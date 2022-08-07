import mongoose from "mongoose";
import { paginate } from "../modules/paginate";
import { toJSON } from "../modules/toJSON";
import { IFundDoc, IFundModel } from "../types/fund.interfaces";

const fundSchema = new mongoose.Schema<IFundDoc, IFundModel>({
  fundName: {
    type: String,
    required: true,
    trim: true,
  },
  fundDescription: {
    type: String,
    trim: true,
  },
  minInvestAmount: {
    type: Number,
    trim: true
  },
  fundInvestmentBalance: {
    type: Number,
    trim: true
  }
});

// add plugin that converts mongoose to json
fundSchema.plugin(toJSON);
fundSchema.plugin(paginate);

const Fund = mongoose.model<IFundDoc, IFundModel>(
  "Fund",
  fundSchema
);

export default Fund;
