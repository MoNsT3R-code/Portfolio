/*
 * All site content lives here. Edit this file to change the site; components only render it.
 *
 * Rules this file follows:
 * - Nothing is invented. Anything missing is a visible TODO placeholder in square brackets.
 *   Run `npm run todos` to list every placeholder that's left.
 * - No internal links, internal documents, screenshots or logos.
 * - Team work is credited as team work. In-progress and design-stage work is labeled as such.
 */

export type StatusKind = 'accepted' | 'documented' | 'prototype' | 'in-progress' | 'design-stage' | 'team-build';

export interface Status {
  kind: StatusKind;
  label: string;
}

export interface Block {
  text?: string[];
  points?: string[];
  groups?: { title: string; points: string[] }[];
}

export interface MetricRow {
  label: string;
  before: string;
  after: string;
  change: string;
}

export type FigureKind = 'pipeline' | 'roles' | 'ownership' | 'journey' | 'chunking' | 'patterns' | 'architecture' | 'certificate';

export interface Project {
  slug: string;
  title: string;
  kicker: string;
  summary: string;
  status: Status;
  timeframe: string;
  team?: string[];
  myPart?: string;
  builtWith?: string[];
  deliverables?: string[];
  problem: Block;
  approach: Block;
  built: Block;
  results: Block & { metrics?: { caption: string; rows: MetricRow[] } };
  next: Block;
  figure?: FigureKind;
  media?: string[];
  related?: { label: string; href: string }[];
}

export interface Link {
  label: string;
  href: string | null;
  display: string;
}

/**
 * Files marked "hold" in assets-src/library.json (internal Stewart material, or files whose authorship isn't confirmed)
 * show on localhost but are left out of production builds. Set this to true only once you have approval to publish them.
 */
export const PUBLISH_HELD = false;

/** Replace with the deployed domain. Used for canonical URLs, Open Graph and the sitemap. */
export const SITE_URL = 'https://example.com'; // [TODO: your deployed domain, e.g. https://yourname.vercel.app]

export const site = {
  name: 'Musfira Sehar',
  title: 'Musfira Sehar · AI & security engineer',
  description:
    'I build AI that retrieves before it answers and secures before it ships: RAG pipelines, agentic workflows and security-aware applications.',
  updated: 'October 2026',
};

export const person = {
  name: 'Musfira Sehar',
  descriptor: 'AI & security engineer',
  role: 'Trainee IT Programmer Analyst I',
  team: 'AI Team & R&D projects',
  company: 'Stewart',
  since: 'July 2026',
  period: '13 July – 12 October 2026',
  education: {
    degree: 'BS Computer Science',
    school: 'Forman Christian College, University',
    graduation: 'Expected July 2028',
  },
  positioning:
    'I build AI systems that are grounded, secure and honest: RAG pipelines, agentic workflows, and security-aware applications.',
};

export const hero = {
  greeting: 'Hello, I’m',
  firstName: 'Musfira',
  lastName: 'Sehar',
  role: 'AI & Security Engineer',
  tagline: 'I build AI that retrieves before it answers and secures before it ships.',
  taglineParts: {
    before: 'I build AI that ',
    hit1: 'retrieves',
    middle: ' before it answers',
    and: ' and ',
    hit2: 'secures',
    end: ' before it ships.',
  },
  lede:
    'I design RAG pipelines, agentic workflows and security-aware applications that cite their evidence, check their own answers, and say plainly when work is still in progress.',
  sources: [
    {
      n: 1,
      text: 'BreachMirror AI: agentic RAG that cites the handbook policy behind each answer.',
      href: '/work/breachmirror-ai',
    },
    {
      n: 2,
      text: 'Governance before data: approvals confirmed before external models touch sensitive data.',
      href: '/#practice',
    },
    {
      n: 3,
      text: 'Team recognition: the AI Models Openness Report, reviewed and accepted after two review passes.',
      href: '/#recognition',
    },
    {
      n: 4,
      text: 'Token Optimizer: critical issues cut from 4 to 0 over three test rounds.',
      href: '/work/claude-code-skills',
    },
  ],
};

export const recognition = {
  title: 'Recognition Spotlight',
  report: 'AI Models Openness Report',
  outcome: 'Reviewed and accepted',
  detail: 'Accepted after two review passes.',
  team: ['Taimoor Nasir', 'Rabia Adeel', 'Mudassar Hussain', 'Musfira Sehar'],
  image: {
    src: 'certificates/ai-models-openness-recognition.webp',
    srcSmall: 'certificates/ai-models-openness-recognition-960.webp',
    srcTiny: 'certificates/ai-models-openness-recognition-640.webp',
    width: 1360,
    height: 760,
    alt: 'Recognition Spotlight certificate for the AI Models Openness Report, reviewed and accepted. Gold and white text on a navy background inside a thin gold double border, with small star and constellation motifs. It names the team: Taimoor Nasir, Rabia Adeel, Mudassar Hussain and Musfira Sehar, and notes that the report was accepted after two review passes.',
  },
  context:
    'The report compared open-weight and closed AI models on deployment, infrastructure cost and security, and closed with business-focused recommendations. This was a team achievement.',
};

