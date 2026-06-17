import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Sparkles, ArrowLeft, BookOpen, Terminal, CheckCircle2, AlertTriangle } from "lucide-react";
import styles from "./page.module.css";

// Static data structure definitions
interface CheatsheetDetail {
  title: string;
  description: string;
  tips: string[];
  codeSnippet: string;
  codeLanguage: string;
  pitfalls: string[];
  bestPractices: string[];
}

const sections = [
  {
    title: "Java",
    slug: "java",
    notes: ["Collections Cheat Sheet", "Streams Cheat Sheet", "JVM Cheat Sheet", "Concurrency Cheat Sheet"],
  },
  {
    title: "DSA",
    slug: "dsa",
    notes: ["Complexity Cheat Sheet", "Tree Traversal Cheat Sheet", "Graph Algorithms Cheat Sheet", "DP Patterns"],
  },
  {
    title: "Spring Boot",
    slug: "spring-boot",
    notes: ["Annotations Cheat Sheet", "Security Cheat Sheet", "JPA Cheat Sheet", "Kafka Integration Notes"],
  },
  {
    title: "Docker & Kubernetes",
    slug: "docker-kubernetes",
    notes: ["Docker Commands", "Docker Compose Commands", "Kubectl Commands", "Helm Commands"],
  },
  {
    title: "System Design",
    slug: "system-design",
    notes: ["Caching Cheat Sheet", "Database Cheat Sheet", "CAP Theorem", "Load Balancer Notes"],
  },
  {
    title: "Go",
    slug: "go",
    notes: ["Goroutines Cheat Sheet", "Channels Cheat Sheet", "Go Syntax Revision", "Context API Notes"],
  },
  {
    title: "Python",
    slug: "python",
    notes: ["Generators & Iterators", "Decorators Cheat Sheet", "AsyncIO Cheatsheet", "Virtual Envs & PIP"],
  },
  {
    title: "AI",
    slug: "ai",
    notes: ["Prompt Engineering Tips", "RAG Pipeline Cheat Sheet", "Vector DB Comparison", "Model Context Protocol"],
  },
];

// Custom regex highlighter
function highlightCode(code: string) {
  const regex = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/|#[^\n]*)|("(?:\\.|[^\\"])*"|'(?:\\.|[^\\'])*'|`(?:\\.|[^\\`])*`)|(@\w+)|\b(package|import|func|go|defer|select|chan|range|var|const|struct|interface|return|type|for|if|else|switch|case|default|class|public|private|protected|static|final|void|new|null|true|false|try|catch|finally|throw|throws|extends|implements|async|await|function|let|from|export)\b|\b(int|string|bool|float64|Map|List|Set|Queue|ConcurrentHashMap|ArrayList|HashSet|PriorityQueue|HashMap|ArrayDeque|String|Integer|Double|Boolean|Float|Object)\b|\b(\d+)\b/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(code)) !== null) {
    if (match.index > lastIndex) {
      parts.push(code.substring(lastIndex, match.index));
    }
    const [full, comment, str, annotation, keyword, type, number] = match;
    const key = `token-${match.index}`;

    if (comment) {
      parts.push(<span key={key} className={styles.codeComment}>{full}</span>);
    } else if (str) {
      parts.push(<span key={key} className={styles.codeString}>{full}</span>);
    } else if (annotation) {
      parts.push(<span key={key} className={styles.codeAnnotation}>{full}</span>);
    } else if (keyword) {
      parts.push(<span key={key} className={styles.codeKeyword}>{full}</span>);
    } else if (type) {
      parts.push(<span key={key} className={styles.codeType}>{full}</span>);
    } else if (number) {
      parts.push(<span key={key} className={styles.codeNumber}>{full}</span>);
    } else {
      parts.push(full);
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < code.length) {
    parts.push(code.substring(lastIndex));
  }
  return parts;
}

