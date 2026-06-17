export const roadmap = [
  "Kubernetes Fundamentals",
  "Kubernetes Architecture",
  "Workloads & Application Deployment",
  "Configuration Management",
  "Networking",
  "Storage",
  "Production Deployments",
  "Scaling & Reliability",
  "Scheduling & Resource Management",
  "Security",
  "Advanced Patterns",
  "Helm & Package Management",
  "Observability & Troubleshooting",
  "Production Best Practices"
];

export const topics = [
  {
    title: "Kubernetes Fundamentals",
    description:
      "Understand containers, pods, nodes, clusters, desired state, reconciliation loop, self-healing, scaling, and the declarative model that powers Kubernetes.",
    details: [
      "Containers vs. Virtual Machines and containerization values",
      "Declarative Model & Desired State configuration",
      "Reconciliation Loop & Controllers patterns",
      "Self-Healing: auto-restart, auto-replication, auto-scaling"
    ]
  },
  {
    title: "Kubernetes Architecture",
    description:
      "Learn API Server, etcd, Scheduler, Controller Manager, kubelet, kube-proxy, container runtime, control plane components, and worker node internals.",
    details: [
      "Control Plane: API Server, etcd, Scheduler, Controller Manager",
      "Worker Nodes: kubelet, kube-proxy, Container Runtime",
      "Cluster state storage, etcd consensus, and data replication",
      "Kubelet synchronization loop and Pod lifecycle manager"
    ]
  },
  {
    title: "Workloads & Application Deployment",
    description:
      "Master Pods, ReplicaSets, Deployments, StatefulSets, DaemonSets, Jobs, CronJobs, rolling updates, rollbacks, resource requests, and limits.",
    details: [
      "Pods: definition, lifecycle states, and multi-container patterns",
      "Deployments and ReplicaSets for stateless application scaling",
      "StatefulSets: stable network identifiers and persistent storage mapping",
      "DaemonSets for node-level agents, Jobs, and CronJobs for batch tasks"
    ]
  },
  {
    title: "Configuration Management",
    description:
      "Manage application configuration using ConfigMaps, Secrets, environment variables, mounted files, secret management, and external secret providers.",
    details: [
      "ConfigMaps: key-value configuration injection and hot reloading",
      "Secrets: encoding, security context, and volume mount storage",
      "Injecting variables via env, envFrom, and volume mount paths",
      "Integrating with external secret managers (HashiCorp Vault, AWS Secrets Manager)"
    ]
  },
  {
    title: "Networking",
    description:
      "Learn Pod Networking, ClusterIP, NodePort, LoadBalancer, ExternalName, Ingress, DNS, Service Discovery, and Network Policies.",
    details: [
      "Pod-to-Pod and Pod-to-Service networking (CNI plugins)",
      "Services: ClusterIP, NodePort, LoadBalancer, and ExternalName mapping",
      "Ingress Resources, Rules, Paths, and Ingress Controllers setup",
      "Network Policies: firewalling namespaces, ingress and egress rules"
    ]
  },
  {
    title: "Storage",
    description:
      "Understand Persistent Volumes, Persistent Volume Claims, Storage Classes, dynamic provisioning, access modes, and stateful application storage.",
    details: [
      "Persistent Volumes (PV) and Persistent Volume Claims (PVC) bindings",
      "Storage Classes for dynamic storage provisioning in cloud and on-prem",
      "Access Modes: ReadWriteOnce, ReadOnlyMany, ReadWriteMany specifications",
      "Reclaim Policies: Retain, Delete, and Recycle behaviors"
    ]
  },
  {
    title: "Production Deployments",
    description:
      "Deploy real-world applications using Deployments, Services, ConfigMaps, Secrets, PVCs, startup dependencies, and multi-tier architectures.",
    details: [
      "Structuring multi-tier apps (Web frontend, API backend, DB)",
      "Init Containers for database migration and dependency checks",
      "Rolling updates strategies, maxSurge, maxUnavailable parameters",
      "Blue-Green and Canary deployment pipelines"
    ]
  },
  {
    title: "Scaling & Reliability",
    description:
      "Implement Liveness Probes, Readiness Probes, Startup Probes, Horizontal Pod Autoscaler, Pod Disruption Budgets, and fault-tolerant systems.",
    details: [
      "Liveness, Readiness, and Startup Probes configuration",
      "Horizontal Pod Autoscaler (HPA) using CPU, Memory, and custom metrics",
      "Pod Disruption Budgets (PDB) for zero-downtime maintenance node drains",
      "Fault tolerance: Pod anti-affinity across availability zones"
    ]
  },
  {
    title: "Scheduling & Resource Management",
    description:
      "Control workload placement using Namespaces, Resource Quotas, Node Affinity, Pod Anti-Affinity, Taints, Tolerations, and topology awareness.",
    details: [
      "Namespaces and ResourceQuotas for multi-tenant isolation",
      "Resource Requests and Limits (CPU, Memory, Ephemeral Storage)",
      "Node Affinity/Anti-Affinity and Pod Affinity/Anti-Affinity rules",
      "Taints, Tolerations, and NodeSelectors placement controls"
    ]
  },
  {
    title: "Security",
    description:
      "Secure clusters with RBAC, Service Accounts, Namespace Isolation, Secret Management, Network Policies, and least-privilege access.",
    details: [
      "Role-Based Access Control (RBAC): Roles, ClusterRoles, Bindings",
      "Service Accounts and token mounting configurations for Pods",
      "Namespace isolation, Security Contexts, and readOnlyRootFilesystem",
      "Network policies for restricting cross-namespace network access"
    ]
  },
  {
    title: "Advanced Patterns",
    description:
      "Explore Init Containers, Sidecars, Service Mesh concepts, dependency management, migration workflows, and production deployment patterns.",
    details: [
      "Init Containers for pre-flight bootstrapping and configs",
      "Sidecar pattern for logging agents, proxy tunnels, and metrics",
      "Service Mesh (Istio, Linkerd) for mTLS, traffic management, and tracing",
      "Custom Resource Definitions (CRDs) and custom Controllers (Operator pattern)"
    ]
  },
  {
    title: "Helm & Package Management",
    description:
      "Package and deploy applications using Helm Charts, Templates, Values Files, Release Management, Rollbacks, and CI/CD integrations.",
    details: [
      "Helm Chart structure, templates, helper functions, and dry-runs",
      "Values.yaml files and environment-specific overrides",
      "Helm release lifecycles, upgrades, history, and rollbacks",
      "Integrating Helm with GitOps tools (ArgoCD, Flux)"
    ]
  },
  {
    title: "Observability & Troubleshooting",
    description:
      "Monitor and debug clusters using Prometheus, Grafana, Logging, Metrics Server, kubectl, Events, Logs, and Runtime Diagnostics.",
    details: [
      "Prometheus Operator and Grafana dashboards for cluster health",
      "Centralized logging aggregates (Fluentd, Loki, Elasticsearch)",
      "kubectl debug, exec, logs, events, and describe diagnostics",
      "Metrics Server setup for resource profiling"
    ]
  },
  {
    title: "Production Best Practices",
    description:
      "Learn common production pitfalls, deployment strategies, versioning, high availability, resilience patterns, and operating Kubernetes at scale.",
    details: [
      "Avoiding using the 'latest' image tags in production specs",
      "Setting mandatory resource requests and limits on all containers",
      "Graceful shutdowns: preStop hooks, terminationGracePeriodSeconds",
      "Configuring multi-master high-availability clusters"
    ]
  }
];

