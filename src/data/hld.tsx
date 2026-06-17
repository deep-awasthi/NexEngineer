export const roadmap = [
  "System Design Fundamentals",
  "Scalability",
  "Load Balancing",
  "Caching",
  "Databases",
  "Replication",
  "Sharding",
  "Message Queues",
  "Distributed Systems",
  "Microservices",
  "CAP Theorem",
  "Observability",
  "Security",
  "System Design Interviews"
];

export const topics = [
  {
    title: "System Design Fundamentals & Scalability",
    description: "Understand the core trade-offs of system design, scaling mechanics, latency numbers, and capacity planning.",
    details: [
      "Vertical scaling (scale-up) vs. Horizontal scaling (scale-out)",
      "Latency vs. Throughput metrics and performance benchmarks",
      "Back-of-the-envelope calculations: capacity planning, storage, and bandwidth estimation",
      "Identifying bottleneck checkpoints: CPU, Memory, IO, and Network limits"
    ]
  },
  {
    title: "Load Balancing & High Availability",
    description: "Distribute incoming traffic across healthy resource pools and eliminate single points of failure.",
    details: [
      "Layer 4 (Transport) vs. Layer 7 (Application) Load Balancing",
      "Load balancing algorithms: Round Robin, Least Connections, Weighted, IP Hash",
      "Health checks, passive/active health monitoring, and routing configurations",
      "High Availability configurations: Active-Passive vs Active-Active, DNS routing (GSLB)"
    ]
  },
  {
    title: "Caching Strategies & CDN",
    description: "Accelerate data reads, reduce database queries, and serve static assets close to users.",
    details: [
      "Caching patterns: Cache-aside, Read-through, Write-through, Write-behind",
      "Cache eviction policies: LRU, LFU, FIFO, and TTL configurations",
      "Distributed Caching with Redis: Clusters, Sentinel, and Replication",
      "Content Delivery Networks (CDNs): edge servers, static vs dynamic caching, push vs pull"
    ]
  },
  {
    title: "Database Partitioning, Replication, & Sharding",
    description: "Scale database engines, replicate data for high availability, and partition datasets.",
    details: [
      "Replication models: Single Leader (Master-Slave), Multi-Leader, Leaderless (Quorum)",
      "Horizontal database partitioning: Range-based, Hash-based, and Directory-based sharding",
      "Sharding challenges: join queries, re-sharding, hot-spotting, and transaction management",
      "Consistent Hashing: ring mapping, virtual nodes, and data routing"
    ]
  },
  {
    title: "Messaging & Event Streaming",
    description: "Decouple services, handle async requests, and stream data logs.",
    details: [
      "Message Queues (RabbitMQ) vs Event Streaming platforms (Apache Kafka)",
      "Publisher-Subscriber patterns and message delivery guarantees (At-most-once, At-least-once, Exactly-once)",
      "Kafka architecture: Topics, Partitions, Consumer Groups, and Commit logs",
      "Handling backpressure and DLQ (Dead Letter Queue) processing"
    ]
  },
  {
    title: "Distributed Systems & CAP Theorem",
    description: "Understand distributed systems challenges, consensus algorithms, and CAP trade-offs.",
    details: [
      "CAP Theorem: Consistency, Availability, and Partition Tolerance tradeoffs",
      "PACELC Theorem: adding Latency and Consistency tradeoffs during normal operations",
      "Strong Consistency vs Eventual Consistency models",
      "Consensus algorithms: Raft, Paxos, and gossip protocols"
    ]
  },
  {
    title: "Microservices Architecture & API Gateway",
    description: "Structure microservices, implement service discovery, and configure unified API Gateways.",
    details: [
      "Monolith vs. Microservices tradeoffs and boundaries",
      "API Gateway features: Rate Limiting, Authentication, Routing, and SSL termination",
      "Service Discovery mechanisms: Client-side vs Server-side discovery",
      "Resilience patterns: Circuit Breakers, Bulkheads, Retries, and Timeouts"
    ]
  }
];

export const interviewQuestions = [
  {
    question: "What is horizontal scaling?",
    answer: "Adding more servers to increase capacity."
  },
  {
    question: "What is database sharding?",
    answer: "Splitting data across multiple database instances."
  }
];

export const pageData = {
  title: "HLD",
  badge: "System Design & Architecture",
  description:
    "Learn High Level Design from scalability fundamentals to distributed systems and real-world architecture interviews.",
  stats: [
    { value: "15", label: "Architecture Modules" },
    { value: "50+", label: "Interview Questions" },
    { value: "25+", label: "System Design Concepts" },
    { value: "10+", label: "Case Studies" }
  ],
  roadmap,
  learnConcepts: [
    "Scalability",
    "Load Balancing",
    "Caching",
    "Databases",
    "Replication",
    "Sharding",
    "CAP Theorem",
    "Microservices",
    "Message Queues",
    "CDN",
    "Distributed Systems",
    "Observability"
  ],
  additionalGrids: [
    {
      title: "Design Components",
      items: [
        "API Gateway",
        "Load Balancer",
        "Redis Cache",
        "Kafka",
        "ElasticSearch",
        "PostgreSQL",
        "MySQL",
        "S3 Storage",
        "CDN",
        "Service Discovery",
        "Rate Limiter",
        "Monitoring"
      ]
    },
    {
      title: "Systems You will Design",
      items: [
        "URL Shortener",
        "Instagram",
        "YouTube",
        "WhatsApp",
        "Netflix",
        "Uber",
        "Twitter/X",
        "Notification Service",
        "Rate Limiter",
        "Distributed Cache",
        "Payment System",
        "Search Engine"
      ]
    }
  ],
  topics,
  interviewQuestions,
  resources: [
    "System Design Primer",
    "Designing Data Intensive Apps",
    "ByteByteGo",
    "High Scalability",
    "AWS Architecture",
    "Google SRE",
    "Netflix Tech Blog",
    "Uber Engineering",
    "Kafka Docs",
    "Redis Docs",
    "Kubernetes",
    "Microservices.io"
  ],
  ctaTitle: "Become a System Design Expert",
  ctaDescription:
    "Learn scalability, distributed systems and architecture patterns used by large-scale applications."
};