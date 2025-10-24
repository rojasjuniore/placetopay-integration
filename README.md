# PlaceToPay Integration

Integración completa con la pasarela de pagos PlaceToPay Checkout API utilizando Node.js, Express y TypeScript.

## 🚀 Características

- ✅ Autenticación segura con SHA-256
- ✅ Creación de sesiones de pago
- ✅ Consulta de estado de transacciones
- ✅ Manejo de webhooks con validación de signature
- ✅ Soporte para reversos (devoluciones)
- ✅ TypeScript para type-safety
- ✅ Arquitectura modular y escalable
- ✅ Documentación interactiva con Redoc
- ✅ Docker y Docker Compose ready
- ✅ Health checks integrados

## 📋 Requisitos Previos

- Node.js >= 18.0.0
- npm o yarn
- Cuenta activa en PlaceToPay
- Credenciales de API (login y secretKey)

## 🛠️ Instalación

```bash
# Clonar el repositorio
git clone <repository-url>
cd placeTopay

# Instalar dependencias
npm install

# Copiar variables de entorno
cp .env.example .env

# Editar .env con tus credenciales
nano .env
```

## ⚙️ Configuración

Edita el archivo `.env` con tus credenciales de PlaceToPay:

```env
PLACETOPAY_LOGIN=tu_login_aqui
PLACETOPAY_SECRET_KEY=tu_secret_key_aqui
PLACETOPAY_BASE_URL=https://checkout-test.placetopay.com
PORT=3000
RETURN_URL=http://localhost:3000/checkout/return
WEBHOOK_URL=https://tu-dominio.com/webhook/placetopay
```

## 🚦 Uso

### Modo Desarrollo

```bash
npm run dev
```

### Modo Producción

```bash
npm run build
npm start
```

### Con Docker

```bash
# Usando Docker Compose
docker-compose up -d

# Ver documentación completa
# Ver DOCKER.md para más detalles
```

## 📖 Documentación API

La API incluye documentación interactiva con Redoc:

**URL de documentación:** http://localhost:3001/docs

La documentación incluye:
- Descripción detallada de todos los endpoints
- Esquemas de request/response
- Ejemplos de uso
- Códigos de estado HTTP
- Especificación OpenAPI 3.0

También disponible en formato JSON: http://localhost:3001/docs/openapi.json

## 📡 API Endpoints

### 1. Crear Sesión de Pago

```http
POST /api/checkout/create
Content-Type: application/json

{
  "payment": {
    "reference": "ORDER-12345",
    "description": "Compra de producto XYZ",
    "amount": {
      "currency": "USD",
      "total": 100.50
    }
  },
  "buyer": {
    "name": "John",
    "surname": "Doe",
    "email": "john@example.com",
    "mobile": "+573001234567"
  }
}
```

**Respuesta:**
```json
{
  "success": true,
  "requestId": 123456,
  "processUrl": "https://checkout-test.placetopay.com/session/123456/abc...",
  "status": {
    "status": "OK",
    "reason": "PC",
    "message": "La petición se ha procesado correctamente"
  }
}
```

### 2. Consultar Estado

```http
GET /api/checkout/status/:requestId
```

**Respuesta:**
```json
{
  "success": true,
  "session": {
    "requestId": 123456,
    "status": {
      "status": "APPROVED",
      "reason": "00",
      "message": "Aprobada"
    },
    "payment": [
      {
        "status": { "status": "APPROVED" },
        "reference": "ORDER-12345",
        "amount": { "currency": "USD", "total": 100.50 },
        "authorization": "123456",
        "receipt": "789012"
      }
    ]
  }
}
```

### 3. Página de Retorno

```http
GET /checkout/return?requestId=123456
```

### 4. Webhook (para PlaceToPay)

```http
POST /webhook/placetopay
Content-Type: application/json

{
  "requestId": 123456,
  "status": {
    "status": "APPROVED",
    "reason": "00",
    "message": "Aprobada",
    "date": "2024-01-15T10:30:00-05:00"
  },
  "reference": "ORDER-12345",
  "signature": "abc123..."
}
```

## 🔄 Flujo de Integración

```
1. Tu aplicación crea una sesión → POST /api/checkout/create
   ↓
2. Recibes requestId + processUrl
   ↓
3. Guardas requestId en tu DB con estado PENDING
   ↓
4. Rediriges al usuario a processUrl
   ↓
5. Usuario paga en PlaceToPay
   ↓
6. PlaceToPay redirige a tu returnUrl
   ↓
7. Consultas el estado → GET /api/checkout/status/:requestId
   ↓
8. Recibes webhook de confirmación → POST /webhook/placetopay
   ↓
9. Validas signature y actualizas tu DB
```

## 🏗️ Estructura del Proyecto

```
placeTopay/
├── src/
│   ├── config/
│   │   └── placetopay.config.ts      # Configuración
│   ├── controllers/
│   │   ├── checkout.controller.ts    # Lógica de checkout
│   │   └── webhook.controller.ts     # Lógica de webhooks
│   ├── routes/
│   │   ├── checkout.routes.ts        # Rutas de checkout
│   │   └── webhook.routes.ts         # Rutas de webhooks
│   ├── services/
│   │   ├── auth.service.ts           # Autenticación
│   │   ├── session.service.ts        # Manejo de sesiones
│   │   └── webhook.service.ts        # Validación de webhooks
│   ├── types/
│   │   └── placetopay.types.ts       # Tipos TypeScript
│   └── index.ts                      # Servidor Express
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## 🔒 Seguridad

- ✅ Autenticación SHA-256 en cada request
- ✅ Validación de signature SHA-1 en webhooks
- ✅ TLS 1.2+ obligatorio
- ✅ Sincronización NTP (seed < 5min)
- ✅ Variables de entorno para credenciales
- ⚠️ NUNCA exponer secretKey
- ⚠️ NUNCA llamar endpoints desde el navegador

## 📝 Ejemplo de Uso con cURL

```bash
# Crear sesión
curl -X POST http://localhost:3000/api/checkout/create \
  -H "Content-Type: application/json" \
  -d '{
    "payment": {
      "reference": "ORDER-001",
      "description": "Test payment",
      "amount": {
        "currency": "USD",
        "total": 50.00
      }
    },
    "buyer": {
      "email": "test@example.com",
      "name": "Test",
      "surname": "User"
    }
  }'

# Consultar estado
curl http://localhost:3000/api/checkout/status/123456

# Health check
curl http://localhost:3000/health
```

## 🧪 Testing

```bash
# Ejecutar tests (cuando estén implementados)
npm test

# Linting
npm run lint

# Format
npm run format
```

## 📚 Documentación

- [PlaceToPay Checkout Docs](https://docs.placetopay.dev/en/checkout)
- [API Reference](https://docs.placetopay.dev/en/checkout/api)
- [Authentication](https://docs.placetopay.dev/en/checkout/authentication)
- [Webhooks](https://docs.placetopay.dev/en/checkout/notification)

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/amazing-feature`)
3. Commit tus cambios (`git commit -m 'Add amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## 📄 Licencia

MIT

## 💬 Soporte

Para soporte de PlaceToPay, contacta a su equipo de desarrollo.
