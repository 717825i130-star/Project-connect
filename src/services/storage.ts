/**
 * ProjectConnect Persistent Storage Engine
 * Manages local persistent database for users, problems, requests, projects, milestones and files.
 */

import {
  ActiveProject,
  Milestone,
  MilestoneSubmission,
  ProjectProblem,
  ProjectProposal,
  ProjectRequest,
  StaffProfile,
  StudentProfile,
  TeamMember,
} from '../types';

const STORAGE_KEYS = {
  USERS: 'projectconnect_users_v2',
  CURRENT_USER_ID: 'projectconnect_current_session_uid_v2',
  PROBLEMS: 'projectconnect_problems_v2',
  REQUESTS: 'projectconnect_requests_v2',
  PROJECTS: 'projectconnect_projects_v2',
  DOMAINS: 'projectconnect_domains_v2',
  CONFIG: 'projectconnect_cloud_config_v2',
};

export const INITIAL_DOMAINS = [
  'AI & Machine Learning',
  'Healthcare',
  'Agriculture',
  'Education',
  'Cybersecurity',
  'Finance',
  'Environment',
  'Industrial',
  'Software',
  'Social Impact',
];

// SHA-256 salt & hash simulation using Web Crypto API
export async function hashPassword(password: string): Promise<string> {
  const enc = new TextEncoder();
  const salt = 'projectconnect_secure_salt_2026';
  const data = enc.encode(password + salt);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

// Initial Seed Users
export const SEED_STUDENT_ID = 'std_alex_chen';
export const SEED_STAFF_ID = 'stf_dr_watson';

export const INITIAL_STUDENT: StudentProfile = {
  id: SEED_STUDENT_ID,
  email: 'alex.chen@university.edu',
  passwordHash: '', // Populated during seed initialization
  role: 'student',
  fullName: 'Alex Chen',
  department: 'Computer Science & Engineering',
  year: '3rd Year',
  rollNumber: 'CS23-0482',
  skills: [
    'Python',
    'Machine Learning',
    'PyTorch',
    'React',
    'TypeScript',
    'Tailwind CSS',
    'FastAPI',
  ],
  interests: ['AI & Machine Learning', 'Healthcare', 'Social Impact'],
  bio: 'Junior undergraduate student passionate about biomedical imaging, assistive AI models, and accessible web systems.',
  githubUrl: 'https://github.com/alexchen-edu',
  avatarUrl: '/src/assets/images/avatar_student_sarah_1792641942397.jpg',
  createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
  updatedAt: new Date().toISOString(),
};

export const INITIAL_STAFF: StaffProfile = {
  id: SEED_STAFF_ID,
  email: 'dr.watson@university.edu',
  passwordHash: '', // Populated during seed initialization
  role: 'staff',
  fullName: 'Dr. Evelyn Watson',
  department: 'School of Computing & Data Science',
  designation: 'Associate Professor & Research Chair',
  areasOfExpertise: [
    'Deep Learning',
    'Biomedical Signal Processing',
    'Computer Vision',
    'Edge AI Devices',
  ],
  officeLocation: 'Science & Tech Tower, Lab 402',
  researchFocus: 'Real-time diagnostic algorithms and edge-assisted clinical workflows.',
  avatarUrl: '/src/assets/images/avatar_staff_prof_1792641956605.jpg',
  createdAt: new Date(Date.now() - 60 * 86400000).toISOString(),
  updatedAt: new Date().toISOString(),
};

export const INITIAL_PROBLEMS: ProjectProblem[] = [
  {
    id: 'prob_ai_retina',
    title: 'Automated Diabetic Retinopathy Screening on Edge Devices',
    domain: 'Healthcare',
    description:
      'Design and prototype a lightweight, real-time convolutional vision model deployed on mobile or embedded microprocessors to assist rural clinic health workers in detecting early-stage diabetic retinopathy from fundus photographs without requiring cloud connectivity.',
    expectedSolution:
      'A multi-class classification neural model quantized with INT8 precision, paired with a responsive web dashboard or mobile app that accepts camera feed/uploaded fundus images and provides instant visual saliency heatmaps with triage confidence scores.',
    requiredSkills: ['Python', 'PyTorch', 'Computer Vision', 'FastAPI', 'React'],
    difficulty: 'Advanced',
    maxTeamSize: 4,
    deadline: '2026-12-15',
    staffId: SEED_STAFF_ID,
    staffName: 'Dr. Evelyn Watson',
    staffDepartment: 'School of Computing & Data Science',
    staffAvatar: '/src/assets/images/avatar_staff_prof_1792641956605.jpg',
    status: 'Available',
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
  {
    id: 'prob_agri_drone',
    title: 'Hyperspectral Crop Stress & Soil Moisture Prediction',
    domain: 'Agriculture',
    description:
      'Develop an automated geospatial data pipeline combining multi-spectral drone imagery and in-ground IoT moisture sensors to forecast drought stress in grain crops before visible chlorosis occurs.',
    expectedSolution:
      'An end-to-end data assimilation module computing NDVI/NDRE indices, generating prescription irrigation maps, and an interactive GIS dashboard for farm operators.',
    requiredSkills: ['Python', 'Machine Learning', 'GIS / Remote Sensing', 'IoT', 'Data Visualization'],
    difficulty: 'Intermediate',
    maxTeamSize: 3,
    deadline: '2026-11-30',
    staffId: SEED_STAFF_ID,
    staffName: 'Dr. Evelyn Watson',
    staffDepartment: 'School of Computing & Data Science',
    staffAvatar: '/src/assets/images/avatar_staff_prof_1792641956605.jpg',
    status: 'Available',
    createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 14 * 86400000).toISOString(),
  },
  {
    id: 'prob_cyber_zero_trust',
    title: 'Zero-Trust Microsegmentation for Campus IoT Networks',
    domain: 'Cybersecurity',
    description:
      'Campus smart metering and lab controllers are vulnerable to lateral pivot attacks. Implement an eBPF-driven behavioral packet filter that dynamically enforces least-privilege network policies based on device device fingerprints and runtime anomaly detection.',
    expectedSolution:
      'An eBPF kernel enforcement agent with an automated behavioral baseline generator and a staff alert dashboard highlighting anomalous lateral communication flows.',
    requiredSkills: ['Linux Internals', 'C / Rust', 'Python', 'Networking', 'Cybersecurity'],
    difficulty: 'Advanced',
    maxTeamSize: 3,
    deadline: '2027-01-20',
    staffId: 'stf_marcus_vance',
    staffName: 'Prof. Marcus Vance',
    staffDepartment: 'Department of Information Assurance',
    status: 'Available',
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
  {
    id: 'prob_edu_adaptive_tutor',
    title: 'Cognitive Knowledge-Tracing System for Mathematics Pedagogy',
    domain: 'Education',
    description:
      'Build a personalized learning platform that maps prerequisite concept graphs for undergraduate calculus and linear algebra, dynamically predicting when students will struggle and generating tailored mini-drill remediation paths.',
    expectedSolution:
      'A Bayesian Knowledge Tracing or Graph Neural Network model tracking mastery levels, coupled with a student-facing interactive study portal with LaTeX rendering.',
    requiredSkills: ['Python', 'TypeScript', 'React', 'Graph Algorithms', 'Statistics'],
    difficulty: 'Intermediate',
    maxTeamSize: 4,
    deadline: '2026-12-01',
    staffId: SEED_STAFF_ID,
    staffName: 'Dr. Evelyn Watson',
    staffDepartment: 'School of Computing & Data Science',
    staffAvatar: '/src/assets/images/avatar_staff_prof_1792641956605.jpg',
    status: 'Available',
    createdAt: new Date(Date.now() - 12 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 86400000).toISOString(),
  },
  {
    id: 'prob_fin_fraud_graph',
    title: 'Real-Time Graph Fraud Detection for Micro-Transactions',
    domain: 'Finance',
    description:
      'Construct a streaming graph analytical engine that identifies synthetic identity rings and circular transaction money laundering in high-throughput digital wallet payments.',
    expectedSolution:
      'A streaming graph analytics pipeline executing subgraph pattern matching within sub-100ms latency window, complete with synthetic data generator and fraud visualization console.',
    requiredSkills: ['Python', 'Neo4j / Graph DB', 'Docker', 'FastAPI', 'Data Analytics'],
    difficulty: 'Advanced',
    maxTeamSize: 4,
    deadline: '2027-02-15',
    staffId: 'stf_marcus_vance',
    staffName: 'Prof. Marcus Vance',
    staffDepartment: 'Department of Information Assurance',
    status: 'Available',
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: 'prob_env_air_quality',
    title: 'Hyperlocal Urban Heat Island & Air Quality Micro-Station Network',
    domain: 'Environment',
    description:
      'Deploy solar-powered environmental sensor nodes across campus quadrangles to map microclimates, particulate matter (PM2.5/PM10), and heat island mitigation impacts.',
    expectedSolution:
      'Hardware schematic + firmware for ESP32 with solar charging, a time-series ingestion backend, and a public heat-stress web forecast widget.',
    requiredSkills: ['Embedded C', 'IoT', 'Python', 'React', 'Time Series Analysis'],
    difficulty: 'Beginner',
    maxTeamSize: 2,
    deadline: '2026-11-20',
    staffId: SEED_STAFF_ID,
    staffName: 'Dr. Evelyn Watson',
    staffDepartment: 'School of Computing & Data Science',
    staffAvatar: '/src/assets/images/avatar_staff_prof_1792641956605.jpg',
    status: 'Available',
    createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 20 * 86400000).toISOString(),
  },
  {
    id: 'prob_social_civic_access',
    title: 'Accessible Multilingual Public Benefits Navigator',
    domain: 'Social Impact',
    description:
      'Design an accessible web portal conforming strictly to WCAG AAA standards that helps non-English-speaking low-income families verify eligibility for subsidized healthcare, nutrition, and utility assistance programs.',
    expectedSolution:
      'An offline-first progressive web application with voice-guided question flows in 4 campus-region languages, automated document eligibility checklist generator, and privacy-first local caching.',
    requiredSkills: ['React', 'Accessibility (a11y)', 'TypeScript', 'Tailwind CSS', 'PWA'],
    difficulty: 'Beginner',
    maxTeamSize: 3,
    deadline: '2026-11-25',
    staffId: SEED_STAFF_ID,
    staffName: 'Dr. Evelyn Watson',
    staffDepartment: 'School of Computing & Data Science',
    staffAvatar: '/src/assets/images/avatar_staff_prof_1792641956605.jpg',
    status: 'Available',
    createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 15 * 86400000).toISOString(),
  },
];

