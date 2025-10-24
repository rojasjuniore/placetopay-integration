# Changelog

Todas las actualizaciones notables del proyecto serán documentadas en este archivo.

## [1.1.0] - 2025-10-24

### Agregado
- **Documentación API con Redoc**
  - Especificación OpenAPI 3.0 completa (`openapi.yaml`)
  - Endpoint `/docs` con documentación interactiva
  - Endpoint `/docs/openapi.json` para consumo programático
  - Endpoint `/docs/openapi.yaml` para especificación raw

- **Soporte Docker**
  - Dockerfile multi-stage para builds optimizados
  - Docker Compose con configuración completa
  - Health checks integrados
  - Configuración de seguridad (usuario no-root)
  - Resource limits y logging configurado
  - Documentación completa en DOCKER.md

- **Dependencias**
  - `js-yaml` para parseo de OpenAPI spec
  - `@types/js-yaml` para TypeScript

### Modificado
- README.md actualizado con secciones de documentación y Docker
- src/index.ts incluye ruta `/docs`
- package.json con nuevas dependencias

## [1.0.0] - 2025-10-24

### Agregado
- **Integración PlaceToPay Checkout API**
  - Servicio de autenticación con SHA-256
  - Creación de sesiones de pago
  - Consulta de estado de transacciones
  - Manejo de webhooks con validación SHA-1
  - Soporte para reversos/devoluciones

- **Arquitectura**
  - TypeScript completo con strict mode
  - Express.js como framework web
  - Arquitectura modular (services, controllers, routes)
  - Tipos TypeScript completos

- **Endpoints API**
  - `POST /api/checkout/create` - Crear sesión de pago
  - `GET /api/checkout/status/:requestId` - Consultar estado
  - `GET /checkout/return` - Página de retorno
  - `POST /webhook/placetopay` - Recibir notificaciones
  - `GET /health` - Health check
  - `GET /` - API info

- **Documentación**
  - README.md completo
  - QUICKSTART.md para inicio rápido
  - TEST_RESULTS.md con resultados de pruebas
  - Ejemplos de código en carpeta `examples/`

- **Calidad de Código**
  - ESLint configurado
  - Prettier para formateo
  - TypeScript strict mode
  - .gitignore completo

- **Despliegue**
  - Scripts npm para desarrollo y producción
  - Variables de entorno con .env.example
  - Repositorio público en GitHub
