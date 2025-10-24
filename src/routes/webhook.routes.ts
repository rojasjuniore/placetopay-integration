import { Router } from 'express';
import { handleWebhook } from '../controllers/webhook.controller';

const router = Router();

/**
 * POST /webhook/placetopay
 * Recibe notificaciones de PlaceToPay
 *
 * Body:
 * {
 *   requestId: number,
 *   status: { status, reason, message, date },
 *   reference: string,
 *   signature: string
 * }
 */
router.post('/placetopay', handleWebhook);

export default router;
