/**
 * API Service
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

export class ApiService {
  static async get(endpoint: string) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    if (!response.ok) throw new Error("API request failed");
    return response.json();
  }

  static async post(endpoint: string, data: any) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("API request failed");
    return response.json();
  }

  static async patch(endpoint: string, data: any) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("API request failed");
    return response.json();
  }

  static async getProjects() {
    return this.get("/projects");
  }

  static async getProject(id: number) {
    return this.get(`/projects/${id}`);
  }

  static async getCalendarEvents() {
    return this.get('/projects/calendar/events');
  }

  static async updateProject(id: number, data: any) {
    return this.patch(`/projects/${id}`, data);
  }

  static async createProject(data: any) {
    return this.post("/projects", data);
  }

  static async getDashboard() {
    return this.get("/projects/dashboard/summary");
  }

  static async getWorkerTasks(workerId: number) {
    return this.get(`/worker/tasks/${workerId}`);
  }

  static async updatePaymentStatus(paymentId: number, isPaid: boolean) {
    return this.patch(`/payments/${paymentId}`, { is_paid: isPaid });
  }

  static async getUsers() {
    return this.get("/users");
  }

  static async createUser(data: any) {
    return this.post("/users", data);
  }
}