export const projects: Project[] = [
  {
    slug: 'breachmirror-ai',
    title: 'BreachMirror AI',
    kicker: 'Flagship · Agentic RAG · Security',
    summary:
      'A cybersecurity awareness and threat-monitoring platform that became a handbook-driven AI policy assistant with agentic RAG.',
    status: { kind: 'in-progress', label: 'In progress' },
    timeframe: 'September – October 2026',
    builtWith: ['React', 'TypeScript', 'Vite', 'LangGraph', 'BM25 (rank_bm25)'],
    deliverables: ['One-page technical documentation', 'Presentation deck'],
    problem: {
      text: [
        'BreachMirror AI started as a cybersecurity awareness and threat-monitoring platform and grew into a policy assistant. Answers about security policy need to be traceable to the policy they came from, checked before anyone reads them, and safe to show. A model that answers in one step does none of that.',
      ],
    },
    approach: {
      text: [
        'I built the assistant as an agentic pipeline in LangGraph: Retrieve → Draft → Evaluate → Finalize. Instead of answering in one step, the system searches the policy documents itself, reasons over the results, checks its own answer quality, and enforces safety guardrails.',
        'Governance comes first. I verify approval for external model providers before any company-sensitive data is used.',
      ],
    },
    built: {
      groups: [
        {
          title: 'Interface',
          points: [
            'React, TypeScript and Vite frontend with interactive dashboards',
            'Real-time threat telemetry visualizations and a threat radar',
            'A Security Handbook with flashcards, a decision lab and certification quizzes',
            'Registration, a login panel and password authentication',
          ],
        },
        {
          title: 'Agentic RAG',
          points: [
            'A LangGraph pipeline: Retrieve → Draft → Evaluate → Finalize',
            'BM25Okapi retrieval over the handbook policies',
            'Evidence-backed answers with citations',
          ],
        },
        {
          title: 'Trust and safety',
          points: [
            'Answers are validated before they are returned',
            'Sensitive data is redacted',
            'Approval for external model providers is verified before company-sensitive data is used',
          ],
        },
      ],
    },
    results: {
      points: [
        'A handbook-driven policy assistant that cites the policy behind each answer',
        'Validation and redaction run before an answer is shown',
        'Delivered one-page technical documentation and a presentation deck',
      ],
    },
    next: {
      points: [
        'Embedding / vector search',
        'MCP integration once the search API is stable',
        'A hosted platform with a secure backend',
        'A full design-system redesign',
      ],
    },
    figure: 'pipeline',
    related: [
      { label: 'How I work: governance before data', href: '/#practice' },
      { label: 'RAG chunking evaluation', href: '/work/rag-chunking-evaluation' },
    ],
  },
  {
    slug: 'ai-models-openness-report',
    title: 'AI Models Openness Report',
    kicker: 'Team research · Recognized',
    summary:
      'A comparison of open-weight and closed AI models across deployment, infrastructure cost and security. Reviewed and accepted after two review passes.',
    status: { kind: 'accepted', label: 'Accepted' },
    timeframe: 'July 2026',
    team: ['Taimoor Nasir', 'Rabia Adeel', 'Mudassar Hussain', 'Musfira Sehar'],
    myPart: '[TODO: which parts of the report were yours]',
    deliverables: ['Comparative report', 'Business-focused recommendations'],
    problem: {
      text: [
        'Choosing between open-weight and closed AI models is a deployment, cost and security decision as much as a capability one. The report compared them on those terms.',
      ],
    },
    approach: {
      points: [
        'Compared deployment options: API access versus self-hosting',
        'Compared GPU and VRAM requirements and infrastructure costs',
        'Analysed the security of each deployment model',
        'Compared NVIDIA Nemotron 3 Ultra, Claude Opus, Gemini and Copilot',
      ],
    },
    built: {
      text: ['A report with a security analysis at its centre, and recommendations written for the business.'],
      points: [
        'Open-weight models like NVIDIA Nemotron 3 Ultra have no built-in authentication. They rely on enterprise identity: Entra ID, OAuth 2.0, AD/LDAP or API keys.',
        'In a well-secured setup, the real risks are hallucinations, prompt injection and data governance.',
        'Recommendations aligned to cost, governance and compliance.',
      ],
    },
    results: {
      points: [
        'Reviewed and accepted after two review passes',
        'Recognized in a Recognition Spotlight, credited to the whole team',
      ],
    },
    next: { text: ['[TODO: any follow-up work, or remove this section]'] },
    figure: 'certificate',
    related: [{ label: 'Recognition', href: '/#recognition' }],
  },
  {
    slug: 'claude-code-skills',
    title: 'Claude Code skills: design and evaluation',
    kicker: 'Skill engineering · Evaluation',
    summary:
      'A Token Optimizer skill improved over three rounds with a 7-role agent pipeline, the co-developed Optimize skill, and an evaluation of the Handoff skill.',
    status: { kind: 'documented', label: 'Documented' },
    timeframe: 'Late July – August 2026',
    builtWith: ['Claude Code (skills, subagents)'],
    deliverables: [
      'Token Optimizer skill',
      'Handoff skill evaluation with findings and recommendations',
      'Optimize skill (co-developed) with review and benchmark',
    ],
    problem: {
      text: [
        'A skill that cuts an agent’s token usage is only useful if the answers stay correct. Multi-stage workflows add a second problem: context and knowledge have to survive each handoff between specialists.',
      ],
    },
    approach: {
      points: [
        'Token Optimizer: three rounds of testing and refinement through a 7-role agent pipeline: Architect, Judge, Tester, Red Team, Benchmark Analyst, Auditor and Refiner',
        'Handoff: security-assessment and architecture-security handoff scenarios, testing how well context carries over between specialists',
        'Optimize: co-developed and reviewed the skill, analysed its three-layer design (output, thinking, security), and benchmarked optimized against baseline runs for tokens, quality and security',
      ],
    },
    built: {
      groups: [
        {
          title: 'Token Optimizer',
          points: [
            'A skill that reduces AI agent token usage without losing correctness',
            'Caught a real bug where a PowerShell command could report a failed build as passing',
          ],
        },
        {
          title: 'Handoff evaluation',
          points: [
            'Scenario-based tests of context carry-over in multi-stage workflows',
            'Documented findings and recommendations',
          ],
        },
        {
          title: 'Optimize skill',
          points: ['Co-developed the skill and reviewed it', 'Analysis of the output, thinking and security layers', 'Benchmark of optimized against baseline runs'],
        },
      ],
    },
    results: {
      metrics: {
        caption: 'Token Optimizer · 3 rounds · 7-role agent pipeline',
        rows: [
          { label: 'Judge score', before: '73/100', after: '78/100', change: '+5' },
          { label: 'Critical issues', before: '4', after: '0', change: '−4' },
          { label: 'Simulated test pass rate', before: '61%', after: '82%', change: '+21 pts' },
        ],
      },
      points: [
        'An 80% token-reduction target wasn’t achievable without quality loss, so I set evidence-based targets instead.',
      ],
    },
    next: { text: ['[TODO: what’s next for these skills]'] },
    figure: 'roles',
    related: [{ label: 'Field note: cut tokens at the source', href: '/#notes' }],
  },
  {
    slug: 'ai-security-chrome-extension',
    title: 'AI Security Assistant Chrome Extension',
    kicker: 'Research & prototype · Browser security',
    summary:
      'Researched and prototyped an AI security assistant as a Chrome extension, covering architecture, permissions, security risks and enterprise readiness.',
    status: { kind: 'prototype', label: 'Prototype' },
    timeframe: 'September 2026',
    deliverables: ['Prototype', 'Research brief', 'Product documentation', 'Presentation decks', 'Explainer video', 'Findings presented to the team'],
    problem: {
      text: [
        'A browser extension sits close to everything a user does on the web. That makes it a useful place for an AI security assistant, and a risky one.',
      ],
    },
    approach: {
      points: [
        'Mapped the extension architecture: manifest, content scripts and background scripts',
        'Reviewed the permissions and APIs the assistant would need',
        'Studied extension security risks and their mitigations',
        'Traced the link between browser extensions and LLM security',
      ],
    },
    built: {
      points: [
        'A prototype of the assistant',
        'Product and technical documentation: features, stack, architecture, governance, roadmap and lessons from extension history',
        'An assessment of enterprise deployment readiness, covering compliance and governance',
        'Presentation decks for the team, from extension basics to an enterprise threat briefing',
      ],
    },
    results: { points: ['Presented the findings to the team'] },
    next: { text: ['[TODO: what’s next for the extension]'] },
  },
  {
    slug: 'rag-chunking-evaluation',
    title: 'RAG Chunking Strategy Evaluation',
    kicker: 'RAG research · Evaluation',
    summary:
      'Chunking strategies tested on policy, legal and technical documents with 29 predefined queries and PASS/FAIL criteria.',
    status: { kind: 'documented', label: 'Documented' },
    timeframe: '[TODO: month]',
    deliverables: ['Evaluation with PASS/FAIL criteria', 'Documented recommendation'],
    problem: {
      text: [
        'How a RAG system splits its documents decides what it can retrieve. The right strategy depends on the documents, so I tested the options instead of picking one by default.',
      ],
    },
    approach: {
      points: [
        'Compared Recursive, Fixed-Size, Semantic, Hierarchical, Structure-Based, Late, Contextual and Adaptive chunking',
        'Tested them on policy, legal and technical documents',
        'Built a common evaluation dataset of 29 test queries across four categories: fact retrieval, reasoning, summarization and context preservation',
        'Scored each strategy against the queries with PASS/FAIL criteria',
      ],
    },
    built: {
      text: [
        'An evaluation framework (v1.2), a test dataset, a results and recommendation report, a research brief, and an interactive chunking lab that runs the strategies on your own text.',
      ],
    },
    results: {
      points: [
        'Recommended Recursive chunking at about 512 tokens as the baseline',
        'Documented when the advanced strategies pay off',
      ],
    },
    next: { text: ['[TODO: what’s next]'] },
    figure: 'chunking',
    related: [{ label: 'Field note: the baseline to beat', href: '/#notes' }],
  },
  {
    slug: 'agentic-ui-research',
    title: 'Agentic UI research: who owns the interface?',
    kicker: 'Research · Agentic UX',
    summary:
      'As AI apps move past plain chat, the key question is who owns the interface: the application, the model or the tool.',
    status: { kind: 'documented', label: 'Documented' },
    timeframe: 'September 2026',
    deliverables: ['3 explainer demo videos, one per model', 'One-page A2UI architecture document'],
    problem: {
      text: ['As AI apps move past plain chat, the key question is who owns the user interface.'],
    },
    approach: {
      groups: [
        {
          title: 'Three ownership models',
          points: [
            'Application-owned UI: today’s default',
            'Model-owned UI: declarative, as in A2UI and OpenUI',
            'Tool-owned UI: delivered through MCP Apps',
          ],
        },
        {
          title: 'Also covered',
          points: [
            'Keeping the frontend in sync with a running agent (streaming, tool calls, errors) via AG-UI',
            'Why early “model generates raw HTML” attempts failed',
          ],
        },
      ],
    },
    built: {
      points: ['Three explainer demo videos, one per ownership model', 'A one-page A2UI architecture document'],
    },
    results: {
      points: ['Finding: the three models are usually combined, not competing'],
    },
    next: { text: ['[TODO: what’s next]'] },
    figure: 'ownership',
    related: [{ label: 'Field note: who owns the interface', href: '/#notes' }],
  },
  {
    slug: 'rnd-support',
    title: 'R&D team support',
    kicker: 'Internship · Team operations',
    summary:
      'Set up the shared R&D Portfolio repository, coordinated intern presentations, evaluated Microsoft Whiteboard for team collaboration, and started a security-awareness handbook for new interns.',
    status: { kind: 'team-build', label: 'Team support' },
    timeframe: '13 July – 12 October 2026',
    deliverables: ['Shared R&D Portfolio repository', 'Intern presentation schedule', 'Whiteboard evaluation', 'Security-awareness handbook (started)'],
    problem: {
      text: ['A growing R&D team with several interns needed shared places to keep its work, a rhythm for presenting it, and a common baseline for security habits.'],
    },
    approach: {
      points: [
        'Set up the shared repository the team’s R&D Portfolio site is built in',
        'Coordinated the intern presentations',
        'Evaluated Microsoft Whiteboard for team collaboration',
        'Started a security-awareness handbook for new interns',
      ],
    },
    built: {
      text: [
        'The R&D Portfolio site itself was built by teammates; my part was setting up the shared repository. The security-awareness handbook is the written deliverable, and it is still in progress.',
      ],
    },
    results: { text: ['[TODO: anything you can share about the Whiteboard evaluation or the intern presentations]'] },
    next: { text: ['Finish the security-awareness handbook for new interns.'] },
  },
  {
    slug: 'secure-agent-pattern-catalog',
    title: 'Secure AI Agent Design Pattern Catalog',
    kicker: 'Architecture · Design stage',
    summary: 'An architecture blueprint for securing common AI agent patterns, with four planned modules.',
    status: { kind: 'design-stage', label: 'Design stage' },
    timeframe: '[TODO: month]',
    deliverables: ['Architecture blueprint (draft)'],
    problem: {
      text: ['Teams building agents choose from a handful of common patterns, and each pattern needs its own security thinking.'],
    },
    approach: {
      points: ['Covered the ReAct, Reflection, Supervisor, Planner-Executor and RAG Assistant patterns'],
    },
    built: { text: ['A draft architecture blueprint covering the five patterns, written alongside my AI security research on prompt injection, tool poisoning and multi-agent risks.'] },
    results: { text: ['Design stage. The drafted blueprint is the current deliverable.'] },
    next: {
      text: ['Planned modules:'],
      points: ['Pattern Catalog', 'Security Testing Lab', 'Recommendation Engine', 'Multi-Agent Security Simulator'],
    },
    figure: 'patterns',
  },
  {
    slug: 'malware-analysis-platform',
    title: 'AI-Powered Malware Analysis Platform',
    kicker: 'Architecture design · Security',
    summary:
      'A SOC-grade design that detonates suspicious files and URLs in isolated sandboxes, extracts static and behavioral indicators, classifies them with AI and produces analyst and executive reports.',
    status: { kind: 'design-stage', label: 'Design stage' },
    timeframe: 'August 2026',
    deliverables: ['Architecture design document'],
    problem: {
      text: [
        'Analyzing a suspicious file safely means running it somewhere it can do no harm, watching what it does, and turning that evidence into a verdict people can trust.',
      ],
    },
    approach: {
      text: [
        'Every untrusted sample only ever touches network-isolated, ephemeral sandboxes restored from a snapshot. The control plane (API, database, queue) never executes untrusted code.',
      ],
    },
    built: {
      groups: [
        {
          title: 'Sandboxing',
          points: [
            'A fresh Windows VM or gVisor/Firecracker microVM per job, cloned from a golden snapshot and destroyed afterwards',
            'Kernel-level instrumentation (ETW on Windows, eBPF on Linux) instead of in-guest agents malware could detect',
            'Anti-evasion basics: randomized VM fingerprints, simulated user input, tuned timeouts',
          ],
        },
        {
          title: 'Platform',
          points: [
            'FastAPI gateway, PostgreSQL schema, Redis and Celery queueing',
            'An AI analysis pipeline cross-referenced with threat intelligence',
            'React, TypeScript and Tailwind frontend: upload, live analysis monitor, threat-intel dashboard, report viewer with a MITRE ATT&CK heatmap',
          ],
        },
        {
          title: 'Security controls',
          points: [
            'RBAC enforced at the API, MFA for admin and analyst roles, short-lived JWTs',
            'Samples encrypted at rest and stored outside any web-servable path',
            'Sandbox network air-gapped with deny-by-default egress; full audit logging and rate limits',
          ],
        },
        {
          title: 'Deployment',
          points: [
            'Kubernetes with autoscaling sandbox workers on an isolated node pool',
            'Model versions deployed separately, with a shadow-mode evaluation before they affect live verdicts',
          ],
        },
      ],
    },
    results: { text: ['Design stage. The architecture document is the deliverable.'] },
    next: { text: ['[TODO: what’s next]'] },
  },
  {
    slug: 'prompt-a-thon-portal',
    title: 'Prompt-a-thon 2026 portal',
    kicker: 'Team build · Event hub',
    summary:
      'Co-built the hub for a company-wide AI innovation challenge: structure, navigation, event journey, categories, rules, governance and participant resources.',
    status: { kind: 'team-build', label: 'Team build' },
    timeframe: 'August 2026',
    team: ['[TODO: teammates or team name]'],
    myPart: '[TODO: which sections or decisions were yours]',
    builtWith: ['SharePoint'],
    deliverables: ['Internal event hub'],
    problem: {
      text: [
        'A company-wide AI adoption challenge needed one hub where any employee, technical or not, could understand the event, sign up and know the rules before building anything.',
      ],
    },
    approach: {
      text: [
        'We structured the hub around the participant’s path, with one quick-links bar so every question was a click away: what to build, who can take part, how the event runs, how it’s judged, and what’s off-limits.',
      ],
    },
    built: {
      groups: [
        {
          title: 'Structure',
          points: ['A single-page hub with quick links to seven sections', 'A countdown to the event'],
        },
        {
          title: 'Event journey',
          points: [
            'Five phases: Training → Registration → Build Day → Showcase → Follow-Up',
            'The strongest ideas move on to proof-of-concept and governance review',
          ],
        },
        {
          title: 'Participant resources',
          points: [
            'A six-session training track, from fundamentals to an optional technical deep dive',
            'A key-dates table and a registration form capturing the business problem, team, category, skill level and proposed approach',
          ],
        },
        {
          title: 'Competition design',
          points: [
            'Nine categories spanning non-technical and technical tracks',
            'A weighted judging rubric that puts business impact first',
          ],
        },
        {
          title: 'Rules and governance',
          points: [
            'Validate every AI output, use sanitized or approved data, and disclose data sources and integrations',
            'Never deploy hackathon work straight to production, and never enter confidential or sensitive data',
          ],
        },
      ],
    },
    results: { text: ['[TODO: only what can be shared publicly, e.g. launch timing]'] },
    next: { text: ['[TODO: e.g. publishing the training schedule and key dates]'] },
    figure: 'journey',
    related: [{ label: 'How I work: governance before data', href: '/#practice' }],
  },
  {
    slug: 'ai-code-editor',
    title: 'AI Code Editor',
    kicker: 'Personal project · In progress',
    summary: 'A Cursor- and Claude Code-inspired editor on a MERN microservices architecture.',
    status: { kind: 'in-progress', label: 'In progress' },
    timeframe: '[TODO: start date]',
    builtWith: ['React', 'Tailwind CSS', 'Firebase Auth'],
    problem: {
      text: ['A personal project: an AI code editor in the style of Cursor and Claude Code. [TODO: one line on why you started it]'],
    },
    approach: {
      text: ['A MERN microservices architecture, with an API gateway in front of separate services.'],
    },
    built: {
      points: ['API gateway', 'Auth service with Firebase and Google sign-in', 'React + Tailwind frontend'],
    },
    results: { text: ['In progress. [TODO: what works today]'] },
    next: {
      text: ['Planned:'],
      points: ['LangGraph agents', 'AWS', 'Redis', 'Runtime file creation and editing'],
    },
    figure: 'architecture',
    media: ['[TODO: repository link or screenshots, if public]'],
  },
];

