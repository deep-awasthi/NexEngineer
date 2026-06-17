import TopicCard from "./TopicCard";
import styles from "./LearningGrid.module.css";

const topics = [
  {
    title: "Java",
    href: "/java",
    description:
      "Collections, Streams, JVM, Concurrency and Interview Preparation",
  },
  {
    title: "Data Structure & Algorithms",
    href: "/dsa",
    description:
      "Problem Patterns, Complexity Analysis and Interview Questions",
  },
  {
    title: "Spring Boot",
    href: "/springBoot",
    description:
      "REST APIs, Security, JPA, Microservices and Kafka",
  },
  {
    title: "Docker",
    href: "/docker",
    description:
      "Containers, Images, Compose and Production Deployment",
  },
  {
    title: "Kubernetes",
    href: "/kubernetes",
    description:
      "Pods, Deployments, Services, Ingress and Helm",
  },
  {
    title: "Low Level Design",
    href: "/lld",
    description:
      "SOLID Principles and Design Patterns",
  },
  {
    title: "High Level Design",
    href: "/hld",
    description:
      "Load Balancers, Caching, Databases and Scaling",
  },
  {
    title: "Python",
    href: "/python",
    description:
      "Core Python, FastAPI, AsyncIO and Interview Questions",
  },
  {
    title: "Artificial Intelligence",
    href: "/ai",
    description:
      "LLMs, RAG, Embeddings, Agents and MCP",
  },
  {
    title: "Go",
    href: "/go",
    description:
      "Concurrency, Goroutines, Channels and Microservices",
  },
  {
    title: "Revision Notes",
    href: "/notes",
    description:
      "Quick Revision Guides and Cheat Sheets",
  },
];

export default function LearningGrid() {
  return (
    <section id="paths" className={styles.section}>
      <div className="container">
        <h2>Learning Paths</h2>

        <div className={styles.grid}>
          {topics.map((topic) => (
            <TopicCard
              key={topic.title}
              title={topic.title}
              description={topic.description}
              href={topic.href}
            />
          ))}
        </div>
      </div>
    </section>
  );
}