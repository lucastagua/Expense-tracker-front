import api from "../api/axios";

export const getSummaryRequest = async () => {
  const response = await api.get("/dashboard/summary");
  return response.data;
};