/** Personal and academic work on GitHub. Facts come from each repository's README. */
export const GITHUB = 'https://github.com/MoNsT3R-code';

export interface RepoProject {
  repo: string;
  title: string;
  summary: string;
  points: string[];
  stack: string[];
  live?: string;
  team?: string;
  context?: string;
}

export const githubProjects: RepoProject[] = [
  {
    repo: 'EduQuest-AI-Platform',
    title: 'EduQuest AI Platform',
    summary:
      'An AI-powered, gamified learning platform for grades 3–7 that predicts student performance from behavioral telemetry and adapts difficulty and rewards in real time.',
    points: [
      'Random Forest classifier (100 trees) on 200+ synthetic student records, with a stratified 80/20 split',
      '72.5% test accuracy; F1 of 0.84, 0.65 and 0.73 for high, medium and low performance',
      'Three reward tiers and an interactive Streamlit dashboard',
    ],
    stack: ['Python', 'scikit-learn', 'Streamlit', 'Pandas'],
    team: 'With Amzi Asif',
    context: 'Introduction to Artificial Intelligence, FCCU',
  },
  {
    repo: 'WaqfApp',
    title: 'WaqfApp',
    summary: 'A secure digital waqf platform for modern philanthropy, combining 3D visualizations with financial management.',
    points: [
      'Multi-factor authentication with JWT sessions and bcrypt password hashing',
      'An end-to-end encrypted vault for digital keys',
      'A smart capital advisor for PKR finances, with Gemini API integration',
    ],
    stack: ['React 19', 'Three.js', 'Node.js', 'Express'],
    live: 'https://waqf-app.vercel.app',
  },
  {
    repo: 'School-Management-App',
    title: 'School Management ERP',
    summary: 'A secure, cloud-based ERP for Al-Noor Islamic Academy: attendance, billing, grading and reports.',
    points: [
      'Multi-tenant architecture with role-based access control',
      'Hifz (Quran memorization) and Tarbiyah (character development) tracking modules',
      'Input validation and strict database constraints',
    ],
    stack: ['Python', 'MariaDB / PostgreSQL', 'JavaScript'],
  },
  {
    repo: 'neon-overdrive-suite',
    title: 'Neon Overdrive Suite',
    summary:
      'Six zero-dependency desktop apps built only with the Python standard library: Snake, Word Search, Sudoku, Tic-Tac-Toe, Minesweeper and a calculator.',
    points: ['Object-oriented design with decoupled, encapsulated classes', 'Tkinter canvas rendering and event binding', 'State saved as JSON'],
    stack: ['Python', 'Tkinter'],
  },
  {
    repo: 'scientific-calculator-app',
    title: 'MathHub Pro',
    summary: 'A single-page app combining a scientific calculator, a notes suite and an interactive graph plotter.',
    points: ['Graph plotting on an HTML5 canvas', 'Notes saved in local storage; works offline', 'Keyboard capture for direct input'],
    stack: ['JavaScript', 'Tailwind CSS', 'HTML5 Canvas'],
    live: 'https://calculator-app-12a09d.tiiny.site',
  },
  {
    repo: 'Multi-featured-website',
    title: 'The Artisan’s Touch',
    summary: 'A resin-art storefront with an admin dashboard, built as a local Flask application.',
    points: [
      'Role-based access for customers and admins',
      'Session-based cart, with persistent models for users, products and orders',
      'Responsive down to 320px screens',
    ],
    stack: ['Python', 'Flask', 'SQLAlchemy', 'SQLite'],
  },
];

