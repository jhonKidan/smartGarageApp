// Import from the env 
const api_url = process.env.REACT_APP_API_URL;

// Get vehicles for a customer
const getVehiclesByCustomer = async (token, customerId) => {
  const requestOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token
    }
  };
  const response = await fetch(`${api_url}/api/customers/${customerId}/vehicles`, requestOptions);
  return response;
};

// Add a new vehicle for a customer
const addVehicle = async (token, customerId, vehicleData) => {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token
    },
    body: JSON.stringify(vehicleData)
  };
  const response = await fetch(`${api_url}/api/customers/${customerId}/vehicles`, requestOptions);
  return response;
};

const vehicleService = {
  getVehiclesByCustomer,
  addVehicle,
};

export default vehicleService;