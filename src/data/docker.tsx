export const roadmap = [
  "Images",
  "Containers",
  "Dockerfile",
  "Volumes",
  "Networking",
  "Docker Compose",
  "Production Deployment"
];

export const topics = [
  {
    title: "Containers & Engine Architecture",
    description: "Understand process isolation, namespaces, cgroups, Union File System, and container runtimes.",
    details: [
      "Process isolation using Linux Namespaces (PID, NET, IPC, MNT, UTS, USER)",
      "Resource constraints using Control Groups (cgroups) for CPU, Memory, and IO limits",
      "Container runtimes: containerd, runc, and Docker Engine layers",
      "Docker Daemon configuration and CLI communication sockets"
    ]
  },
  {
    title: "Docker Images & Dockerfile optimization",
    description: "Build efficient, layered images, write custom Dockerfiles, and leverage build cache.",
    details: [
      "Dockerfile directives: FROM, RUN, COPY, ADD, CMD, ENTRYPOINT, ENV, EXPOSE",
      "Layer caching mechanisms: ordering instructions to maximize caching",
      "Minimizing image size: Alpine/distroless bases, removing cache, combining RUN commands",
      "BuildKit capabilities, secrets injection, and mount types (cache, bind)"
    ]
  },
  {
    title: "Persistent Storage: Volumes & Bind Mounts",
    description: "Configure persistent data, manage container state, and share files with host systems.",
    details: [
      "Docker Volumes: managed lifecycle, named volumes, and driver plug-ins",
      "Bind Mounts: mapping host paths to containers for hot-reloading development code",
      "tmpfs mounts for transient, memory-only filesystems (sensitive data)",
      "Handling permissions: user namespace mapping, non-root run directives"
    ]
  },
  {
    title: "Docker Networking",
    description: "Create isolated networks, manage port forwards, and enable container-to-container communication.",
    details: [
      "Network drivers: bridge, host, overlay, macvlan, and none",
      "User-defined bridge networks for isolated container DNS resolution",
      "Port publishing (ingress mapping) vs container port exposure",
      "DNS resolution inside Docker and links networking fallback"
    ]
  },
  {
    title: "Multi-Stage Builds",
    description: "Optimize production deployments by compiling code in intermediary containers and copying output.",
    details: [
      "Chaining build environments: separating compiler SDKs from runtime engines",
      "Naming intermediate stages (AS builder) and copying build artifacts (COPY --from=builder)",
      "Drastically reducing production image size and security attack vectors",
      "Multi-platform builds (linux/amd64, linux/arm64) using buildx"
    ]
  },
  {
    title: "Multi-Container Apps with Docker Compose",
    description: "Define, run, and scale multi-container environments using YAML configuration files.",
    details: [
      "Compose specification syntax: services, networks, volumes, and environments",
      "Service dependency resolution using depends_on, healthcheck conditions",
      "Scaling replicas dynamically and hot-reloading env file bindings",
      "Docker Compose stack deployment: Local database, Redis cache, API, and Nginx proxy"
    ]
  },
  {
    title: "Security & Registry Best Practices",
    description: "Scan images for vulnerabilities, enforce least privilege, and manage registries.",
    details: [
      "Image scanning using Docker Scout, Trivy, or Grype",
      "Enforcing least privilege: running containers as non-root users",
      "Setting read-only root filesystems and limiting capability privileges",
      "Configuring Docker registries, image tagging schemas, and secret credentials"
    ]
  }
];

export const interviewQuestions = [
  {
    question: "Difference between image and container?",
    answer: "Image is a template, container is a running instance."
  },
  {
    question: "What are Docker volumes?",
    answer: "Persistent storage independent of container lifecycle."
  }
];

export const pageData = {
  title: "Docker",
  badge: "Containerization Platform",
  description:
    "Learn Docker from container fundamentals to production deployments, networking, storage, security and cloud-native architectures.",
  stats: [
    { value: "12", label: "Learning Modules" },
    { value: "25+", label: "Interview Questions" },
    { value: "30+", label: "Core Concepts" },
    { value: "20+", label: "Production Examples" }
  ],
  roadmap,
  learnConcepts: [
    "Containers",
    "Images",
    "Dockerfile",
    "Build Context",
    "Volumes",
    "Bind Mounts",
    "Networking",
    "Docker Compose",
    "Multi-Stage Builds",
    "Registry",
    "Security",
    "Production Deployments"
  ],
  additionalGrids: [
    {
      title: "Docker Architecture",
      items: [
        "Docker CLI",
        "Docker Engine",
        "Docker Daemon",
        "containerd",
        "runc",
        "Namespaces",
        "cgroups",
        "Union File System",
        "Docker Hub",
        "Private Registry",
        "Compose",
        "Kubernetes Integration"
      ]
    },
    {
      title: "Projects You will Build",
      items: [
        "Spring Boot Container",
        "Node.js Container",
        "MySQL Container",
        "Redis Container",
        "Docker Compose Stack",
        "Multi-Stage Build",
        "Nginx Reverse Proxy",
        "Microservices Setup",
        "Private Registry",
        "CI/CD Pipeline",
        "Container Monitoring",
        "Production Deployment"
      ]
    }
  ],
  topics,
  interviewQuestions,
  resources: [
    "Docker Documentation",
    "Docker Hub",
    "Docker Compose",
    "BuildKit",
    "containerd",
    "Docker Scout",
    "Nginx",
    "Redis",
    "MySQL",
    "Kubernetes",
    "GitHub Actions",
    "Production Security"
  ],
  ctaTitle: "Become Production Ready with Docker",
  ctaDescription:
    "Explore container internals, image optimization, networking, storage, security and real-world deployment strategies."
};