"use client";

import Link from "next/link";
import { useState } from "react";
import Search from "./Search";
import ThemeToggle from "./ThemeToggle";


// Lucide — topics without an official brand logo
import { ChevronDown, Binary, Building2, Puzzle, Menu, X } from "lucide-react";


// Official brand logos
import { DiJava } from "react-icons/di";
import {
  SiSpringboot,
  SiDocker,
  SiKubernetes,
  SiPython,
  SiGo,
  SiOpenai,
} from "react-icons/si";

import styles from "./Navbar.module.css";

const topics = [
  { name: "Java",        href: "/java",       icon: DiJava,        color: "#f89820" }, // Java orange
  { name: "DSA",         href: "/dsa",        icon: Binary,        color: "#ec4899" }, // pink (no official logo)
  { name: "Spring Boot", href: "/spring-boot", icon: SiSpringboot,  color: "#6db33f" }, // Spring green
  { name: "Docker",      href: "/docker",     icon: SiDocker,      color: "#2496ed" }, // Docker blue
  { name: "Kubernetes",  href: "/kubernetes", icon: SiKubernetes,  color: "#326ce5" }, // K8s blue
  { name: "LLD",         href: "/lld",        icon: Puzzle,        color: "#a855f7" }, // purple (no official logo)
  { name: "HLD",         href: "/hld",        icon: Building2,     color: "#8b5cf6" }, // violet (no official logo)
  { name: "Python",      href: "/python",     icon: SiPython,      color: "#3776ab" }, // Python official blue
  { name: "AI",          href: "/ai",         icon: SiOpenai,      color: "#10a37f" }, // OpenAI green
  { name: "Go",          href: "/go",         icon: SiGo,          color: "#00acd7" }, // Go official cyan
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className={styles.navbar}>
      <div className={`container ${styles.wrapper}`}>
        <Link href="/" className={styles.logo} onClick={() => setMobileMenuOpen(false)}>
          Nex<span>Engineer</span>
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
                      <Icon size={18} style={{ color: topic.color, flexShrink: 0 }} />
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

          <ThemeToggle />
        </div>


        {/* Mobile menu button */}
        <button
          className={styles.menuButton}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile slide-down menu */}
        {mobileMenuOpen && (
          <div className={styles.mobileMenu}>
            <div className={styles.mobileSearchWrapper}>
              <Search />
            </div>
            <nav className={styles.mobileLinks}>
              <div className={styles.mobileDropdownSection}>
                <div className={styles.mobileDropdownHeader}>
                  <span>Topics</span>
                </div>
                <div className={styles.mobileTopicsGrid}>
                  {topics.map((topic) => {
                    const Icon = topic.icon;

                    return (
                      <Link
                        key={topic.name}
                        href={topic.href}
                        className={styles.mobileTopicItem}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Icon size={16} style={{ color: topic.color }} />
                        <span>{topic.name}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
              <Link
                href="/notes"
                className={styles.mobileNavLink}
                onClick={() => setMobileMenuOpen(false)}
              >
                Notes
              </Link>
              <Link
                href="/about"
                className={styles.mobileNavLink}
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <div className={styles.mobileThemeToggleWrapper}>
                <ThemeToggle />
                <span className={styles.mobileThemeToggleText}>Toggle Theme</span>
              </div>
            </nav>
          </div>

        )}
      </div>
    </header>
  );
}