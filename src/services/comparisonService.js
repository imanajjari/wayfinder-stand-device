import api from "../api/api";

export const compareDestinations = async ({ desc1, desc2 }) => {
  const response = await api.post("/comparison", {
    desc1: String(desc1),
    desc2: String(desc2),
  });
  return response.data;
};
