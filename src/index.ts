import express, { Express, Request, Response } from 'express';
import { appConfig } from './config/placetopay.config';
import checkoutRoutes from './routes/checkout.routes';
import webhookRoutes from './routes/webhook.routes';

const app: Express = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req: Request, _res: Response, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/checkout', checkoutRoutes);
app.use('/checkout', checkoutRoutes);
app.use('/webhook', webhookRoutes);

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: appConfig.nodeEnv
  });
});

// Root endpoint
app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    message: 'PlaceToPay Integration API',
    version: '1.0.0',
    endpoints: {
      createCheckout: 'POST /api/checkout/create',
      checkStatus: 'GET /api/checkout/status/:requestId',
      returnPage: 'GET /checkout/return?requestId=123',
      webhook: 'POST /webhook/placetopay',
      health: 'GET /health'
    }
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Endpoint no encontrado',
    path: req.path
  });
});

// Error handler
app.use((err: Error, _req: Request, res: Response, _next: any) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Error interno del servidor',
    message: err.message
  });
});

// Start server
app.listen(appConfig.port, () => {
  console.log('===========================================');
  console.log('🚀 PlaceToPay Integration Server');
  console.log('===========================================');
  console.log(`Environment: ${appConfig.nodeEnv}`);
  console.log(`Port: ${appConfig.port}`);
  console.log(`URL: http://localhost:${appConfig.port}`);
  console.log('===========================================');
  console.log('Endpoints:');
  console.log(`  POST   /api/checkout/create`);
  console.log(`  GET    /api/checkout/status/:requestId`);
  console.log(`  GET    /checkout/return?requestId=123`);
  console.log(`  POST   /webhook/placetopay`);
  console.log(`  GET    /health`);
  console.log('===========================================');
});
