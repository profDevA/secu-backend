import mongoose from "mongoose";
import validator from "validator";
import { paginate } from "../modules/paginate";
import { toJSON } from "../modules/toJSON";
import { ICustomerDoc, ICustomerModel } from "../types/customer.interfaces";

const customerSchema = new mongoose.Schema<ICustomerDoc, ICustomerModel>({
  name: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate(value: string) {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid email");
      }
    },
  },
  walletAmount: {
    type: Number,
    trim: true,
  },
});

// add plugin that converts mongoose to json
customerSchema.plugin(toJSON);
customerSchema.plugin(paginate);


/**
 * Check if email is taken
 * @param {string} email - The customer's email
 * @param {ObjectId} [excludeCustomerId] - The id of the customer to be excluded
 * @returns {Promise<boolean>}
 */
customerSchema.static(
  "isEmailTaken",
  async function (
    email: string,
    excludeCustomerId: mongoose.ObjectId
  ): Promise<boolean> {
    const customer = await this.findOne({
      email,
      _id: { $ne: excludeCustomerId },
    });
    return !!customer;
  }
);

const Customer = mongoose.model<ICustomerDoc, ICustomerModel>(
  "Customer",
  customerSchema
);

export default Customer;
