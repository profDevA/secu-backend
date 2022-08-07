import mongoose, { Model, Document } from "mongoose";
import { QueryResult } from "../modules/paginate/paginate";

export interface ICustomer {
  name: string;
  email: string;
  walletAmount: number;
}

export interface ICustomerDoc extends ICustomer, Document {}

export interface ICustomerModel extends Model<ICustomerDoc> {
  isEmailTaken(
    email: string,
    excludeCustomerId?: mongoose.Types.ObjectId
  ): Promise<boolean>;
  paginate(
    filter: Record<string, any>,
    options: Record<string, any>
  ): Promise<QueryResult>;
}

export type UpdateCustomerBody = Partial<ICustomer>;
