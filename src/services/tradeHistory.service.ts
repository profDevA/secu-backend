import httpStatus from "http-status";
import mongoose from "mongoose";
import { TradeHistory } from "../models";
import { customerService, fundService } from ".";
import { ApiError } from "../modules/errors";
import { IOptions, QueryResult } from "../modules/paginate/paginate";
import {
  ITradeHistoryDoc,
  ITradeHistory,
  UpdateTradeHistoryBody,
  IWalletTransaction,
  TransactionType,
  IFundTransaction,
} from "../types/tradeHistory.interface";

/**
 * Deposit to wallet
 * @param {IWalletTransaction} walletTransaction
 * @returns {Promise<ITradeHistory>}
 */
export const depositWallet = async (
  walletTransaction: IWalletTransaction
): Promise<ITradeHistoryDoc> => {
  const customer = await customerService.getCustomerById(
    walletTransaction.customerId
  );

  if (!customer) {
    throw new ApiError(httpStatus.NOT_FOUND, "Invalid customer id");
  }

  const tradeHistoryBody = {
    startingBalance: customer.walletAmount,
    endingBalance: customer.walletAmount + walletTransaction.transactionAmount,
    transactionAmount: walletTransaction.transactionAmount,
    transactionDate: new Date(),
    transactionType: TransactionType.DEPOSIT_WALLET,
  };

  const tradeHistory = await TradeHistory.create(tradeHistoryBody);

  if (!tradeHistory) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Error occured while saving transaction history"
    );
  }

  customerService.updateCustomerById(walletTransaction.customerId, {
    walletAmount: customer.walletAmount + walletTransaction.transactionAmount,
  });

  return tradeHistory;
};

/**
 * Withdraw from wallet
 * @param {IWalletTransaction} walletTransaction
 * @returns {Promise<ITradeHistory>}
 */
export const withdrawWallet = async (
  walletTransaction: IWalletTransaction
): Promise<ITradeHistoryDoc> => {
  const customer = await customerService.getCustomerById(
    walletTransaction.customerId
  );

  if (!customer) {
    throw new ApiError(httpStatus.NOT_FOUND, "Invalid customer id");
  }

  if (customer.walletAmount < walletTransaction.transactionAmount) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Insufficient balance");
  }

  const tradeHistoryBody = {
    startingBalance: customer.walletAmount,
    endingBalance: customer.walletAmount - walletTransaction.transactionAmount,
    transactionAmount: walletTransaction.transactionAmount,
    transactionDate: new Date(),
    transactionType: TransactionType.WITHDRAW_WALLET,
  };

  const tradeHistory = await TradeHistory.create(tradeHistoryBody);

  if (!tradeHistory) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Error occured while saving transaction history"
    );
  }

  customerService.updateCustomerById(walletTransaction.customerId, {
    walletAmount: customer.walletAmount - walletTransaction.transactionAmount,
  });

  return tradeHistory;
};

/**
 * Deposit to fund
 * @param {IFundTransaction} fundTransaction
 * @returns {Promise<ITradeHistory>}
 */
export const depositFund = async (
  fundTransaction: IFundTransaction
): Promise<ITradeHistoryDoc> => {
  const customer = await customerService.getCustomerById(
    fundTransaction.customerId
  );

  if (!customer) {
    throw new ApiError(httpStatus.NOT_FOUND, "Invalid customer id");
  }

  if (customer.walletAmount < fundTransaction.transactionAmount) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Insufficient Balance");
  }

  const fund = await fundService.getFundById(fundTransaction.fundId);

  if (!fund) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Fund not found");
  }

  if (fundTransaction.transactionAmount < fund.minInvestAmount) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Amount is too small");
  }

  const tradeHistoryBody = {
    startingBalance: customer.walletAmount,
    endingBalance: customer.walletAmount - fundTransaction.transactionAmount,
    transactionAmount: fundTransaction.transactionAmount,
    transactionDate: new Date(),
    transactionType: TransactionType.DEPOSIT_FUND,
  };

  const tradeHistory = await TradeHistory.create(tradeHistoryBody);

  if (!tradeHistory) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Error occured while saving transaction history"
    );
  }

  customerService.updateCustomerById(fundTransaction.customerId, {
    walletAmount: customer.walletAmount - fundTransaction.transactionAmount,
  });

  fundService.updateFundById(fundTransaction.fundId, {
    fundInvestmentBalance:
      fund.fundInvestmentBalance + fundTransaction.transactionAmount,
  });

  return tradeHistory;
};

/**
 * Deposit to fund
 * @param {IFundTransaction} fundTransaction
 * @returns {Promise<ITradeHistory>}
 */
export const withdrawFund = async (
  fundTransaction: IFundTransaction
): Promise<ITradeHistoryDoc> => {
  const customer = await customerService.getCustomerById(
    fundTransaction.customerId
  );

  if (!customer) {
    throw new ApiError(httpStatus.NOT_FOUND, "Invalid customer id");
  }

  const fund = await fundService.getFundById(fundTransaction.fundId);

  if (!fund) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Fund not found");
  }

  if (fundTransaction.transactionAmount > fund.fundInvestmentBalance) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Amount is too big");
  }

  const tradeHistoryBody = {
    startingBalance: customer.walletAmount,
    endingBalance: customer.walletAmount + fundTransaction.transactionAmount,
    transactionAmount: fundTransaction.transactionAmount,
    transactionDate: new Date(),
    transactionType: TransactionType.WITHDRAW_FUND,
  };

  const tradeHistory = await TradeHistory.create(tradeHistoryBody);

  if (!tradeHistory) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Error occured while saving transaction history"
    );
  }

  customerService.updateCustomerById(fundTransaction.customerId, {
    walletAmount: customer.walletAmount + fundTransaction.transactionAmount,
  });

  fundService.updateFundById(fundTransaction.fundId, {
    fundInvestmentBalance:
      fund.fundInvestmentBalance - fundTransaction.transactionAmount,
  });

  return tradeHistory;
};
