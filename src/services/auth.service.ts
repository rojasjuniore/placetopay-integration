import crypto from 'crypto';
import { Auth } from '../types/placetopay.types';

/**
 * Servicio de autenticación para PlaceToPay
 * Genera el objeto auth requerido en todas las peticiones
 */
export class AuthService {
  private login: string;
  private secretKey: string;

  constructor(login: string, secretKey: string) {
    this.login = login;
    this.secretKey = secretKey;
  }

  /**
   * Genera el objeto de autenticación completo
   * Formula tranKey: Base64(SHA-256(nonce + seed + secretKey))
   *
   * @returns Auth object con login, tranKey, nonce y seed
   */
  generateAuth(): Auth {
    const seed = this.generateSeed();
    const rawNonce = this.generateRawNonce();
    const nonce = this.encodeNonce(rawNonce);
    const tranKey = this.generateTranKey(rawNonce, seed);

    return {
      login: this.login,
      tranKey,
      nonce,
      seed
    };
  }

  /**
   * Genera la fecha actual en formato ISO 8601
   * IMPORTANTE: No debe diferir más de 5 minutos del servidor
   *
   * @returns Fecha en formato ISO 8601 (ej: 2023-06-21T09:56:06-05:00)
   */
  private generateSeed(): string {
    return new Date().toISOString();
  }

  /**
   * Genera un nonce aleatorio (número random)
   *
   * @returns String con número aleatorio
   */
  private generateRawNonce(): string {
    return crypto.randomBytes(16).toString('hex');
  }

  /**
   * Codifica el nonce en Base64
   *
   * @param rawNonce Nonce sin codificar
   * @returns Nonce codificado en Base64
   */
  private encodeNonce(rawNonce: string): string {
    return Buffer.from(rawNonce).toString('base64');
  }

  /**
   * Genera el tranKey usando SHA-256
   * Formula: Base64(SHA-256(nonce + seed + secretKey))
   *
   * IMPORTANTE: El hash debe ser raw (no hex) antes de codificar en Base64
   *
   * @param rawNonce Nonce sin codificar
   * @param seed Fecha ISO 8601
   * @returns tranKey codificado
   */
  private generateTranKey(rawNonce: string, seed: string): string {
    const hash = crypto
      .createHash('sha256')
      .update(rawNonce + seed + this.secretKey)
      .digest(); // digest() sin parámetro retorna Buffer (raw bytes)

    return hash.toString('base64');
  }

  /**
   * Genera signature para validar webhooks
   * Formula: SHA-1(requestId + status + date + secretKey)
   *
   * @param requestId ID de la sesión
   * @param status Estado de la transacción
   * @param date Fecha de la transacción
   * @returns Signature en hexadecimal
   */
  generateSignature(requestId: number, status: string, date: string): string {
    return crypto
      .createHash('sha1')
      .update(`${requestId}${status}${date}${this.secretKey}`)
      .digest('hex');
  }

  /**
   * Valida la signature de un webhook
   *
   * @param requestId ID de la sesión
   * @param status Estado de la transacción
   * @param date Fecha de la transacción
   * @param receivedSignature Signature recibida en el webhook
   * @returns true si la signature es válida
   */
  validateSignature(
    requestId: number,
    status: string,
    date: string,
    receivedSignature: string
  ): boolean {
    const expectedSignature = this.generateSignature(requestId, status, date);
    return expectedSignature === receivedSignature;
  }
}
