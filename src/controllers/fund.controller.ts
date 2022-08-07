import mongoose from "mongoose";
import httpStatus from "http-status";
import { Request, Response } from "express";
import { catchAsync, pick } from "../utils";
import { IOptions } from "../modules/paginate/paginate";
import { fundService } from "../services";
import { ApiError } from "../modules/errors";

export const createFund = catchAsync(
  async (req: Request, res: Response) => {
    const fund = await fundService.createFund(req.body);
    res.status(httpStatus.CREATED).send(fund);
  }
);

export const getFunds = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, ["fundName",]);
  const options: IOptions = pick(req.query, [
    "sortBy",
    "limit",
    "page",
    "projectBy",
  ]);
  const result = await fundService.queryFunds(filter, options);
  res.send(result);
});

export const getFund = catchAsync(async (req: Request, res: Response) => {
  if (typeof req.params["fundId"] === "string") {
    const fund = await fundService.getFundById(
      new mongoose.Types.ObjectId(req.params["fundId"])
    );
    if (!fund) {
      throw new ApiError(httpStatus.NOT_FOUND, "Fund not found");
    }
    res.send(fund);
  }
});

export const updateFund = catchAsync(
  async (req: Request, res: Response) => {
    if (typeof req.params["fundId"] === "string") {
      const fund = await fundService.updateFundById(
        new mongoose.Types.ObjectId(req.params["fundId"]),
        req.body
      );
      res.send(fund);
    }
  }
);

export const deleteFund = catchAsync(
  async (req: Request, res: Response) => {
    if (typeof req.params["fundId"] === "string") {
      await fundService.deleteFundById(
        new mongoose.Types.ObjectId(req.params["fundId"])
      );
      res.status(httpStatus.NO_CONTENT).send();
    }
  }
);
