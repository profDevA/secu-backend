import httpStatus from "http-status";
import { Request, Response } from "express";
import { catchAsync, pick } from "../utils";
import { IOptions } from "../modules/paginate/paginate";
import * as customerService from "../services/customer.service";
import mongoose from "mongoose";
import { ApiError } from "../modules/errors";

export const createCustomer = catchAsync(
  async (req: Request, res: Response) => {
    const customer = await customerService.createCustomer(req.body);
    res.status(httpStatus.CREATED).send(customer);
  }
);

export const getCustomers = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, ["name", "role"]);
  const options: IOptions = pick(req.query, [
    "sortBy",
    "limit",
    "page",
    "projectBy",
  ]);
  const result = await customerService.queryCustomers(filter, options);
  res.send(result);
});

export const getCustomer = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params["customerId"] === "string") {
    const customer = await customerService.getCustomerById(
      new mongoose.Types.ObjectId(req.params["customerId"])
    );
    if (!customer) {
      throw new ApiError(httpStatus.NOT_FOUND, "Customer not found");
    }
    res.send(customer);
  }
});

export const updateCustomer = catchAsync(
  async (req: Request, res: Response) => {
    if (typeof req.params["customerId"] === "string") {
      const customer = await customerService.updateCustomerById(
        new mongoose.Types.ObjectId(req.params["customerId"]),
        req.body
      );
      res.send(customer);
    }
  }
);

export const deleteCustomer = catchAsync(
  async (req: Request, res: Response) => {
    if (typeof req.params["customerId"] === "string") {
      await customerService.deleteCustomerById(
        new mongoose.Types.ObjectId(req.params["customerId"])
      );
      res.status(httpStatus.NO_CONTENT).send();
    }
  }
);
