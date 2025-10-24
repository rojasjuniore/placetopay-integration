# 🐳 Docker - Guía de Uso

Documentación para ejecutar PlaceToPay Integration usando Docker.

## 📋 Requisitos Previos

- Docker >= 20.10
- Docker Compose >= 2.0
- Credenciales de PlaceToPay

## 🚀 Inicio Rápido

### 1. Clonar el repositorio

```bash
git clone https://github.com/rojasjuniore/placetopay-integration.git
cd placetopay-integration
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env
```

Editar `.env` con tus credenciales:

```env
PLACETOPAY_LOGIN=tu_login
PLACETOPAY_SECRET_KEY=tu_secret_key
PLACETOPAY_BASE_URL=https://checkout-test.placetopay.com
PORT=3000
RETURN_URL=http://localhost:3000/checkout/return
```

### 3. Iniciar con Docker Compose

```bash
docker-compose up -d
```

La API estará disponible en: http://localhost:3000

### 4. Verificar que esté corriendo

```bash
curl http://localhost:3000/health
```

## 🔧 Comandos Útiles

### Iniciar servicios

```bash
# Iniciar en segundo plano
docker-compose up -d

# Iniciar y ver logs
docker-compose up

# Iniciar solo el servicio de API
docker-compose up -d placetopay-api
```

### Ver logs

```bash
# Ver logs en tiempo real
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f placetopay-api

# Ver últimas 100 líneas
docker-compose logs --tail=100 placetopay-api
```

### Detener servicios

```bash
# Detener servicios
docker-compose stop

# Detener y eliminar contenedores
docker-compose down

# Detener, eliminar contenedores y volúmenes
docker-compose down -v
```

### Rebuild

```bash
# Rebuild y restart
docker-compose up -d --build

# Rebuild sin caché
docker-compose build --no-cache
docker-compose up -d
```

### Entrar al contenedor

```bash
docker-compose exec placetopay-api sh
```

### Ver estado

```bash
# Ver contenedores activos
docker-compose ps

# Ver health status
docker inspect placetopay-integration --format='{{.State.Health.Status}}'
```

## 🏗️ Build Manual

### Build de la imagen

```bash
docker build -t placetopay-integration:latest .
```

### Run manual (sin docker-compose)

```bash
docker run -d \
  --name placetopay-api \
  -p 3000:3000 \
  -e PLACETOPAY_LOGIN=tu_login \
  -e PLACETOPAY_SECRET_KEY=tu_secret_key \
  -e PLACETOPAY_BASE_URL=https://checkout-test.placetopay.com \
  -e PORT=3000 \
  -e NODE_ENV=production \
  -e RETURN_URL=http://localhost:3000/checkout/return \
  placetopay-integration:latest
```

## 📊 Características del Dockerfile

### Multi-stage Build

El Dockerfile usa multi-stage build para optimizar:

- **Stage 1 (Builder):** Compila TypeScript y instala dependencias
- **Stage 2 (Production):** Solo runtime, imagen final más pequeña

### Seguridad

- ✅ Usuario no-root (nodejs:1001)
- ✅ Alpine Linux (imagen base pequeña)
- ✅ dumb-init para manejo de señales
- ✅ Health check integrado

### Optimizaciones

- Tamaño de imagen reducido (~150MB)
- Cache de layers optimizado
- Solo production dependencies en imagen final

## 🔍 Health Check

El contenedor incluye health check automático:

```yaml
healthcheck:
  test: ["CMD", "node", "-e", "..."]
  interval: 30s
  timeout: 3s
  retries: 3
  start_period: 5s
```

Verifica el estado:

```bash
docker ps  # Muestra "healthy" en la columna STATUS
```

## 📦 Volúmenes (Opcional)

Para persistir datos, puedes agregar volúmenes:

```yaml
services:
  placetopay-api:
    volumes:
      - ./logs:/app/logs
      - ./data:/app/data
```

## 🌐 Networking

Por defecto, Docker Compose crea una red llamada `placetopay-network`.

Los servicios pueden comunicarse usando sus nombres:

```bash
# Desde dentro del contenedor
curl http://placetopay-api:3000/health
```

## 🔐 Variables de Entorno

| Variable | Descripción | Requerido | Default |
|----------|-------------|-----------|---------|
| `PLACETOPAY_LOGIN` | Login de PlaceToPay | ✅ | - |
| `PLACETOPAY_SECRET_KEY` | Secret key | ✅ | - |
| `PLACETOPAY_BASE_URL` | URL de PlaceToPay | ❌ | https://checkout-test.placetopay.com |
| `PORT` | Puerto del servidor | ❌ | 3000 |
| `NODE_ENV` | Ambiente | ❌ | production |
| `RETURN_URL` | URL de retorno | ❌ | http://localhost:3000/checkout/return |
| `WEBHOOK_URL` | URL para webhooks | ❌ | - |

## 🚀 Producción

### Recomendaciones

1. **Usar HTTPS:**
```bash
# Usar un reverse proxy (nginx, traefik)
# O configurar certificados SSL
```

2. **Resource Limits:**
```yaml
deploy:
  resources:
    limits:
      cpus: '1.0'
      memory: 512M
```

3. **Restart Policy:**
```yaml
restart: unless-stopped
```

4. **Logging:**
```yaml
logging:
  driver: "json-file"
  options:
    max-size: "10m"
    max-file: "3"
```

### Deploy con Docker Swarm

```bash
docker stack deploy -c docker-compose.yml placetopay
```

### Deploy con Kubernetes

```bash
# Crear deployment desde la imagen
kubectl create deployment placetopay --image=placetopay-integration:latest
kubectl expose deployment placetopay --port=3000 --type=LoadBalancer
```

## 🧪 Testing

```bash
# Build imagen de test
docker build -t placetopay-test --target builder .

# Ejecutar tests
docker run --rm placetopay-test npm test
```

## 🐛 Troubleshooting

### El contenedor no inicia

```bash
# Ver logs completos
docker-compose logs placetopay-api

# Verificar variables de entorno
docker-compose config
```

### Health check failing

```bash
# Ver detalles del health check
docker inspect placetopay-integration | jq '.[0].State.Health'
```

### Problemas de permisos

```bash
# Verificar permisos de archivos
ls -la

# Rebuild sin caché
docker-compose build --no-cache
```

### Puerto ocupado

```bash
# Cambiar puerto en docker-compose.yml
ports:
  - "3001:3000"  # host:container
```

## 📚 Recursos

- [Docker Docs](https://docs.docker.com/)
- [Docker Compose Docs](https://docs.docker.com/compose/)
- [Node.js Docker Best Practices](https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md)
