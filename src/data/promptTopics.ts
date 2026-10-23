import { PromptTopic, PromptLevel, PromptMethod } from '../types';

export const PROMPT_TOPICS: PromptTopic[] = [
  {
    id: 'shared-responsibility',
    domainId: 'cloud-concepts',
    name: 'Shared Responsibility Model',
    description: 'Understand who manages what across On-Premises, IaaS, PaaS, and SaaS, especially data & identity.',
    keyConcepts: ['Data & Identity ownership', 'Guest OS patching', 'Physical security', 'SaaS vs IaaS boundaries'],
  },
  {
    id: 'capex-opex',
    domainId: 'cloud-concepts',
    name: 'Cloud Economics (CapEx vs OpEx)',
    description: 'Financial principles of cloud computing, pay-as-you-go consumption, and asset depreciation.',
    keyConcepts: ['Upfront capital outlays', 'Operational expenses', 'Tax deduction timing', 'Consumption billing'],
  },
  {
    id: 'regions-zones',
    domainId: 'architecture-services',
    name: 'Regions & Availability Zones',
    description: 'Geographic and physical infrastructure: Data centers, availability zones, latency, and region pairs.',
    keyConcepts: ['Datacenter physical isolation', 'Sub-millisecond zone latency', 'Region pairs (~300 miles)', 'Disaster recovery'],
  },
  {
    id: 'storage-redundancy',
    domainId: 'architecture-services',
    name: 'Azure Storage Redundancy (LRS, ZRS, GRS)',
    description: 'Replication tiers protecting blob, file, and disk data against datacenter and regional outages.',
    keyConcepts: ['LRS (single datacenter)', 'ZRS (3 availability zones)', 'GRS (secondary paired region)', 'RA-GRS read access'],
  },
  {
    id: 'vnet-peering',
    domainId: 'architecture-services',
    name: 'Azure Virtual Networks & Peering',
    description: 'Private network connectivity, IP addressing, private backbone routing, and hybrid VPNs.',
    keyConcepts: ['VNet Peering vs VPN Gateway', 'Microsoft backbone routing', 'Zero public internet exposure', 'ExpressRoute circuits'],
  },
  {
    id: 'entra-id-rbac',
    domainId: 'management-governance',
    name: 'Microsoft Entra ID & RBAC',
    description: 'Authentication vs Authorization, Multi-Factor Authentication (MFA), Conditional Access, and Role-Based Access Control.',
    keyConcepts: ['AuthN (who you are)', 'AuthZ (what you can do)', 'Least privilege access', 'Role assignments scope'],
  },
  {
    id: 'policy-locks',
    domainId: 'management-governance',
    name: 'Azure Policy vs Resource Locks',
    description: 'Resource compliance guardrails versus deletion prevention, and how they override RBAC.',
    keyConcepts: ['Azure Policy (guardrails & allowed SKUs)', 'CanNotDelete vs ReadOnly locks', 'Inheritance down hierarchy', 'Governance vs Authorization'],
  },
  {
    id: 'zero-trust',
    domainId: 'management-governance',
    name: 'Zero Trust Security Architecture',
    description: 'The three core pillars of Microsoft Zero Trust cybersecurity: Verify explicitly, least privilege, and assume breach.',
    keyConcepts: ['Verify explicitly', 'Use least privilege access', 'Assume breach', 'Micro-segmentation'],
  },
];

export const generateStudyPrompt = (
  topic: PromptTopic,
  level: PromptLevel,
  method: PromptMethod
): string => {
  const levelDescriptions: Record<PromptLevel, string> = {
    beginner: 'Assume I am a beginner with no prior cloud background. Avoid technical jargon without first defining it simply.',
    intermediate: 'Assume I understand general IT concepts (servers, networking, databases). Focus on Azure-specific architectural nuances.',
    'exam-revision': 'I am preparing specifically for the Microsoft AZ-900 exam. Highlight high-yield exam traps, memorization mnemonics, and official testable distinctions.',
  };

  const methodInstructions: Record<PromptMethod, string> = {
    analogy: 'Explain this concept using a vivid real-world non-technical analogy (e.g., renting an apartment, public utilities, or restaurant dining).',
    'step-by-step': 'Break this concept down into numbered, logical sequential steps, detailing exactly what happens from start to finish.',
    scenario: 'Frame your explanation around a realistic enterprise business scenario facing an operational decision or architectural trade-off.',
    comparison: 'Present a structured comparison table highlighting key differences, pros and cons, cost implications, and exact when-to-use-which criteria.',
  };

  return `You are a Principal Cloud Architect and Microsoft Certified Trainer specializing in Microsoft Azure Fundamentals (AZ-900).

Your task is to teach me: "${topic.name}".
Subject Scope: ${topic.description}
Key Concepts to cover: ${topic.keyConcepts.join(', ')}.

STUDENT PERSONA & DIFFICULTY LEVEL:
${levelDescriptions[level]}

LEARNING METHOD TO EMPLOY:
${methodInstructions[method]}

REQUIRED RESPONSE FORMAT:
1. Core Concept in 2 Sentences: State the fundamental rule.
2. The ${method === 'analogy' ? 'Real-World Analogy' : method === 'scenario' ? 'Enterprise Scenario' : method === 'comparison' ? 'Comparison Matrix' : 'Step-by-Step Breakdown'}: Detailed pedagogical explanation following the requested method.
3. AZ-900 Exam Trap to Watch Out For: Identify a common distractor trick that Microsoft tests on this topic.
4. Quick Self-Check Question: Provide 1 multiple-choice question with 4 options and the answer key hidden at the bottom.

Please produce a concise, memorable explanation aligned with official Microsoft Learn documentation.`;
};

