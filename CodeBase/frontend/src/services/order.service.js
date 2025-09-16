const api_url = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Create order
const createOrder = async (token, orderData) => {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token
    },
    body: JSON.stringify(orderData)
  };
  const response = await fetch(`${api_url}/api/orders`, requestOptions);
  return response;
};

// Get all orders
const getAllOrders = async (token) => {
  const requestOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token
    }
  };
  const response = await fetch(`${api_url}/api/orders`, requestOptions);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  return data.data || [];
};

// Assign mechanic to order
const assignMechanic = async (token, orderId, employeeId) => {
  const requestOptions = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'x-access-token': token
    },
    body: JSON.stringify({ employee_id: employeeId })
  };
  const response = await fetch(`${api_url}/api/orders/${orderId}/assign`, requestOptions);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

const orderService = {
  createOrder,
  getAllOrders,
  assignMechanic,
};

export default orderService;