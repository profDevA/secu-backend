import mongoose from "mongoose";
import httpStatus from "http-status";
import { Request, Response } from "express";
import { catchAsync, pick } from "../utils";
import { tradeService } from "../services";

export const depositWallet = catchAsync(async (req: Request, res: Response) => {
  const tradeHistory = await tradeService.depositWallet(req.body);
  res.status(httpStatus.CREATED).send(tradeHistory);
});

export const withdrawWallet = catchAsync(
  async (req: Request, res: Response) => {
    const tradeHistory = await tradeService.withdrawWallet(req.body);
    res.status(httpStatus.CREATED).send(tradeHistory);
  }
);

export const depositFund = catchAsync(async (req: Request, res: Response) => {
  const tradeHistory = await tradeService.depositFund(req.body);
  res.status(httpStatus.CREATED).send(tradeHistory);
});

export const withdrawFund = catchAsync(async (req: Request, res: Response) => {
  const tradeHistory = await tradeService.withdrawFund(req.body);
  res.status(httpStatus.CREATED).send(tradeHistory);
});
