import mongoose from "mongoose";
import { paginate } from "../modules/paginate";
import { toJSON } from "../modules/toJSON";
import {
  ITradeHistoryDoc,
  ITradeHistoryModel,
} from "../types/tradeHistory.interface";

const tradeHistorySchema = new mongoose.Schema<
  ITradeHistoryDoc,
  ITradeHistoryModel
>({
  statingBalance: {
    type: Number,
    required: true,
    trim: true,
  },
  endingBlance: {
    type: Number,
    required: true,
    trim: true,
  },
  transactionAmount: {
    type: Number,
    required: true,
    trim: true,
  },
  transactionDate: {
    type: Date,
    required: true,
    trim: true,
  },
  transactionType: {
    type: String,
    required: true,
    trim: true,
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
  },
  fundId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Fund",
  },
});

// add plugin that converts mongoose to json
tradeHistorySchema.plugin(toJSON);
tradeHistorySchema.plugin(paginate);

const TradeHistory = mongoose.model<ITradeHistoryDoc, ITradeHistoryModel>(
  "TradeHistory",
  tradeHistorySchema
);

export default TradeHistory;