export const githubCoursework = [
  { repo: 'Cyber-Project', title: 'PortSwigger Web Security Academy', summary: '32 lab solutions across 8 vulnerability categories, for Advanced Web Security.' },
  { repo: 'Cyber-Security', title: 'Cyber security labs', summary: 'Linux fundamentals, networking, GDB/GEF, stack analysis and buffer overflows.' },
  { repo: 'Artificial-Intelligent', title: 'Artificial intelligence labs', summary: 'Machine learning, neural networks and genetic algorithms.' },
  { repo: 'Software-Engineering', title: 'MediTrack', summary: 'Software engineering: SRS, system models, sequence diagrams and testing documents.' },
  { repo: 'Operating-Systems', title: 'Operating systems', summary: 'Processes, threads, IPC and signals, in C.' },
  { repo: 'Compiler-Constructions', title: 'Compiler construction', summary: 'Tokenizers, LL parsers and grammar analyzers, in C.' },
  { repo: 'LL0-Parsers', title: 'LL(0) parsers', summary: 'Parsing utilities for building and testing grammar-based systems.' },
  { repo: 'DSA', title: 'Data structures & algorithms', summary: 'Hands-on Python, from arrays to AVL trees.' },
  { repo: 'dbms', title: 'Databases', summary: 'SQL labs, sample tables and practice files.' },
  { repo: 'CSCS320', title: 'Numerical methods', summary: 'Implementations in MATLAB.' },
  { repo: 'Quiz-with-JSON-python', title: 'JSON quiz engine', summary: 'A generic-typed OOP quiz engine with a decoupled JSON question bank.' },
  { repo: 'shooting-game', title: 'Shooting game', summary: 'A browser game: aim, shoot, score.' },
  { repo: 'The-Artisian-s-Touch-', title: 'Resin art site', summary: 'A static resin-art website.' },
];

