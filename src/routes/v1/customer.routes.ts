import express, { Router } from "express";

import { customerController } from "../../controllers";

const router: Router = express.Router();

router
  .route("/")
  .post(customerController.createCustomer)
  .get(customerController.getCustomers);

router
  .route("/:customerId")
  .get(customerController.getCustomer)
  .patch(customerController.updateCustomer)
  .delete(customerController.deleteCustomer);

export default router;
