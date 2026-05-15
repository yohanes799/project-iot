import api from "./api";

export const waterService = {
  // Get all water quality data with pagination
  getAll: (params = {}) => api.get("/water", { params }),

  // Get latest reading
  getLatest: () => api.get("/water/latest"),

  // Get statistics
  getStats: () => api.get("/water/stats"),

  // Delete a record (admin only)
  delete: (id) => api.delete(`/water/${id}`),
};
