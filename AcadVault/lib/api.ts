// Real API Client - Connected to Next.js API Routes
export interface User {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role?: "student" | "faculty" | "admin";
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
  proofUrl?: string | null;
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
  cgpa?: number;
  branch?: string;
  mentor?: string;
  avatar?: string;
  lastActive?: string;
}

export interface Department {
  id: number;
  name: string;
  code: string;
  head?: string;
}

export interface Faculty {
  id: number;
  name: string;
  email: string;
  department: string;
  specialization: string;
  experience: number;
}

export interface AcademicRecord {
  id: number;
  student_id: number;
  semester: string;
  subject: string;
  credits: number;
  grade: string;
  marks: number;
}

export interface Portfolio {
  id: number;
  student_id: number;
  title: string;
  template: string;
  created_at: string;
  updated_at: string;
  public_url?: string;
}

export interface Ticket {
  id: number;
  title: string;
  description: string;
  priority: "Low" | "Medium" | "High";
  status: "Open" | "In Progress" | "Resolved" | "Closed";
  created_at: string;
  updated_at: string;
  category: string;
  assigned_to?: string;
}

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

class ApiClient {
  private token: string | null = null;
  private currentUser: User | null = null;

  constructor() {
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("authToken");
      const userData = localStorage.getItem("currentUser");
      if (userData) {
        try {
          this.currentUser = JSON.parse(userData);
        } catch {
          this.currentUser = null;
        }
      }
    }
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = { "Content-Type": "application/json" };
    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }
    return headers;
  }

  private async request<T>(url: string, options?: RequestInit): Promise<ApiResponse<T>> {
    try {
      const res = await fetch(url, {
        ...options,
        headers: { ...this.getHeaders(), ...options?.headers },
      });
      const json = await res.json();
      if (!res.ok) {
        return { error: json.error || `Request failed with status ${res.status}` };
      }
      return json;
    } catch (error) {
      console.error("API request error:", error);
      return { error: "Network error - please try again" };
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
    this.currentUser = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("authToken");
      localStorage.removeItem("currentUser");
    }
  }

  getToken() {
    return this.token;
  }

  getCurrentUser() {
    return this.currentUser;
  }

  // Authentication
  async login(credentials: LoginData): Promise<ApiResponse<{ token: string; message: string; user: User }>> {
    const result = await this.request<{ token: string; message: string; user: User }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    if (result.data?.token) {
      this.setToken(result.data.token);
      this.currentUser = result.data.user;
      if (typeof window !== "undefined") {
        localStorage.setItem("currentUser", JSON.stringify(result.data.user));
      }
    }

    return result;
  }

  async register(userData: RegisterData): Promise<ApiResponse<{ message: string }>> {
    return this.request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async logout() {
    this.clearToken();
  }

  async getMe(): Promise<ApiResponse<User>> {
    return this.request("/api/auth/me");
  }

  // Students
  async getStudents(): Promise<ApiResponse<Student[]>> {
    return this.request("/api/students");
  }

  async getStudent(id: number): Promise<ApiResponse<Student>> {
    return this.request(`/api/students/${id}`);
  }

  async createStudent(student: Partial<Student>): Promise<ApiResponse<Student>> {
    return this.request("/api/students", {
      method: "POST",
      body: JSON.stringify(student),
    });
  }

  async updateStudent(id: number, student: Partial<Student>): Promise<ApiResponse<Student>> {
    return this.request(`/api/students/${id}`, {
      method: "PUT",
      body: JSON.stringify(student),
    });
  }

  async deleteStudent(id: number): Promise<ApiResponse> {
    return this.request(`/api/students/${id}`, { method: "DELETE" });
  }

  // Achievements
  async getAchievements(): Promise<ApiResponse<Achievement[]>> {
    return this.request("/api/achievements");
  }

  async getAchievement(id: number): Promise<ApiResponse<Achievement>> {
    return this.request(`/api/achievements/${id}`);
  }

  async createAchievement(achievement: Partial<Achievement>): Promise<ApiResponse<Achievement>> {
    return this.request("/api/achievements", {
      method: "POST",
      body: JSON.stringify(achievement),
    });
  }

  async updateAchievement(id: number, achievement: Partial<Achievement>): Promise<ApiResponse<Achievement>> {
    return this.request(`/api/achievements/${id}`, {
      method: "PUT",
      body: JSON.stringify(achievement),
    });
  }

  async deleteAchievement(id: number): Promise<ApiResponse> {
    return this.request(`/api/achievements/${id}`, { method: "DELETE" });
  }

  // Departments
  async getDepartments(): Promise<ApiResponse<Department[]>> {
    return this.request("/api/departments");
  }

  // Faculty
  async getFaculty(): Promise<ApiResponse<Faculty[]>> {
    return this.request("/api/faculty");
  }

  // Academic Records
  async getAcademicRecords(): Promise<ApiResponse<AcademicRecord[]>> {
    return this.request("/api/academic-records");
  }

  // Portfolios
  async getPortfolios(): Promise<ApiResponse<Portfolio[]>> {
    return this.request("/api/portfolios");
  }

  // Tickets
  async getTickets(): Promise<ApiResponse<Ticket[]>> {
    return this.request("/api/tickets");
  }

  async createTicket(ticket: Partial<Ticket>): Promise<ApiResponse<Ticket>> {
    return this.request("/api/tickets", {
      method: "POST",
      body: JSON.stringify(ticket),
    });
  }

  async updateTicket(id: number, ticket: Partial<Ticket>): Promise<ApiResponse<Ticket>> {
    return this.request(`/api/tickets/${id}`, {
      method: "PUT",
      body: JSON.stringify(ticket),
    });
  }
}

export const apiClient = new ApiClient();