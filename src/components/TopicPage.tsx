"use client";

import React, { useState, useEffect } from "react";

import Link from "next/link";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import styles from "./TopicPage.module.css";


export interface StatItem {
  value: string;
  label: string;
}

export interface TopicItem {
  title: string;
  description: string;
  details?: string[];
  mediumUrl?: string;
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
  const [completedConcepts, setCompletedConcepts] = useState<Record<string, boolean>>({});
  const defaultCtaTitle = `Become Production Ready with ${data.title}`;
  const defaultCtaDesc = `Explore deep-dive concepts, real-world deployments, and industry best practices for ${data.title}.`;

  const topicSlug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  useEffect(() => {
    const saved = localStorage.getItem(`progress-${topicSlug}`);
    const timer = setTimeout(() => {
      if (saved) {
        try {
          setCompletedConcepts(JSON.parse(saved));
        } catch (e) {
          console.error(e);
        }
      } else {
        setCompletedConcepts({});
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [topicSlug]);


  const toggleComplete = (conceptSlug: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card from expanding
    const updated = {
      ...completedConcepts,
      [conceptSlug]: !completedConcepts[conceptSlug],
    };
    setCompletedConcepts(updated);
    localStorage.setItem(`progress-${topicSlug}`, JSON.stringify(updated));
  };

  const toggleExpand = (index: number) => {
    if (expandedIndices.includes(index)) {
      setExpandedIndices(expandedIndices.filter((i) => i !== index));
    } else {
      setExpandedIndices([...expandedIndices, index]);
    }
  };

  const totalConcepts = data.topics.length;
  const completedCount = data.topics.filter((t) => {
    const conceptSlug = t.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    return completedConcepts[conceptSlug];
  }).length;
  const progressPercent = totalConcepts > 0 ? Math.round((completedCount / totalConcepts) * 100) : 0;


  const getBgUrl = (title: string) => {
    const t = title.toLowerCase();
    if (t === "java") return "/backgrounds/java_icon.png";
    if (t === "spring boot") return "/backgrounds/springboot_icon.png";
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

  const bgUrl = getBgUrl(data.title);

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

      {/* STATS */}
      {data.stats && data.stats.length > 0 && (
        <section className={styles.statsSection}>
          <div className="container">
            <div className={styles.stats}>
              {data.stats.map((stat, idx) => (
                <div key={idx} className={styles.statCard}>
                  <h3>{stat.value}</h3>
                  <p>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}


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

              {/* Progress Tracker */}
              {totalConcepts > 0 && (
                <div className={styles.progressContainer}>
                  <div className={styles.progressHeader}>
                    <span>Roadmap Progress</span>
                    <span className={styles.progressValue}>
                      {completedCount} / {totalConcepts} ({progressPercent}%)
                    </span>
                  </div>
                  <div className={styles.progressBarBg}>
                    <div
                      className={styles.progressBarFill}
                      style={{ width: `${progressPercent}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>


            <div className={styles.conceptsRoadmap}>
              {data.topics.map((topic, idx) => {
                const isExpanded = expandedIndices.includes(idx);
                const topicSlug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
                const conceptSlug = topic.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
                const detailUrl = `/${topicSlug}/${conceptSlug}`;
                const isCompleted = !!completedConcepts[conceptSlug];

                return (
                  <div key={topic.title} className={styles.conceptNode}>
                    <div className={`${styles.conceptCircle} ${isCompleted ? styles.conceptCircleCompleted : ""} ${isExpanded && !isCompleted ? styles.conceptCircleActive : ""}`}>
                      {isCompleted ? (
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="3" style={{ margin: "auto" }}>
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      ) : (
                        idx + 1
                      )}
                    </div>

                    <div
                      className={`${styles.conceptCard} ${isCompleted ? styles.conceptCardCompleted : ""} ${isExpanded ? styles.conceptCardActive : ""}`}
                      onClick={() => toggleExpand(idx)}
                    >
                      <div className={styles.conceptHeader}>
                        <div className={styles.conceptTitleArea}>
                          <button
                            className={`${styles.checkbox} ${
                              isCompleted ? styles.checkboxChecked : ""
                            }`}
                            onClick={(e) => toggleComplete(conceptSlug, e)}
                            title={isCompleted ? "Mark as uncompleted" : "Mark as completed"}
                            aria-label={isCompleted ? "Mark as uncompleted" : "Mark as completed"}
                          >
                            {isCompleted && (
                              <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            )}
                          </button>
                          <h3 className={isCompleted ? styles.titleCompleted : ""}>
                            {topic.title}
                          </h3>
                        </div>
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

      {/* ADDITIONAL GRIDS */}
      {data.additionalGrids && data.additionalGrids.length > 0 && (
        <section>
          <div className="container">
            {data.additionalGrids.map((grid, idx) => (
              <div key={idx} style={{ marginBottom: "60px" }}>
                <div className={styles.sectionHeader}>
                  <h2>{grid.title}</h2>
                </div>
                <div className={styles.learnGrid}>
                  {grid.items.map((item, itemIdx) => (
                    <div key={itemIdx}>{item}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}      {/* CTA */}

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
