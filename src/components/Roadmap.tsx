"use client";

import { motion } from "framer-motion";

import styles from "./Roadmap.module.css";

interface RoadmapProps {
  items: string[];
}

export default function Roadmap({
  items,
}: RoadmapProps) {
  return (
    <div className={styles.roadmap}>
      {items.map((item, index) => (
        <motion.div
          key={item}
          className={styles.node}
          initial={{
            opacity: 0,
            x: -20,
          }}
          whileInView={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            delay: index * 0.1,
          }}
        >
          <div className={styles.circle}>
            {index + 1}
          </div>

          <span>{item}</span>
        </motion.div>
      ))}
    </div>
  );
}