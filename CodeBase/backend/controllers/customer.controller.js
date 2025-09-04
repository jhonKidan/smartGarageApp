//import the customer service
const customerService = require('../services/customer.service');
//create the create customer controller
async function createCustomer(req, res, next) {
    // Check if employee email already exists in the database 
    const customerExists = await customerService.checkIfCustomerExists(req.body.customer_email);
    // If customer exists, send a response to the client
    if (customerExists) {
    res.status(400).json({
      error: "This email address is already associated with another employee!"
    });
    }
    else {
        try {
          const customerData = req.body;
          // Create the employee
          const customer = await customerService.createCustomer(customerData);
          if (!customer) {
            res.status(400).json({
              error: "Failed to add the employee!"
            });
          } else {
            res.status(200).json({
              status: "true",
            });
          }
        } catch (error) {
          console.log(error);
          res.status(400).json({
            error: "Something went wrong!"
          });
        }
      }
}
//// Export the createCustomer controller 
module.exports = {
    createCustomer
};