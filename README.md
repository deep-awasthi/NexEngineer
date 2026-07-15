# NexEngineer

> A Portal for Software Engineers to Master Engineering.

NexEngineer is the ultimate learning and workspace platform for software engineers. It combines the best aspects of LeetCode (tracker/editor), Visualgo (animated visualizations), Excalidraw (system design canvases), and Medium (engineering blogs) into a single, cohesive, zero-server-overhead Next.js application designed to run entirely on the **Vercel Free Tier** and **Supabase Free Tier**.

---

## 🚀 Key Features

*   **DSA Mastery Tracker:** Track solved problems across 25 categories. Features filtering by difficulty, company tags (Google, Meta, Amazon, etc.), search indexes, and a revision scheduler.
*   **System Design Studio:** A fullscreen drag-and-drop whiteboard canvas built with `@xyflow/react`. Includes custom node primitives (Servers, Databases, Cache modules, Message Brokers, Load Balancers), grid snapping, zoom controls, undo/redo states, and JSON configuration exports.
*   **Interactive DSA Visualizer:** Real-time visual canvas with fluid bar/node animations powered by Framer Motion. Supports Bubble Sort and Binary Search with custom inputs, playback speed sliders, step timeline controls, and side-by-side pseudocode trace highlights.
*   **Online IDE Sandbox:** Monaco Editor workspace supporting JavaScript, Python, C++, and Java. Executes code against public compiler containers through a secure Next.js Proxy Route Handler mapping standard output, execution time, and compilation errors.
*   **Engineering MDX Library:** Curated architectural articles rendered dynamically on the server using `next-mdx-remote/rsc` with custom typography style templates.
*   **Fuzzy Global Search:** Fully integrated Command Palette modal triggered by `Cmd+K` anywhere in the app, indexing diagrams, code challenges, visualizers, and articles in milliseconds.
*   **Admin Console:** Management panel showing usage statistics, and featuring forms to write MDX articles and inject new DSA questions.

---

## 🛠️ Tech Stack

*   **Framework:** Next.js (App Router, Server Components & Server Actions)
*   **Styling:** Tailwind CSS, Framer Motion (Animations), Lucide (Icons)
*   **State Management:** Zustand (Client-side), TanStack React Query (Server cache)
*   **Database & Auth:** Supabase (PostgreSQL with RLS, Supabase Auth, Supabase Storage)
*   **Editor:** Monaco Editor (`@monaco-editor/react`)
*   **Diagrams:** React Flow (`@xyflow/react`)
*   **Fuzzy Search:** Fuse.js

---

## 📦 Getting Started

### 1. Prerequisites
Ensure you have Node.js (version 18+ recommended) and npm installed.

### 2. Installation
Clone the repository and install the project dependencies:
```bash
npm install --legacy-peer-deps
```

### 3. Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

### 4. Running in Demo Mode (Zero Config)
Out of the box, the application runs in a simulated **Demo Mode** if `.env.local` contains the default placeholder Supabase URL. 
*   Progress, saved code files, and diagrams are mapped to browser LocalStorage.
*   You can log in instantly with **any** credentials on the Login screen by clicking the **"Instant Demo Login"** button.

---

## 🗄️ Database Setup (Supabase Link)

To link your live database and enable persistent cloud accounts, follow these steps:

1. Create a free PostgreSQL instance on [Supabase](https://supabase.com).
2. Navigate to the **SQL Editor** in your Supabase project dashboard.
3. Paste and run the entire SQL code from the initial migration file:  
   [`supabase/migrations/20260716000000_init_schema.sql`](file:///Users/deepawasthi/Developer/NexEngineer/supabase/migrations/20260716000000_init_schema.sql)  
   This will automatically build all tables, set up Row-Level Security (RLS) policies, link authentication profile triggers, and seed the tracker database with 25 topics, standard questions, and default MDX articles.
4. Replace the placeholder credentials in your `.env.local` file with your real Supabase **Project URL** and **API keys** (found under *Project Settings -> API*).
5. Restart your local server:
   ```bash
   npm run dev
   ```

---

## 👑 Granting Admin Privileges
To access the Admin Console, a user must have the `'admin'` badge in their profile metadata.
To grant this:
1. Register an account in the app.
2. Go to your Supabase Database editor, open the `profiles` table, locate your row, and modify the `badges` column JSON value to include `"admin"`.
   Example value: `["admin", "pro-member"]`
3. Save the changes. The Admin link will now appear in your sidebar and header dashboard panels.

---

## 🌐 Production Vercel Deployment

NexEngineer is built to be deployed to **Vercel's Free Tier** with zero backend servers:

1. Create a new Git repository on GitHub and push the codebase.
2. Link the repository to your Vercel account.
3. Go to the project dashboard on Vercel, navigate to **Settings -> Environment Variables**, and add:
   *   `NEXT_PUBLIC_SUPABASE_URL`
   *   `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   *   `SUPABASE_SERVICE_ROLE_KEY`
4. Click **Deploy**. Vercel will build the optimized code bundles and serve them with SSL globally.
