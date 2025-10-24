import { AuthService } from './auth.service';
import { WebhookNotification, PlaceToPayError } from '../types/placetopay.types';

/**
 * Servicio para manejar webhooks de PlaceToPay
 */
export class WebhookService {
  private authService: AuthService;

  constructor(login: string, secretKey: string) {
    this.authService = new AuthService(login, secretKey);
  }

  /**
   * Valida la signature de un webhook
   * Formula: SHA-1(requestId + status.status + status.date + secretKey)
   *
   * @param notification Datos del webhook
   * @returns true si la signature es válida
   * @throws PlaceToPayError si la signature es inválida
   */
  validateWebhook(notification: WebhookNotification): boolean {
    const { requestId, status, signature } = notification;

    if (!status.date) {
      throw new PlaceToPayError('Webhook no contiene fecha en status');
    }

    const isValid = this.authService.validateSignature(
      requestId,
      status.status,
      status.date,
      signature
    );

    if (!isValid) {
      throw new PlaceToPayError(
        'Signature del webhook inválida - posible petición fraudulenta'
      );
    }

    return true;
  }

  /**
   * Procesa un webhook de PlaceToPay
   * IMPORTANTE: Debe responder con 2xx lo más rápido posible
   * Si la lógica es compleja, usar un job asíncrono
   *
   * @param notification Datos del webhook
   * @returns Datos validados del webhook
   */
  async processWebhook(
    notification: WebhookNotification
  ): Promise<{
    requestId: number;
    status: string;
    isApproved: boolean;
    isRejected: boolean;
    isPending: boolean;
  }> {
    // 1. Validar signature
    this.validateWebhook(notification);

    // 2. Extraer información
    const { requestId, status } = notification;

    return {
      requestId,
      status: status.status,
      isApproved: status.status === 'APPROVED',
      isRejected: status.status === 'REJECTED',
      isPending: status.status === 'PENDING'
    };
  }
}
