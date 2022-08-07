import httpStatus from "http-status";
import mongoose from "mongoose";
import { Fund } from "../models";
import { ApiError } from "../modules/errors";
import { IOptions, QueryResult } from "../modules/paginate/paginate";
import { IFundDoc, IFund, UpdateFundBody } from "../types/fund.interfaces";

/**
 * Create a fund
 * @param {IFund} fundBody
 * @returns {Promise<IFund>}
 */
export const createFund = async (fundBody: IFund): Promise<IFundDoc> => {
  return Fund.create({
    ...fundBody,
    minInvestAmount: fundBody.minInvestAmount || 0,
    fundInvestmentBalance: 0,
  });
};

/**
 * Query for funds
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
export const queryFunds = async (
  filter: Record<string, any>,
  options: IOptions
): Promise<QueryResult> => {
  const funds = await Fund.paginate(filter, options);
  return funds;
};

/**
 * Get fund by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<IFundDoc | null>}
 */
export const getFundById = async (
  id: mongoose.Types.ObjectId
): Promise<IFundDoc | null> => Fund.findById(id);

/**
 * Update fund by id
 * @param {mongoose.Types.ObjectId} fundId
 * @param {UpdateFundBody} updateBody
 * @returns {Promise<IFundDoc | null>}
 */
export const updateFundById = async (
  fundId: mongoose.Types.ObjectId,
  updateBody: UpdateFundBody
): Promise<IFundDoc | null> => {
  const fund = await getFundById(fundId);
  if (!fund) {
    throw new ApiError(httpStatus.NOT_FOUND, "Fund not found");
  }

  Object.assign(fund, updateBody);
  await fund.save();
  return fund;
};

/**
 * Delete fund by id
 * @param {mongoose.Types.ObjectId} fundId
 * @returns {Promise<IFundDoc | null>}
 */
export const deleteFundById = async (
  fundId: mongoose.Types.ObjectId
): Promise<IFundDoc | null> => {
  const fund = await getFundById(fundId);
  if (!fund) {
    throw new ApiError(httpStatus.NOT_FOUND, "Fund not found");
  }
  await fund.remove();
  return fund;
};
