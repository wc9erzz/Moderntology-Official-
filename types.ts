export interface User {
  id: string; // UUID
  unique_id?: number; // Integer ID for hierarchy
  email?: string;
  name: string;
  role: string;
  reportsTo: string | null; // ID of the manager
  avatarUrl?: string;
  subscription_type?: 'x' | 'standard' | 'incomplete' | 'business';
  business_position?: 'ceo' | 'manager' | 'employee' | 'director' | 'supervisor' | 'consultant' | 'contractor';
  is_account_holder?: boolean;
  business_id?: number;
}

export interface Note {
  id: string;
  text: string;
  createdAt: string;
  authorName: string; // Simplified for demo
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'Active' | 'Planning' | 'Completed';
  memberIds: string[];
  dueDate: string;
  notes: Note[];
}

export enum ViewState {
  HUB = 'HUB',
  HIERARCHY = 'HIERARCHY',
  PROJECTS = 'PROJECTS'
}

export interface ChartData {
  name: string;
  value: number;
}

export type UserMode = 'MANAGER' | 'EMPLOYEE';