export const interviewQuestions = [
  {
    question: "What problem does Kubernetes solve?",
    answer:
      "Kubernetes automates deployment, scaling, networking, self-healing, and management of containerized applications running across multiple machines."
  },

  {
    question: "Explain the Kubernetes reconciliation loop.",
    answer:
      "Kubernetes continuously compares actual state with desired state and uses controllers to reconcile any differences."
  },

  {
    question: "What happens when a Pod crashes?",
    answer:
      "The ReplicaSet controller detects the missing replica and creates a replacement Pod to maintain the desired replica count."
  },

  {
    question: "Difference between Pod, Deployment, ReplicaSet, and StatefulSet?",
    answer:
      "Pod runs containers, ReplicaSet maintains replica count, Deployment manages stateless application lifecycle, StatefulSet manages stateful workloads with stable identities."
  },

  {
    question: "How does Service Discovery work in Kubernetes?",
    answer:
      "Services provide stable virtual IPs and DNS names while kube-proxy routes traffic to healthy Pods."
  },

  {
    question: "Difference between ClusterIP, NodePort, LoadBalancer, and Ingress?",
    answer:
      "ClusterIP is internal only, NodePort exposes a port on each node, LoadBalancer provisions external cloud load balancers, and Ingress provides HTTP routing through a single entry point."
  },

  {
    question: "What is the role of etcd?",
    answer:
      "etcd is the distributed key-value store that acts as the source of truth for all cluster state and configuration."
  },

  {
    question: "How does the Scheduler decide where to place Pods?",
    answer:
      "The Scheduler evaluates resource availability, affinity rules, taints, tolerations, topology constraints, and scheduling policies."
  },

  {
    question: "What are ConfigMaps and Secrets?",
    answer:
      "ConfigMaps store non-sensitive configuration while Secrets store sensitive information such as passwords, certificates, and API keys."
  },

  {
    question: "What are Liveness, Readiness, and Startup Probes?",
    answer:
      "Liveness determines if a container should be restarted, Readiness determines if traffic should be routed to the Pod, and Startup protects slow-starting applications."
  },

  {
    question: "What is a Persistent Volume Claim?",
    answer:
      "A PVC is a request for storage that abstracts the underlying Persistent Volume implementation."
  },

  {
    question: "How does Horizontal Pod Autoscaler work?",
    answer:
      "HPA monitors metrics such as CPU or memory utilization and automatically adjusts replica counts."
  },

  {
    question: "What are Taints and Tolerations?",
    answer:
      "Taints restrict workloads from scheduling on nodes while Tolerations allow specific Pods to bypass those restrictions."
  },

  {
    question: "What is Pod Anti-Affinity and why is it important?",
    answer:
      "It spreads replicas across nodes or zones to improve availability and reduce single points of failure."
  },

  {
    question: "How would you secure a Kubernetes cluster?",
    answer:
      "Use RBAC, Network Policies, Namespace Isolation, Secret Management, Pod Security controls, image scanning, and least-privilege access."
  },

  {
    question: "What is Helm and why is it used?",
    answer:
      "Helm is Kubernetes' package manager that simplifies deployment, configuration, upgrades, and rollback of applications."
  },

  {
    question: "How do you troubleshoot a failing Pod?",
    answer:
      "Check Pod status, Events, Logs, Describe output, resource usage, probes, node health, and application diagnostics."
  },

  {
    question: "What are common Kubernetes production mistakes?",
    answer:
      "Missing resource limits, using latest image tags, skipping probes, poor RBAC practices, lack of anti-affinity, and storing secrets insecurely."
  }
];

export const pageData = {
  title: "Kubernetes",
  badge: "Container Orchestration",
  description:
    "Learn Kubernetes from Pods and Deployments to Production Architecture, Networking, Storage, Security and Scaling.",
  stats: [
    { value: "14", label: "Core Topics" },
    { value: "20+", label: "Interview Questions" },
    { value: "30+", label: "Production Concepts" },
    { value: "50+", label: "Practical Examples" }
  ],
  roadmap,
  learnConcepts: [
    "Declarative Model",
    "Control Plane",
    "Pods & Nodes",
    "Deployments",
    "StatefulSets",
    "Services",
    "Ingress",
    "Network Policies",
    "Persistent Storage",
    "Health Probes",
    "Autoscaling",
    "RBAC Security"
  ],
  topics,
  interviewQuestions,
  resources: [
    "Kubernetes Documentation",
    "CNCF Landscape",
    "Helm",
    "Kustomize",
    "Prometheus",
    "Grafana"
  ],
  ctaTitle: "Continue Your Learning Journey",
  ctaDescription:
    "Read detailed technical articles and stay updated with new content."
};