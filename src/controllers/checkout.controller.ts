import { Request, Response } from 'express';
import { SessionService } from '../services/session.service';
import { placeToPayConfig } from '../config/placetopay.config';
import { Payment, Person } from '../types/placetopay.types';

const sessionService = new SessionService(
  placeToPayConfig.login,
  placeToPayConfig.secretKey,
  placeToPayConfig.baseUrl,
  placeToPayConfig.returnUrl
);

/**
 * Controlador para crear una nueva sesión de checkout
 */
export const createCheckout = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { payment, buyer, payer } = req.body;

    // Validar datos requeridos
    if (!payment?.reference || !payment?.description || !payment?.amount) {
      res.status(400).json({
        error: 'Los campos payment.reference, payment.description y payment.amount son requeridos'
      });
      return;
    }

    // Obtener IP y User Agent del cliente
    const ipAddress = (req.headers['x-forwarded-for'] as string) ||
                      req.socket.remoteAddress ||
                      '127.0.0.1';
    const userAgent = req.headers['user-agent'] || 'Unknown';

    // Crear sesión
    const response = await sessionService.createSession(
      payment as Payment,
      ipAddress,
      userAgent,
      buyer as Person,
      payer as Person
    );

    res.status(200).json({
      success: true,
      requestId: response.requestId,
      processUrl: response.processUrl,
      status: response.status
    });
  } catch (error: any) {
    console.error('Error al crear checkout:', error);
    res.status(500).json({
      error: 'Error al crear sesión de pago',
      message: error.message
    });
  }
};

/**
 * Controlador para consultar el estado de una sesión
 */
export const getCheckoutStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { requestId } = req.params;

    if (!requestId || isNaN(Number(requestId))) {
      res.status(400).json({
        error: 'requestId inválido'
      });
      return;
    }

    const session = await sessionService.getSession(Number(requestId));

    res.status(200).json({
      success: true,
      session
    });
  } catch (error: any) {
    console.error('Error al consultar sesión:', error);
    res.status(500).json({
      error: 'Error al consultar estado de sesión',
      message: error.message
    });
  }
};

/**
 * Controlador para la página de retorno después del checkout
 */
export const handleReturn = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { requestId } = req.query;

    if (!requestId || isNaN(Number(requestId))) {
      res.status(400).send('requestId inválido');
      return;
    }

    // Consultar estado de la sesión
    const session = await sessionService.getSession(Number(requestId));
    const status = await sessionService.getSessionStatus(Number(requestId));

    // Aquí puedes renderizar una página HTML o redirigir a tu frontend
    res.status(200).json({
      success: true,
      requestId: Number(requestId),
      status,
      session
    });
  } catch (error: any) {
    console.error('Error en página de retorno:', error);
    res.status(500).send('Error al procesar el retorno');
  }
};
