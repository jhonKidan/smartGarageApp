import React, { useEffect, useState } from "react";
import vehicleService from '../../../../services/vehicle.service';
import { useAuth } from '../../../../Contexts/AuthContext'; 


const VehicleList = ({ customerId, refresh }) => {
  const { employee } = useAuth();
  const token = employee ? employee.employee_token : null;
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const data = await vehicleService.getVehiclesByCustomer(customerId, token);
        setVehicles(data);
      } catch (err) {
        console.error("Error fetching vehicles:", err);
      }
    };
    fetchVehicles();
  }, [customerId, refresh]);

  return (
    <div>
      <h3>Vehicles of Customer</h3>
      {vehicles.length === 0 ? (
        <p>No vehicle found</p>
      ) : (
        <ul>
          {vehicles.map((v) => (
            <li key={v.vehicle_id}>
              {v.vehicle_year} {v.vehicle_make} {v.vehicle_model} ({v.vehicle_color})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default VehicleList;
