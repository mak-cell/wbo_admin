/**
 * API Service
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

export class ApiService {
  static async get(endpoint: string) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    if (!response.ok) {
      const errorBody = await response.text().catch(() => "");
      throw new Error(`API request failed: ${response.status} ${errorBody}`);
    }
    return response.json();
  }

  static async post(endpoint: string, data: any) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorBody = await response.text().catch(() => "");
      throw new Error(`API request failed: ${response.status} ${errorBody}`);
    }
    return response.json();
  }

  static async patch(endpoint: string, data: any) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorBody = await response.text().catch(() => "");
      throw new Error(`API request failed: ${response.status} ${errorBody}`);
    }
    return response.json();
  }

  static async delete(endpoint: string) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      const errorBody = await response.text().catch(() => "");
      throw new Error(`API request failed: ${response.status} ${errorBody}`);
    }
    // Some DELETE endpoints return 204 No Content
    if (response.status === 204) return null;
    return response.json();
  }

  // --- Project Endpoints ---

  static async getProjects() {
    return this.get("/projects");
  }

  static async getProject(id: number) {
    return this.get(`/projects/${id}`);
  }

  static async createProject(data: any) {
    return this.post("/projects", data);
  }

  static async updateProject(id: number, data: any) {
    return this.patch(`/projects/${id}`, data);
  }

  static async getDashboard() {
    return this.get("/projects/dashboard/summary");
  }

  static async getCalendarEvents() {
    return this.get("/projects/calendar/events");
  }

  // --- Payment Endpoints (Income) ---

  static async getPayments() {
    return this.get("/payments/");
  }

  static async getPayment(id: number) {
    return this.get(`/payments/${id}`);
  }

  static async createPayment(data: any) {
    return this.post("/payments/", data);
  }

  static async updatePaymentStatus(paymentId: number, isPaid: boolean) {
    return this.patch(`/payments/${paymentId}`, { is_paid: isPaid });
  }

  // --- Worker Payout Endpoints (Expenses) ---

  static async getWorkerPayouts() {
    return this.get("/payments/payouts/");
  }

  static async createWorkerPayout(data: any) {
    return this.post("/payments/payouts/", data);
  }

  static async updateWorkerPayoutStatus(payoutId: number, isPaid: boolean) {
    return this.patch(`/payments/payouts/${payoutId}?is_paid=${isPaid}`, {});
  }

  // --- Worker Task Endpoints ---

  static async getWorkerTasks(workerId: number) {
    return this.get(`/worker/tasks/${workerId}`);
  }

  static async getProjectAssignments(projectId: number) {
    return this.get(`/worker/tasks/project/${projectId}`);
  }

  static async createTaskAssignment(data: any) {
    return this.post("/worker/tasks", data);
  }

  static async updateTaskStatus(taskId: number, status: string) {
    return this.patch(`/worker/tasks/${taskId}`, { status });
  }

  static async deleteTaskAssignment(taskId: number) {
    return this.delete(`/worker/tasks/${taskId}`);
  }

  // --- User Endpoints ---

  static async getUsers() {
    return this.get("/users/");
  }

  static async getUser(id: number) {
    return this.get(`/users/${id}`);
  }

  static async createUser(data: any) {
    return this.post("/users/", data);
  }
}