export const research = [
  {
    area: 'AI security',
    note: 'How agents and LLM apps get attacked.',
    items: [
      'Direct and indirect prompt injection',
      'Context manipulation',
      'Tool poisoning and misuse',
      'Memory and multi-agent risks',
    ],
  },
  {
    area: 'Web security',
    note: 'Hands-on PortSwigger Web Security Academy labs, aligned to the OWASP Top 10: 32 labs across 8 categories.',
    items: ['SQL injection', 'CSRF', 'Reflected, stored and DOM XSS, with CSP mitigations', 'Authentication, directory traversal and access control', 'File upload and SSRF'],
  },
  {
    area: 'Text2SQL and internal apps',
    note: 'Retrieval for structured data, and reading other teams’ systems.',
    items: ['Researched agentic code retrieval for Text2SQL', 'Why one-shot keyword retrieval misses business logic, and iterative retrieval as the fix', 'Analyzed the architecture of an internal status-reporting application'],
  },
  {
    area: 'Also explored',
    note: 'Broader groundwork.',
    items: [
      'PRDs for legacy systems',
      'LangGraph, AutoGen and CrewAI compared',
      'MCP',
      'Computer Use Automation',
      'Networking fundamentals',
    ],
  },
];

export const fieldNotes = [
  {
    topic: 'Token efficiency',
    quote: 'Cut tokens at the source: retrieve the paragraph, not the 50-page document.',
    href: '/work/claude-code-skills',
  },
  {
    topic: 'Prompting',
    quote: '“GODMODE” isn’t a command. Describe the role, objective, constraints and output format.',
  },
  {
    topic: 'Open-weight models',
    quote:
      'Open-weight models shift the security focus from authentication to hallucination, prompt injection and data governance.',
    href: '/work/ai-models-openness-report',
  },
  {
    topic: 'Chunking',
    quote: 'Recursive chunking at ~512 tokens is the baseline to beat.',
    href: '/work/rag-chunking-evaluation',
  },
  {
    topic: 'Agentic UX',
    quote: 'The future of AI UX isn’t chat. It’s deciding who owns the interface.',
    href: '/work/agentic-ui-research',
  },
];