export const getDeterministicSampleResponse = (
  topic: PromptTopic,
  level: PromptLevel,
  method: PromptMethod
): {
  headline: string;
  summary: string;
  mainBodyTitle: string;
  mainBodyContent: string[];
  examTrap: string;
  practiceQuestion: {
    question: string;
    options: string[];
    correct: string;
    explanation: string;
  };
} => {
  if (topic.id === 'shared-responsibility') {
    return {
      headline: 'The Shared Responsibility Model: Customer vs. Cloud Provider',
      summary: 'In cloud computing, security and operational tasks are divided: Microsoft handles infrastructure hardware, while the customer ALWAYS retains sole responsibility for their data, identities, and endpoints.',
      mainBodyTitle: method === 'analogy' ? 'The Real-World Analogy: Renting an Apartment' : 'Core Architecture Breakdown',
      mainBodyContent: [
        'On-Premises = Owning a house. You replace the roof, maintain the pipes, install the security cameras, and clean the living room.',
        'IaaS (Azure VMs) = Renting an unfurnished apartment. The landlord (Microsoft) fixes the exterior brickwork and hallway lights, but you buy the furniture and lock your own front door.',
        'PaaS (Azure SQL / App Service) = Staying in a furnished corporate rental. The landlord provides the furniture and utilities, but you still own the personal belongings and access keys.',
        'SaaS (Microsoft 365) = Staying at a luxury hotel. The hotel staff maintains everything from sheets to power, but you are still responsible for not leaving your wallet on the table.',
      ],
      examTrap: 'Exam Trap: Microsoft 365 (SaaS) is NOT 100% Microsoft\'s responsibility! Data classification, user credentials, and device security are NEVER transferred to Microsoft in any cloud model.',
      practiceQuestion: {
        question: 'Under the shared responsibility model, which item is ALWAYS the exclusive responsibility of the customer across all cloud models (IaaS, PaaS, and SaaS)?',
        options: [
          'A. Physical datacenter security',
          'B. Operating system security patches',
          'C. Data classification and user identities',
          'D. Hypervisor virtualization hosts',
        ],
        correct: 'C',
        explanation: 'Data and identities are always 100% customer responsibility, even in Software as a Service.',
      },
    };
  }

  // Default rich response
  return {
    headline: `${topic.name}: Azure Fundamentals Deep Dive`,
    summary: `Mastering ${topic.name} requires understanding how Azure balances operational automation, high availability, and customer control.`,
    mainBodyTitle: `${method.toUpperCase()} Analysis for ${level.toUpperCase()} level`,
    mainBodyContent: [
      `Key Principle: ${topic.description}`,
      `Critical Boundaries: ${topic.keyConcepts.slice(0, 2).join(' & ')} form the foundational rules tested on the AZ-900 exam.`,
      `Architectural Impact: Utilizing ${topic.name} allows organizations to achieve resiliency while adhering to the Well-Architected Framework pillars of Reliability and Security.`,
    ],
    examTrap: `Common Distractor: Expect Microsoft questions to test the exact operational boundary between customer responsibility and Azure automated platform features.`,
    practiceQuestion: {
      question: `Which statement accurately describes ${topic.name} according to official Microsoft Learn guidelines?`,
      options: [
        'A. It requires explicit customer management of physical hardware',
        'B. It is designed to provide automated, scalable cloud reliability aligned with Well-Architected principles',
        'C. It completely eliminates all operational expenditure (OpEx)',
        'D. It can only be deployed in a private on-premises datacenter',
      ],
      correct: 'B',
      explanation: 'Azure services deliver automated, resilient cloud capabilities adhering to official architecture standards.',
    },
  };
};
