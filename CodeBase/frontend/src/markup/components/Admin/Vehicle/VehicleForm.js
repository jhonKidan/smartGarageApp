import React, { useState } from "react";
import vehicleService from '../../../../services/vehicle.service';
import { useAuth } from '../../../../Contexts/AuthContext'; 


const VehicleForm = ({ customerId, onVehicleAdded }) => {
  const { employee } = useAuth();
  const token = employee ? employee.employee_token : null;

  const [formData, setFormData] = useState({
    vehicle_year: "",
    vehicle_make: "",
    vehicle_model: "",
    vehicle_type: "",
    vehicle_mileage: "",
    vehicle_tag: "",
    vehicle_serial: "",
    vehicle_color: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await vehicleService.addVehicle({ ...formData, customer_id: customerId }, token);
      setFormData({
        vehicle_year: "",
        vehicle_make: "",
        vehicle_model: "",
        vehicle_type: "",
        vehicle_mileage: "",
        vehicle_tag: "",
        vehicle_serial: "",
        vehicle_color: ""
      });
      onVehicleAdded();
    } catch (err) {
      console.error("Error adding vehicle:", err);
    }
  };

  return (
    <div className="vehicle-form-container">
      <h3>
        Add a new vehicle <span style={{ color: "red" }}>━</span>
      </h3>
      <form onSubmit={handleSubmit}>
        {Object.keys(formData).map((field, i) => (
          <input
            key={i}
            type="text"
            name={field}
            placeholder={field.replace("_", " ")}
            value={formData[field]}
            onChange={handleChange}
            className="vehicle-input"
          />
        ))}
        <button type="submit" className="btn-add-vehicle">
          ADD VEHICLE
        </button>
      </form>
    </div>
  );
};

export default VehicleForm;
