import mongoose, { Model, Document } from "mongoose";
import { QueryResult } from "../modules/paginate/paginate";

export enum TransactionType {
  DEPOSIT_WALLET = "DEPOSIT_WALLET",
  WITHDRAW_WALLET = "WITHDRAW_WALLET",
  DEPOSIT_FUND = "DEPOSIT_FUND",
  WITHDRAW_FUND = "WITHDRAW_FUND",
}

export interface ITradeHistory {
  statingBalance: number;
  endingBlance: number;
  transactionAmount: number;
  transactionDate: Date;
  transactionType: TransactionType;
  customerId: mongoose.Schema.Types.ObjectId;
  fundId: mongoose.Schema.Types.ObjectId;
}

export interface ITradeHistoryDoc extends ITradeHistory, Document {}

export interface ITradeHistoryModel extends Model<ITradeHistoryDoc> {
  paginate(
    filter: Record<string, any>,
    options: Record<string, any>
  ): Promise<QueryResult>;
}

export interface IWalletTransaction {
  customerId: mongoose.Types.ObjectId,
  transactionAmount: number
}

export interface IFundTransaction extends IWalletTransaction {
  fundId: mongoose.Types.ObjectId
}

export type UpdateTradeHistoryBody = Partial<ITradeHistory>;
