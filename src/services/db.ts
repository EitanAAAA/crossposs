import { User, VideoRecord } from '../../types';

// @ts-ignore
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const apiCall = async <T>(endpoint: string, options?: RequestInit): Promise<T> => {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: response.statusText }));
      throw new Error(errorData.error || `API call failed: ${response.statusText}`);
    }
    return response.json();
  } catch (error: any) {
    if (error.message.includes('fetch')) {
      throw new Error('Cannot connect to server. Make sure the backend is running on port 3000.');
    }
    throw error;
  }
};

export const db = {
  getUsers: async (): Promise<User[]> => {
    try {
      return await apiCall<User[]>('/users');
    } catch {
      return [];
    }
  },

  saveUser: async (user: User | Omit<User, 'id'>): Promise<User> => {
    return await apiCall<User>('/users', {
      method: 'POST',
      body: JSON.stringify(user),
    });
  },

  findUserByEmail: async (email: string): Promise<User | undefined> => {
    try {
      return await apiCall<User>(`/users/email/${encodeURIComponent(email)}`);
    } catch {
      return undefined;
    }
  },

  getVideos: async (userId: string): Promise<VideoRecord[]> => {
    try {
      return await apiCall<VideoRecord[]>(`/videos/${userId}`);
    } catch {
      return [];
    }
  },

  saveVideo: async (userId: string, video: VideoRecord): Promise<void> => {
    await apiCall(`/videos/${userId}`, {
      method: 'POST',
      body: JSON.stringify(video),
    });
  },

  updateUser: async (userId: string, updates: Partial<User>): Promise<User> => {
    return await apiCall<User>(`/users/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }
};
