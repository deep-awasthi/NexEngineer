import styles from "./page.module.css";
import { Mail, BookOpen, ArrowUpRight, Sparkles } from "lucide-react";
import { FaLinkedin, FaGithub } from "react-icons/fa";

export const metadata = {
  title: "About | DevOrbit",
  description:
    "Learn about DevOrbit - a premium platform for software engineers to master system design, backend architectures, cloud-native deployments, and algorithms.",
};

export default function AboutPage() {
  return (
    <main className={styles.page}>
      <div className="pageBackground" style={{ backgroundImage: "url('/backgrounds/about_icon.png')" }} />
      <div className="container">
        {/* Hero Section */}
        <section className={styles.heroSection} id="about-hero">
          <div className={styles.heroGlow}></div>
          <div className={styles.badge}>
            <Sparkles size={14} className={styles.badgeIcon} />
            <span>Empowering Engineers</span>
          </div>
          <h1 className={styles.title}>
            Inside Dev<span>Orbit</span>
          </h1>
          <p className={styles.subtitle}>
            A curated orbit of advanced guides, system design blueprints, and cheat sheets designed to elevate backend engineers to technical leads.
          </p>
        </section>

        {/* Platform Overview */}
        <section className={styles.gridSection} id="about-overview">
          <div className={styles.mainCard}>
            <div className={styles.cardGlow}></div>
            <h2>The Mission</h2>
            <p>
              In software engineering, understanding the syntax is only the first step. The true test lies in building scalable, reliable, and fault-tolerant distributed systems. 
            </p>
            <p>
              DevOrbit is built to bridge the gap between academic programming and senior engineering realities. We break down complex concepts into digestible, production-grade roadmaps—from the nuances of the JVM to running high-throughput Kubernetes workloads.
            </p>
            <div className={styles.featuresList}>
              <div className={styles.featureItem}>
                <span className={styles.featureDot}></span>
                <span>Deep Dives on Java & Spring Boot</span>
              </div>
              <div className={styles.featureItem}>
                <span className={styles.featureDot}></span>
                <span>High-Level & Low-Level System Design (HLD/LLD)</span>
              </div>
              <div className={styles.featureItem}>
                <span className={styles.featureDot}></span>
                <span>Cloud-Native Infrastructure (Docker, Kubernetes)</span>
              </div>
              <div className={styles.featureItem}>
                <span className={styles.featureDot}></span>
                <span>Algorithms & Data Structures (DSA)</span>
              </div>
            </div>
          </div>
        </section>

        {/* Subscription / Medium CTA Section */}
        <section className={styles.mediumSection} id="subscribe-medium">
          <div className={styles.mediumCard}>
            <div className={styles.mediumIconWrapper}>
              <BookOpen size={36} className={styles.mediumIcon} />
            </div>
            <div className={styles.mediumContent}>
              <div className={styles.cardHeader}>
                <span className={styles.smallBadge}>Weekly Newsletter</span>
                <h2>Subscribe via Medium</h2>
              </div>
              <p>
                Get weekly backend engineering breakdowns, distributed systems blueprints, and interview strategies delivered straight to your inbox. Follow the DevOrbit publication on Medium to stay ahead of the curve.
              </p>
              <a 
                href="https://medium.com/@deepawasthi" 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.subscribeBtn}
                id="medium-subscribe-link"
              >
                Follow on Medium
                <ArrowUpRight size={18} />
              </a>
            </div>
          </div>
        </section>

        {/* Contact Me Section */}
        <section className={styles.contactSection} id="contact-me">
          <div className={styles.sectionHeader}>
            <h2>Get In Touch</h2>
            <p>Have questions about the material, feedback on a roadmap, or want to collaborate? Reach out through any of these platforms.</p>
          </div>
          
          <div className={styles.contactGrid}>
            <a 
              href="mailto:deepawasthi@gmail.com" 
              className={styles.contactCard}
              id="contact-email"
            >
              <div className={styles.contactIconBg}>
                <Mail size={24} className={styles.contactIcon} />
              </div>
              <h3>Email Me</h3>
              <p>deepawasthi@gmail.com</p>
              <span className={styles.cardAction}>
                Send email <ArrowUpRight size={14} />
              </span>
            </a>

            <a 
              href="https://www.linkedin.com/in/deep-awasthi/" 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.contactCard}
              id="contact-linkedin"
            >
              <div className={styles.contactIconBg}>
                <FaLinkedin size={24} className={styles.contactIcon} />
              </div>
              <h3>LinkedIn</h3>
              <p>@deep-awasthi</p>
              <span className={styles.cardAction}>
                Let&apos;s connect <ArrowUpRight size={14} />
              </span>
            </a>

            <a 
              href="https://github.com/deep-awasthi" 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.contactCard}
              id="contact-github"
            >
              <div className={styles.contactIconBg}>
                <FaGithub size={24} className={styles.contactIcon} />
              </div>
              <h3>GitHub</h3>
              <p>@deep-awasthi</p>
              <span className={styles.cardAction}>
                Follow repositories <ArrowUpRight size={14} />
              </span>
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}