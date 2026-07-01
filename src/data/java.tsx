export const roadmap = [
  "Java Basics",
  "OOP",
  "Collections",
  "Streams",
  "Exception Handling",
  "Concurrency",
  "JVM",
  "Memory Management",
  "Spring Boot"
];

export const topics = [
  {
    title: "Java Basics & OOP",
    description: "Learn core Java syntax, variables, control flow, and Object-Oriented Programming (OOP) concepts.",
    details: [
      "Variables, Data Types, and Operators",
      "Control Flow: Loops, Conditionals, and Switch statements",
      "OOP Core: Inheritance, Polymorphism, Abstraction, and Encapsulation",
      "Classes, Interfaces, Abstract Classes, and Record Types"
    ],
    mediumUrl: "https://medium.com/@deepawasthi/mastering-java-basics-and-oop-fundamentals-9a7206bb9b1f"
  },

  {
    title: "Collections Framework",
    description: "Master List, Set, Queue, and Map implementations along with complexity analysis.",
    details: [
      "List implementations: ArrayList, LinkedList, Vector",
      "Set implementations: HashSet, LinkedHashSet, TreeSet",
      "Map implementations: HashMap, LinkedHashMap, TreeMap, ConcurrentHashMap",
      "Queue & Deque: PriorityQueue, ArrayDeque",
      "Big-O complexity analysis and performance characteristics"
    ]
  },
  {
    title: "Streams API & Functional Programming",
    description: "Learn functional programming interfaces, lambda expressions, stream operations, and collectors.",
    details: [
      "Lambda Expressions and Functional Interfaces (Predicate, Function, Consumer, Supplier)",
      "Intermediate operations: map(), filter(), flatMap(), sorted(), distinct()",
      "Terminal operations: collect(), reduce(), findFirst(), anyMatch()",
      "Collectors API: groupingBy(), partitioningBy(), toList(), toSet()",
      "Parallel Streams: performance considerations and thread safety"
    ]
  },
  {
    title: "Exception Handling",
    description: "Handle errors robustly using checked/unchecked exceptions, try-catch-finally, and custom exceptions.",
    details: [
      "Checked exceptions (compile-time) vs Unchecked exceptions (runtime)",
      "Try-catch-finally blocks and Try-with-resources (AutoCloseable)",
      "Throw, throws, and propagating exceptions",
      "Creating and throwing custom application exceptions",
      "Best practices: avoiding Exception swallowing, using precise exception types"
    ]
  },
  {
    title: "Concurrency & Multithreading",
    description: "Master threads, executors, CompletableFuture, and synchronization for high-performance applications.",
    details: [
      "Thread lifecycle, Runnable, Callable, and Thread pools",
      "ExecutorService and ScheduledExecutorService",
      "CompletableFuture: asynchronous pipelines, chaining, and error handling",
      "Synchronization, Volatile variables, and Atomic classes",
      "Locks: ReentrantLock, ReadWriteLock, and Semaphore"
    ]
  },
  {
    title: "JVM & Memory Management",
    description: "Understand class loading, runtime data areas (Heap, Stack, Metaspace), JIT compilation, and Garbage Collection.",
    details: [
      "JVM Architecture: Class Loader, Execution Engine, and JIT Compiler",
      "Runtime Memory Areas: Heap, Thread Stack, Metaspace, Program Counter",
      "Garbage Collection (GC) algorithms: G1, ZGC, Parallel GC",
      "Memory leaks: identification, heap dumps, and analysis (Eclipse Memory Analyzer)",
      "Performance tuning: JVM flags, memory limits, and optimization"
    ]
  },
  {
    title: "Enterprise Spring Boot Integration",
    description: "Learn how to build enterprise backend microservices and REST APIs using Spring Boot.",
    details: [
      "Inversion of Control (IOC) and Dependency Injection",
      "Spring MVC: Controllers, Requests, Responses, and validation",
      "JPA & Hibernate: Entities, Repositories, and transaction management",
      "Spring Security: Authentication, Authorization, JWT, and OAuth2"
    ]
  }
];

export const interviewQuestions = [
  {
    question:
      "Difference between HashMap and ConcurrentHashMap?",
    answer:
      "HashMap is not thread-safe. ConcurrentHashMap supports concurrent access and minimizes locking."
  },
  {
    question:
      "What happens when an object is created in Java?",
    answer:
      "Memory is allocated on heap, constructor executes and reference is returned."
  },
  {
    question:
      "What is the difference between ArrayList and LinkedList?",
    answer:
      "ArrayList offers fast random access while LinkedList provides efficient insertions and deletions."
  },
  {
    question:
      "How does Garbage Collection work?",
    answer:
      "The JVM identifies unreachable objects and reclaims heap memory automatically."
  }
];

export const pageData = {
  title: "Java",
  badge: "Programming Language",
  description:
    "Learn Java from fundamentals to JVM internals, multithreading, collections, memory management, design patterns and production systems.",
  stats: [
    { value: "15", label: "Learning Modules" },
    { value: "25+", label: "Interview Questions" },
    { value: "40+", label: "Core Concepts" },
    { value: "50+", label: "Practical Examples" }
  ],
  roadmap,
  learnConcepts: [
    "OOP",
    "Collections",
    "Generics",
    "Streams API",
    "Exception Handling",
    "JVM",
    "Memory Management",
    "Garbage Collection",
    "Multithreading",
    "Concurrency",
    "Annotations",
    "Reflection"
  ],
  additionalGrids: [
    {
      title: "JVM Architecture",
      items: [
        "Class Loader",
        "Method Area",
        "Heap Memory",
        "Stack Memory",
        "Program Counter",
        "Native Method Stack",
        "GC Algorithms",
        "JIT Compiler",
        "Memory Leaks",
        "Profiling",
        "Thread Model",
        "Performance Tuning"
      ]
    }
  ],
  featuredArticle: {
    title: "Java OOP",
    description:
      "Learn classes, objects, inheritance, polymorphism, abstraction and encapsulation.",
    href: "/java/oop",
    readTime: "10 min read"
  },
  topics,
  interviewQuestions,
  resources: [
    "Java Documentation",
    "JVM Internals",
    "Collections Framework",
    "Concurrency",
    "Design Patterns",
    "Effective Java",
    "Streams API",
    "Memory Management",
    "Garbage Collection",
    "Spring Ecosystem",
    "Performance Tuning",
    "Interview Preparation"
  ],
  ctaTitle: "Become Production Ready with Java",
  ctaDescription:
    "Explore deep-dive articles, JVM internals, concurrency, performance tuning and real-world backend development."
};