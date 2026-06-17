import { Metadata } from "next";

import Roadmap from "@/components/Roadmap";
import InterviewAccordion from "@/components/InterviewAccordion";

import {
  roadmap,
  topics,
  interviewQuestions,
} from "@/data/springBoot";

import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Spring Boot Roadmap",
  description:
    "Master GO through structured learning paths and interview preparation.",
};

export default function GoPage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className="container">
          <h1>AI Roadmap</h1>

          <p>
            Learn Go from basics to
            production-grade backend systems.
          </p>
        </div>
      </section>

      <section>
        <div className="container">
          <h2>Learning Roadmap</h2>

          <Roadmap items={roadmap} />
        </div>
      </section>

      <section>
        <div className="container">
          <h2>Core Topics</h2>

          <div className={styles.grid}>
            {topics.map((topic) => (
              <div
                key={topic.title}
                className={styles.card}
              >
                <h3>{topic.title}</h3>

                <p>{topic.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <h2>Interview Questions</h2>

          <InterviewAccordion
            questions={interviewQuestions}
          />
        </div>
      </section>

      <section>
        <div className="container">
          <h2>Deep Dive Articles</h2>

          <div className={styles.links}>
            <a
              href="YOUR_MEDIUM_URL"
              target="_blank"
            >
              Read Full Java Articles →
            </a>

            <a
              href="YOUR_LINKEDIN_URL"
              target="_blank"
            >
              Follow on LinkedIn →
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}