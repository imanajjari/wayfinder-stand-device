// services/customerService.js
import api from "../api/api";

// add customer to customer club
export const addCustomer = async ({ name, number, email }) => {
  const response = await api.post("/client/add", {
    name: name,
    number: number,
    email: email,
  });

  return response.data;
};
