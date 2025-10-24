import { Request, Response } from 'express';
import { WebhookService } from '../services/webhook.service';
import { SessionService } from '../services/session.service';
import { placeToPayConfig } from '../config/placetopay.config';
import { WebhookNotification } from '../types/placetopay.types';

const webhookService = new WebhookService(
  placeToPayConfig.login,
  placeToPayConfig.secretKey
);

const sessionService = new SessionService(
  placeToPayConfig.login,
  placeToPayConfig.secretKey,
  placeToPayConfig.baseUrl,
  placeToPayConfig.returnUrl
);

/**
 * Controlador para recibir webhooks de PlaceToPay
 *
 * IMPORTANTE:
 * - Responder con 2xx lo más rápido posible
 * - PlaceToPay solo hace UN intento de envío
 * - Si la lógica es compleja, usar jobs asíncronos
 */
export const handleWebhook = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const notification: WebhookNotification = req.body;

    // 1. Validar signature (esto es rápido)
    const processedWebhook = await webhookService.processWebhook(notification);

    // 2. Responder inmediatamente con 200
    res.status(200).json({ received: true });

    // 3. Procesar lógica de negocio de forma asíncrona
    // IMPORTANTE: No bloquear la respuesta HTTP
    setImmediate(async () => {
      try {
        console.log('Webhook recibido:', {
          requestId: processedWebhook.requestId,
          status: processedWebhook.status,
          isApproved: processedWebhook.isApproved
        });

        // Consultar información completa de la sesión
        const session = await sessionService.getSession(
          processedWebhook.requestId
        );

        // Aquí va tu lógica de negocio:
        if (processedWebhook.isApproved) {
          console.log('✅ Pago aprobado:', session);
          // TODO: Actualizar estado en tu base de datos
          // TODO: Enviar email de confirmación
          // TODO: Activar servicio/producto
        } else if (processedWebhook.isRejected) {
          console.log('❌ Pago rechazado:', session);
          // TODO: Actualizar estado en tu base de datos
          // TODO: Notificar al usuario
        } else if (processedWebhook.isPending) {
          console.log('⏳ Pago pendiente:', session);
          // TODO: Mantener en estado pendiente
        }
      } catch (error) {
        console.error('Error procesando webhook de forma asíncrona:', error);
        // TODO: Implementar sistema de retry o logging para errores
      }
    });
  } catch (error: any) {
    console.error('Error validando webhook:', error);

    // Incluso si falla la validación, responder 200 para evitar reintentos
    // (PlaceToPay no reintenta de todas formas)
    res.status(200).json({
      received: true,
      error: error.message
    });
  }
};
