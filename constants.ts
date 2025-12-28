import { Project } from './types';

export const INITIAL_PROJECTS: Project[] = [
  {
    id: '1',
    name: 'Website Redesign',
    description: 'Overhaul the company website with new branding.',
    status: 'Active',
    memberIds: ['1', '2'],
    dueDate: '2023-12-31',
    notes: [],
  },
  {
    id: '2',
    name: 'Mobile App Launch',
    description: 'Launch the new mobile application for iOS and Android.',
    status: 'Planning',
    memberIds: ['3'],
    dueDate: '2024-03-15',
    notes: [],
  },
  {
    id: '3',
    name: 'Internal Audit',
    description: 'Conduct an internal financial audit.',
    status: 'Completed',
    memberIds: ['1'],
    dueDate: '2023-10-01',
    notes: [],
  },
];

export const AVAILABLE_ROLES = [
  'Software Engineer',
  'Product Manager',
  'Designer',
  'Data Scientist',
  'Marketing Specialist',
  'Sales Representative',
  'HR Manager',
];

export const TEAM_COLORS = [
  '#3b82f6', // blue-500
  '#10b981', // emerald-500
  '#f59e0b', // amber-500
  '#ef4444', // red-500
  '#8b5cf6', // violet-500
  '#ec4899', // pink-500
  '#06b6d4', // cyan-500
];

export const MOCK_AVATAR_BASE = 'https://ui-avatars.com/api/?background=random&name=';
