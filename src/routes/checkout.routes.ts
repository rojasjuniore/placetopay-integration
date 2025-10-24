import { Router } from 'express';
import {
  createCheckout,
  getCheckoutStatus,
  handleReturn
} from '../controllers/checkout.controller';

const router = Router();

/**
 * POST /api/checkout/create
 * Crea una nueva sesión de checkout
 *
 * Body:
 * {
 *   payment: {
 *     reference: string,
 *     description: string,
 *     amount: { currency: string, total: number }
 *   },
 *   buyer?: { name, surname, email, mobile, ... },
 *   payer?: { name, surname, email, ... }
 * }
 */
router.post('/create', createCheckout);

/**
 * GET /api/checkout/status/:requestId
 * Consulta el estado de una sesión
 */
router.get('/status/:requestId', getCheckoutStatus);

/**
 * GET /checkout/return
 * Página de retorno después del pago
 * Query params: ?requestId=123
 */
router.get('/return', handleReturn);

export default router;
