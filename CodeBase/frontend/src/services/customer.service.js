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

const customerService = {
  createCustomer,
};

export default customerService;
