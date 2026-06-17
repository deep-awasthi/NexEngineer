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
    title: "Collections Framework",
    description:
      "Master List, Set, Queue and Map implementations along with complexity analysis."
  },
  {
    title: "Streams API",
    description:
      "Learn functional programming, map, filter, reduce and collectors."
  },
  {
    title: "Exception Handling",
    description:
      "Checked exceptions, unchecked exceptions and best practices."
  },
  {
    title: "Concurrency",
    description:
      "Threads, Executors, CompletableFuture and synchronization."
  },
  {
    title: "JVM",
    description:
      "Heap, Stack, Metaspace, JIT and Garbage Collection."
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