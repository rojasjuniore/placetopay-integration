/**
 * Tipos TypeScript para la integración con PlaceToPay Checkout API
 * Basado en la documentación oficial: https://docs.placetopay.dev/en/checkout
 */

// ============= AUTENTICACIÓN =============

export interface Auth {
  login: string;
  tranKey: string;
  nonce: string;
  seed: string;
}

// ============= PAYMENT =============

export interface Amount {
  currency: string;
  total: number;
}

export interface Payment {
  reference: string;
  description: string;
  amount: Amount;
}

// ============= BUYER / PAYER =============

export interface Address {
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

export interface Person {
  document?: string;
  documentType?: string;
  name?: string;
  surname?: string;
  email?: string;
  mobile?: string;
  address?: Address;
}

// ============= SESSION REQUEST =============

export interface CreateSessionRequest {
  auth: Auth;
  payment: Payment;
  ipAddress: string;
  userAgent: string;
  returnUrl: string;
  buyer?: Person;
  payer?: Person;
  expiration?: string;
}

// ============= SESSION RESPONSE =============

export interface Status {
  status: 'OK' | 'FAILED' | 'PENDING' | 'APPROVED' | 'REJECTED';
  reason: string;
  message: string;
  date?: string;
}

export interface CreateSessionResponse {
  status: Status;
  requestId: number;
  processUrl: string;
}

// ============= QUERY SESSION =============

export interface QuerySessionRequest {
  auth: Auth;
}

export interface Transaction {
  status: Status;
  reference: string;
  internalReference?: number;
  paymentMethod?: string;
  paymentMethodName?: string;
  amount: Amount;
  authorization?: string;
  receipt?: string;
  franchise?: string;
  refunded?: boolean;
}

export interface QuerySessionResponse {
  status: Status;
  requestId: number;
  request: {
    payment: Payment;
    returnUrl: string;
    ipAddress: string;
    userAgent: string;
  };
  payment?: Transaction[];
  subscription?: any;
}

// ============= WEBHOOK NOTIFICATION =============

export interface WebhookNotification {
  requestId: number;
  status: Status;
  reference: string;
  signature: string;
}

// ============= REVERSE (REFUND) =============

export interface ReverseRequest {
  auth: Auth;
  internalReference: number;
  amount?: Amount;
}

export interface ReverseResponse {
  status: Status;
  payment: Transaction;
}

// ============= CONFIG =============

export interface PlaceToPayConfig {
  login: string;
  secretKey: string;
  baseUrl: string;
  returnUrl: string;
  webhookUrl?: string;
}

// ============= ERRORS =============

export class PlaceToPayError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public response?: any
  ) {
    super(message);
    this.name = 'PlaceToPayError';
  }
}
