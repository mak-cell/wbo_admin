/**
 * Design System Types and Interfaces
 */

export enum Role {
  ADMIN = "Admin",
  SHOOTER = "Shooter",
  EDITOR = "Editor",
}

export enum ProjectStatus {
  PENDING = "Pending",
  IN_PROGRESS = "In Progress",
  REVIEW = "Review",
  DELIVERED = "Delivered",
  COMPLETED = "Completed",
}

export interface User {
  id: number;
  name: string;
  contact: string;
  role: Role;
}

export interface Event {
  id: number;
  project_id: number;
  event_type: string;
  event_date: string;
}

export interface Deliverable {
  id: number;
  project_id: number;
  category: string;
  description?: string;
  details?: Record<string, any>;
  status: ProjectStatus;
  due_date?: string;
}

export interface Payment {
  id: number;
  project_id: number;
  milestone: string;
  amount: number;
  is_paid: boolean;
}

export interface TaskAssignment {
  id: number;
  worker_id: number;
  project_id: number;
  event_id?: number;
  deliverable_id?: number;
  task_description: string;
  status: ProjectStatus;
}

export interface Project {
  id: number;
  client_name: string;
  event_title: string;
  location: string;
  contact_number: string;
  instagram_reference?: string;
  total_budget: number;
  status: ProjectStatus;
  events: Event[];
  deliverables: Deliverable[];
  payments: Payment[];
}

export interface CalendarEvent {
  event_id: number;
  project_id: number;
  title: string;
  event_type: string;
  date: string;
  location: string;
  client_name: string;
  status: ProjectStatus;
  assigned_workers: string[];
  source: "event" | "deliverable";
}

export interface DashboardSummary {
  total_projects: number;
  active_projects: number;
  total_revenue: number;
  pending_payments: number;
  completed_deliverables: number;
}
