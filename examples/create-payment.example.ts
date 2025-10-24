/**
 * Ejemplo de cómo crear un pago con PlaceToPay
 */

import { SessionService } from '../src/services/session.service';
import { Payment, Person } from '../src/types/placetopay.types';

// Configuración
const LOGIN = 'tu_login';
const SECRET_KEY = 'tu_secret_key';
const BASE_URL = 'https://checkout-test.placetopay.com';
const RETURN_URL = 'http://localhost:3000/checkout/return';

// Inicializar servicio
const sessionService = new SessionService(LOGIN, SECRET_KEY, BASE_URL, RETURN_URL);

// Datos del pago
const payment: Payment = {
  reference: 'ORDER-' + Date.now(),
  description: 'Compra de producto ejemplo',
  amount: {
    currency: 'USD',
    total: 100.00
  }
};

// Datos del comprador (opcional)
const buyer: Person = {
  name: 'John',
  surname: 'Doe',
  email: 'john.doe@example.com',
  mobile: '+573001234567',
  address: {
    street: 'Calle 123',
    city: 'Bogotá',
    country: 'CO'
  }
};

// Crear sesión
async function createPayment() {
  try {
    const response = await sessionService.createSession(
      payment,
      '192.168.1.1',
      'Mozilla/5.0...',
      buyer
    );

    console.log('Sesión creada exitosamente:');
    console.log('Request ID:', response.requestId);
    console.log('Process URL:', response.processUrl);
    console.log('\nRedirige al usuario a:', response.processUrl);
  } catch (error) {
    console.error('Error al crear sesión:', error);
  }
}

// Consultar estado
async function checkPaymentStatus(requestId: number) {
  try {
    const session = await sessionService.getSession(requestId);
    const status = await sessionService.getSessionStatus(requestId);

    console.log('Estado de la sesión:', status);
    console.log('Información completa:', JSON.stringify(session, null, 2));
  } catch (error) {
    console.error('Error al consultar estado:', error);
  }
}

// Ejecutar ejemplos
createPayment();
// checkPaymentStatus(123456);
