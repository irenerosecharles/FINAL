
export enum UserRole {
  NORMAL = 'NORMAL',
  INSPECTOR = 'INSPECTOR'
}

export interface User {
  id: string;
  email: string;
  username: string;
  password?: string;
  role: UserRole;
  fullName: string;
  phoneNumber: string;
}

export enum RoomType {
  KITCHEN = 'Kitchen',
  BATHROOM = 'Bathroom',
  BEDROOM = 'Bedroom',
  LIVING_ROOM = 'Living Room',
  OTHER = 'Other'
}

export interface GroundingSource {
  uri: string;
  title: string;
}

export interface Defect {
  id: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  aiTag: string;
}

export interface RoomInspection {
  roomType: RoomType;
  findings: Defect[];
  riskScore: number;
  summary: string;
  completed: boolean;
  images: string[];
  groundingSources?: GroundingSource[];
}

export interface PropertyReport {
  id: string;
  propertyId: string;
  houseNumber: string;
  address: string;
  totalRiskScore: number;
  summary: string;
  rooms: RoomInspection[];
  inspectedBy: string;
  inspectionDate: string;
  isPublic: boolean;
  groundingSources?: GroundingSource[];
}

export interface PropertyRecord {
  id: string;
  houseNumber: string;
  address: string;
  ownerId: string;
  registeredDate: string;
  status: 'SAFE' | 'CONCERN' | 'CRITICAL' | 'UNAUDITED';
}

export interface AppState {
  currentUser: User | null;
  activeReport: PropertyReport | null;
}
