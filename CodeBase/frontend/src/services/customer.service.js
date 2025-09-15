// Import from the env 
const api_url = process.env.REACT_APP_API_URL;

// Create customer
const createCustomer = async (formData, loggedInEmployeeToken) => {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": loggedInEmployeeToken,
    },
    body: JSON.stringify(formData),
  };
  const response = await fetch(`${api_url}/api/customer`, requestOptions);
  return response;
};

// Get all customers
const getAllCustomers = async (token) => {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  };
  const response = await fetch(`${api_url}/api/customers`, requestOptions);
  return response;
};

// 🔹 Search customers by name/email/phone
const searchCustomers = async (token, query) => {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  };
  const response = await fetch(
    `${api_url}/api/customers/search?q=${encodeURIComponent(query)}`,
    requestOptions
  );
  return response;
};

// NEW: Update customer
const updateCustomer = async (token, id, customerData) => {
  const requestOptions = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
    body: JSON.stringify(customerData),
  };
  const response = await fetch(`${api_url}/api/customer/${id}`, requestOptions);
  return response;
};

// NEW: Delete customer
const deleteCustomer = async (token, id) => {
  const requestOptions = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  };
  const response = await fetch(`${api_url}/api/customer/${id}`, requestOptions);
  return response;
};

const customerService = {
  createCustomer,
  getAllCustomers,
  searchCustomers,
  updateCustomer,
  deleteCustomer,
};

export default customerService;


