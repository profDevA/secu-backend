import { Model, Document } from "mongoose";
import { QueryResult } from "../modules/paginate/paginate";

export interface IFund {
  fundName: string;
  fundDescription: string;
  minInvestAmount: number;
  fundInvestmentBalance: number;
}

export interface IFundDoc extends IFund, Document {}

export interface IFundModel extends Model<IFundDoc> {
  paginate(
    filter: Record<string, any>,
    options: Record<string, any>
  ): Promise<QueryResult>;
}

export type UpdateFundBody = Partial<IFund>;
