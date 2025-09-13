const api_url = process.env.REACT_APP_API_URL;

// Create service
const createService = async (formData, loggedInEmployeeToken) => {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': loggedInEmployeeToken
    },
    body: JSON.stringify(formData)
  };
  const response = await fetch(`${api_url}/api/service`, requestOptions);
  return response;
};

const serviceService = {
  createService,
};

export default serviceService;