// Cheatsheet detail mapping data
const cheatsheetContentMap: Record<string, CheatsheetDetail> = {
  "collections-cheat-sheet": {
    title: "Collections Cheat Sheet",
    description: "Quick reference guide for the Java Collections Framework (JCF), hierarchy, complexity, and thread safety rules.",
    tips: [
      "ArrayList is backed by a dynamic array. Default capacity is 10. Grows by 50% (new = old + old >> 1).",
      "LinkedList implements List and Deque, backed by a doubly-linked list. Better for frequent index-based additions/removals but slower for search.",
      "HashMap capacity must be a power of 2 to allow index lookup via fast bitwise AND: (n - 1) & hash.",
      "ConcurrentHashMap uses volatile read optimizations and synchronized bucket locks instead of table locks, scaling concurrent throughput."
    ],
    codeSnippet: `// Quick Java Collections Initialization and Operations
Map<String, List<Integer>> multimap = new HashMap<>();
multimap.computeIfAbsent("user-logs", k -> new ArrayList<>()).add(104);

// Synchronized map wrapping (slower than ConcurrentHashMap)
Map<String, String> syncMap = Collections.synchronizedMap(new HashMap<>());

// Iterating over keys safely
for (Map.Entry<String, List<Integer>> entry : multimap.entrySet()) {
    System.out.println(entry.getKey() + ": " + entry.getValue().size());
}`,
    codeLanguage: "java",
    pitfalls: [
      "Do not modify a collection directly during a standard Iterator loop or foreach - it throws ConcurrentModificationException. Use iterator.remove() or collection.removeIf().",
      "Using mutable keys in a HashMap can break key retrieval because the computed hash code changes when the key changes."
    ],
    bestPractices: [
      "Always override both hashCode() and equals() when using custom keys in Map or Set.",
      "Set initial capacity for HashMap if final size is known: initialCapacity = (expectedSize / 0.75f) + 1."
    ]
  },
  "complexity-cheat-sheet": {
    title: "Complexity Cheat Sheet",
    description: "Algorithmic complexities of standard operations across data structures, including sorting rules.",
    tips: [
      "Array / ArrayList has O(1) random access reads but O(N) insertion/deletion due to element shifting.",
      "Singly / Doubly Linked Lists have O(1) insertion/deletion at pointers but O(N) search and lookup time.",
      "Binary Search Trees (BST) have O(log N) average cases but O(N) worst cases if unbalanced (skewed tree).",
      "Trie structures provide O(L) complexity for string retrieval, where L is the length of the string, independent of total elements."
    ],
    codeSnippet: `// Time Complexity Reference Table (Worst Cases)
/*
 * Data Structure   | Access   | Search   | Insertion | Deletion
 * -----------------|----------|----------|-----------|-----------
 * Array / Vector   | O(1)     | O(N)     | O(N)      | O(N)
 * Stack / Queue    | O(N)     | O(N)     | O(1)      | O(1)
 * Hash Table       | N/A      | O(N)*    | O(N)*     | O(N)*     (*Hash collisions)
 * Red-Black Tree   | O(log N) | O(log N) | O(log N)  | O(log N)
 */`,
    codeLanguage: "javascript",
    pitfalls: [
      "Using recursion blindly without tracking stack frames can lead to StackOverflowError. Factor in O(N) call stack memory.",
      "Assuming HashMap lookup is always O(1). In massive collisions, Java converts bins to balanced trees (Red-Black), reducing worst-case to O(log N)."
    ],
    bestPractices: [
      "Use iterative algorithms or tail-recursion optimizations where memory footprint is strict.",
      "Profile real-world dataset distributions since lower Big-O algorithms may have high constant factors."
    ]
  },
  "annotations-cheat-sheet": {
    title: "Annotations Cheat Sheet",
    description: "Core Spring and Spring Boot annotations mapping stereotypes, injection modes, and API endpoints.",
    tips: [
      "@Component registers classes as generic beans. @Service, @Repository, and @Controller are specialized stereotypes.",
      "@Autowired performs dependency injection. Constructor injection is preferred over field injection for testability.",
      "@RestController combines @Controller and @ResponseBody, returning serialized JSON/XML payloads directly.",
      "@Transactional sets up declarative transactional boundaries. Propagates rollback rules dynamically."
    ],
    codeSnippet: `@RestController
@RequestMapping("/api/v1/orders")
public class OrderController {
    
    private final OrderService orderService;
    
    // Spring constructor injection
    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrder(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.findOrderById(id));
    }
}`,
    codeLanguage: "java",
    pitfalls: [
      "@Transactional only works on public methods called externally. Internal calls bypass the Spring AOP proxy wrapper.",
      "Field injection makes mocking dependencies in unit tests difficult without reflection libraries."
    ],
    bestPractices: [
      "Use Constructor Injection for all mandatory dependencies.",
      "Always document @PathVariable and @RequestParam details to prevent route binding mismatches."
    ]
  },
  "docker-commands": {
    title: "Docker Commands",
    description: "Essential Docker CLI commands for container lifecycle, builds, volumes, and networks.",
    tips: [
      "docker run runs a container. Use -d for detached mode, -p for port forwarding, and -v for mounting volumes.",
      "docker exec runs commands inside an active container. Use -it for interactive TTY.",
      "docker prune cleans up unused containers, networks, and images. Releases heavy disk pressure.",
      "Multi-stage Dockerfiles reduce final image sizes by building artifacts in an compile container and copying them into a light runtime image."
    ],
    codeSnippet: `# Building and Running Containers
docker build -t app-service:1.0.0 .
docker run -d -p 8080:8080 --name backend-api -v app-data:/data app-service:1.0.0

# Inspection and Debugging
docker ps -a
docker logs -f backend-api
docker exec -it backend-api /bin/sh

# Clean Up
docker system prune -a --volumes`,
    codeLanguage: "bash",
    pitfalls: [
      "Running containers as root users inside the Docker container exposes the host system to security vulnerabilities.",
      "Hardcoding environment configurations or credentials in Dockerfiles breaks key configuration patterns."
    ],
    bestPractices: [
      "Implement multi-stage builds to keep production images tiny.",
      "Use .dockerignore to exclude node_modules, target folders, and git histories from image layers."
    ]
  },
  "caching-cheat-sheet": {
    title: "Caching Cheat Sheet",
    description: "Revision guidelines on caching architectures, write strategies, invalidation, and deployment topologies.",
    tips: [
      "Cache-Aside (Lazy Loading): Applications query cache first. On miss, queries database and updates cache.",
      "Write-Through: Cache updates synchronously with database writes. Good for consistency but slower on writes.",
      "Write-Behind (Write-Back): Cache updates immediately; database writes asynchronously. Fast writes but risks data loss.",
      "Eviction policies decide who gets removed when memory limits are hit: LRU (Least Recently Used), LFU (Least Frequently Used), FIFO."
    ],
    codeSnippet: `// Pseudocode: Cache Read-through pattern
async function getCachedResource(key, fetchDbFallback) {
    let data = await cache.get(key);
    if (!data) {
        data = await fetchDbFallback();
        await cache.set(key, JSON.stringify(data), 'EX', 600); // 10m TTL
    } else {
        data = JSON.parse(data);
    }
    return data;
}`,
    codeLanguage: "javascript",
    pitfalls: [
      "Cache Stampede: Simultaneous cache misses cause multiple workers to hit the database at once. Solution: lock keys.",
      "Not setting a TTL (Time-To-Live) on cached data leads to memory exhaustion and stale database drift."
    ],
    bestPractices: [
      "Always configure maximum memory limits and eviction policies in Redis/Memcached config.",
      "Keep TTL values reasonably short for volatile fields to ensure data freshness."
    ]
  },
  "goroutines-cheat-sheet": {
    title: "Goroutines Cheat Sheet",
    description: "Revision checklist for Go's lightweight runtime threads, orchestration tools, and channels.",
    tips: [
      "Goroutines are managed by Go's runtime scheduler (M:P:N model), starting with a tiny 2KB stack that grows dynamically.",
      "Channels synchronize goroutines. Unbuffered channels block until sender and receiver are both ready.",
      "Buffered channels allow senders to write without blocking until the buffer limit is reached.",
      "Use sync.WaitGroup to wait for a set of goroutines to complete."
    ],
    codeSnippet: `package main

import (
	"fmt"
	"sync"
)

func main() {
	var wg sync.WaitGroup
	ch := make(chan int, 3)

	for i := 1; i <= 3; i++ {
		wg.Add(1)
		go func(id int) {
			defer wg.Done()
			ch <- id * 10
		}(i)
	}

	wg.Wait()
	close(ch)

	for val := range ch {
		fmt.Println("Received:", val)
	}
}`,
    codeLanguage: "go",
    pitfalls: [
      "Goroutine leaks: If a goroutine is blocked sending or receiving on a channel indefinitely, it leaks memory.",
      "Writing to a closed channel causes a runtime panic. Reading from a closed channel returns the zero-value immediately."
    ],
    bestPractices: [
      "Always design clear channel ownership rules (the creator should be the one closing it).",
      "Use select blocks with a <-time.After() default to prevent blocking on network pipelines."
    ]
  },
  "generators-iterators": {
    title: "Generators & Iterators",
    description: "How Python generators handle memory-efficient loops and evaluations using yield.",
    tips: [
      "Iterators implement __iter__() and __next__(). Generators are functions using the 'yield' keyword.",
      "Generators calculate values lazily on-the-fly, retaining local variable states across calls.",
      "Generator expressions have identical syntax to list comprehensions but use parentheses instead of square brackets.",
      "They are highly optimized for handling infinite streams or huge files since only one item is loaded into RAM."
    ],
    codeSnippet: `# Generator function producing Fibonacci sequences
def fibonacci(limit):
    a, b = 0, 1
    for _ in range(limit):
        yield a
        a, b = b, a + b

# Generator expression (Lazy Evaluation)
infinite_nums = (x * x for x in range(1000000))

# Consuming values
for val in fibonacci(5):
    print(val) # Prints 0, 1, 1, 2, 3`,
    codeLanguage: "python",
    pitfalls: [
      "Iterators and generators can only be consumed once. Attempting to loop a second time yields no results. Create a new generator.",
      "Using list(generator) defeats the memory-saving purpose because it resolves all elements in RAM."
    ],
    bestPractices: [
      "Prefer generator expressions over list comprehensions when the final list is large and read once.",
      "Use generators for streaming file parses: line-by-line read rather than file.read()."
    ]
  },
  "prompt-engineering-tips": {
    title: "Prompt Engineering Tips",
    description: "Strategic directives for writing structured system prompts and guiding LLM inferences.",
    tips: [
      "System Prompts: Define role, constraints, context, and preferred output style upfront.",
      "Few-Shot Prompting: Provide clear input/output input examples before asking the final query.",
      "Chain of Thought: Encourage LLMs to 'think step by step' before answering. Drastically improves logical outcomes.",
      "Formatting constraints: Request responses in XML or JSON schema blocks to ease parsing."
    ],
    codeSnippet: `# Prompt Construction Template
"""
You are an expert system design architect.
Your task is to analyze database structures.

[Context]
Analyzing e-commerce cart checkouts under peak transaction load (50k rps).

[Guidelines]
1. Think step-by-step.
2. Outline trade-offs of SQL vs NoSQL.

[Response Format]
Format your answer in standard Markdown with headings.
"""`,
    codeLanguage: "text",
    pitfalls: [
      "Over-specifying conflicting instructions in a single prompt causes the model to ignore lower-priority constraints.",
      "Relying on models to format JSON correctly without enforcing schema validator checks or structured outputs."
    ],
    bestPractices: [
      "Use specific markers (like XML tags <context></context>) to cleanly separate inputs and directives.",
      "Version control your prompts just like application source code files."
    ]
  }
};

