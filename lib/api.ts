import {
  UserDTO,
  GroupDTO,
  CreateGroupRequest,
  AdminPresentResponse,
  MobilePresentResponse,
  PresentUpdateRequest,
  ErrorResponse,
} from './types';

// Use the proxy server running on localhost:3001
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorData: ErrorResponse | null = null;
    try {
      errorData = await response.json();
    } catch (e) {
      // Failed to parse error response
    }
    
    throw new ApiError(
      response.status,
      errorData?.code || 'UNKNOWN_ERROR',
      errorData?.message || `HTTP ${response.status}: ${response.statusText}`
    );
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return null as T;
  }

  return response.json();
}

// User API
export const userApi = {
  getCurrentUser: async (): Promise<UserDTO> => {
    const response = await fetch(`${API_BASE_URL}/users/me`);
    return handleResponse<UserDTO>(response);
  },

  getUserById: async (id: number): Promise<UserDTO> => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`);
    return handleResponse<UserDTO>(response);
  },

  createUser: async (user: UserDTO): Promise<UserDTO> => {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });
    return handleResponse<UserDTO>(response);
  },

  updateUser: async (id: number, user: UserDTO): Promise<UserDTO> => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });
    return handleResponse<UserDTO>(response);
  },

  deleteUser: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'DELETE',
    });
    return handleResponse<void>(response);
  },
};

// Group API
export const groupApi = {
  getAvailableGroups: async (): Promise<GroupDTO[]> => {
    const response = await fetch(`${API_BASE_URL}/groups`);
    return handleResponse<GroupDTO[]>(response);
  },

  getGroupById: async (id: number): Promise<GroupDTO> => {
    const response = await fetch(`${API_BASE_URL}/groups/${id}`);
    return handleResponse<GroupDTO>(response);
  },

  createGroup: async (group: CreateGroupRequest): Promise<GroupDTO> => {
    const response = await fetch(`${API_BASE_URL}/groups`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(group),
    });
    return handleResponse<GroupDTO>(response);
  },

  updateGroup: async (id: number, group: GroupDTO): Promise<GroupDTO> => {
    const response = await fetch(`${API_BASE_URL}/groups/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(group),
    });
    return handleResponse<GroupDTO>(response);
  },

  deleteGroup: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/groups/${id}`, {
      method: 'DELETE',
    });
    return handleResponse<void>(response);
  },

  addStudentToGroup: async (groupId: number, studentId: number): Promise<GroupDTO> => {
    const response = await fetch(
      `${API_BASE_URL}/groups/${groupId}/students/${studentId}`,
      { method: 'POST' }
    );
    return handleResponse<GroupDTO>(response);
  },

  removeStudentFromGroup: async (groupId: number, studentId: number): Promise<GroupDTO> => {
    const response = await fetch(
      `${API_BASE_URL}/groups/${groupId}/students/${studentId}`,
      { method: 'DELETE' }
    );
    return handleResponse<GroupDTO>(response);
  },
};

// Present API
export const presentApi = {
  getPresents: async (page = 0, size = 20): Promise<MobilePresentResponse[]> => {
    const response = await fetch(`${API_BASE_URL}/presents?page=${page}&size=${size}`);
    return handleResponse<MobilePresentResponse[]>(response);
  },

  getPresent: async (id: number): Promise<AdminPresentResponse> => {
    const response = await fetch(`${API_BASE_URL}/presents/${id}`);
    return handleResponse<AdminPresentResponse>(response);
  },

  searchPresents: async (query: string): Promise<MobilePresentResponse[]> => {
    const response = await fetch(`${API_BASE_URL}/presents/search?query=${encodeURIComponent(query)}`);
    return handleResponse<MobilePresentResponse[]>(response);
  },

  createPresent: async (
    name: string,
    priceCoins: number,
    stock: number,
    photos: File[]
  ): Promise<AdminPresentResponse> => {
    const formData = new FormData();
    photos.forEach((photo) => formData.append('photos', photo));

    const response = await fetch(
      `${API_BASE_URL}/presents?name=${encodeURIComponent(name)}&priceCoins=${priceCoins}&stock=${stock}`,
      {
        method: 'POST',
        body: formData,
      }
    );
    return handleResponse<AdminPresentResponse>(response);
  },

  updatePresent: async (id: number, update: PresentUpdateRequest): Promise<AdminPresentResponse> => {
    const response = await fetch(`${API_BASE_URL}/presents/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(update),
    });
    return handleResponse<AdminPresentResponse>(response);
  },

  deletePresent: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/presents/${id}`, {
      method: 'DELETE',
    });
    return handleResponse<void>(response);
  },

  addPhotos: async (presentId: number, photos: File[]): Promise<AdminPresentResponse> => {
    const formData = new FormData();
    photos.forEach((photo) => formData.append('photos', photo));

    const response = await fetch(`${API_BASE_URL}/presents/${presentId}/photos`, {
      method: 'POST',
      body: formData,
    });
    return handleResponse<AdminPresentResponse>(response);
  },

  deletePhoto: async (presentId: number, photoId: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/presents/${presentId}/photos/${photoId}`, {
      method: 'DELETE',
    });
    return handleResponse<void>(response);
  },

  getPhotoUrl: (presentId: number, photoId: number): string => {
    return `${API_BASE_URL}/presents/${presentId}/photos/${photoId}`;
  },
};

export { ApiError };
