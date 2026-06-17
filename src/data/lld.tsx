export const roadmap = [
  "OOP",
  "SOLID",
  "Factory Pattern",
  "Strategy Pattern",
  "Observer Pattern",
  "Builder Pattern",
  "Case Studies"
];

export const topics = [
  {
    title: "Object-Oriented Programming (OOP) Core",
    description: "Understand classes, objects, data abstraction, encapsulation, inheritance, and polymorphism in low-level code design.",
    details: [
      "Inheritance (is-a) vs. Composition (has-a) principles",
      "Polymorphism: method overriding (runtime) vs. method overloading (compile-time)",
      "Encapsulation: access modifiers, domain boundaries, and data hiding",
      "Abstraction: abstract classes vs interfaces and contracts implementation"
    ]
  },
  {
    title: "SOLID Principles",
    description: "Master the five fundamental principles of object-oriented design for creating robust and maintainable code.",
    details: [
      "Single Responsibility Principle (SRP): class separation and single reason to change",
      "Open/Closed Principle (OCP): open for extension, closed for modification using polymorphism",
      "Liskov Substitution Principle (LSP): subclass substitutability without breaking expectations",
      "Interface Segregation Principle (ISP): split bloated interfaces into granular, focused contracts",
      "Dependency Inversion Principle (DIP): program to interfaces, not concrete implementations"
    ]
  },
  {
    title: "Creational Design Patterns",
    description: "Learn abstraction patterns for object creation and lifecycle control.",
    details: [
      "Singleton: single instance management, thread-safe lazy initialization, double-checked locking",
      "Factory Method & Abstract Factory: isolating object creation instantiation logic from client code",
      "Builder Pattern: step-by-step construction of complex objects with validation constraints",
      "Prototype Pattern: cloning existing object instances dynamically"
    ]
  },
  {
    title: "Structural Design Patterns",
    description: "Compose classes and objects into larger, flexible structures.",
    details: [
      "Adapter: wrapping legacy interfaces to match client contracts",
      "Decorator: dynamically attaching new responsibilities to objects without subclassing",
      "Facade: providing a simplified unified interface to a complex subsystem",
      "Proxy: controlling access to target objects (lazy loading, caching, logging)"
    ]
  },
  {
    title: "Behavioral Design Patterns",
    description: "Manage algorithms, object interactions, and responsibilities mapping.",
    details: [
      "Strategy: encapsulating families of algorithms and switching them at runtime",
      "Observer: one-to-many subscription model for state change propagation",
      "Command: encapsulating requests as objects to parameterize or queue operations",
      "State: altering object behaviors dynamically when internal state changes"
    ]
  },
  {
    title: "Machine Coding Case Studies",
    description: "Apply OOD principles to design real-world systems under time constraints.",
    details: [
      "Parking Lot: classes design, slots management, tickets generation, and vehicle types",
      "Splitwise: expense sharing, user groups, and simplified debt clearance algorithms",
      "BookMyShow: concurrency bookings management, seats allocation, and payment states",
      "ATM System: state transitions logic (card reading, pin entry, cash dispensing)"
    ]
  }
];

export const interviewQuestions = [
  {
    question: "What is Open Closed Principle?",
    answer: "Software entities should be open for extension and closed for modification."
  },
  {
    question: "When should Strategy Pattern be used?",
    answer: "When behavior varies dynamically."
  }
];

export const pageData = {
  title: "LLD",
  badge: "Object Oriented Design",
  description:
    "Learn Low Level Design from OOP fundamentals to scalable object modelling, design patterns and machine coding interviews.",
  stats: [
    { value: "12", label: "Learning Modules" },
    { value: "50+", label: "Interview Questions" },
    { value: "20+", label: "Design Patterns" },
    { value: "10+", label: "Machine Coding Problems" }
  ],
  roadmap,
  learnConcepts: [
    "OOP",
    "SOLID Principles",
    "UML",
    "Class Design",
    "Object Modelling",
    "Composition",
    "Aggregation",
    "Interfaces",
    "Abstraction",
    "Coupling",
    "Cohesion",
    "Refactoring"
  ],
  additionalGrids: [
    {
      title: "Essential Patterns",
      items: [
        "Singleton",
        "Factory",
        "Builder",
        "Strategy",
        "Observer",
        "Decorator",
        "Adapter",
        "Facade",
        "Command",
        "Prototype",
        "Chain of Responsibility",
        "State Pattern"
      ]
    },
    {
      title: "Systems You will Design",
      items: [
        "Parking Lot",
        "Splitwise",
        "BookMyShow",
        "Snake & Ladder",
        "Tic Tac Toe",
        "ATM System",
        "Library Management",
        "Elevator System",
        "Chess Game",
        "Notification System",
        "Car Rental",
        "Food Delivery"
      ]
    }
  ],
  topics,
  interviewQuestions,
  resources: [
    "Refactoring Guru",
    "Head First Design Patterns",
    "Clean Code",
    "Clean Architecture",
    "Design Patterns",
    "UML Guide",
    "Java Design Patterns",
    "Object Modelling",
    "SOLID Principles",
    "Machine Coding",
    "System Design Primer",
    "ByteByteGo"
  ],
  ctaTitle: "Become an LLD Expert",
  ctaDescription:
    "Learn object-oriented design, design patterns and machine coding techniques used in top software engineering interviews."
};