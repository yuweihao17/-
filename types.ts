export enum Role {
  ADMIN = 'Administrator',
  MANAGER = 'Dorm Manager',
  STUDENT = 'Student',
}

export interface User {
  id: string;
  name: string;
  role: Role;
  dormId?: string; // For Dorm Managers
  studentId?: string; // For students
}

export interface DormBuilding {
  id: string;
  name: string;
}

export interface Room {
  id: string;
  number: string;
  buildingId: string;
  capacity: number;
  occupants: string[]; // array of student IDs
}

export interface Student {
  id: string;
  name: string;
  studentId: string;
  gender: 'Male' | 'Female';
  class: string;
  roomId?: string;
  buildingId?: string;
}

export enum RepairStatus {
  PENDING = 'Pending',
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed',
}

export interface RepairRequest {
  id: string;
  studentId: string;
  roomId: string;
  buildingId: string;
  description: string;
  status: RepairStatus;
  submittedAt: string;
}

export interface HygieneCheck {
  id: string;
  roomId: string;
  buildingId: string;
  score: number;
  notes: string;
  date: string;
}

export interface Visitor {
  id: string;
  name: string;
  idNumber: string;
  studentToVisitId: string;
  checkInTime: string;
  checkOutTime?: string;
}

export type RoomWithDetails = Room & {
    buildingName: string;
    occupantNames: string[];
};