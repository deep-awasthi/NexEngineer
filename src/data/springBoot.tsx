export const roadmap = [
  "IOC",
  "Dependency Injection",
  "Spring MVC",
  "REST APIs",
  "JPA",
  "Security",
  "Kafka",
  "Microservices"
];

export const topics = [
  {
    title: "IoC Container & Dependency Injection",
    description: "Understand Bean lifecycles, application contexts, dependency resolution, and configuration styles.",
    details: [
      "Inversion of Control (IoC) concept and ApplicationContext container",
      "Bean scopes (Singleton, Prototype, Request, Session) and lifecycles",
      "Dependency Injection patterns: Constructor-based (recommended) vs Setter-based vs Field injection",
      "Stereotype annotations: @Component, @Service, @Repository, @Controller, @Configuration"
    ]
  },
  {
    title: "Spring MVC & REST APIs",
    description: "Build scalable REST endpoints, map requests, validate inputs, and handle exceptions globally.",
    details: [
      "Spring MVC request dispatching: DispatcherServlet architecture",
      "@RestController mapping: @GetMapping, @PostMapping, @PutMapping, @DeleteMapping",
      "Request parameter parsing: @PathVariable, @RequestParam, @RequestBody validation (@Valid)",
      "Global exception handling: @ControllerAdvice and @ExceptionHandler patterns"
    ]
  },
  {
    title: "Data Access: JPA & Hibernate",
    description: "Map databases to Java entities, write queries, manage relationships, and handle transactions.",
    details: [
      "Object-Relational Mapping (ORM) using JPA and Hibernate entities",
      "Spring Data JPA Repositories: query creation methods, @Query custom SQL/JPQL",
      "Entity relationships mapping: @OneToOne, @OneToMany, @ManyToOne, @ManyToMany",
      "Transaction management: @Transactional boundaries, propagation, and isolation levels"
    ]
  },
  {
    title: "Enterprise Spring Security",
    description: "Secure endpoints, authenticate users, handle session states, and implement stateless JWT filters.",
    details: [
      "Spring Security filter chain architecture",
      "Authentication managers, UserDetailsService, and password encoders",
      "Securing route rules: requestMatchers, roles authorization (@PreAuthorize)",
      "Stateless security: Custom JWT generation, injection, and extraction filter setup"
    ]
  },
  {
    title: "Spring Boot Microservices & Enterprise Integrations",
    description: "Deploy microservices, manage service registries, route traffic, and configure event stream messaging.",
    details: [
      "Service Discovery using Spring Cloud Netflix Eureka",
      "Gateway routing and load balancing using Spring Cloud Gateway",
      "Distributed configuration registries using Spring Cloud Config Server",
      "Event streaming integration using Spring Kafka (Producers, Consumers, serialization)"
    ]
  }
];

export const interviewQuestions = [
  {
    question: "What is Dependency Injection?",
    answer: "A design pattern where dependencies are provided externally."
  },
  {
    question: "Difference between @Component and @Service?",
    answer: "Both register beans, @Service adds semantic meaning."
  }
];

export const pageData = {
  title: "Spring Boot",
  badge: "Java Framework",
  description:
    "Learn Spring Boot from Dependency Injection and MVC to JPA, Security, Microservices and Kafka.",
  stats: [
    { value: "8", label: "Learning Modules" },
    { value: "25+", label: "Interview Questions" },
    { value: "15+", label: "Core Concepts" },
    { value: "10+", label: "Production Examples" }
  ],
  roadmap,
  learnConcepts: [
    "IOC",
    "Dependency Injection",
    "Spring MVC",
    "REST APIs",
    "JPA",
    "Security",
    "Kafka",
    "Microservices",
    "Spring Cloud",
    "Actuator",
    "Testing",
    "Containerization"
  ],
  topics,
  interviewQuestions,
  resources: [
    "Spring Documentation",
    "Baeldung",
    "Spring Academy",
    "Java Guides",
    "Effective Java",
    "Microservices.io"
  ],
  ctaTitle: "Become Production Ready with Spring Boot",
  ctaDescription:
    "Master dependency injection, controllers, databases, security, Kafka, and enterprise microservices using Spring Boot."
};