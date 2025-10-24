# 🚀 Quick Start Guide

## Pasos para comenzar en 5 minutos

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env
```

Edita `.env` y configura tus credenciales:

```env
PLACETOPAY_LOGIN=tu_login_de_placetopay
PLACETOPAY_SECRET_KEY=tu_secret_key
PLACETOPAY_BASE_URL=https://checkout-test.placetopay.com
PORT=3000
RETURN_URL=http://localhost:3000/checkout/return
```

### 3. Iniciar el servidor

```bash
npm run dev
```

Deberías ver:

```
===========================================
🚀 PlaceToPay Integration Server
===========================================
Environment: development
Port: 3000
URL: http://localhost:3000
===========================================
```

### 4. Probar la API

#### Crear un pago

```bash
curl -X POST http://localhost:3000/api/checkout/create \
  -H "Content-Type: application/json" \
  -d '{
    "payment": {
      "reference": "TEST-001",
      "description": "Pago de prueba",
      "amount": {
        "currency": "USD",
        "total": 10.00
      }
    },
    "buyer": {
      "email": "test@example.com",
      "name": "Test",
      "surname": "User"
    }
  }'
```

**Respuesta esperada:**

```json
{
  "success": true,
  "requestId": 123456,
  "processUrl": "https://checkout-test.placetopay.com/session/...",
  "status": {
    "status": "OK",
    "reason": "PC",
    "message": "La petición se ha procesado correctamente"
  }
}
```

#### Consultar estado del pago

```bash
curl http://localhost:3000/api/checkout/status/123456
```

### 5. Flujo completo

1. **Crear sesión** → Obtienes `requestId` y `processUrl`
2. **Redirigir al usuario** → A la URL `processUrl`
3. **Usuario paga** → En la interfaz de PlaceToPay
4. **Retorno** → PlaceToPay redirige a tu `returnUrl`
5. **Webhook** → Recibes notificación en `/webhook/placetopay`
6. **Consultar estado** → Verificas el estado final

## 📝 Endpoints Disponibles

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/checkout/create` | Crear sesión de pago |
| GET | `/api/checkout/status/:requestId` | Consultar estado |
| GET | `/checkout/return?requestId=123` | Página de retorno |
| POST | `/webhook/placetopay` | Webhook de PlaceToPay |
| GET | `/health` | Health check |

## 🔧 Comandos útiles

```bash
# Desarrollo
npm run dev

# Build
npm run build

# Producción
npm start

# Lint
npm run lint

# Format
npm run format
```

## ⚠️ Importante

- Usa credenciales de **TEST** primero
- Configura el webhook URL en tu panel de PlaceToPay
- El webhook URL debe ser **HTTPS** en producción
- Valida que tu servidor tenga sincronización NTP

## 🎯 Próximos pasos

1. Integrar con tu base de datos
2. Implementar lógica de negocio en el webhook
3. Crear frontend para el checkout
4. Configurar logs y monitoreo
5. Implementar tests

## 📚 Más información

- Ver `README.md` para documentación completa
- Ver `examples/` para ejemplos de código
- Revisar la documentación oficial: https://docs.placetopay.dev
