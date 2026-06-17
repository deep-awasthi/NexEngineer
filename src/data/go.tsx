export const roadmap = [
  "Go Fundamentals",
  "Functions & Packages",
  "Structs & Interfaces",
  "Pointers",
  "Error Handling",
  "Concurrency",
  "Goroutines & Channels",
  "Context API",
  "Testing",
  "REST APIs",
  "Databases",
  "gRPC",
  "Microservices",
  "Production Systems"
];

export const topics = [
  {
    title: "Go Fundamentals & Control Flow",
    description: "Understand variables, types, constant definitions, slices, maps, control loops, and basic functions.",
    details: [
      "Go Type System: static typing, implicit vs explicit definitions, zero values",
      "Slices: backing arrays, capacity vs length, slicing expressions, append behaviors",
      "Maps: hash tables under the hood, key constraints, lookup safety checks",
      "Control Flow: for range loops, switch-case constructs without fallthrough"
    ]
  },
  {
    title: "Functions, Packages, & Modules",
    description: "Write clean, modular Go applications using first-class functions, custom packages, and dependency tracking.",
    details: [
      "Multiple return values, named returns, and blank identifier usage",
      "First-class and anonymous functions (Closures)",
      "Package visibility: Exported vs unexported identifiers",
      "Go Modules (go.mod, go.sum) and dependency version management"
    ]
  },
  {
    title: "Structs, Pointers, & Interfaces",
    description: "Master structs for data modeling, pointers for memory references, and interfaces for implicit polymorphism.",
    details: [
      "Struct compilation: nested structs, composition, field promotion",
      "Pointers: value vs pointer receivers, parameter passing optimization, nil pointer checks",
      "Interfaces: implicit satisfaction, empty interface (any), type assertions, type switches",
      "Memory escape analysis: Stack vs Heap allocation diagnostics"
    ]
  },
  {
    title: "Error Handling & Defer",
    description: "Handle errors explicitly as values, compile resource cleanups using defer, and understand panic recovery.",
    details: [
      "Error interface: returning errors, sentinel errors, custom error types",
      "Chaining and wrapping errors: errors.Is() and errors.As()",
      "Defer: stacked executions, parameter evaluation timings",
      "Panic and Recover mechanisms for critical runtime exception handling"
    ]
  },
  {
    title: "Concurrency: Goroutines & Channels",
    description: "Learn Go's concurrency model: lightweight threads, channel communications, and synchronization.",
    details: [
      "Goroutines: CSP (Communicating Sequential Processes) model, lightweight thread management",
      "Buffered vs Unbuffered Channels: blocking behaviors and close mechanics",
      "Select statement: multiplexing channels, timeouts, non-blocking selects",
      "Sync package: WaitGroup, Mutex, RWMutex, Once, Map synchronization"
    ]
  },
  {
    title: "Context API",
    description: "Manage request lifecycles, cancellations, timeout limits, and metadata values across goroutines.",
    details: [
      "Context lifecycle propagation and cancellation signals",
      "WithCancel, WithTimeout, and WithDeadline usage",
      "WithValue for request-scoped metadata passing (avoiding misuse)",
      "Best practices: passing context as the first parameter"
    ]
  },
  {
    title: "REST APIs, gRPC & Microservices",
    description: "Build robust backend architectures, write routing, connect databases, and implement RPC protocols.",
    details: [
      "Writing REST routers using standard library or web frameworks (Gin, Fiber)",
      "JSON marshalling/unmarshalling, schema validation, and middleware pipelines",
      "Database integration using database/sql or ORMs (GORM, SQLX)",
      "gRPC: Protobuf schemas, service definitions, code generation, streaming RPCs"
    ]
  }
];

export const interviewQuestions = [
  {
    question: "What is a goroutine?",
    answer: "A lightweight thread managed by the Go runtime."
  },
  {
    question: "What are channels?",
    answer: "Mechanism for communication between goroutines."
  }
];

export const pageData = {
  title: "Go",
  badge: "Modern Backend Development",
  description:
    "Learn Go from language fundamentals to microservices, concurrency, distributed systems and production backend architectures.",
  stats: [
    { value: "14", label: "Learning Modules" },
    { value: "30+", label: "Interview Questions" },
    { value: "20+", label: "Production Concepts" },
    { value: "10+", label: "Backend Projects" }
  ],
  roadmap,
  learnConcepts: [
    "Variables",
    "Functions",
    "Structs",
    "Interfaces",
    "Pointers",
    "Error Handling",
    "Goroutines",
    "Channels",
    "Context API",
    "Concurrency Patterns",
    "Testing",
    "Generics"
  ],
  additionalGrids: [
    {
      title: "Production Go Development",
      items: [
        "REST APIs",
        "gRPC",
        "Gin Framework",
        "Fiber",
        "Database Access",
        "PostgreSQL",
        "Redis",
        "Kafka",
        "Microservices",
        "Docker",
        "Kubernetes",
        "Observability"
      ]
    },
    {
      title: "Projects You will Build",
      items: [
        "REST API",
        "URL Shortener",
        "Authentication Service",
        "Payment Service",
        "Kafka Consumer",
        "gRPC Service",
        "Redis Cache",
        "Task Scheduler",
        "Microservice Suite",
        "API Gateway",
        "Distributed System",
        "Backend Platform"
      ]
    }
  ],
  topics,
  interviewQuestions,
  resources: [
    "Go Documentation",
    "Go By Example",
    "Effective Go",
    "Go Blog",
    "Gin",
    "Fiber",
    "gRPC",
    "PostgreSQL",
    "Redis",
    "Kafka",
    "Docker",
    "Kubernetes"
  ],
  ctaTitle: "Become a Production Go Engineer",
  ctaDescription:
    "Build scalable backend systems, microservices and distributed applications using Go."
};