const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export interface LoginData {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
}

export interface Achievement {
  id: number;
  title: string;
  type: string;
  organization: string;
  date: string;
  status: "Pending" | "Approved" | "Rejected";
  description?: string;
  skills?: string[];
  feedback?: string;
}

export interface Student {
  id: number;
  name: string;
  roll_no: string;
  email: string;
  phone?: string;
  year: string;
  attendance: number;
  achievements_count: number;
  department?: number;
  status: string;
}

class ApiClient {
  private token: string | null = null;

  constructor() {
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("authToken");
    }
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== "undefined") {
      localStorage.setItem("authToken", token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("authToken");
    }
  }

  getToken() {
    return this.token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers.Authorization = `Token ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      let data;
      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}`;
        
        if (data.detail) {
          errorMessage = data.detail;
        } else if (data.message) {
          errorMessage = data.message;
        } else if (data.error) {
          errorMessage = data.error;
        } else if (data.non_field_errors && Array.isArray(data.non_field_errors)) {
          errorMessage = data.non_field_errors.join(', ');
        } else if (typeof data === 'object' && data !== null) {
          // Handle field-specific errors
          const fieldErrors = Object.values(data).flat().filter(Boolean);
          if (fieldErrors.length > 0) {
            errorMessage = fieldErrors.join(', ');
          }
        }

        return {
          error: errorMessage,
        };
      }

      return { data };
    } catch (error) {
      console.error("API request failed:", error);
      return { error: "Network error - please check your connection" };
    }
  }

  // Authentication
  async login(credentials: LoginData): Promise<ApiResponse<{ token: string; message: string }>> {
    const response = await this.request<{ token: string; message: string }>("/user/login/", {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    if (response.data?.token) {
      this.setToken(response.data.token);
    }

    return response;
  }

  async register(userData: RegisterData): Promise<ApiResponse<{ message: string }>> {
    return this.request("/user/register/", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async logout() {
    this.clearToken();
  }

  // Students
  async getStudents(): Promise<ApiResponse<Student[]>> {
    return this.request("/students/");
  }

  async getStudent(id: number): Promise<ApiResponse<Student>> {
    return this.request(`/students/${id}/`);
  }

  async createStudent(student: Partial<Student>): Promise<ApiResponse<Student>> {
    return this.request("/students/", {
      method: "POST",
      body: JSON.stringify(student),
    });
  }

  async updateStudent(id: number, student: Partial<Student>): Promise<ApiResponse<Student>> {
    return this.request(`/students/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(student),
    });
  }

  async deleteStudent(id: number): Promise<ApiResponse> {
    return this.request(`/students/${id}/`, {
      method: "DELETE",
    });
  }

  // Achievements
  async getAchievements(): Promise<ApiResponse<Achievement[]>> {
    return this.request("/achievement/");
  }

  async getAchievement(id: number): Promise<ApiResponse<Achievement>> {
    return this.request(`/achievement/${id}/`);
  }

  async createAchievement(achievement: Partial<Achievement>): Promise<ApiResponse<Achievement>> {
    return this.request("/achievement/", {
      method: "POST",
      body: JSON.stringify(achievement),
    });
  }

  async updateAchievement(id: number, achievement: Partial<Achievement>): Promise<ApiResponse<Achievement>> {
    return this.request(`/achievement/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(achievement),
    });
  }

  async deleteAchievement(id: number): Promise<ApiResponse> {
    return this.request(`/achievement/${id}/`, {
      method: "DELETE",
    });
  }

  // Departments
  async getDepartments(): Promise<ApiResponse> {
    return this.request("/department/");
  }

  // Faculty
  async getFaculty(): Promise<ApiResponse> {
    return this.request("/faculty/");
  }

  // Academic Records
  async getAcademicRecords(): Promise<ApiResponse> {
    return this.request("/acadamics/");
  }

  // Portfolios
  async getPortfolios(): Promise<ApiResponse> {
    return this.request("/portfolio/");
  }

  // Tickets
  async getTickets(): Promise<ApiResponse> {
    return this.request("/ticket/");
  }

  async createTicket(ticket: any): Promise<ApiResponse> {
    return this.request("/ticket/", {
      method: "POST",
      body: JSON.stringify(ticket),
    });
  }
}

export const apiClient = new ApiClient();