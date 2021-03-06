import { Market, OffChainTicker, OnChainTicker } from '.';
import { TxOutput } from './blockchain';
import {
  Network,
  PaymentFailedReason,
  RefundType,
  Subnet,
  UserSwapState,
  UserTransactionType,
} from './constants';

//#region Shared

export interface MarketRequirement {
  market: Market;
  payReq: PayReqConfiguration;
}

export type MarketRequirements = MarketRequirement[];

export type Requirements<M> = M extends undefined | null
  ? MarketRequirements
  : M extends Market
  ? MarketRequirement
  : never;

//#endregion

//#region HTTP

export type MarketsResponse = {
  onchainTicker: OnChainTicker;
  offchainTicker: OffChainTicker;
  market: Market;
}[];

export interface OrderDetailsResponse {
  market: Market;
  onchainTicker: OnChainTicker;
  createdAt: string;
  state: UserSwapState;
  payToAddress: string;
  amount: string;
  amountPaid: string;
  invoice: string;
  paymentHash: string;
  paymentPreimage: string;
}

export interface Order {
  id: string;
  market: Market;
  onchainTicker: OnChainTicker;
  createdAt: string;
  state: UserSwapState;
  payToAddress: string;
  amount: string;
  amountPaid: string;
}

export type OrdersResponse = Order[];

export interface Transaction {
  type: UserTransactionType;
  id: string;
}

export type TransactionsResponse = Transaction[];

export interface UtxoRefundDetails {
  refundAddress: string;
  redeemScript: string;
  currentBlockHeight: number;
  feeTokensPerVirtualByte: number;
  utxos: TxOutput[];
}

export interface EthRefundDetails {
  to: string;
  data: string;
}

export type RefundDetails = UtxoRefundDetails | EthRefundDetails;

export interface TimelockRefundDetailsResponse<
  T extends RefundDetails = RefundDetails
> {
  market: Market;
  state: UserSwapState;
  type: RefundType.TIMELOCK_REFUND;
  blocksRemaining: number | undefined;
  refundableAtBlockHeight: number | undefined;
  refundableBalance: string;
  details: T;
}

export interface AdminRefundDetailsResponse<
  T extends RefundDetails = RefundDetails
> {
  market: Market;
  state: UserSwapState;
  type: RefundType.ADMIN_REFUND;
  refundableBalance: string;
  details: T;
}

export type RefundDetailsResponse<T extends RefundDetails = RefundDetails> =
  | TimelockRefundDetailsResponse<T>
  | AdminRefundDetailsResponse<T>;

//#endregion

//#region WebSocket - General

export interface WebSocketResponse<T> {
  success: boolean;
  message?: T;
}

//#endregion

//#region WebSocket - User

export interface TakerQuoteRequest {
  market: Market;
  invoice: string;
  refundAddress?: string;
}

export interface StateUpdateRequest {
  orderId: string;
}

export interface BlockHeightRequest {
  network: Network;
  subnet: Subnet;
}

export interface BroadcastTxRequest {
  onchainTicker: OnChainTicker;
  signedTxHex: string;
}

export interface RefundDetailsRequest {
  orderId: string;
}

export interface TxResult {
  txId: string;
}

export interface GeneralStateUpdate {
  orderId: string;
  state: UserSwapState;
}

export interface TxConfirmedStateUpdate extends GeneralStateUpdate {
  state:
    | UserSwapState.PARTIALLY_FUNDED
    | UserSwapState.FUNDED
    | UserSwapState.REFUNDED;
  transactionId: string;
}

export interface SwapCompleteStateUpdate extends GeneralStateUpdate {
  state: UserSwapState.COMPLETE;
  preimage: string;
}

export type StateUpdate =
  | GeneralStateUpdate
  | TxConfirmedStateUpdate
  | SwapCompleteStateUpdate;

export interface BlockHeightUpdate {
  network: Network;
  subnet: Subnet;
  height: number;
}

export interface Quote<D extends FundTxDetails = FundTxDetails> {
  orderId: string;
  expiryTimestampMs: number;
  amount: string;
  details: D;
}

export type FundDetails<D extends FundTxDetails = FundTxDetails> = Quote<D>;

//#endregion

//#region WebSocket - Liquidity Provider

export interface AuthenticationRequest {
  apiKey: string;
  secretKey: string;
}

export interface PayReqConfiguration {
  minExpirationSeconds: string;
  minBaseUnits: string;
  maxBaseUnits: string;
}

export type ActiveConfigurationRequest = {
  // Liquidity providers MUST provide config values for every market that they subscribe to
  [M in Market]?: {
    payReq: PayReqConfiguration;
  }
};

export type QuoteSubscriptionRequest = Market[];

export interface UtxoFundTxDetails {
  payToAddress: string;
  redeemScript: string;
  refundableAtBlockHeight: number;
}

export interface PartialEvmTxParams {
  from?: string | number;
  gas?: number | string;
  gasPrice?: number | string;
  nonce?: number;
}

export interface EvmUnsignedTx extends PartialEvmTxParams {
  to: string;
  data: string;
  value?: string | number;
}

export interface EvmFundTxDetails {
  unsignedFundingTx: EvmUnsignedTx;
}

export type FundTxDetails = UtxoFundTxDetails | EvmFundTxDetails;

export interface MakerQuoteRequest {
  orderId: string;
  market: Market;
  invoice: string;
  refundAddress?: string;
  requestExpiryTimestampMs: number;
}

export interface MakerQuote<D extends FundTxDetails = FundTxDetails> {
  orderId: string;
  quoteExpiryTimestampMs: number;
  amount?: string;
  details: D;
}

export interface PaymentResult {
  orderId: string;
  success: boolean;
  failedReason?: PaymentFailedReason;
  preimage?: string;
}

//#endregion
