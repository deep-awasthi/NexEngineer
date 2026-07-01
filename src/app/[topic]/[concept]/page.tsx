import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { pageData as java } from "@/data/java";
import { pageData as kubernetes } from "@/data/kubernetes";
import { pageData as ai } from "@/data/ai";
import { pageData as docker } from "@/data/docker";
import { pageData as dsa } from "@/data/dsa";
import { pageData as go } from "@/data/go";
import { pageData as hld } from "@/data/hld";
import { pageData as lld } from "@/data/lld";
import { pageData as python } from "@/data/python";
import { pageData as springBoot } from "@/data/spring-boot";
import { TopicPageData, TopicItem } from "@/components/TopicPage";
import MediumArticleButton from "@/components/MediumArticleButton";
import styles from "./page.module.css";



const dataMap: Record<string, TopicPageData> = {
  java,
  kubernetes,
  ai,
  docker,
  dsa,
  go,
  hld,
  lld,
  python,
  "spring-boot": springBoot
};

export const unstable_instant = { prefetch: "static", unstable_disableValidation: true };

interface PageProps {
  params: Promise<{
    topic: string;
    concept: string;
  }>;
}

// Custom regex-based code syntax highlighter
function highlightCode(code: string) {
  // Regex mapping groups:
  // 1. Comments: //... or /*...*/ or #...
  // 2. Strings: "..." or '...' or `...`
  // 3. Annotations: @Annotation
  // 4. Keywords: func, package, public, etc.
  // 5. Types: int, string, Map, List, etc.
  // 6. Numbers: 123
  const regex = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/|#[^\n]*)|("(?:\\.|[^\\"])*"|'(?:\\.|[^\\'])*'|`(?:\\.|[^\\`])*`)|(@\w+)|\b(package|import|func|go|defer|select|chan|range|var|const|struct|interface|return|type|for|if|else|switch|case|default|class|public|private|protected|static|final|void|new|null|true|false|try|catch|finally|throw|throws|extends|implements|async|await|function|let|from|export)\b|\b(int|string|bool|float64|Map|List|Set|Queue|ConcurrentHashMap|ArrayList|HashSet|PriorityQueue|HashMap|ArrayDeque|String|Integer|Double|Boolean|Float|Object)\b|\b(\d+)\b/g;

  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(code)) !== null) {
    if (match.index > lastIndex) {
      parts.push(code.substring(lastIndex, match.index));
    }

    const [
      full,
      comment,
      str,
      annotation,
      keyword,
      type,
      number
    ] = match;

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

// Generates rich content details based on concept and topic
function getRichContent(topicSlug: string, conceptSlug: string, title: string) {
  const t = topicSlug.toLowerCase();
  
  if (t === "go" && conceptSlug.includes("concurrency")) {
    return {
      codeSnippet: `package main

import (
	"fmt"
	"time"
)

func worker(id int, jobs <-chan int, results chan<- int) {
	for j := range jobs {
		fmt.Printf("worker:%d started job:%d\\n", id, j)
		time.Sleep(time.Second)
		results <- j * 2
	}
}

func main() {
	jobs := make(chan int, 100)
	results := make(chan int, 100)

	// Start 3 concurrent workers
	for w := 1; w <= 3; w++ {
		go worker(w, jobs, results)
	}

	// Send 5 jobs
	for j := 1; j <= 5; j++ {
		jobs <- j
	}
	close(jobs)

	// Collect results
	for a := 1; a <= 5; a++ {
		fmt.Printf("Result: %d\\n", <-results)
	}
}`,
      codeLanguage: "go",
      explanation: "Concurrency in Go is built on the Communicating Sequential Processes (CSP) model. Instead of sharing memory across threads and locking it (mutexes), goroutines communicate values via type-safe channels. This model simplifies concurrent orchestration and helps prevent runtime race conditions.",
      bestPractices: [
        "Always define and control channel ownership (closing on sender side).",
        "Use context.Context to pass timeout boundaries and propagation cancels.",
        "Prevent resource leaks by ensuring goroutines are never blocked indefinitely on channels."
      ],
      keyTakeaways: [
        "Goroutines are extremely lightweight green threads (~2KB starting stack).",
        "Channels act as direct synchronization pipes between tasks.",
        "The sync package (Mutex, WaitGroup) remains crucial for raw state memory protection."
      ]
    };
  }

  if (t === "java" && conceptSlug.includes("collections")) {
    return {
      codeSnippet: `import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

public class CollectionsDemo {
    public static void main(String[] args) {
        // Thread-safe map with segment lock scaling
        Map<String, Integer> map = new ConcurrentHashMap<>();
        map.put("Java", 17);
        map.put("Spring", 6);
        
        // Process map keys dynamically using Streams API
        map.keySet().stream()
            .filter(k -> k.startsWith("J"))
            .forEach(k -> System.out.println(k + " version: " + map.get(k)));
    }
}`,
      codeLanguage: "java",
      explanation: "The Java Collections Framework provides a unified architecture to store and manipulate collections of elements. By defining abstract interfaces (List, Set, Map, Queue) and multiple performance-tuned implementations, Java allows developers to switch backing structures depending on read/write workloads.",
      bestPractices: [
        "Prefer interface reference bindings (e.g. Map over HashMap) to improve design flexibility.",
        "Always specify exact Generic Types to prevent runtime ClassCastExceptions.",
        "Use ConcurrentHashMap instead of HashTable or synchronized maps for concurrent throughput."
      ],
      keyTakeaways: [
        "List represents ordered indices, Set prevents duplicates, Map handles key-value pairs.",
        "Custom classes used as Map keys must override hashCode() and equals() correctly.",
        "Implementations have distinct complexity profiles (e.g. ArrayList O(1) read vs LinkedList O(1) insert)."
      ]
    };
  }

  if (t === "kubernetes" && (conceptSlug.includes("architecture") || conceptSlug.includes("fundamentals"))) {
    return {
      codeSnippet: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: client-api
  labels:
    app: backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: backend
  template:
    metadata:
      labels:
        app: backend
    spec:
      containers:
      - name: api-server
        image: backend-service:1.4.2
        ports:
        - containerPort: 8080
        resources:
          limits:
            memory: "256Mi"
            cpu: "500m"
          requests:
            memory: "128Mi"
            cpu: "250m"`,
      codeLanguage: "yaml",
      explanation: "Kubernetes runs workloads on a declarative configuration cluster. The control plane orchestrates cluster states via the API Server, scheduling Pods dynamically onto available Worker Nodes running Kubelet and container engines.",
      bestPractices: [
        "Specify resource requests and limits on every container configuration to prevent noisy neighbor outages.",
        "Configure liveness, readiness, and startup probes to automate self-healing.",
        "Ensure containers run as non-root users inside security context manifests."
      ],
      keyTakeaways: [
        "Control Plane components coordinates scheduling, scaling, and state consistency (etcd).",
        "Worker Nodes host container runtimes and manage container lifecycles.",
        "YAML manifests define the desired state that Kubernetes constantly reconciles."
      ]
    };
  }

  if (t === "hld" && conceptSlug.includes("caching")) {
    return {
      codeSnippet: `// Pseudocode: Cache-Aside (Lazy Loading) pattern implementation
async function getUserData(userId) {
  const cacheKey = \`user:\${userId}\`;
  
  // 1. Attempt reading cache
  const cachedUser = await redis.get(cacheKey);
  if (cachedUser) {
    return JSON.parse(cachedUser);
  }
  
  // 2. Cache miss: Read database
  const user = await db.users.find({ id: userId });
  
  // 3. Cache payload back asynchronous
  if (user) {
    await redis.set(cacheKey, JSON.stringify(user), 'EX', 3600); // 1hr TTL
  }
  
  return user;
}`,
      codeLanguage: "javascript",
      explanation: "Caching is the process of storing copies of data in high-speed, temporary memory (like Redis or Memcached) to accelerate subsequent reads, reduce latency, and unload heavy transaction pressures from primary databases.",
      bestPractices: [
        "Always apply a Time-To-Live (TTL) to cached records to prevent memory bloat and stale data.",
        "Implement cache eviction rules (LRU, LFU) at Redis/Memcached configurations.",
        "Add guardrails to prevent cache stampedes (using locks or dynamic background refills)."
      ],
      keyTakeaways: [
        "Cache-aside pattern keeps DB and cache sync decoupled, with lazy loading on demand.",
        "CDNs act as edge caches to distribute static assets globally near end-users.",
        "Invalidation represents one of the primary challenges in cache consistency designs."
      ]
    };
  }

  // Default fallback template for other concepts
  return {
    codeSnippet: `// Sample implementation preview for ${title}
function initializeConcept() {
  console.log("Exploring ${title} configuration...");
  // More detailed information and specifications will be added here
}`,
    codeLanguage: "javascript",
    explanation: `This guide explores the design, integration patterns, and operational details of ${title}. It provides structural breakdowns, practical workflows, and real-world considerations for building scalable solutions around this core concept.`,
    bestPractices: [
      "Follow established industry guidelines and clean code patterns.",
      "Design for testability, isolation, and modular interfaces.",
      "Profile and monitor performance characteristics in mock settings before staging."
    ],
    keyTakeaways: [
      `A thorough understanding of ${title} is key to mastering the topic architecture.`,
      "Practical exercises, code tracing, and design walkthroughs reinforce retention.",
      "Check official document repositories and updates to follow ongoing revisions."
    ]
  };
}

export async function generateStaticParams() {
  const params: { topic: string; concept: string }[] = [];
  
  for (const [topicSlug, data] of Object.entries(dataMap)) {
    if (data && data.topics) {
      data.topics.forEach((topic: TopicItem) => {
        const conceptSlug = topic.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        params.push({
          topic: topicSlug,
          concept: conceptSlug
        });
      });
    }
  }
  
  return params;
}

export default async function ConceptDetailPage({ params }: PageProps) {
  const { topic, concept } = await params;
  
  const currentData = dataMap[topic];
  if (!currentData) {
    notFound();
  }

  // Find matching topic by slugified title
  const matchingTopic = currentData.topics.find((t: TopicItem) => {
    const slug = t.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    return slug === concept;
  });

  if (!matchingTopic) {
    notFound();
  }

  const richContent = getRichContent(topic, concept, matchingTopic.title);

  const getBgUrl = (topicSlug: string) => {
    const t = topicSlug.toLowerCase();
    if (t === "java") return "/backgrounds/java_icon.png";
    if (t === "spring-boot") return "/backgrounds/springboot_icon.png";
    if (t === "dsa") return "/backgrounds/dsa_icon.png";
    if (t === "docker") return "/backgrounds/docker_icon.png";
    if (t === "kubernetes") return "/backgrounds/kubernetes_icon.png";
    if (t === "lld") return "/backgrounds/lld_icon.png";
    if (t === "hld") return "/backgrounds/hld_icon.png";
    if (t === "python") return "/backgrounds/python_icon.png";
    if (t === "ai") return "/backgrounds/ai_icon.png";
    if (t === "go") return "/backgrounds/go_icon.png";
    return "/background.png";
  };

  const bgUrl = getBgUrl(topic);

  return (
    <main className={styles.page}>
      <div className="pageBackground">
        <Image
          src={bgUrl}
          alt=""
          fill
          priority
          sizes="(max-width: 768px) 350px, 650px"
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
      </div>
      <div className={styles.container}>
        {/* BREADCRUMBS */}
        <nav className={styles.breadcrumbs}>
          <Link href="/">Home</Link>
          <span className={styles.separator}>/</span>
          <Link href={`/${topic}`}>{currentData.title}</Link>
          <span className={styles.separator}>/</span>
          <span className={styles.activeBreadcrumb}>{matchingTopic.title}</span>
        </nav>

        {/* BLOG HEADER */}
        <header className={styles.blogHeader}>
          <span className={styles.badge}>{currentData.badge}</span>
          <h1 className={styles.title}>
            {matchingTopic.title}
          </h1>
          
          <div className={styles.blogMeta}>
            <div className={styles.readTime}>
              <span>5 min read</span>
            </div>
          </div>
        </header>

        {/* BLOG BODY ARTICLE */}
        <article className={styles.article}>
          {/* LEAD SUMMARY */}
          <p className={styles.leadParagraph}>
            {matchingTopic.description}
          </p>

          {/* OVERVIEW SECTION */}
          <section className={styles.articleSection}>
            <h2>Conceptual Overview</h2>
            <p>{richContent.explanation}</p>
          </section>

          {/* CORE SUB-TOPICS */}
          {matchingTopic.details && matchingTopic.details.length > 0 && (
            <section className={styles.articleSection}>
              <h2>Key Sub-Concepts</h2>
              <div className={styles.subTopicsContainer}>
                {matchingTopic.details.map((detail: string, idx: number) => (
                  <div key={idx} className={styles.subTopicCard}>
                    <span className={styles.cardIndex}>{idx + 1}</span>
                    <p>{detail}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* IMPLEMENTATION CODE BLOCK (IDE STYLE) */}
          <section className={styles.articleSection}>
            <h2>Implementation & Syntax Preview</h2>
            <div className={styles.terminalWindow}>
              <div className={styles.terminalHeader}>
                <div className={styles.windowControls}>
                  <span className={`${styles.dot} ${styles.close}`}></span>
                  <span className={`${styles.dot} ${styles.minimize}`}></span>
                  <span className={`${styles.dot} ${styles.expand}`}></span>
                </div>
                <div className={styles.terminalTitle}>
                  {matchingTopic.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.{richContent.codeLanguage === "javascript" ? "js" : richContent.codeLanguage}
                </div>
              </div>
              <pre className={styles.codeBlock}>
                <code>
                  {highlightCode(richContent.codeSnippet)}
                </code>
              </pre>
            </div>
          </section>

          {/* BEST PRACTICES & TAKEAWAYS */}
          <div className={styles.calloutGrid}>
            <section className={`${styles.calloutCard} ${styles.bestPracticesCard}`}>
              <h3>Best Practices</h3>
              <ul className={styles.calloutList}>
                {richContent.bestPractices.map((bp: string, idx: number) => (
                  <li key={idx}>
                    <span className={styles.checkIcon}>✓</span>
                    <span>{bp}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className={`${styles.calloutCard} ${styles.takeawaysCard}`}>
              <h3>Key Takeaways</h3>
              <ul className={styles.calloutList}>
                {richContent.keyTakeaways.map((takeaway: string, idx: number) => (
                  <li key={idx}>
                    <span className={styles.bulletIcon}>•</span>
                    <span>{takeaway}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* FURTHER READING & REFERENCES */}
          <section className={styles.articleSection}>
            <h2>Further Reading & References</h2>
            <MediumArticleButton url={matchingTopic.mediumUrl || `https://medium.com/search?q=${encodeURIComponent(matchingTopic.title)}`} />
          </section>
        </article>



        {/* BOTTOM NAV BAR */}
        <footer className={styles.blogFooter}>
          <Link href={`/${topic}`} className={styles.backLink}>
            ← Back to the {currentData.title} Roadmap
          </Link>
        </footer>
      </div>
    </main>
  );
}
