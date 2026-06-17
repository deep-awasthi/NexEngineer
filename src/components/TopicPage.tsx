"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import InterviewAccordion from "./InterviewAccordion";
import styles from "./TopicPage.module.css";

export interface StatItem {
  value: string;
  label: string;
}

export interface TopicItem {
  title: string;
  description: string;
  details?: string[];
}

export interface InterviewQuestionItem {
  question: string;
  answer: string;
}

export interface LearnGridSection {
  title: string;
  items: string[];
}

export interface FeaturedArticle {
  title: string;
  description: string;
  href: string;
  readTime: string;
}

export interface TopicPageData {
  title: string;
  description: string;
  badge: string;
  stats: StatItem[];
  roadmap: string[];
  learnConcepts: string[];
  additionalGrids?: LearnGridSection[];
  featuredArticle?: FeaturedArticle;
  topics: TopicItem[];
  interviewQuestions: InterviewQuestionItem[];
  resources: string[];
  ctaTitle?: string;
  ctaDescription?: string;
}

interface TopicPageProps {
  data: TopicPageData;
}

export default function TopicPage({ data }: TopicPageProps) {
  const [expandedIndices, setExpandedIndices] = useState<number[]>([]);
  const defaultCtaTitle = `Become Production Ready with ${data.title}`;
  const defaultCtaDesc = `Explore deep-dive concepts, real-world deployments, and industry best practices for ${data.title}.`;

  const toggleExpand = (index: number) => {
    if (expandedIndices.includes(index)) {
      setExpandedIndices(expandedIndices.filter((i) => i !== index));
    } else {
      setExpandedIndices([...expandedIndices, index]);
    }
  };

  const getBgUrl = (title: string) => {
    const t = title.toLowerCase();
    if (t === "java" || t === "spring boot") return "/backgrounds/java_bg.png";
    if (t === "dsa") return "/backgrounds/dsa_bg.png";
    if (t === "docker" || t === "kubernetes" || t === "lld" || t === "hld") return "/backgrounds/infra_bg.png";
    if (t === "python" || t === "ai" || t === "go") return "/backgrounds/python_ai_bg.png";
    return "/background.png";
  };

  const bgUrl = getBgUrl(data.title);

  return (
    <main className={styles.page}>
      <div className="pageBackground" style={{ backgroundImage: `url('${bgUrl}')` }} />
      {/* HERO */}
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroContent}>
            <span className={styles.badge}>{data.badge}</span>
            <h1>
              Master {data.title}
              <span className={styles.gradient}> Step by Step</span>
            </h1>
            <p>{data.description}</p>
            <div className={styles.heroActions}>
              <a href="#roadmap" className={styles.primaryButton}>
                Start Learning
              </a>
              {(() => {
                const getNotesUrl = (title: string) => {
                  const t = title.toLowerCase();
                  if (t === "java") return "/notes#java";
                  if (t === "dsa") return "/notes#dsa";
                  if (t === "spring boot") return "/notes#spring-boot";
                  if (t === "docker" || t === "kubernetes") return "/notes#docker-kubernetes";
                  if (t === "hld" || t === "lld") return "/notes#system-design";
                  if (t === "go") return "/notes#go";
                  if (t === "python") return "/notes#python";
                  if (t === "ai") return "/notes#ai";
                  return "/notes";
                };
                return (
                  <Link href={getNotesUrl(data.title)} className={styles.secondaryButton}>
                    Quick Revision Notes
                  </Link>
                );
              })()}
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE CORE CONCEPTS ROADMAP */}
      {data.topics && data.topics.length > 0 && (
        <section id="roadmap">
          <div className="container">
            <div className={styles.sectionHeader}>
              <span>Structured Learning</span>
              <h2>Core Concepts</h2>
              <p>
                Explore the most important {data.title} concepts in a structured learning path.
                Click on each card to expand and view details.
              </p>
            </div>

            <div className={styles.conceptsRoadmap}>
              {data.topics.map((topic, idx) => {
                const isExpanded = expandedIndices.includes(idx);
                const topicSlug = data.title.toLowerCase() === "spring boot" ? "springBoot" : data.title.toLowerCase().replace(/[^a-z0-9]+/g, "");
                const conceptSlug = topic.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
                const detailUrl = `/${topicSlug}/${conceptSlug}`;

                return (
                  <div key={topic.title} className={styles.conceptNode}>
                    <div className={`${styles.conceptCircle} ${isExpanded ? styles.conceptCircleActive : ""}`}>
                      {idx + 1}
                    </div>

                    <div
                      className={`${styles.conceptCard} ${isExpanded ? styles.conceptCardActive : ""}`}
                      onClick={() => toggleExpand(idx)}
                    >
                      <div className={styles.conceptHeader}>
                        <h3>{topic.title}</h3>
                        <ChevronDown
                          size={20}
                          className={`${styles.conceptToggleIcon} ${isExpanded ? styles.conceptToggleIconRotated : ""}`}
                        />
                      </div>

                      {isExpanded && (
                        <div className={styles.conceptContent}>
                          <p>{topic.description}</p>
                          {topic.details && topic.details.length > 0 && (
                            <ul className={styles.conceptDetails}>
                              {topic.details.map((detail, detailIdx) => (
                                <li key={detailIdx}>{detail}</li>
                              ))}
                            </ul>
                          )}
                          <div className={styles.readMoreWrapper}>
                            <Link
                              href={detailUrl}
                              className={styles.readMoreLink}
                              onClick={(e) => e.stopPropagation()}
                            >
                              Read More →
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}



      {/* INTERVIEW QUESTIONS */}
      {data.interviewQuestions && data.interviewQuestions.length > 0 && (
        <section>
          <div className="container">
            <div className={styles.sectionHeader}>
              <span>Interview Preparation</span>
              <h2>Frequently Asked Questions</h2>
              <p>
                Prepare for {data.title} interviews with commonly asked
                questions and detailed answers.
              </p>
            </div>
            <InterviewAccordion questions={data.interviewQuestions} />
          </div>
        </section>
      )}

      {/* CTA */}
      <section className={styles.cta}>
        <div className="container">
          <h2>{data.ctaTitle || defaultCtaTitle}</h2>
          <p>{data.ctaDescription || defaultCtaDesc}</p>
          <div className={styles.links}>
            <a
              href="https://medium.com/@deepawasthi"
              target="_blank"
              rel="noopener noreferrer"
            >
              Read on Medium →
            </a>
            <a
              href="https://www.linkedin.com/in/deep-awasthi/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Follow on LinkedIn →
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
