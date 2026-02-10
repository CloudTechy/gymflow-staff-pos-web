import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import type { ApiResponse, Product, Sale, ShiftSession, Staff } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.code === 'ECONNABORTED' || !error.response) {
          console.warn('Network error detected, switching to offline mode');
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async login(username: string, password: string): Promise<ApiResponse<{ token: string; staff: Staff }>> {
    try {
      const response = await this.client.post('/auth/login', { username, password });
      return { success: true, data: response.data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async logout(): Promise<ApiResponse<void>> {
    try {
      await this.client.post('/auth/logout');
      localStorage.removeItem('authToken');
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // Product endpoints
  async getProducts(): Promise<ApiResponse<Product[]>> {
    try {
      const response = await this.client.get('/products');
      return { success: true, data: response.data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async getProduct(id: string): Promise<ApiResponse<Product>> {
    try {
      const response = await this.client.get(`/products/${id}`);
      return { success: true, data: response.data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // Sale endpoints
  async createSale(sale: Omit<Sale, 'id' | 'createdAt'>): Promise<ApiResponse<Sale>> {
    try {
      const response = await this.client.post('/sales', sale);
      return { success: true, data: response.data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async getSales(params?: { startDate?: string; endDate?: string; shiftId?: string }): Promise<ApiResponse<Sale[]>> {
    try {
      const response = await this.client.get('/sales', { params });
      return { success: true, data: response.data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // Shift endpoints
  async startShift(data: { staffId: string; startingCash: number }): Promise<ApiResponse<ShiftSession>> {
    try {
      const response = await this.client.post('/shifts/start', data);
      return { success: true, data: response.data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async endShift(shiftId: string, data: { endingCash: number }): Promise<ApiResponse<ShiftSession>> {
    try {
      const response = await this.client.post(`/shifts/${shiftId}/end`, data);
      return { success: true, data: response.data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async getActiveShift(staffId: string): Promise<ApiResponse<ShiftSession>> {
    try {
      const response = await this.client.get(`/shifts/active/${staffId}`);
      return { success: true, data: response.data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      await this.client.get('/health');
      return true;
    } catch {
      return false;
    }
  }
}

export const apiClient = new ApiClient();
