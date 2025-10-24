import axios, { AxiosInstance } from 'axios';
import { AuthService } from './auth.service';
import {
  CreateSessionRequest,
  CreateSessionResponse,
  QuerySessionResponse,
  Payment,
  Person,
  PlaceToPayError,
  ReverseRequest,
  ReverseResponse
} from '../types/placetopay.types';

/**
 * Servicio para manejar sesiones de pago con PlaceToPay
 */
export class SessionService {
  private authService: AuthService;
  private httpClient: AxiosInstance;
  private returnUrl: string;

  constructor(
    login: string,
    secretKey: string,
    baseUrl: string,
    returnUrl: string
  ) {
    this.authService = new AuthService(login, secretKey);
    this.returnUrl = returnUrl;

    this.httpClient = axios.create({
      baseURL: baseUrl,
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });
  }

  /**
   * Crea una nueva sesión de pago
   *
   * @param payment Información del pago
   * @param ipAddress IP del usuario
   * @param userAgent User agent del navegador
   * @param buyer Información del comprador (opcional, editable)
   * @param payer Información del pagador (opcional, no editable)
   * @returns Respuesta con requestId y processUrl
   */
  async createSession(
    payment: Payment,
    ipAddress: string,
    userAgent: string,
    buyer?: Person,
    payer?: Person
  ): Promise<CreateSessionResponse> {
    try {
      const auth = this.authService.generateAuth();

      const request: CreateSessionRequest = {
        auth,
        payment,
        ipAddress,
        userAgent,
        returnUrl: this.returnUrl,
        ...(buyer && { buyer }),
        ...(payer && { payer })
      };

      const response = await this.httpClient.post<CreateSessionResponse>(
        '/api/session',
        request
      );

      if (response.data.status.status !== 'OK') {
        throw new PlaceToPayError(
          `Error al crear sesión: ${response.data.status.message}`,
          response.status,
          response.data
        );
      }

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new PlaceToPayError(
          error.response?.data?.status?.message || error.message,
          error.response?.status,
          error.response?.data
        );
      }
      throw error;
    }
  }

  /**
   * Consulta el estado de una sesión de pago
   *
   * @param requestId ID de la sesión
   * @returns Información completa de la sesión
   */
  async getSession(requestId: number): Promise<QuerySessionResponse> {
    try {
      const auth = this.authService.generateAuth();

      const response = await this.httpClient.post<QuerySessionResponse>(
        `/api/session/${requestId}`,
        { auth }
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new PlaceToPayError(
          error.response?.data?.status?.message || error.message,
          error.response?.status,
          error.response?.data
        );
      }
      throw error;
    }
  }

  /**
   * Realiza un reverso (devolución) de un pago
   *
   * @param internalReference Referencia interna de la transacción
   * @param amount Monto a devolver (opcional para devolución parcial)
   * @returns Respuesta del reverso
   */
  async reversePayment(
    internalReference: number,
    amount?: { total: number; currency: string }
  ): Promise<ReverseResponse> {
    try {
      const auth = this.authService.generateAuth();

      const request: ReverseRequest = {
        auth,
        internalReference,
        ...(amount && { amount })
      };

      const response = await this.httpClient.post<ReverseResponse>(
        '/api/reverse',
        request
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new PlaceToPayError(
          error.response?.data?.status?.message || error.message,
          error.response?.status,
          error.response?.data
        );
      }
      throw error;
    }
  }

  /**
   * Verifica si una sesión fue aprobada
   *
   * @param requestId ID de la sesión
   * @returns true si el pago fue aprobado
   */
  async isSessionApproved(requestId: number): Promise<boolean> {
    const session = await this.getSession(requestId);

    if (!session.payment || session.payment.length === 0) {
      return false;
    }

    return session.payment.some(
      payment => payment.status.status === 'APPROVED'
    );
  }

  /**
   * Obtiene el estado actual de una sesión
   *
   * @param requestId ID de la sesión
   * @returns Estado de la sesión
   */
  async getSessionStatus(
    requestId: number
  ): Promise<'APPROVED' | 'REJECTED' | 'PENDING'> {
    const session = await this.getSession(requestId);

    if (!session.payment || session.payment.length === 0) {
      return 'PENDING';
    }

    const latestPayment = session.payment[session.payment.length - 1];
    return latestPayment.status.status as 'APPROVED' | 'REJECTED' | 'PENDING';
  }
}
