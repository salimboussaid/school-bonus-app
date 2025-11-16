// API Types based on OpenAPI schema

export interface ErrorResponse {
  code: string;
  message: string;
  timestamp: string;
}

export type UserRole = 'ADMIN' | 'TEACHER' | 'STUDENT';

export interface UserDTO {
  id?: number;
  login: string;
  password?: string;
  role: UserRole;
  first_name: string;
  last_name: string;
  middle_name?: string;
  full_name?: string;
  email: string;
  date_of_birth: string;
  coins?: number;
}

export interface PhotoResponse {
  id: number;
}

export interface AdminPresentResponse {
  id: number;
  name: string;
  priceCoins: number;
  stock: number;
  photos: PhotoResponse[];
}

export interface MobilePresentResponse {
  id: number;
  name: string;
  priceCoins: number;
  stock: number;
  photoIds: number[];
}

export interface PresentUpdateRequest {
  name?: string;
  priceCoins?: number;
  stock?: number;
}

export interface GroupDTO {
  id?: number;
  group_name: string;
  teacher_id?: number;
  teacher?: UserDTO;
  students?: UserDTO[];
}

export interface CreateGroupRequest {
  group_name: string;
  teacher_id: number;
}
