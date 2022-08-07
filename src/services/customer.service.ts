import httpStatus from "http-status";
import mongoose from "mongoose";
import Customer from "../models/customer.model";
import { ApiError } from "../modules/errors";
import { IOptions, QueryResult } from "../modules/paginate/paginate";
import { ICustomerDoc, ICustomer, UpdateCustomerBody } from "../types/customer.interfaces";

/**
 * Create a customer
 * @param {ICustomer} customerBody
 * @returns {Promise<ICustomer>}
 */
 export const createCustomer = async (customerBody: ICustomer): Promise<ICustomerDoc> => {
  if (await Customer.isEmailTaken(customerBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  return Customer.create(customerBody);
};

/**
 * Query for customers
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
 export const queryCustomers = async (filter: Record<string, any>, options: IOptions): Promise<QueryResult> => {
  const customers = await Customer.paginate(filter, options);
  return customers;
};

/**
 * Get customer by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<ICustomerDoc | null>}
 */
export const getCustomerById = async (id: mongoose.Types.ObjectId): Promise<ICustomerDoc | null> => Customer.findById(id);

/**
 * Get customer by email
 * @param {string} email
 * @returns {Promise<ICustomerDoc | null>}
 */
export const getCustomerByEmail = async (email: string): Promise<ICustomerDoc | null> => Customer.findOne({ email });

/**
 * Update customer by id
 * @param {mongoose.Types.ObjectId} customerId
 * @param {UpdateCustomerBody} updateBody
 * @returns {Promise<ICustomerDoc | null>}
 */
 export const updateCustomerById = async (
  customerId: mongoose.Types.ObjectId,
  updateBody: UpdateCustomerBody
): Promise<ICustomerDoc | null> => {
  const customer = await getCustomerById(customerId);
  if (!customer) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Customer not found');
  }
  if (updateBody.email && (await Customer.isEmailTaken(updateBody.email, customerId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(customer, updateBody);
  await customer.save();
  return customer;
};

/**
 * Delete customer by id
 * @param {mongoose.Types.ObjectId} customerId
 * @returns {Promise<ICustomerDoc | null>}
 */
export const deleteCustomerById = async (customerId: mongoose.Types.ObjectId): Promise<ICustomerDoc | null> => {
  const customer = await getCustomerById(customerId);
  if (!customer) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Customer not found');
  }
  await customer.remove();
  return customer;
};