export const practices = [
  {
    title: 'Documentation ships with the work',
    body: 'Each project comes with a one-page doc, a deck or demo videos.',
    evidence: [
      { label: 'BreachMirror AI: one-page doc and deck', href: '/work/breachmirror-ai' },
      { label: 'Agentic UI: three explainer videos', href: '/work/agentic-ui-research' },
    ],
  },
  {
    title: 'Honest status',
    body: 'Interim updates while work is in progress, with test results attached. Every project on this site carries its real status.',
    evidence: [{ label: 'Token Optimizer: results by round', href: '/work/claude-code-skills' }],
  },
  {
    title: 'Governance before data',
    body: 'I confirm approvals before external AI providers touch sensitive data.',
    evidence: [
      { label: 'BreachMirror AI: provider approval first', href: '/work/breachmirror-ai' },
      { label: 'Prompt-a-thon: rules and governance', href: '/work/prompt-a-thon-portal' },
    ],
  },
  {
    title: 'Learning on a roadmap',
    body: 'AI fundamentals → RAG → agents → LangChain/LangGraph, applying each step in a real project.',
    evidence: [{ label: 'Journey', href: '/#journey' }],
  },
];

export const skills = {
  builtWith: [
    { name: 'React', usedIn: ['breachmirror-ai', 'ai-code-editor'] },
    { name: 'TypeScript', usedIn: ['breachmirror-ai'] },
    { name: 'Vite', usedIn: ['breachmirror-ai'] },
    { name: 'Tailwind CSS', usedIn: ['ai-code-editor'] },
    { name: 'Python', usedIn: [] },
    { name: 'LangGraph', usedIn: ['breachmirror-ai'] },
    { name: 'BM25 (rank_bm25)', usedIn: ['breachmirror-ai'] },
    { name: 'Firebase Auth', usedIn: ['ai-code-editor'] },
    { name: 'SharePoint', usedIn: ['prompt-a-thon-portal'] },
    { name: 'Claude Code (skills, subagents)', usedIn: ['claude-code-skills'] },
    { name: 'Git / GitHub', usedIn: [] },
  ],
  explored: [
    'LangChain',
    'Next.js',
    'Blazor',
    'Docker',
    'Azure DevOps',
    'Azure AI Search',
    'Cosmos DB',
    'LlamaIndex',
    'Hugging Face',
    'Vector databases (FAISS, Pinecone, Milvus)',
    'MCP',
    'AWS',
    'Redis',
  ],
  courses: [
    { name: 'Claude Code 101', provider: 'Anthropic', status: 'Completed' },
    { name: 'Claude Code in Action', provider: 'Anthropic', status: 'Completed' },
    { name: 'Introduction to Agent Skills', provider: 'Anthropic', status: 'Completed' },
    { name: 'Introduction to Subagents', provider: 'Anthropic', status: 'Completed' },
    { name: 'Building with the Claude API', provider: 'Anthropic', status: 'In progress' },
    { name: 'Azure AI, RAG and vector search', provider: 'LinkedIn Learning', status: '' },
  ] as { name: string; provider: string; status: string }[],
};

