"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import styles from "./Hero.module.css";

export default function Hero() {
    return (
        <section className={styles.hero}>
            <div className={`container ${styles.content}`}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className={styles.badge}
                >
                    <Sparkles size={14} className={styles.badgeIcon} />
                    <span>Software Engineering Learning Platform</span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                >
                    Master
                    <br />
                    Software Engineering
                </motion.h1>

                <motion.p
                    className={styles.subtitle}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    Learn Java, DSA, Spring Boot, Docker, Kubernetes,
                    LLD, HLD, Python, AI and Go through structured
                    roadmaps, interview preparation and production-grade
                    engineering concepts.
                </motion.p>

                <motion.div
                    className={styles.actions}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    <a href="#paths" className={styles.primary}>
                        Start Learning
                    </a>

                    <Link href="/notes" className={styles.secondary}>
                        Quick Revision Notes
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}