
import React, { useState, useEffect } from 'react';
import getAuth from '../../../../util/auth';
import customerService from '../../../../services/customer.service';
import employeeService from '../../../../services/employee.service';
import orderService from '../../../../services/order.service';
import serviceService from '../../../../services/service.service';

function Dashboard({ refreshTrigger }) {
  const [totals, setTotals] = useState({
    totalEmployees: 0,
    totalCustomers: 0,
    totalOrders: 0,
    totalServices: 0,
    totalAssignedOrders: 0,
    totalCompletedOrders: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refresh, setRefresh] = useState(0); // State to trigger manual refresh

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const employee = await getAuth();
      const token = employee?.employee_token;

      if (!token) {
        throw new Error('No authentication token found. Please log in.');
      }

      // Fetch all data in parallel
      const [employeesRes, customersRes, orders, servicesRes] = await Promise.all([
        employeeService.getAllEmployees(token),
        customerService.getAllCustomers(token),
        orderService.getAllOrders(token), // Returns parsed array
        serviceService.getAllServices(token),
      ]);

      // Check responses for non-order services
      if (!employeesRes.ok) {
        const errorText = await employeesRes.text();
        throw new Error(`Failed to fetch employees: ${errorText}`);
      }
      if (!customersRes.ok) {
        const errorText = await customersRes.text();
        throw new Error(`Failed to fetch customers: ${errorText}`);
      }
      if (!servicesRes.ok) {
        const errorText = await servicesRes.text();
        throw new Error(`Failed to fetch services: ${errorText}`);
      }

      // Parse JSON for non-order services
      const employees = await employeesRes.json();
      const customers = await customersRes.json();
      const services = await servicesRes.json();

      // Extract data (handle both { data: [...] } and [...] structures)
      const employeesList = employees.data || employees;
      const customersList = customers.data || customers;
      const ordersList = orders; // Already parsed by orderService.getAllOrders
      const servicesList = services.data || services;

      // Validate data
      if (!Array.isArray(employeesList)) throw new Error('Invalid employees data format');
      if (!Array.isArray(customersList)) throw new Error('Invalid customers data format');
      if (!Array.isArray(ordersList)) throw new Error('Invalid orders data format');
      if (!Array.isArray(servicesList)) throw new Error('Invalid services data format');

      // Calculate totals
      const totalEmployees = employeesList.length || 0;
      const totalCustomers = customersList.length || 0;
      const totalOrders = ordersList.length || 0;
      const totalServices = servicesList.length || 0;
      const totalAssignedOrders = ordersList.filter(
        order => order.employee_id !== null && order.employee_id !== undefined
      ).length || 0;
      const totalCompletedOrders = ordersList.filter(order => order.order_status === 3).length || 0;

      setTotals({
        totalEmployees,
        totalCustomers,
        totalOrders,
        totalServices,
        totalAssignedOrders,
        totalCompletedOrders,
      });
    } catch (err) {
      console.error('Error fetching dashboard data:', {
        message: err.message,
        stack: err.stack,
      });
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [refresh, refreshTrigger]); // Re-run when refresh or refreshTrigger changes

  const handleRefresh = () => {
    setRefresh(prev => prev + 1); // Increment to trigger useEffect
  };

  if (loading) {
    return (
      <section className="services-section">
        <div className="auto-container">
          <div className="sec-title style-two">
            <h2>Admin Dashboard</h2>
            <div className="text">Loading...</div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="services-section">
        <div className="auto-container">
          <div className="sec-title style-two">
            <h2>Admin Dashboard</h2>
            <div className="text">Error: {error}</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="services-section">
      <div className="auto-container">
        <div className="sec-title style-two">
          <h2>Admin Dashboard</h2>
          <div className="text">
            The order management panel provides an overview of all customer orders. Admins can monitor, update, and
            organize requests from here.
          </div>
          <button className="btn btn-primary" onClick={handleRefresh}>
            Refresh Dashboard
          </button>
        </div>
        <div className="row">
          <div className="col-lg-4 service-block-one">
            <div className="inner-box hvr-float-shadow">
              <h5>Total</h5>
              <h2>{totals.totalEmployees}</h2>
              <a href="#" className="read-more">Total Employee</a>
              <div className="icon">
                <span className="flaticon-power"></span>
              </div>
            </div>
          </div>
          <div className="col-lg-4 service-block-one">
            <div className="inner-box hvr-float-shadow">
              <h5>Total</h5>
              <h2>{totals.totalCustomers}</h2>
              <a href="#" className="read-more">Total Customer</a>
              <div className="icon">
                <span className="flaticon-gearbox"></span>
              </div>
            </div>
          </div>
          <div className="col-lg-4 service-block-one">
            <div className="inner-box hvr-float-shadow">
              <h5>Total</h5>
              <h2>{totals.totalOrders}</h2>
              <a href="#" className="read-more">Total Orders</a>
              <div className="icon">
                <span className="flaticon-brake-disc"></span>
              </div>
            </div>
          </div>
          <div className="col-lg-4 service-block-one">
            <div className="inner-box hvr-float-shadow">
              <h5>Total</h5>
              <h2>{totals.totalServices}</h2>
              <a href="#" className="read-more">Total Service</a>
              <div className="icon">
                <span className="flaticon-tire"></span>
              </div>
            </div>
          </div>
          <div className="col-lg-4 service-block-one">
            <div className="inner-box hvr-float-shadow">
              <h5>Total</h5>
              <h2>{totals.totalAssignedOrders}</h2>
              <a href="#" className="read-more">Total Assigned</a>
              <div className="icon">
                <span className="flaticon-tire"></span>
              </div>
            </div>
          </div>
          <div className="col-lg-4 service-block-one">
            <div className="inner-box hvr-float-shadow">
              <h5>Total</h5>
              <h2>{totals.totalCompletedOrders}</h2>
              <a href="#" className="read-more">Total Completed</a>
              <div className="icon">
                <span className="flaticon-spray-gun"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Dashboard;
