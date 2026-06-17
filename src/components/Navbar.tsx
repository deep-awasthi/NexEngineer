"use client";

import Link from "next/link";
import { useState } from "react";
import Search from "./Search";

import {
  ChevronDown,
  Coffee,
  Brain,
  FileText,
  Boxes,
  Container,
  Binary,
  Building2,
  Puzzle,
  Code2,
  Flame,
} from "lucide-react";

import styles from "./Navbar.module.css";

const topics = [
  { name: "Java", href: "/java", icon: Coffee },
  { name: "DSA", href: "/dsa", icon: Binary },
  { name: "Spring Boot", href: "/springBoot", icon: Flame },
  { name: "Docker", href: "/docker", icon: Container },
  { name: "Kubernetes", href: "/kubernetes", icon: Boxes },
  { name: "LLD", href: "/lld", icon: Puzzle },
  { name: "HLD", href: "/hld", icon: Building2 },
  { name: "Python", href: "/python", icon: Code2 },
  { name: "AI", href: "/ai", icon: Brain },
  { name: "Go", href: "/go", icon: Code2 },
  { name: "Revision Notes", href: "/notes", icon: FileText },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className={styles.navbar}>
      <div className={`container ${styles.wrapper}`}>
        <Link href="/" className={styles.logo}>
          Dev<span>Orbit</span>
        </Link>

        <div className={styles.rightSection}>
          <Search />

          <div
            className={styles.dropdown}
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
          >
            <button className={styles.dropdownButton}>
              Topics
              <ChevronDown size={18} />
            </button>

            {open && (
              <div className={styles.dropdownMenu}>
                {topics.map((topic) => {
                  const Icon = topic.icon;

                  return (
                    <Link
                      key={topic.name}
                      href={topic.href}
                      className={styles.dropdownItem}
                    >
                      <Icon size={18} />

                      <span>{topic.name}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          <Link href="/notes" className={styles.navLink}>
            Notes
          </Link>

          <Link href="/about" className={styles.navLink}>
            About
          </Link>
        </div>
      </div>
    </header>
  );
}