export const journey = [
  {
    when: 'July 2026',
    title: 'Foundations',
    body: 'AI, ML and DL fundamentals, transformers, RAG, agents and Claude Code.',
    outcome: 'AI Models Openness Report',
    href: '/work/ai-models-openness-report',
  },
  {
    when: 'Late July – August 2026',
    title: 'Agents and optimization',
    body: 'Skill engineering, token efficiency and handoff evaluation.',
    outcome: 'Claude Code skills',
    href: '/work/claude-code-skills',
  },
  {
    when: 'August 2026',
    title: 'Security and community',
    body: 'Web security labs, AI security research and the Prompt-a-thon portal.',
    outcome: 'Research & Security',
    href: '/#research',
  },
  {
    when: 'September – October 2026',
    title: 'Building',
    body: 'BreachMirror AI with agentic RAG, the Chrome extension, agentic UI research and the R&D portfolio.',
    outcome: 'BreachMirror AI',
    href: '/work/breachmirror-ai',
  },
];

export const about = {
  paragraphs: [
    'From 13 July to 12 October 2026 I was a **Trainee IT Programmer Analyst I** on Stewart’s **AI Team and R&D projects**, building and evaluating secure, grounded AI: an agentic RAG policy assistant, Claude Code skill evaluations and AI security research. I’m studying for a **BS in Computer Science** at Forman Christian College, University, with graduation expected in July 2028.',
    'My focus areas are **agentic AI and RAG**, **AI and web application security**, AI model evaluation and deployment, and frontend development. Outside work I build on GitHub: an AI-powered learning platform, a secure philanthropy app, a school ERP and a stack of coursework from operating systems to compilers.',
    'I learn on a roadmap, from AI fundamentals to **RAG** to **agents** to LangChain and LangGraph, and I apply each step in a real project. The work I care about most is AI that can **show where its answers came from**, and that has been **checked before anyone relies on it**.',
    '[TODO: anything from your LinkedIn About section you want here]',
  ],
  facts: [
    { label: 'Role', value: 'Trainee IT Programmer Analyst I, AI Team & R&D, Stewart' },
    { label: 'Internship', value: '13 July – 12 October 2026' },
    { label: 'Education', value: 'BS Computer Science, Forman Christian College, University' },
    { label: 'Graduation', value: 'Expected July 2028' },
    { label: 'Based in', value: 'Lahore, Pakistan' },
  ],
};

