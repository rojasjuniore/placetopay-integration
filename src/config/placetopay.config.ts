import dotenv from 'dotenv';
import { PlaceToPayConfig } from '../types/placetopay.types';

dotenv.config();

/**
 * Configuración de PlaceToPay desde variables de entorno
 */
export const placeToPayConfig: PlaceToPayConfig = {
  login: process.env.PLACETOPAY_LOGIN || '',
  secretKey: process.env.PLACETOPAY_SECRET_KEY || '',
  baseUrl: process.env.PLACETOPAY_BASE_URL || 'https://checkout-test.placetopay.com',
  returnUrl: process.env.RETURN_URL || 'http://localhost:3000/checkout/return',
  webhookUrl: process.env.WEBHOOK_URL
};

// Validar que existan las credenciales
if (!placeToPayConfig.login || !placeToPayConfig.secretKey) {
  console.error('ERROR: PLACETOPAY_LOGIN y PLACETOPAY_SECRET_KEY son requeridos en .env');
  process.exit(1);
}

export const appConfig = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development'
};
