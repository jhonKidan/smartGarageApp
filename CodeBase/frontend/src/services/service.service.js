const api_url = process.env.REACT_APP_API_URL;

// Create service
const createService = async (formData, loggedInEmployeeToken) => {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": loggedInEmployeeToken,
    },
    body: JSON.stringify(formData),
  };
  return fetch(`${api_url}/api/service`, requestOptions);
};

// Get all services (requires authentication)
const getAllServices = async (token) => {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  };
  return fetch(`${api_url}/api/services`, requestOptions);
};

// NEW: Get all services without authentication
const getAllPublicServices = async () => {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };
  return fetch(`${api_url}/api/public/services`, requestOptions);
};

// Update service
const updateService = async (token, id, serviceData) => {
  const requestOptions = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
    body: JSON.stringify(serviceData),
  };
  return fetch(`${api_url}/api/service/${id}`, requestOptions);
};

// Delete service
const deleteService = async (token, id) => {
  const requestOptions = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  };
  return fetch(`${api_url}/api/service/${id}`, requestOptions);
};

const serviceService = {
  createService,
  getAllServices,
  getAllPublicServices, // Add the new function
  updateService,
  deleteService,
};

export default serviceService;