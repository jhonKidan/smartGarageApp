import React, { useState } from "react";
import VehicleList from "./VehicleList";
import VehicleForm from "./VehicleForm";

const CustomerDetails = ({ customer }) => {
  const [refresh, setRefresh] = useState(false);

  const handleVehicleAdded = () => {
    setRefresh(!refresh);
  };

  return (
    <div>
      <h2>Customer: {customer.customer_first_name} {customer.customer_last_name}</h2>
      <p>Email: {customer.customer_email}</p>
      <p>Phone: {customer.customer_phone_number}</p>
      <p>Active Customer: {customer.active_customer_status ? "Yes" : "No"}</p>

      <VehicleList customerId={customer.customer_id} refresh={refresh} />
      <VehicleForm customerId={customer.customer_id} onVehicleAdded={handleVehicleAdded} />
    </div>
  );
};

export default CustomerDetails;
