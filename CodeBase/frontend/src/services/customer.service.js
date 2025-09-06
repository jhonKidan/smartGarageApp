// Import from the env 
const api_url = process.env.REACT_APP_API_URL;

// A function to send post request to create a new customer 
const createCustomer = async (formData, loggedInEmployeeToken) => {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': loggedInEmployeeToken
    },
    body: JSON.stringify(formData)
  };
  console.log("Requesting:", requestOptions);
  const response = await fetch(`${api_url}/api/customer`, requestOptions);
  return response;
};


// A function to send get request to get all customers
const getAllCustomers = async (token) => {
  const requestOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token
    }
  };
  const response = await fetch(`${api_url}/api/customers`, requestOptions);
  return response;
};

const customerService = {
  createCustomer,
  getAllCustomers
};

export default customerService;
