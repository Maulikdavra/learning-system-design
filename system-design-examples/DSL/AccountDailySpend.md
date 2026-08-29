# Per-Account Daily Spend Limit

A debit card product enforces a **daily spend limit** (e.g. $2,000/day). Transactions
arrive as a stream of `(accountId, amount, timestamp)` debit events. If a transaction
would push the account's total spend for the calendar day over the limit, it must be
declined in real time — not after the fact.

This is a practice write-up from a coaching session, kept in Q&A form intentionally —
the process of getting to the right answer is the point, not just the final design.

---

## 1. Core logic first — before any architecture

**Rule:** For each account, track `dailySpend` for the current calendar day.
On each incoming debit event:

​```
if dailySpend + event.amount > dailyLimit:
    decline(event)
else:
    dailySpend += event.amount
    approve(event)
​```

Reset `dailySpend` to `0` at the start of each new calendar day.

### First instinct (and why it was wrong)

Initial idea: process transactions **smallest-first** within a batch, so more of them
"fit" under the limit before the limit is hit.

**Why this breaks:** trace it against three transactions arriving as
`$900, $800, $700` (limit $2,000):

- Strict arrival order (FIFO): $900 → approved ($900 total), $800 → approved ($1,700
  total), $700 → declined (would be $2,400).
- "Smallest-first" reordering: $700 and $800 approved ($1,500 total), $900 declined —
  even though the $900 transaction arrived *first*.

A real debit card cannot silently reorder approvals by size — a customer's coffee
purchase from this morning could get declined while a transaction they made *after*
it goes through. **Fix: process strictly in arrival order (FIFO).** Whichever
transaction pushes the running total over the limit gets declined, full stop — no
reordering.

---

## 2. The concurrency problem

**Scenario:** account has spent $1,900 of a $2,000 limit ($100 headroom left). Two
$80 transactions arrive at the exact same instant, on two different threads/servers.

Individually, each $80 is under the $100 headroom — so if checked as two independent
`read → check → write` sequences, **both can read the same $1,900 baseline before
either writes back**, and both get approved. Result: $1,900 + $80 + $80 = $2,060,
over the limit, with no decline at all.

### Wrong turn: "add a queue, process one, replay the other on failure"

First proposed fix involved a queue plus retry/replay logic if a transaction failed
mid-processing. This works but is unnecessarily complex — it's solving a problem that
already has a known, simpler primitive.

### Actual fix: per-account lock (or atomic check-and-update)

This is the same shape of problem as an idempotent transfer processor's account-level
locking, or an idempotency key claimed via `SETNX` / a DB unique constraint — only one
thread should ever be allowed to do the `read → check → write` for a given account's
running total at a time.

​```java
// per-account lock guarding the check-then-update
lock(accountId);
try {
    if (dailySpend + amount > dailyLimit) {
        decline();
    } else {
        dailySpend += amount;
        approve();
    }
} finally {
    unlock(accountId);
}
​```

First thread in wins, updates `dailySpend`, releases. Second thread then reads the
**already-updated** total and correctly declines. No queue, no failure-replay
narrative needed — the lock alone removes the race.

---

## 3. Cache consistency (read path)

Design also needs a fast read path (app shows current balance/spend to the customer)
backed by Redis, with Postgres/DB as source of truth.

**Question raised:** what happens if the DB write (source of truth) succeeds but the
Redis update fails right after?

**Wrong first answer:** "if Redis crashes, spin up a new instance and manually pull
all fields back from the balance service."

**Better answer:** treat this the same as the ledger/webhook durability pattern used
elsewhere in this series — write the DB update and an outbox event in the **same
transaction**, and have Redis be just another **consumer** of that event stream (same
role as a partner webhook consumer). If Redis misses an event or restarts, it
re-subscribes and replays from its last committed offset — cache staleness is bounded
by consumer lag, not by hoping nothing fails silently.

---

## 4. Final design summary

- **Ordering:** strict FIFO by arrival timestamp — no reordering by transaction size.
- **Concurrency:** per-account lock (or atomic compare-and-swap) around the
  `check-then-update` of `dailySpend`, so simultaneous requests for the same account
  can't both slip under the limit.
- **Durability/cache:** DB write + outbox event in one transaction; Redis (and any
  other read-side consumer) subscribes to that event stream and recovers via offset
  replay rather than manual reconciliation.
- **Customer experience:** declined transactions notify the customer of the daily
  limit and remaining headroom, rather than silently reordering which transactions
  succeed.

---

## Key takeaway

The biggest fix across this exercise wasn't architectural — it was catching two bad
instincts (reordering by size, queue-with-replay-on-failure) by tracing them against
concrete numbers *before* committing to them, and recognizing that a problem already
solved elsewhere (per-key locking, outbox-based consumer durability) usually
generalizes rather than needing a new mechanism invented from scratch.
