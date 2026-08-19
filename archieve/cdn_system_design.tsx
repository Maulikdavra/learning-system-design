import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Server, Globe, Database, Lock, Zap } from 'lucide-react';

const CDNSystemDesign = () => {
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const Section = ({ id, title, icon: Icon, children }) => {
    const isExpanded = expandedSections[id];
    return (
      <div className="mb-4 border border-gray-300 rounded-lg overflow-hidden">
        <button
          onClick={() => toggleSection(id)}
          className="w-full px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 flex items-center justify-between transition-colors"
        >
          <div className="flex items-center gap-3">
            <Icon className="w-6 h-6 text-indigo-600" />
            <span className="font-bold text-lg text-gray-800">{title}</span>
          </div>
          {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
        </button>
        {isExpanded && (
          <div className="p-6 bg-white">
            {children}
          </div>
        )}
      </div>
    );
  };

  const QA = ({ q, a, intuition }) => (
    <div className="mb-6 border-l-4 border-indigo-500 pl-4">
      <div className="font-semibold text-indigo-700 mb-2">Q: {q}</div>
      <div className="text-gray-800 mb-2">A: {a}</div>
      {intuition && (
        <div className="mt-2 p-3 bg-yellow-50 rounded border-l-4 border-yellow-400">
          <div className="text-sm font-semibold text-yellow-800 mb-1">💡 Intuition:</div>
          <div className="text-sm text-yellow-900">{intuition}</div>
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-50">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8 rounded-lg mb-6 shadow-lg">
        <h1 className="text-4xl font-bold mb-3">System Design: Content Delivery Network (CDN)</h1>
        <p className="text-indigo-100 text-lg">A comprehensive interview guide with questions, answers, and intuitions</p>
      </div>

      <Section id="intro" title="Phase 0: Introduction & Context" icon={Globe}>
        <div className="prose max-w-none">
          <p className="text-gray-700 mb-4">
            <strong>Interviewer:</strong> "Today we'll design a Content Delivery Network. Before we start, let me explain what a CDN is. A CDN is a geographically distributed network of servers that delivers content to users based on their location. Think of companies like Cloudflare, Akamai, or AWS CloudFront. Are you familiar with CDNs?"
          </p>
          <p className="text-gray-700 mb-4">
            <strong>Candidate:</strong> "Yes, I understand the basic concept. CDNs cache content closer to users to reduce latency and improve load times. Let me start by asking some clarifying questions to understand the requirements better."
          </p>
        </div>
      </Section>

      <Section id="requirements" title="Phase 1: Requirements Gathering" icon={Database}>
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Clarifying Questions</h3>
          
          <QA 
            q="What types of content will the CDN serve? Static files, dynamic content, or both?"
            a="Let's focus primarily on static content like images, videos, CSS, JavaScript files, and HTML pages. We should also support some basic dynamic content with appropriate caching strategies."
            intuition="Understanding content types helps us design appropriate caching strategies and storage mechanisms. Static content is easier to cache and has predictable patterns, while dynamic content requires more sophisticated cache invalidation."
          />

          <QA 
            q="What's the scale we're looking at? How many requests per second? How much data?"
            a="Let's design for 100 million requests per second globally, with petabytes of content to serve. Think of a large-scale CDN like serving content for major websites."
            intuition="Scale determines our architecture choices. At this scale, we need distributed systems, can't use single points of failure, and must think about geographic distribution from the start."
          />

          <QA 
            q="What geographical coverage do we need?"
            a="Global coverage with presence in all major continents. We want to serve users with low latency regardless of their location."
            intuition="Geographic requirements drive our edge location strategy. More locations mean better latency but higher operational costs and complexity."
          />

          <QA 
            q="What are our latency requirements?"
            a="We want to achieve sub-100ms latency for 95% of requests, with most requests served in under 50ms."
            intuition="Latency requirements validate our need for edge locations. The speed of light limits us - a round trip from California to Singapore takes ~200ms, so we must cache content closer to users."
          />

          <QA 
            q="Do we need to handle origin server failures gracefully?"
            a="Yes, the CDN should continue serving cached content even if the origin is down, and it should have retry mechanisms with exponential backoff."
            intuition="This speaks to reliability and availability. A good CDN acts as a shield for origin servers and improves their reliability, not just performance."
          />
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-bold text-gray-800 mb-3">Functional Requirements:</h4>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Serve static content (images, videos, CSS, JS, HTML)</li>
            <li>Fetch content from origin servers when not cached</li>
            <li>Cache content at edge locations close to users</li>
            <li>Support cache invalidation/purging</li>
            <li>Route users to nearest edge location</li>
            <li>Support SSL/TLS termination</li>
          </ul>
        </div>

        <div className="bg-green-50 p-4 rounded-lg mt-4">
          <h4 className="font-bold text-gray-800 mb-3">Non-Functional Requirements:</h4>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>Availability:</strong> 99.99% uptime (52 minutes downtime/year)</li>
            <li><strong>Latency:</strong> Sub-100ms for 95% of requests</li>
            <li><strong>Scalability:</strong> Handle 100M requests/second globally</li>
            <li><strong>Consistency:</strong> Eventual consistency is acceptable</li>
            <li><strong>Reliability:</strong> Graceful degradation on failures</li>
          </ul>
        </div>
      </Section>

      <Section id="capacity" title="Phase 2: Capacity Estimation" icon={Server}>
        <QA 
          q="Let's do some back-of-the-envelope calculations. Can you estimate our storage and bandwidth needs?"
          a="Sure, let me break this down:"
          intuition="Capacity estimation helps validate our design choices and identify potential bottlenecks early. It's better to be roughly right than precisely wrong - use round numbers."
        />

        <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm space-y-2 mb-4">
          <div><strong>Traffic Estimation:</strong></div>
          <div>• 100M requests/second globally</div>
          <div>• Average object size: 100 KB</div>
          <div>• Bandwidth: 100M req/s × 100 KB = 10 TB/second = 80 Terabits/second</div>
          <div>• Daily data transfer: 10 TB/s × 86,400s = 864 PB/day</div>
          <div className="mt-4"><strong>Storage Estimation:</strong></div>
          <div>• Assume we cache 20% of all content (80/20 rule)</div>
          <div>• Unique objects: ~100 billion objects</div>
          <div>• Total cached storage needed: 100B × 100KB × 0.2 = 2 Exabytes</div>
          <div>• Per edge location (assume 200 locations): ~10 PB each</div>
          <div className="mt-4"><strong>Memory Estimation (Hot Cache):</strong></div>
          <div>• Keep 1% of content in memory for ultra-fast access</div>
          <div>• Memory per location: 100 TB</div>
        </div>

        <div className="p-4 bg-purple-50 rounded-lg">
          <h4 className="font-semibold text-purple-900 mb-2">Key Insight:</h4>
          <p className="text-purple-800">These numbers seem massive, but they're realistic for a global CDN. This validates that we need a distributed system with no single point of failure. We'll use a multi-tier caching strategy: memory → SSD → HDD → origin.</p>
        </div>
      </Section>

      <Section id="high-level" title="Phase 3: High-Level Design" icon={Globe}>
        <QA 
          q="Let's start with the high-level architecture. How would you structure this system?"
          a="I'll design this with several key components working together:"
          intuition="Start simple and iterate. Draw the user's journey through the system. Think about what happens when a user requests content."
        />

        <div className="my-6 p-6 bg-white border-2 border-gray-300 rounded-lg">
          <svg viewBox="0 0 800 600" className="w-full h-auto">
            <circle cx="100" cy="300" r="30" fill="#3b82f6" />
            <text x="100" y="350" textAnchor="middle" className="text-xs" fill="#1f2937">User</text>
            
            <rect x="220" y="80" width="120" height="60" fill="#8b5cf6" rx="5" />
            <text x="280" y="115" textAnchor="middle" className="text-sm font-bold" fill="white">DNS</text>
            
            <rect x="220" y="270" width="120" height="60" fill="#10b981" rx="5" />
            <text x="280" y="295" textAnchor="middle" className="text-xs font-bold" fill="white">Edge Location</text>
            <text x="280" y="310" textAnchor="middle" className="text-xs" fill="white">(Cache)</text>
            
            <rect x="420" y="270" width="120" height="60" fill="#f59e0b" rx="5" />
            <text x="480" y="295" textAnchor="middle" className="text-xs font-bold" fill="white">Regional Cache</text>
            <text x="480" y="310" textAnchor="middle" className="text-xs" fill="white">(Mid-tier)</text>
            
            <rect x="620" y="270" width="120" height="60" fill="#ef4444" rx="5" />
            <text x="680" y="295" textAnchor="middle" className="text-xs font-bold" fill="white">Origin Server</text>
            <text x="680" y="310" textAnchor="middle" className="text-xs" fill="white">(Customer)</text>
            
            <rect x="420" y="80" width="120" height="60" fill="#6366f1" rx="5" />
            <text x="480" y="105" textAnchor="middle" className="text-xs font-bold" fill="white">Control Plane</text>
            <text x="480" y="120" textAnchor="middle" className="text-xs" fill="white">(Config/Monitor)</text>
            
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                <polygon points="0 0, 10 3, 0 6" fill="#374151" />
              </marker>
            </defs>
            
            <line x1="130" y1="290" x2="220" y2="130" stroke="#374151" strokeWidth="2" markerEnd="url(#arrowhead)" />
            <text x="160" y="200" className="text-xs" fill="#374151">1. DNS Query</text>
            
            <line x1="230" y1="140" x2="140" y2="280" stroke="#374151" strokeWidth="2" markerEnd="url(#arrowhead)" />
            <text x="160" y="220" className="text-xs" fill="#374151">2. Nearest IP</text>
            
            <line x1="130" y1="300" x2="220" y2="300" stroke="#374151" strokeWidth="2" markerEnd="url(#arrowhead)" />
            <text x="160" y="290" className="text-xs" fill="#374151">3. Request</text>
            
            <line x1="340" y1="300" x2="420" y2="300" stroke="#374151" strokeWidth="2" markerEnd="url(#arrowhead)" strokeDasharray="5,5" />
            <text x="370" y="290" className="text-xs" fill="#374151">4. Cache Miss</text>
            
            <line x1="540" y1="300" x2="620" y2="300" stroke="#374151" strokeWidth="2" markerEnd="url(#arrowhead)" strokeDasharray="5,5" />
            <text x="570" y="290" className="text-xs" fill="#374151">5. Cache Miss</text>
            
            <line x1="480" y1="140" x2="340" y2="270" stroke="#6366f1" strokeWidth="1" strokeDasharray="3,3" />
            <line x1="480" y1="140" x2="480" y2="270" stroke="#6366f1" strokeWidth="1" strokeDasharray="3,3" />
            <line x1="480" y1="140" x2="640" y2="270" stroke="#6366f1" strokeWidth="1" strokeDasharray="3,3" />
            
            <rect x="20" y="450" width="760" height="120" fill="#f3f4f6" rx="5" />
            <text x="40" y="475" className="text-sm font-bold" fill="#1f2937">Request Flow:</text>
            <text x="40" y="495" className="text-xs" fill="#374151">1. User makes DNS query for cdn.example.com</text>
            <text x="40" y="515" className="text-xs" fill="#374151">2. DNS returns IP of nearest edge location (GeoDNS routing)</text>
            <text x="40" y="535" className="text-xs" fill="#374151">3. User requests content from edge location</text>
            <text x="40" y="555" className="text-xs" fill="#374151">4. If cache miss, edge queries regional cache (optional tier)</text>
            <text x="40" y="575" className="text-xs" fill="#374151">5. If still miss, fetch from origin server and cache at each tier</text>
          </svg>
        </div>

        <div className="space-y-4 mt-6">
          <div className="border-l-4 border-blue-500 pl-4">
            <h4 className="font-bold text-gray-800">1. DNS Layer (GeoDNS)</h4>
            <p className="text-gray-700 text-sm mt-1">Routes users to the nearest edge location based on their geographic location. Uses Anycast or GeoDNS to return the optimal IP address.</p>
          </div>
          
          <div className="border-l-4 border-green-500 pl-4">
            <h4 className="font-bold text-gray-800">2. Edge Locations (PoP - Point of Presence)</h4>
            <p className="text-gray-700 text-sm mt-1">200+ globally distributed cache servers. First line of defense. Handle 90%+ of requests from cache. Each has memory cache (hot data) + SSD cache (warm data).</p>
          </div>
          
          <div className="border-l-4 border-orange-500 pl-4">
            <h4 className="font-bold text-gray-800">3. Regional Cache (Optional Mid-tier)</h4>
            <p className="text-gray-700 text-sm mt-1">Reduces load on origin servers. Serves as backup for edge locations. Useful for less popular content that doesn't fit in edge caches.</p>
          </div>
          
          <div className="border-l-4 border-red-500 pl-4">
            <h4 className="font-bold text-gray-800">4. Origin Servers</h4>
            <p className="text-gray-700 text-sm mt-1">Customer's servers where original content lives. CDN fetches content from here on cache miss.</p>
          </div>
          
          <div className="border-l-4 border-indigo-500 pl-4">
            <h4 className="font-bold text-gray-800">5. Control Plane</h4>
            <p className="text-gray-700 text-sm mt-1">Configuration management, monitoring, analytics, cache invalidation API. Separate from data plane for reliability.</p>
          </div>
        </div>
      </Section>

      <Section id="components" title="Phase 4: Deep Dive - Core Components" icon={Zap}>
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">4.1 DNS and Routing</h3>
            <QA 
              q="How exactly does the DNS routing work to send users to the nearest location?"
              a="We use a combination of GeoDNS and Anycast routing with health checking."
              intuition="DNS is the first decision point. Getting this right means users start with the best possible server. We need both geographic proximity and health awareness."
            />
            
            <div className="bg-gray-50 p-4 rounded-lg mt-2">
              <h4 className="font-semibold mb-2">Implementation Details:</h4>
              <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
                <li><strong>GeoDNS:</strong> Maintains database of IP geolocation. When user queries cdn.example.com, returns IP of nearest healthy edge location based on source IP.</li>
                <li><strong>Anycast:</strong> Multiple locations advertise the same IP address. BGP routing automatically sends traffic to the topologically nearest location.</li>
                <li><strong>Health Checks:</strong> DNS removes unhealthy locations from responses. Checks run every 5-10 seconds.</li>
                <li><strong>TTL Strategy:</strong> Short TTL (60-300 seconds) allows quick failover but increases DNS query load. Balance based on reliability needs.</li>
                <li><strong>Failover:</strong> If primary location fails, DNS redirects to next nearest healthy location within 1-5 minutes.</li>
              </ul>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">4.2 Caching Strategy</h3>
            <QA 
              q="Describe your caching strategy. What do you cache, for how long, and how do you handle cache invalidation?"
              a="We'll use a multi-tier caching strategy with intelligent eviction policies."
              intuition="Caching is the heart of CDN performance. The goal is to maximize cache hit ratio while minimizing stale content. Different content types need different strategies."
            />
            
            <div className="bg-gray-50 p-4 rounded-lg mt-2 space-y-3">
              <div>
                <h4 className="font-semibold mb-1">Cache Hierarchy:</h4>
                <div className="text-sm space-y-1 ml-4">
                  <div><strong>L1 - Memory (RAM):</strong> 1-5% of content, hottest data, sub-millisecond access</div>
                  <div><strong>L2 - SSD:</strong> 20% of content, millisecond access</div>
                  <div><strong>L3 - HDD (optional):</strong> Larger storage, slower access</div>
                  <div><strong>L4 - Regional Cache:</strong> Backup tier</div>
                  <div><strong>L5 - Origin:</strong> Last resort</div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-1">Eviction Policy:</h4>
                <p className="text-sm text-gray-700">Use <strong>LRU (Least Recently Used)</strong> with size-aware eviction. Consider access frequency (LFU hybrid) for hot content. Items with imminent expiration get lower priority.</p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-1">Cache Keys:</h4>
                <p className="text-sm text-gray-700">URL + Query Parameters + Vary Headers (Accept-Encoding, Accept-Language, etc.)</p>
                <p className="text-sm text-gray-700 mt-1">Example: GET /image.jpg?width=800 with Accept-Encoding: gzip</p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-1">TTL Strategy by Content Type:</h4>
                <div className="text-sm space-y-1 ml-4">
                  <div>• Static assets with version hash: 1 year (immutable)</div>
                  <div>• Images/videos: 24 hours - 7 days</div>
                  <div>• HTML pages: 5-60 minutes (or use stale-while-revalidate)</div>
                  <div>• API responses: 0-5 minutes or no-cache</div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">4.3 Cache Invalidation</h3>
            <QA 
              q="How do we handle cache invalidation when content is updated at the origin?"
              a="We support multiple invalidation mechanisms with different trade-offs."
              intuition="This is one of the hardest problems in CDN design. Perfect consistency is impossible at global scale. We aim for 'good enough' with fast propagation for critical updates."
            />
            
            <div className="bg-gray-50 p-4 rounded-lg mt-2 space-y-3">
              <div>
                <h4 className="font-semibold mb-1">1. Purge API (Active Invalidation):</h4>
                <p className="text-sm text-gray-700">Customer calls API to invalidate specific URLs or patterns. Control plane propagates to all edge locations. Typical propagation time: 2-30 seconds globally.</p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-1">2. Cache-Control Headers (Passive):</h4>
                <p className="text-sm text-gray-700">Origin sets TTL via headers. CDN respects these. Stale-while-revalidate allows serving stale content while fetching fresh copy in background.</p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-1">3. Version-based URLs:</h4>
                <p className="text-sm text-gray-700">Best practice: Include version/hash in URL (e.g., /style.v123.css). New version = new URL = no invalidation needed. Long TTL possible.</p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-1">4. Soft Purge:</h4>
                <p className="text-sm text-gray-700">Mark content as stale but keep it. If origin fails, serve stale content. Graceful degradation.</p>
              </div>
              
              <div className="bg-yellow-50 p-3 rounded border-l-4 border-yellow-400">
                <p className="text-sm text-yellow-900"><strong>Trade-off:</strong> Fast invalidation requires distributed coordination (complex, expensive). Slow invalidation is simpler but users see stale content longer. We optimize for common case (version-based URLs) and provide escape hatch (purge API) for emergencies.</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">4.4 Origin Shield / Regional Cache</h3>
            <QA 
              q="Why do we need a regional cache layer? Can't edge servers just talk directly to origin?"
              a="Regional cache (Origin Shield) protects origin servers from thundering herd problem and reduces egress costs."
              intuition="When popular content expires simultaneously across 200 edge locations, all might request from origin at once. Regional cache collapses these requests into one, protecting origin."
            />
            
            <div className="bg-gray-50 p-4 rounded-lg mt-2 space-y-3">
              <div>
                <h4 className="font-semibold mb-1">Benefits:</h4>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                  <li><strong>Request Collapsing:</strong> 1000 edge requests → 1 origin request</li>
                  <li><strong>Cost Reduction:</strong> Lower origin bandwidth costs</li>
                  <li><strong>Origin Protection:</strong> Shield origin from traffic spikes</li>
                  <li><strong>Larger Cache:</strong> Can cache more than individual edges</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-1">Implementation:</h4>
                <p className="text-sm text-gray-700">Deploy regional caches in 10-20 locations globally. Each edge location is assigned to nearest regional cache. Regional cache uses consistent hashing to distribute load among origin servers.</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">4.5 Request Flow &amp; Cache Miss Handling</h3>
            <div className="bg-white border-2 border-gray-300 rounded-lg p-4 my-4">
              <div className="text-sm font-mono space-y-1 text-gray-700">
                <div>1. User → Edge: "GET /logo.png"</div>
                <div>2. Edge checks L1 (memory) → MISS</div>
                <div>3. Edge checks L2 (SSD) → MISS</div>
                <div>4. Edge → Regional Cache: "GET /logo.png"</div>
                <div>5. Regional Cache checks cache → MISS</div>
                <div>6. Regional → Origin: "GET /logo.png" (with conditional headers)</div>
                <div>7. Origin → Regional: 200 OK + content (or 304 Not Modified)</div>
                <div>8. Regional caches content, returns to Edge</div>
                <div>9. Edge caches in L2 and L1, returns to User</div>
                <div>10. Next request: Edge L1 → HIT (sub-millisecond response)</div>
              </div>
            </div>
            
            <div className="bg-blue-50 p-3 rounded mt-2">
              <p className="text-sm text-blue-900"><strong>Optimization:</strong> Use <strong>request coalescing</strong> at each tier. If 100 requests for same uncached resource arrive simultaneously, only forward 1 request upstream. Others wait for that response.</p>
            </div>
          </div>
        </div>
      </Section>

      <Section id="advanced" title="Phase 5: Advanced Topics" icon={Lock}>
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">5.1 Security</h3>
            <QA 
              q="How do we secure the CDN against attacks like DDoS?"
              a="We implement multiple layers of security at different points in the architecture."
              intuition="CDNs are prime targets for attacks because they're at the edge. But their distributed nature also makes them excellent for absorbing attacks. Turn the architecture into defense."
            />
            
            <div className="bg-gray-50 p-4 rounded-lg mt-2 space-y-3">
              <div>
                <h4 className="font-semibold mb-2">DDoS Protection:</h4>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                  <li><strong>Anycast:</strong> Distributes attack traffic across all locations</li>
                  <li><strong>Rate Limiting:</strong> Per-IP request limits at edge</li>
                  <li><strong>Traffic Scrubbing:</strong> Identify and drop malicious traffic patterns</li>
                  <li><strong>Connection Limits:</strong> Limit concurrent connections per IP</li>
                  <li><strong>SYN Flood Protection:</strong> SYN cookies at load balancers</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Application Security:</h4>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                  <li><strong>WAF (Web Application Firewall):</strong> Filter malicious requests</li>
                  <li><strong>Bot Detection:</strong> Machine learning to identify bot traffic</li>
                  <li><strong>SSL/TLS Termination:</strong> Handle encryption at edge, reduce origin load</li>
                  <li><strong>Token Authentication:</strong> Signed URLs with expiration for protected content</li>
                  <li><strong>Hotlink Protection:</strong> Prevent unauthorized embedding</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Certificate Management:</h4>
                <p className="text-sm text-gray-700">Automated cert provisioning via Let's Encrypt API. Store private keys in HSM (Hardware Security Module). Support SNI (Server Name Indication) to serve multiple domains from single IP.</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">5.2 Monitoring &amp; Observability</h3>
            <QA 
              q="How do we monitor the health and performance of our CDN?"
              a="Comprehensive monitoring across all layers with real-time alerting."
              intuition="At this scale, things fail constantly. We need to detect issues before users notice. Observability lets us understand system behavior and debug issues quickly."
            />
            
            <div className="bg-gray-50 p-4 rounded-lg mt-2 space-y-3">
              <div>
                <h4 className="font-semibold mb-2">Key Metrics:</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="border-l-4 border-blue-500 pl-2">
                    <div className="font-semibold">Performance</div>
                    <div className="text-xs text-gray-600">• Cache hit ratio (target: 90%+)</div>
                    <div className="text-xs text-gray-600">• P50, P95, P99 latency</div>
                    <div className="text-xs text-gray-600">• Request rate</div>
                    <div className="text-xs text-gray-600">• Bandwidth utilization</div>
                  </div>
                  <div className="border-l-4 border-green-500 pl-2">
                    <div className="font-semibold">Reliability</div>
                    <div className="text-xs text-gray-600">• Error rate (4xx, 5xx)</div>
                    <div className="text-xs text-gray-600">• Origin health</div>
                    <div className="text-xs text-gray-600">• Edge server health</div>
                    <div className="text-xs text-gray-600">• Network packet loss</div>
                  </div>
                  <div className="border-l-4 border-orange-500 pl-2">
                    <div className="font-semibold">Business</div>
                    <div className="text-xs text-gray-600">• Data transfer (costs)</div>
                    <div className="text-xs text-gray-600">• Requests per customer</div>
                    <div className="text-xs text-gray-600">• Geographic distribution</div>
                  </div>
                  <div className="border-l-4 border-red-500 pl-2">
                    <div className="font-semibold">Security</div>
                    <div className="text-xs text-gray-600">• Attack traffic detected</div>
                    <div className="text-xs text-gray-600">• WAF blocks</div>
                    <div className="text-xs text-gray-600">• Bot traffic percentage</div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Real User Monitoring (RUM):</h4>
                <p className="text-sm text-gray-700">Inject JavaScript beacon to measure actual user experience. Track time to first byte (TTFB), page load time, geographic latency distribution.</p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Synthetic Monitoring:</h4>
                <p className="text-sm text-gray-700">Probes from various locations continuously test CDN endpoints. Alert if latency exceeds threshold or availability drops below 99.9%.</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">5.3 Consistency &amp; Cache Coherence</h3>
            <QA 
              q="How do we handle consistency across 200+ edge locations?"
              a="We embrace eventual consistency with bounded staleness."
              intuition="Strong consistency at global scale is prohibitively expensive (CAP theorem). Users generally tolerate slightly stale content for better performance. Design the system to minimize staleness window."
            />
            
            <div className="bg-gray-50 p-4 rounded-lg mt-2 space-y-3">
              <div>
                <h4 className="font-semibold mb-2">Consistency Model:</h4>
                <p className="text-sm text-gray-700"><strong>Eventual Consistency with Bounded Staleness:</strong> Content may be stale for up to TTL duration (typically 5 min - 24 hours depending on content type). Purge API provides escape hatch for critical updates.</p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Versioning Strategy:</h4>
                <p className="text-sm text-gray-700">Use ETags (entity tags) for version tracking. Conditional requests (If-None-Match) reduce bandwidth. Origin returns 304 Not Modified if content unchanged.</p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Purge Propagation:</h4>
                <div className="text-sm text-gray-700">
                  <div>1. Customer calls Purge API</div>
                  <div>2. Control plane writes to distributed queue (Kafka/Kinesis)</div>
                  <div>3. Each edge location subscribes to queue</div>
                  <div>4. Edge processes purge within 2-30 seconds</div>
                  <div>5. Send confirmation back to control plane</div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">5.4 Analytics &amp; Logging</h3>
            <QA 
              q="How do we provide analytics to customers about their content delivery?"
              a="We need a scalable log aggregation and analytics pipeline."
              intuition="At 100M requests/second, we generate massive logs (TBs/hour). Can't afford to process everything in real-time. Use sampling and batch processing for cost efficiency."
            />
            
            <div className="bg-gray-50 p-4 rounded-lg mt-2 space-y-3">
              <div>
                <h4 className="font-semibold mb-2">Log Pipeline:</h4>
                <div className="text-sm space-y-2">
                  <div><strong>1. Edge Logging:</strong> Each request logged locally with request details (timestamp, URL, status, bytes, latency, geo location, cache status)</div>
                  <div><strong>2. Sampling:</strong> Sample 1-10% of logs for detailed analysis. Keep full logs for errors and security events</div>
                  <div><strong>3. Aggregation:</strong> Buffer logs locally (1-5 minutes), compress, upload to S3/Cloud Storage</div>
                  <div><strong>4. Processing:</strong> Batch processing with Spark/Flink. Generate aggregated metrics per customer</div>
                  <div><strong>5. Storage:</strong> Hot data (7 days) in time-series DB. Cold data in data warehouse (Snowflake/BigQuery)</div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Real-time Metrics:</h4>
                <p className="text-sm text-gray-700">Use time-series DB (InfluxDB/TimescaleDB) for real-time dashboards. Pre-aggregate common queries (requests/min, bandwidth, cache hit rate) using streaming processing (Flink/Kafka Streams).</p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section id="optimization" title="Phase 6: Optimizations &amp; Trade-offs" icon={Zap}>
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">6.1 Performance Optimizations</h3>
            
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold text-gray-800">HTTP/2 &amp; HTTP/3 (QUIC)</h4>
                <p className="text-sm text-gray-700 mt-1">Support multiplexing, header compression, server push. HTTP/3 reduces latency over lossy networks by using UDP instead of TCP.</p>
                <p className="text-xs text-gray-600 mt-1"><strong>Trade-off:</strong> More complex implementation vs 30% latency improvement</p>
              </div>
              
              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-semibold text-gray-800">Compression</h4>
                <p className="text-sm text-gray-700 mt-1">Gzip for text content, Brotli for even better compression. Compress once at origin, serve compressed from cache.</p>
                <p className="text-xs text-gray-600 mt-1"><strong>Trade-off:</strong> CPU cost vs 70% bandwidth savings</p>
              </div>
              
              <div className="border-l-4 border-orange-500 pl-4">
                <h4 className="font-semibold text-gray-800">Image Optimization</h4>
                <p className="text-sm text-gray-700 mt-1">On-the-fly image resizing, format conversion (WebP, AVIF), quality adjustment. Cache each variant separately.</p>
                <p className="text-xs text-gray-600 mt-1"><strong>Trade-off:</strong> Processing cost vs better user experience and bandwidth savings</p>
              </div>
              
              <div className="border-l-4 border-purple-500 pl-4">
                <h4 className="font-semibold text-gray-800">TCP Optimization</h4>
                <p className="text-sm text-gray-700 mt-1">BBR congestion control, TCP Fast Open, larger initial congestion window. Persistent connections between edge and origin.</p>
                <p className="text-xs text-gray-600 mt-1"><strong>Trade-off:</strong> Complexity vs 20-40% latency improvement</p>
              </div>
              
              <div className="border-l-4 border-red-500 pl-4">
                <h4 className="font-semibold text-gray-800">Predictive Prefetching</h4>
                <p className="text-sm text-gray-700 mt-1">Machine learning to predict what content user will request next. Prefetch to edge cache before requested.</p>
                <p className="text-xs text-gray-600 mt-1"><strong>Trade-off:</strong> Wasted bandwidth if wrong vs instant load times when right</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">6.2 Cost Optimizations</h3>
            
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold text-gray-800">Tiered Storage</h4>
                <p className="text-sm text-gray-700 mt-1">Hot data in memory/SSD, cold data in HDD, very cold in object storage. Move data between tiers based on access patterns.</p>
              </div>
              
              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-semibold text-gray-800">Origin Shield</h4>
                <p className="text-sm text-gray-700 mt-1">Reduces origin bandwidth costs by 80-90%. Protects origin from cache stampede.</p>
              </div>
              
              <div className="border-l-4 border-orange-500 pl-4">
                <h4 className="font-semibold text-gray-800">Smart Routing</h4>
                <p className="text-sm text-gray-700 mt-1">Route through cheaper transit providers when latency difference is minimal. Balance cost vs performance.</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">6.3 Key Trade-offs Summary</h3>
            
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-lg space-y-3">
              <div>
                <h4 className="font-semibold text-gray-800 text-sm">Consistency vs Availability</h4>
                <p className="text-xs text-gray-700">Chose eventual consistency over strong consistency for better availability and performance. Acceptable for CDN use case.</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-800 text-sm">Number of PoPs vs Cost</h4>
                <p className="text-xs text-gray-700">More locations = better latency but higher operational cost. Sweet spot is 150-300 locations globally.</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-800 text-sm">Cache Size vs Hit Ratio</h4>
                <p className="text-xs text-gray-700">Larger cache = higher hit ratio but more expensive storage. Use tiered storage and smart eviction.</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-800 text-sm">Real-time Purge vs Complexity</h4>
                <p className="text-xs text-gray-700">Fast global purge requires complex distributed system. Alternative: versioned URLs with long TTL (simpler, faster).</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-800 text-sm">Security vs Performance</h4>
                <p className="text-xs text-gray-700">SSL termination at edge improves security but adds latency. Use hardware acceleration and connection pooling to minimize impact.</p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section id="failure" title="Phase 7: Failure Scenarios &amp; Reliability" icon={Server}>
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">7.1 Failure Scenarios</h3>
            
            <div className="space-y-4">
              <div className="bg-red-50 border-l-4 border-red-500 p-4">
                <h4 className="font-semibold text-red-900">Scenario 1: Origin Server Down</h4>
                <div className="text-sm text-red-800 mt-2">
                  <div><strong>Detection:</strong> Health checks fail (3 consecutive failures, 30s interval)</div>
                  <div><strong>Response:</strong></div>
                  <ul className="list-disc list-inside ml-4 mt-1">
                    <li>Serve stale content from cache (even if expired)</li>
                    <li>Display custom error page if content not in cache</li>
                    <li>Retry with exponential backoff: 1s, 2s, 4s, 8s</li>
                    <li>Mark origin unhealthy in control plane</li>
                    <li>Alert customer and CDN ops team</li>
                  </ul>
                  <div className="mt-2"><strong>Recovery:</strong> Automatic when health checks pass</div>
                </div>
              </div>
              
              <div className="bg-orange-50 border-l-4 border-orange-500 p-4">
                <h4 className="font-semibold text-orange-900">Scenario 2: Edge Location Failure</h4>
                <div className="text-sm text-orange-800 mt-2">
                  <div><strong>Detection:</strong> Health checks fail from multiple vantage points</div>
                  <div><strong>Response:</strong></div>
                  <ul className="list-disc list-inside ml-4 mt-1">
                    <li>Remove from DNS within 60-300 seconds (based on TTL)</li>
                    <li>Anycast automatically routes to next nearest location</li>
                    <li>Redistribute load to nearby healthy locations</li>
                  </ul>
                  <div className="mt-2"><strong>Impact:</strong> Minimal - users see 50-100ms extra latency temporarily</div>
                </div>
              </div>
              
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
                <h4 className="font-semibold text-yellow-900">Scenario 3: Regional Cache Failure</h4>
                <div className="text-sm text-yellow-800 mt-2">
                  <div><strong>Response:</strong></div>
                  <ul className="list-disc list-inside ml-4 mt-1">
                    <li>Edge locations bypass regional cache and fetch directly from origin</li>
                    <li>Use secondary regional cache if available</li>
                    <li>Temporarily cache more at edge to reduce origin load</li>
                  </ul>
                  <div className="mt-2"><strong>Impact:</strong> Increased origin load, slightly higher latency</div>
                </div>
              </div>
              
              <div className="bg-purple-50 border-l-4 border-purple-500 p-4">
                <h4 className="font-semibold text-purple-900">Scenario 4: Network Partition</h4>
                <div className="text-sm text-purple-800 mt-2">
                  <div><strong>Response:</strong></div>
                  <ul className="list-disc list-inside ml-4 mt-1">
                    <li>Edge locations continue serving cached content</li>
                    <li>Cannot reach origin: serve stale content (stale-while-revalidate)</li>
                    <li>Route around partition using alternate paths</li>
                    <li>Graceful degradation: return cached content with warning header</li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                <h4 className="font-semibold text-blue-900">Scenario 5: DDoS Attack</h4>
                <div className="text-sm text-blue-800 mt-2">
                  <div><strong>Detection:</strong> Spike in traffic, high percentage from specific ASNs/geos</div>
                  <div><strong>Response:</strong></div>
                  <ul className="list-disc list-inside ml-4 mt-1">
                    <li>Anycast distributes attack across all locations</li>
                    <li>Rate limiting per IP: 1000 req/min normal, 100 req/min during attack</li>
                    <li>Challenge suspicious traffic with CAPTCHA</li>
                    <li>Block known malicious IPs at network layer</li>
                    <li>Activate DDoS mitigation provider if needed (Cloudflare Spectrum, AWS Shield)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">7.2 Reliability Mechanisms</h3>
            
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <div>
                <h4 className="font-semibold text-gray-800">Circuit Breaker Pattern</h4>
                <p className="text-sm text-gray-700">If origin errors exceed threshold (50% error rate for 30s), open circuit and serve stale content. Try again after cooldown period (60s).</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-800">Retry Logic</h4>
                <p className="text-sm text-gray-700">Exponential backoff with jitter. Max 3 retries. Retry on network errors, not on 4xx client errors. Use different origin servers for retries if available.</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-800">Health Checking</h4>
                <p className="text-sm text-gray-700">Active health checks every 10s. Passive health checking based on actual request success/failure. Remove from rotation after 3 consecutive failures.</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-800">Graceful Degradation</h4>
                <p className="text-sm text-gray-700">Serve stale content &gt; Error page. Serve low-quality images &gt; No image. Return 503 with Retry-After header rather than silently failing.</p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section id="scaling" title="Phase 8: Scaling Considerations" icon={Globe}>
        <div className="space-y-6">
          <QA 
            q="How do we scale from 100M req/s to 1B req/s?"
            a="The architecture is already designed to scale horizontally. Here's how we'd handle 10x growth:"
            intuition="Good distributed systems scale linearly. The key is avoiding bottlenecks and single points of failure. Our stateless edge architecture makes this easier."
          />
          
          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            <div>
              <h4 className="font-semibold text-gray-800">Horizontal Scaling</h4>
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 ml-4">
                <li><strong>Edge Locations:</strong> Add more servers to existing PoPs. Add new PoPs in high-traffic regions. Each PoP is independent.</li>
                <li><strong>Regional Cache:</strong> Add more regional cache servers. Use consistent hashing for load distribution.</li>
                <li><strong>Control Plane:</strong> Shard control plane by customer or region. Each shard handles subset of configuration.</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-800">Bottleneck Analysis</h4>
              <div className="space-y-2 mt-2">
                <div className="text-sm">
                  <span className="font-semibold">DNS:</span>
                  <span className="text-gray-700"> Use Anycast DNS servers globally. Each handles millions of QPS. Scale by adding more Anycast IPs.</span>
                </div>
                <div className="text-sm">
                  <span className="font-semibold">Log Aggregation:</span>
                  <span className="text-gray-700"> Use distributed log collection (Kafka/Kinesis). Partition by customer_id or edge_location.</span>
                </div>
                <div className="text-sm">
                  <span className="font-semibold">Purge Propagation:</span>
                  <span className="text-gray-700"> Use pub-sub model (Kafka topics per region). Each edge subscribes to relevant topics.</span>
                </div>
                <div className="text-sm">
                  <span className="font-semibold">Analytics:</span>
                  <span className="text-gray-700"> Use distributed data warehouse (BigQuery/Snowflake). Pre-aggregate common queries.</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-800">Cost at Scale</h4>
              <p className="text-sm text-gray-700">At 1B req/s: ~100 PB/day data transfer. Major costs: bandwidth ($0.01-0.05/GB) = $1-5M/day, servers (~10K servers) = $10M/month, data center space = $5M/month. Total: ~$150-200M/month operating costs.</p>
            </div>
          </div>
        </div>
      </Section>

      <Section id="api" title="Phase 9: API Design" icon={Database}>
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Control Plane APIs</h3>
          
          <div className="bg-gray-50 p-4 rounded-lg font-mono text-xs space-y-4">
            <div>
              <div className="font-bold text-gray-800 mb-2">1. Configuration API</div>
              <div className="text-gray-700">POST /api/v1/domains</div>
              <div className="text-gray-600 ml-4">Register new domain to CDN</div>
              <div className="text-gray-700 mt-1">PUT /api/v1/domains/[domain_id]/origin</div>
              <div className="text-gray-600 ml-4">Configure origin servers</div>
              <div className="text-gray-700 mt-1">PUT /api/v1/domains/[domain_id]/cache-rules</div>
              <div className="text-gray-600 ml-4">Set TTL, query string handling, etc.</div>
            </div>
            
            <div>
              <div className="font-bold text-gray-800 mb-2">2. Purge API</div>
              <div className="text-gray-700">POST /api/v1/purge</div>
              <div className="text-gray-600 ml-4">Invalidate specific URLs</div>
              <div className="text-gray-700 mt-1">POST /api/v1/purge/tag</div>
              <div className="text-gray-600 ml-4">Purge by custom tags</div>
            </div>
            
            <div>
              <div className="font-bold text-gray-800 mb-2">3. Analytics API</div>
              <div className="text-gray-700">GET /api/v1/analytics</div>
              <div className="text-gray-600 ml-4">Get traffic stats, cache hit ratio, bandwidth</div>
              <div className="text-gray-700 mt-1">GET /api/v1/logs</div>
              <div className="text-gray-600 ml-4">Query access logs</div>
            </div>
            
            <div>
              <div className="font-bold text-gray-800 mb-2">4. Certificate API</div>
              <div className="text-gray-700">POST /api/v1/certificates</div>
              <div className="text-gray-600 ml-4">Upload custom SSL certificate</div>
              <div className="text-gray-700 mt-1">POST /api/v1/certificates/auto</div>
              <div className="text-gray-600 ml-4">Auto-provision Let's Encrypt certificate</div>
            </div>
          </div>
        </div>
      </Section>

      <Section id="summary" title="Phase 10: Interview Closing &amp; Summary" icon={Zap}>
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border-l-4 border-green-500">
            <h3 className="text-xl font-bold text-gray-800 mb-3">Key Takeaways</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-green-600 font-bold mr-2">✓</span>
                <span><strong>Geographic Distribution:</strong> 200+ edge locations ensure low latency globally</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 font-bold mr-2">✓</span>
                <span><strong>Multi-tier Caching:</strong> Memory to SSD to Regional to Origin reduces latency and origin load</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 font-bold mr-2">✓</span>
                <span><strong>Smart Routing:</strong> GeoDNS + Anycast directs users to optimal location</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 font-bold mr-2">✓</span>
                <span><strong>Eventual Consistency:</strong> Accept stale content briefly for better availability</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 font-bold mr-2">✓</span>
                <span><strong>Graceful Degradation:</strong> Serve stale content on failures rather than errors</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 font-bold mr-2">✓</span>
                <span><strong>Security Layers:</strong> DDoS protection, WAF, rate limiting at edge</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 font-bold mr-2">✓</span>
                <span><strong>Observability:</strong> Comprehensive monitoring and real-user metrics</span>
              </li>
            </ul>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500">
            <h3 className="text-xl font-bold text-gray-800 mb-3">What We Didn't Cover (Extended Topics)</h3>
            <ul className="space-y-1 text-sm text-gray-700">
              <li>• Video streaming optimizations (adaptive bitrate, chunking)</li>
              <li>• Edge computing / serverless functions at edge</li>
              <li>• Advanced bot detection with ML</li>
              <li>• Cost optimization strategies in detail</li>
              <li>• Multi-CDN strategies (using multiple CDN providers)</li>
              <li>• IPv6 support and dual-stack implementation</li>
              <li>• Real-time log streaming to customers</li>
            </ul>
          </div>

          <div className="bg-purple-50 p-6 rounded-lg border-l-4 border-purple-500">
            <h3 className="text-xl font-bold text-gray-800 mb-3">Interviewer's Final Questions</h3>
            <div className="space-y-3">
              <div>
                <p className="font-semibold text-purple-900">Q: How would you handle a scenario where a major CDN customer (like Netflix) suddenly drives 10x normal traffic?</p>
                <p className="text-sm text-purple-800 mt-1">A: Auto-scaling at edge + traffic shaping + cache pre-warming if predictable (launch events). Rate limiting per customer tier. Spillover to cloud burst capacity.</p>
              </div>
              <div>
                <p className="font-semibold text-purple-900">Q: What's your strategy if a major backbone network goes down?</p>
                <p className="text-sm text-purple-800 mt-1">A: Multi-homed data centers with diverse network providers. BGP-based automated failover. Regional autonomy - each region can operate independently.</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-lg text-center">
            <p className="text-lg font-semibold">Great job! This covers the major aspects of CDN system design.</p>
            <p className="text-sm mt-2 text-indigo-100">Remember: System design is about trade-offs, not perfect solutions.</p>
          </div>
        </div>
      </Section>
    </div>
  );
};

export default CDNSystemDesign;