interface PageProps {
  params: Promise<{
    topic: string;
    note: string;
  }>;
}

export async function generateStaticParams() {
  const params: { topic: string; note: string }[] = [];

  sections.forEach((section) => {
    section.notes.forEach((note) => {
      const noteSlug = note.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      params.push({
        topic: section.slug,
        note: noteSlug,
      });
    });
  });

  return params;
}

export default async function CheatsheetDetailPage({ params }: PageProps) {
  const { topic, note } = await params;

  // Find parent section
  const currentSection = sections.find((s) => s.slug === topic);
  if (!currentSection) {
    notFound();
  }

  // Verify notes list contains cheatsheet
  const matchingNoteName = currentSection.notes.find(
    (n) => n.toLowerCase().replace(/[^a-z0-9]+/g, "-") === note
  );

  if (!matchingNoteName) {
    notFound();
  }

  // Get specific details content or fallback
  const content = cheatsheetContentMap[note] || {
    title: matchingNoteName,
    description: `Quick reference revision tips and cheatsheet for ${matchingNoteName} under the ${currentSection.title} track.`,
    tips: [
      `Review core requirements and specifications for ${matchingNoteName} regularly.`,
      "Practice key interview scenarios and architectural trade-offs.",
      "Explore standard templates and syntax examples in mock development environments.",
      "Understand runtime complexity patterns and constraints."
    ],
    codeSnippet: `// Quick sample overview for ${matchingNoteName}
function initializeRevision() {
    console.log("Revising ${matchingNoteName} details...");
    // Tips, syntax blocks, and structural configurations go here
}`,
    codeLanguage: "javascript",
    pitfalls: [
      `Failing to review standard trade-offs associated with ${matchingNoteName} in production workloads.`,
      "Memorizing syntax structures blindly without tracing runtime call chains."
    ],
    bestPractices: [
      "Apply configurations modularly to maintain separation of concerns.",
      "Monitor runtime traces in sandbox profiles before deployment."
    ]
  };

  // Map topic backgrounds
  const getBgUrl = (topicSlug: string) => {
    const t = topicSlug.toLowerCase();
    if (t === "java" || t === "spring-boot") return "/backgrounds/java_icon.png";
    if (t === "dsa") return "/backgrounds/dsa_icon.png";
    if (t === "docker-kubernetes" || t === "system-design") return "/backgrounds/hld_icon.png";
    if (t === "go" || t === "python" || t === "ai") return "/backgrounds/ai_icon.png";
    return "/background.png";
  };

  const bgUrl = getBgUrl(topic);

  return (
    <main className={styles.page}>
      <div className="pageBackground" style={{ backgroundImage: `url('${bgUrl}')` }} />
      <div className={styles.container}>
        {/* Navigation Breadcrumbs */}
        <nav className={styles.breadcrumbs}>
          <Link href="/">Home</Link>
          <span className={styles.separator}>/</span>
          <Link href="/notes">Notes</Link>
          <span className={styles.separator}>/</span>
          <span className={styles.activeBreadcrumb}>{content.title}</span>
        </nav>

        {/* Back Link */}
        <Link href="/notes" className={styles.backButton}>
          <ArrowLeft size={16} />
          <span>Back to Notes</span>
        </Link>

        {/* Header Section */}
        <header className={styles.header}>
          <div className={styles.badge}>
            <Sparkles size={14} className={styles.badgeIcon} />
            <span>{currentSection.title} Revision</span>
          </div>
          <h1 className={styles.title}>{content.title}</h1>
          <p className={styles.subtitle}>{content.description}</p>
        </header>

        {/* Revision Body Layout */}
        <div className={styles.layout}>
          {/* Main Revision Tips */}
          <section className={styles.mainContent}>
            <div className={styles.sectionCard}>
              <div className={styles.cardHeader}>
                <BookOpen size={20} className={styles.cardIcon} />
                <h2>Quick Revision Tips</h2>
              </div>
              <ul className={styles.tipsList}>
                {content.tips.map((tip, idx) => (
                  <li key={idx} className={styles.tipItem}>
                    <span className={styles.bulletNumber}>{idx + 1}</span>
                    <p>{tip}</p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Implementation Terminal Simulator */}
            <div className={styles.terminal}>
              <div className={styles.terminalHeader}>
                <div className={styles.windowControls}>
                  <span className={`${styles.dot} ${styles.close}`}></span>
                  <span className={`${styles.dot} ${styles.minimize}`}></span>
                  <span className={`${styles.dot} ${styles.expand}`}></span>
                </div>
                <div className={styles.terminalTitle}>
                  <Terminal size={14} />
                  <span>
                    {note}.{content.codeLanguage === "javascript" ? "js" : content.codeLanguage === "python" ? "py" : content.codeLanguage === "java" ? "java" : "txt"}
                  </span>
                </div>
              </div>
              <pre className={styles.codeBlock}>
                <code>{highlightCode(content.codeSnippet)}</code>
              </pre>
            </div>
          </section>

          {/* Side Panels (Pitfalls & Best Practices) */}
          <aside className={styles.sidebar}>
            {/* Common Pitfalls Card */}
            <div className={`${styles.sideCard} ${styles.pitfallsCard}`}>
              <div className={styles.sideCardHeader}>
                <AlertTriangle size={18} className={styles.alertIcon} />
                <h3>Common Pitfalls</h3>
              </div>
              <ul className={styles.sideList}>
                {content.pitfalls.map((pitfall, idx) => (
                  <li key={idx}>
                    <span className={styles.pitfallBullet}>•</span>
                    <p>{pitfall}</p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Best Practices Card */}
            <div className={`${styles.sideCard} ${styles.bestPracticesCard}`}>
              <div className={styles.sideCardHeader}>
                <CheckCircle2 size={18} className={styles.checkIcon} />
                <h3>Best Practices</h3>
              </div>
              <ul className={styles.sideList}>
                {content.bestPractices.map((bp, idx) => (
                  <li key={idx}>
                    <span className={styles.checkBullet}>✓</span>
                    <p>{bp}</p>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