// Seed Requests and Active Projects for instant live experience
export const INITIAL_REQUESTS: ProjectRequest[] = [
  {
    id: 'req_demo_01',
    problemId: 'prob_ai_retina',
    problemTitle: 'Automated Diabetic Retinopathy Screening on Edge Devices',
    domain: 'Healthcare',
    studentId: SEED_STUDENT_ID,
    studentName: 'Alex Chen',
    studentDepartment: 'Computer Science & Engineering',
    studentYear: '3rd Year',
    studentSkills: ['Python', 'PyTorch', 'React', 'FastAPI'],
    studentAvatar: '/src/assets/images/avatar_student_sarah_1792641942397.jpg',
    staffId: SEED_STAFF_ID,
    pitchNote:
      'My research focus is lightweight deep learning models. I have completed coursework in Computer Vision and built an INT8 MobileNet prototype for my minor project. Our team is ready to begin testing fundus datasets immediately.',
    proposedTeamSize: 3,
    status: 'Approved',
    staffNote:
      'Strong skill alignment and thoughtful pitch. Request approved. Please proceed to team assembly and formal project proposal submission.',
    createdAt: new Date(Date.now() - 6 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: 'req_demo_02',
    problemId: 'prob_agri_drone',
    problemTitle: 'Hyperspectral Crop Stress & Soil Moisture Prediction',
    domain: 'Agriculture',
    studentId: 'std_priya_sharma',
    studentName: 'Priya Sharma',
    studentDepartment: 'Robotics & Automation',
    studentYear: 'Final Year',
    studentSkills: ['ROS2', 'Python', 'Sensors', 'GIS'],
    staffId: SEED_STAFF_ID,
    pitchNote:
      'We have access to an agricultural drone test quadcopter and want to integrate multi-spectral NDVI filters for precision grain monitoring.',
    proposedTeamSize: 2,
    status: 'Pending',
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
];

export const INITIAL_PROJECTS: ActiveProject[] = [
  {
    id: 'proj_ai_retina_active',
    problemId: 'prob_ai_retina',
    title: 'Automated Diabetic Retinopathy Screening on Edge Devices',
    domain: 'Healthcare',
    staffId: SEED_STAFF_ID,
    staffName: 'Dr. Evelyn Watson',
    studentLeaderId: SEED_STUDENT_ID,
    studentLeaderName: 'Alex Chen',
    team: [
      {
        id: SEED_STUDENT_ID,
        name: 'Alex Chen',
        email: 'alex.chen@university.edu',
        role: 'Leader',
        department: 'Computer Science & Engineering',
        rollNumber: 'CS23-0482',
      },
      {
        id: 'member_jordan_lee',
        name: 'Jordan Lee',
        email: 'jordan.lee@university.edu',
        role: 'Member',
        department: 'Biomedical Engineering',
        rollNumber: 'BM23-0114',
      },
      {
        id: 'member_sara_khan',
        name: 'Sara Khan',
        email: 'sara.khan@university.edu',
        role: 'Member',
        department: 'Electrical & Computer Engineering',
        rollNumber: 'EC23-0902',
      },
    ],
    proposal: {
      id: 'prop_retina_01',
      title: 'EdgeRetina: Lightweight Quantized Vision Transformer for Clinical Triage',
      abstract:
        'A clinically grounded proposal targeting deployment of quantized MobileViT networks on Raspberry Pi 4 and edge tablets. We evaluate on public Kaggle APTOS 2019 and EyePACS datasets, maintaining sensitivity >= 92% on severe non-proliferative cases.',
      methodology:
        '1. Dataset preprocessing & CLAHE contrast normalization.\n2. Backbone fine-tuning with focal loss to combat class imbalance.\n3. Post-training dynamic quantization to INT8.\n4. Local FastAPI web interface for real-time fundus inspection.',
      techStack: ['Python 3.11', 'PyTorch', 'TorchVision', 'FastAPI', 'React', 'Tailwind CSS'],
      expectedDeliverables: [
        'Model checkpoint (< 25MB) with INT8 ONNX export',
        'Inference benchmark logs on CPU & edge hardware',
        'Responsive clinician web UI with Grad-CAM heatmap visualization',
        'Final academic project report and IEEE-format paper draft',
      ],
      submittedAt: new Date(Date.now() - 4 * 86400000).toISOString(),
      status: 'Approved',
      staffFeedback:
        'Comprehensive methodology and appropriate dataset choice. Focus early on edge latency metrics and false-negative minimization.',
      reviewedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    },
    milestones: [
      {
        id: 'ms_retina_1',
        projectId: 'proj_ai_retina_active',
        title: 'Milestone 1: Dataset Pipeline & Baseline Model',
        description:
          'Set up verified training pipeline, implement data augmentation (flips, rotations, CLAHE illumination adjustment), and train baseline ResNet-50 benchmark.',
        dueDate: '2026-11-05',
        order: 1,
        status: 'Approved',
        submissions: [
          {
            id: 'sub_retina_1',
            milestoneId: 'ms_retina_1',
            submittedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
            summary:
              'Completed pipeline for APTOS 2019. Achieved 87.4% quadratic weighted kappa on 5-fold validation. Pipeline notebook and verification metrics attached.',
            repoUrl: 'https://github.com/projectconnect-lab/edgeretina-baseline',
            fileName: 'milestone1_metrics_report.pdf',
            fileSize: 420000,
            status: 'Approved',
            staffFeedback:
              'Great progress on the baseline kappa score. Proceed to quantization experiments.',
            reviewedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
            revisionCount: 0,
          },
        ],
      },
      {
        id: 'ms_retina_2',
        projectId: 'proj_ai_retina_active',
        title: 'Milestone 2: INT8 Quantization & Latency Profiling',
        description:
          'Quantize trained weights to INT8, benchmark inference latency on edge device target, and ensure accuracy degradation remains under 2.5%.',
        dueDate: '2026-11-20',
        order: 2,
        status: 'Pending',
        submissions: [],
      },
      {
        id: 'ms_retina_3',
        projectId: 'proj_ai_retina_active',
        title: 'Milestone 3: Web Dashboard & Final Defense',
        description:
          'Build intuitive clinician triage web UI, integrate Grad-CAM explanations, package container, and deliver final thesis defense presentation.',
        dueDate: '2026-12-10',
        order: 3,
        status: 'Pending',
        submissions: [],
      },
    ],
    status: 'In Progress',
    progressPercent: 33, // 1 of 3 approved
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
];

// Helper to safely load data
function getStored<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw) as T;
  } catch (e) {
    console.error(`Error reading ${key} from storage:`, e);
    return defaultValue;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error writing ${key} to storage:`, e);
  }
}

/**
 * Storage Engine API
 */
export const StorageEngine = {
  // Database Initializer (Ensures seeded data exists)
  async initialize(): Promise<void> {
    const existingUsers = getStored<(StudentProfile | StaffProfile)[]>(STORAGE_KEYS.USERS, []);
    if (existingUsers.length === 0) {
      // Hash seed passwords
      const studentPassHash = await hashPassword('Student123!');
      const staffPassHash = await hashPassword('Faculty123!');

      const studentWithHash: StudentProfile = {
        ...INITIAL_STUDENT,
        passwordHash: studentPassHash,
      };

      const staffWithHash: StaffProfile = {
        ...INITIAL_STAFF,
        passwordHash: staffPassHash,
      };

      setStored(STORAGE_KEYS.USERS, [studentWithHash, staffWithHash]);
    }

    if (!localStorage.getItem(STORAGE_KEYS.PROBLEMS)) {
      setStored(STORAGE_KEYS.PROBLEMS, INITIAL_PROBLEMS);
    }

    if (!localStorage.getItem(STORAGE_KEYS.REQUESTS)) {
      setStored(STORAGE_KEYS.REQUESTS, INITIAL_REQUESTS);
    }

    if (!localStorage.getItem(STORAGE_KEYS.PROJECTS)) {
      setStored(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
    }

    if (!localStorage.getItem(STORAGE_KEYS.DOMAINS)) {
      setStored(STORAGE_KEYS.DOMAINS, INITIAL_DOMAINS);
    }
  },

  // USERS
  getUsers(): (StudentProfile | StaffProfile)[] {
    return getStored<(StudentProfile | StaffProfile)[]>(STORAGE_KEYS.USERS, []);
  },

  getUserById(id: string): StudentProfile | StaffProfile | undefined {
    return this.getUsers().find((u) => u.id === id);
  },

  getUserByEmail(email: string): StudentProfile | StaffProfile | undefined {
    return this.getUsers().find((u) => u.email.toLowerCase().trim() === email.toLowerCase().trim());
  },

  saveUser(user: StudentProfile | StaffProfile): void {
    const users = this.getUsers();
    const idx = users.findIndex((u) => u.id === user.id);
    if (idx >= 0) {
      users[idx] = { ...user, updatedAt: new Date().toISOString() };
    } else {
      users.push(user);
    }
    setStored(STORAGE_KEYS.USERS, users);
  },

  // SESSION
  getCurrentUserId(): string | null {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
  },

  setCurrentUserId(id: string | null): void {
    if (id) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, id);
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
    }
  },

  // DOMAINS
  getDomains(): string[] {
    return getStored<string[]>(STORAGE_KEYS.DOMAINS, INITIAL_DOMAINS);
  },

  addDomain(newDomain: string): boolean {
    const trimmed = newDomain.trim();
    if (!trimmed) return false;
    const domains = this.getDomains();
    if (domains.some((d) => d.toLowerCase() === trimmed.toLowerCase())) return false;
    domains.push(trimmed);
    setStored(STORAGE_KEYS.DOMAINS, domains);
    return true;
  },

  // PROBLEMS
  getProblems(): ProjectProblem[] {
    return getStored<ProjectProblem[]>(STORAGE_KEYS.PROBLEMS, INITIAL_PROBLEMS);
  },

  getProblemById(id: string): ProjectProblem | undefined {
    return this.getProblems().find((p) => p.id === id);
  },

  saveProblem(problem: ProjectProblem): void {
    const problems = this.getProblems();
    const idx = problems.findIndex((p) => p.id === problem.id);
    if (idx >= 0) {
      problems[idx] = { ...problem, updatedAt: new Date().toISOString() };
    } else {
      problems.unshift(problem);
    }
    setStored(STORAGE_KEYS.PROBLEMS, problems);
  },

  deleteProblem(id: string): void {
    const problems = this.getProblems().filter((p) => p.id !== id);
    setStored(STORAGE_KEYS.PROBLEMS, problems);
  },

  // REQUESTS
  getRequests(): ProjectRequest[] {
    return getStored<ProjectRequest[]>(STORAGE_KEYS.REQUESTS, INITIAL_REQUESTS);
  },

  getRequestsByStudent(studentId: string): ProjectRequest[] {
    return this.getRequests().filter((r) => r.studentId === studentId);
  },

  getRequestsByStaff(staffId: string): ProjectRequest[] {
    return this.getRequests().filter((r) => r.staffId === staffId);
  },

  saveRequest(req: ProjectRequest): void {
    const requests = this.getRequests();
    const idx = requests.findIndex((r) => r.id === req.id);
    if (idx >= 0) {
      requests[idx] = { ...req, updatedAt: new Date().toISOString() };
    } else {
      requests.unshift(req);
    }
    setStored(STORAGE_KEYS.REQUESTS, requests);
  },

  updateRequestStatus(
    requestId: string,
    status: 'Approved' | 'Declined',
    staffNote?: string
  ): ProjectRequest | null {
    const requests = this.getRequests();
    const req = requests.find((r) => r.id === requestId);
    if (!req) return null;

    req.status = status;
    req.staffNote = staffNote || req.staffNote;
    req.updatedAt = new Date().toISOString();
    setStored(STORAGE_KEYS.REQUESTS, requests);

    // If approved, verify if active project already exists; if not, create one in "Proposal Needed" state
    if (status === 'Approved') {
      const projects = this.getProjects();
      const existing = projects.find(
        (p) => p.problemId === req.problemId && p.studentLeaderId === req.studentId
      );
      if (!existing) {
        const problem = this.getProblemById(req.problemId);
        const newProj: ActiveProject = {
          id: `proj_${Date.now()}`,
          problemId: req.problemId,
          title: req.problemTitle,
          domain: req.domain,
          staffId: req.staffId,
          staffName: problem?.staffName || 'Staff Mentor',
          studentLeaderId: req.studentId,
          studentLeaderName: req.studentName,
          team: [
            {
              id: req.studentId,
              name: req.studentName,
              email: (this.getUserById(req.studentId) as StudentProfile)?.email || '',
              role: 'Leader',
              department: req.studentDepartment,
              rollNumber: (this.getUserById(req.studentId) as StudentProfile)?.rollNumber || '',
            },
          ],
          milestones: [
            {
              id: `ms_${Date.now()}_1`,
              projectId: `proj_${Date.now()}`,
              title: 'Milestone 1: Architecture & Dataset Blueprint',
              description:
                'Formulate detailed system architectural schematic, collect/clean domain dataset, and implement initial baseline.',
              dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
              order: 1,
              status: 'Pending',
              submissions: [],
            },
          ],
          status: 'Proposal Needed',
          progressPercent: 0,
          createdAt: new Date().toISOString(),
        };
        projects.unshift(newProj);
        setStored(STORAGE_KEYS.PROJECTS, projects);
      }
    }

    return req;
  },

  // PROJECTS
  getProjects(): ActiveProject[] {
    return getStored<ActiveProject[]>(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
  },

  getProjectById(id: string): ActiveProject | undefined {
    return this.getProjects().find((p) => p.id === id);
  },

  getProjectsForStudent(studentId: string): ActiveProject[] {
    return this.getProjects().filter(
      (p) =>
        p.studentLeaderId === studentId || p.team.some((member) => member.id === studentId)
    );
  },

  getProjectsForStaff(staffId: string): ActiveProject[] {
    return this.getProjects().filter((p) => p.staffId === staffId);
  },

  saveProject(project: ActiveProject): void {
    const projects = this.getProjects();
    const idx = projects.findIndex((p) => p.id === project.id);

    // Calculate progressPercent
    const totalMilestones = project.milestones.length;
    const approvedMilestones = project.milestones.filter((m) => m.status === 'Approved').length;
    project.progressPercent =
      totalMilestones > 0 ? Math.round((approvedMilestones / totalMilestones) * 100) : 0;

    if (totalMilestones > 0 && approvedMilestones === totalMilestones) {
      project.status = 'Completed';
      if (!project.completedAt) project.completedAt = new Date().toISOString();
    } else if (project.proposal?.status === 'Approved' && project.status !== 'Completed') {
      project.status = 'In Progress';
    }

    if (idx >= 0) {
      projects[idx] = project;
    } else {
      projects.unshift(project);
    }
    setStored(STORAGE_KEYS.PROJECTS, projects);
  },

  // TEAM MANAGEMENT
  addTeamMember(projectId: string, member: TeamMember): boolean {
    const proj = this.getProjectById(projectId);
    if (!proj) return false;
    const exists = proj.team.some(
      (m) => m.email.toLowerCase() === member.email.toLowerCase() || m.id === member.id
    );
    if (exists) return false;
    proj.team.push(member);
    this.saveProject(proj);
    return true;
  },

  removeTeamMember(projectId: string, memberId: string): boolean {
    const proj = this.getProjectById(projectId);
    if (!proj) return false;
    if (proj.studentLeaderId === memberId) return false; // Cannot remove leader
    proj.team = proj.team.filter((m) => m.id !== memberId);
    this.saveProject(proj);
    return true;
  },

  // PROPOSALS
  submitProposal(projectId: string, proposal: ProjectProposal): void {
    const proj = this.getProjectById(projectId);
    if (!proj) return;
    proj.proposal = proposal;
    proj.status = 'In Progress';
    this.saveProject(proj);
  },

  reviewProposal(
    projectId: string,
    status: 'Approved' | 'Needs Revision',
    staffFeedback: string
  ): void {
    const proj = this.getProjectById(projectId);
    if (!proj || !proj.proposal) return;
    proj.proposal.status = status;
    proj.proposal.staffFeedback = staffFeedback;
    proj.proposal.reviewedAt = new Date().toISOString();
    if (status === 'Approved') {
      proj.status = 'In Progress';
    } else {
      proj.status = 'Needs Revision';
    }
    this.saveProject(proj);
  },

  // MILESTONES
  addMilestone(projectId: string, milestone: Omit<Milestone, 'id' | 'status' | 'submissions'>): void {
    const proj = this.getProjectById(projectId);
    if (!proj) return;
    const newMs: Milestone = {
      ...milestone,
      id: `ms_${Date.now()}`,
      status: 'Pending',
      submissions: [],
    };
    proj.milestones.push(newMs);
    this.saveProject(proj);
  },

  submitMilestoneWork(projectId: string, milestoneId: string, submission: MilestoneSubmission): void {
    const proj = this.getProjectById(projectId);
    if (!proj) return;
    const ms = proj.milestones.find((m) => m.id === milestoneId);
    if (!ms) return;

    ms.status = 'Submitted';
    ms.submissions.unshift(submission);
    this.saveProject(proj);
  },

  reviewMilestoneSubmission(
    projectId: string,
    milestoneId: string,
    submissionId: string,
    status: 'Approved' | 'Needs Revision',
    feedback: string
  ): void {
    const proj = this.getProjectById(projectId);
    if (!proj) return;
    const ms = proj.milestones.find((m) => m.id === milestoneId);
    if (!ms) return;

    const sub = ms.submissions.find((s) => s.id === submissionId);
    if (sub) {
      sub.status = status;
      sub.staffFeedback = feedback;
      sub.reviewedAt = new Date().toISOString();
    }

    ms.status = status;
    if (status === 'Needs Revision') {
      proj.status = 'Needs Revision';
    }
    this.saveProject(proj);
  },

  // RESET TO FACTORY SEED DATA
  async resetAllData(): Promise<void> {
    localStorage.removeItem(STORAGE_KEYS.USERS);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
    localStorage.removeItem(STORAGE_KEYS.PROBLEMS);
    localStorage.removeItem(STORAGE_KEYS.REQUESTS);
    localStorage.removeItem(STORAGE_KEYS.PROJECTS);
    localStorage.removeItem(STORAGE_KEYS.DOMAINS);
    await this.initialize();
  },
};
