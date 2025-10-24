/**
 * Ejemplo de validación de webhook de PlaceToPay
 */

import { WebhookService } from '../src/services/webhook.service';
import { WebhookNotification } from '../src/types/placetopay.types';

const LOGIN = 'tu_login';
const SECRET_KEY = 'tu_secret_key';

const webhookService = new WebhookService(LOGIN, SECRET_KEY);

// Ejemplo de payload que recibirías de PlaceToPay
const webhookPayload: WebhookNotification = {
  requestId: 123456,
  status: {
    status: 'APPROVED',
    reason: '00',
    message: 'Aprobada',
    date: '2024-01-15T10:30:00-05:00'
  },
  reference: 'ORDER-12345',
  signature: 'abc123def456...' // Esta es la firma que PlaceToPay envía
};

async function processWebhook() {
  try {
    // Validar y procesar webhook
    const result = await webhookService.processWebhook(webhookPayload);

    console.log('Webhook válido:');
    console.log('Request ID:', result.requestId);
    console.log('Status:', result.status);
    console.log('¿Aprobado?:', result.isApproved);
    console.log('¿Rechazado?:', result.isRejected);
    console.log('¿Pendiente?:', result.isPending);

    // Aquí implementarías tu lógica de negocio
    if (result.isApproved) {
      console.log('✅ Pago aprobado - Activar servicio');
      // Actualizar base de datos
      // Enviar email de confirmación
      // Activar producto/servicio
    } else if (result.isRejected) {
      console.log('❌ Pago rechazado - Notificar al usuario');
      // Actualizar base de datos
      // Notificar al usuario
    }
  } catch (error) {
    console.error('❌ Error procesando webhook:', error);
    // La signature es inválida o el webhook está corrupto
  }
}

processWebhook();
