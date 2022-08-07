import express, { Router } from "express";

import { fundController } from "../../controllers";

const router: Router = express.Router();

router
  .route("/")
  .post(fundController.createFund)
  .get(fundController.getFunds);

router
  .route("/:fundId")
  .get(fundController.getFund)
  .patch(fundController.updateFund)
  .delete(fundController.deleteFund);

export default router;
