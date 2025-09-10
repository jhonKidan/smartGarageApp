const API_URL = "http://localhost:5000/api/vehicles";

const addVehicle = async (vehicleData, token) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token
    },
    body: JSON.stringify(vehicleData)
  });
  return response.json();
};

const getVehiclesByCustomer = async (customerId, token) => {
  const response = await fetch(`${API_URL}/${customerId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token
    }
  });
  return response.json();
};

const vehicleService = { addVehicle, getVehiclesByCustomer };
export default vehicleService;
