import { DomainMeta } from '../types';

export const AZ900_DOMAINS: Record<string, DomainMeta> = {
  'cloud-concepts': {
    id: 'cloud-concepts',
    name: 'Cloud Concepts',
    weightRange: '25–30%',
    description: 'Cloud models (IaaS, PaaS, SaaS), shared responsibility, CapEx vs OpEx, high availability, elasticity, and disaster recovery.',
    targetCount: 10,
    color: '#0F52BA', // Rich Azure Cobalt
    accentBg: '#EEF4FF',
  },
  'architecture-services': {
    id: 'architecture-services',
    name: 'Azure Architecture & Services',
    weightRange: '35–40%',
    description: 'Regions, Availability Zones, Resource Groups, Virtual Machines, Containers, Storage redundancy, Virtual Networks, and ExpressRoute.',
    targetCount: 11,
    color: '#1D7A58', // Muted Sage Mint
    accentBg: '#ECF6F1',
  },
  'management-governance': {
    id: 'management-governance',
    name: 'Azure Management & Governance',
    weightRange: '30–35%',
    description: 'Cost Management & TCO, Microsoft Entra ID, RBAC, Zero Trust, Azure Policy, Resource Locks, Defender for Cloud, and Azure Monitor.',
    targetCount: 9,
    color: '#634A99', // Refined Slate Violet
    accentBg: '#F4EFFB',
  },
};

export const DOMAIN_LIST = Object.values(AZ900_DOMAINS);