export const contact = {
  intro: 'Open to conversations about RAG, agentic workflows and AI security.',
  links: [
    { label: 'Email', href: null, display: '[TODO: the email address you want public]' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/musfira-sehar-14b592320', display: 'linkedin.com/in/musfira-sehar-14b592320' },
    { label: 'GitHub', href: 'https://github.com/MoNsT3R-code', display: 'github.com/MoNsT3R-code' },
  ] as Link[],
  resume: {
    href: null as string | null, // [TODO: add public/resume.pdf, then set href to 'resume.pdf']
    label: 'Download résumé (PDF)',
  },
};

export const certifications = [
  { name: 'Cybersecurity Awareness (ENG 0004)', issuer: 'Stewart', date: 'July 31, 2026', note: 'Certificate of completion' },
  { name: 'Wire and Seller Impersonation Fraud (ENG 0005)', issuer: 'Stewart', date: 'July 31, 2026', note: 'Certificate of completion' },
  { name: 'Stewart 101 (ENG 0002)', issuer: 'Stewart', date: 'August 18, 2026', note: 'Certificate of completion' },
];

/** Compliance training completed during the internship (from the internship summary). */
export const compliance = [
  'Antitrust',
  'Code of Conduct',
  'Cybersecurity Awareness and Data Privacy',
  'Preventing Workplace Harassment',
  'Wire and Seller Impersonation Fraud',
  'Stewart 101 (ENG 0002)',
];

/**
 * Claude certificates, shown as the credential constellation on the home page.
 * Add `date`, `credentialId` and `url` (the "Show credential" link on LinkedIn) for each one:
 * [TODO: issue dates and verification links from your LinkedIn certifications]
 */
export interface Credential {
  id: string;
  name: string;
  issuer: string;
  status: 'Completed' | 'In progress';
  date?: string;
  credentialId?: string;
  url?: string;
}

export const credentials: Credential[] = [
  { id: 'claude-code-101', name: 'Claude Code 101', issuer: 'Anthropic', status: 'Completed' },
  { id: 'claude-code-in-action', name: 'Claude Code in Action', issuer: 'Anthropic', status: 'Completed' },
  { id: 'agent-skills', name: 'Introduction to Agent Skills', issuer: 'Anthropic', status: 'Completed' },
  { id: 'subagents', name: 'Introduction to Subagents', issuer: 'Anthropic', status: 'Completed' },
  { id: 'claude-api', name: 'Building with the Claude API', issuer: 'Anthropic', status: 'In progress' },
];

/** Chapters of the night-sky journey on the home page. */
export const chapters = [
  {
    kind: 'Education',
    title: 'Forman Christian College',
    meta: 'BS Computer Science · Expected July 2028',
    body: 'Studying computer science while working on applied AI. [TODO: start year and anything you want to highlight from your degree]',
  },
  {
    kind: 'Experience',
    title: 'Stewart',
    meta: 'Trainee IT Programmer Analyst I · AI Team & R&D · 13 July – 12 October 2026',
    body: 'Delivered a working agentic RAG assistant that answers policy questions with cited, validated and redacted responses, and reusable research for the AI Team: the recognized openness report, a RAG chunking baseline, agentic UI demo videos and Chrome extension security findings. AI tools were tested against measurable criteria, and approval for external model providers was confirmed before any sensitive data was used.',
  },
  {
    kind: 'Recognition',
    title: 'AI Models Openness Report',
    meta: 'Reviewed and accepted · Team of four',
    body: 'A comparison of open-weight and closed models on deployment, cost and security. Accepted after two review passes, credited to Taimoor Nasir, Rabia Adeel, Mudassar Hussain and Musfira Sehar.',
    certificate: true,
  },
  {
    kind: 'Certification',
    title: 'Cybersecurity Awareness',
    meta: 'ENG 0004 · Completed July 31, 2026',
    body: 'Certificate of completion for the cybersecurity awareness course.',
  },
  {
    kind: 'Courses',
    title: 'Claude credentials',
    meta: 'Four Anthropic courses completed · one in progress',
    body: 'Claude Code, agent skills, subagents and the Claude API, plus LinkedIn Learning on Azure AI, RAG and vector search. They have their own constellation further down.',
  },
];

/** Home-page sections, used by the navigation and the command palette. */
export const sections = [
  { id: 'top', label: 'Home' },
  { id: 'work', label: 'Projects' },
  { id: 'github', label: 'GitHub projects' },
  { id: 'library', label: 'Documents & media' },
  { id: 'journey', label: 'Journey' },
  { id: 'credentials', label: 'Claude credentials' },
  { id: 'knowledge', label: 'Skills & research' },
  { id: 'about', label: 'About' },
] as const;


export function projectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
