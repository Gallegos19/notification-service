import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { Container } from './infrastructure/config/Container';
import { DatabaseConfig } from './infrastructure/config/Database';
import { createNotificationRoutes } from './infrastructure/web/routes/notification.routes';
import { swaggerSpec } from './infrastructure/config/swagger';

// Load environment variables
dotenv.config();

class NotificationServiceApp {
  private app: express.Application;
  private container: Container;
  private port: number;

  constructor() {
    this.app = express();
    this.container = Container.getInstance();
    this.port = parseInt(process.env.PORT || '3005');
    
    this.setupMiddleware();
    this.setupDependencies();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  private setupMiddleware(): void {
    // Security middleware
    this.app.use(helmet());
    
    // CORS configuration
    this.app.use(cors({
      origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
      credentials: true
    }));

    // Body parsing middleware
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Request logging
    this.app.use((req, res, next) => {
      console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
      next();
    });
  }

  private setupDependencies(): void {
    this.container.setupDependencies();
  }


  private setupRoutes(): void {
    // Swagger documentation
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
      customCss: `
        .swagger-ui .topbar { display: none }
        .swagger-ui .info .title { 
          color: #4CAF50; 
          font-size: 2.5em;
        }
        .swagger-ui .info .description { 
          font-size: 1.1em; 
          line-height: 1.6;
        }
        .swagger-ui .scheme-container { 
          background: linear-gradient(135deg, #f0f8f0, #e8f5e8); 
          border-radius: 10px;
          padding: 15px;
        }
        .swagger-ui .opblock.opblock-post { 
          border-color: #4CAF50; 
        }
        .swagger-ui .opblock.opblock-get { 
          border-color: #2196F3; 
        }
        .swagger-ui .opblock-summary { 
          font-weight: bold; 
        }
        .swagger-ui .btn.authorize { 
          background-color: #4CAF50; 
          border-color: #4CAF50; 
        }
        .swagger-ui .btn.authorize:hover { 
          background-color: #45a049; 
        }
      `,
      customSiteTitle: 'Xuma\'a Notification Service API',
      customfavIcon: '/favicon.ico',
      swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
        docExpansion: 'list',
        filter: true,
        showExtensions: true,
        showCommonExtensions: true,
        defaultModelsExpandDepth: 2,
        defaultModelExpandDepth: 2
      }
    }));

    // Swagger JSON endpoint
    this.app.get('/api-docs.json', (req, res) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(swaggerSpec);
    });

    /**
     * @swagger
     * /health:
     *   get:
     *     tags: [Health]
     *     summary: 🏥 Health check del servicio
     *     description: Verifica el estado del servicio de notificaciones
     *     responses:
     *       200:
     *         description: Servicio funcionando correctamente
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/HealthResponse'
     *             example:
     *               status: "OK"
     *               service: "Xuma'a Notification Service"
     *               timestamp: "2024-01-15T10:30:00.000Z"
     *               version: "1.0.0"
     */
    // Health check
    this.app.get('/health', (req, res) => {
      res.status(200).json({
        status: 'OK',
        service: 'Xuma\'a Notification Service',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      });
    });

    // API routes
    this.app.use('/api/notifications', createNotificationRoutes(
      this.container.resolve('notificationController'),
      this.container.resolve('authMiddleware')
    ));

    // Root endpoint with API info
    this.app.get('/', (req, res) => {
      res.json({
        service: 'Xuma\'a Notification Service',
        version: '1.0.0',
        description: 'Servicio de notificaciones para la aplicación de concientización ambiental Xuma\'a',
        documentation: `${req.protocol}://${req.get('host')}/api-docs`,
        endpoints: {
          health: '/health',
          documentation: '/api-docs',
          api: '/api/notifications'
        },
        features: [
          '📧 Envío de correos electrónicos con SendGrid',
          '📱 Notificaciones push con Firebase',
          '🎨 Templates HTML personalizados',
          '📊 Historial de notificaciones',
          '🔐 Autenticación JWT'
        ]
      });
    });

    // 404 handler
    this.app.use('*', (req, res) => {
      res.status(404).json({
        error: 'Not Found',
        message: `Route ${req.method} ${req.originalUrl} not found`,
        availableEndpoints: {
          documentation: '/api-docs',
          health: '/health',
          api: '/api/notifications'
        }
      });
    });
  }

  private setupErrorHandling(): void {
    // Global error handler
    this.app.use((error: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
      console.error('Unhandled error:', error);
      
      res.status(500).json({
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
      });
    });
  }

  async start(): Promise<void> {
    try {
      // Connect to database
      await DatabaseConfig.connect();

      // Start server
      this.app.listen(this.port, () => {
        console.log(`
🌱 Xuma'a Notification Service Started Successfully!
🚀 Server running on port ${this.port}
🌍 Environment: ${process.env.NODE_ENV || 'development'}
📧 Email service: SendGrid
📱 Push notifications: Firebase
💾 Database: PostgreSQL with Prisma
📚 API Documentation: http://localhost:${this.port}/api-docs
🏥 Health Check: http://localhost:${this.port}/health
        `);
      });

      // Graceful shutdown
      process.on('SIGTERM', this.shutdown.bind(this));
      process.on('SIGINT', this.shutdown.bind(this));

    } catch (error) {
      console.error('❌ Failed to start notification service:', error);
      process.exit(1);
    }
  }

  private async shutdown(): Promise<void> {
    console.log('🔄 Shutting down notification service...');
    
    try {
      await DatabaseConfig.disconnect();
      console.log('✅ Notification service shut down successfully');
      process.exit(0);
    } catch (error) {
      console.error('❌ Error during shutdown:', error);
      process.exit(1);
    }
  }
}

// Start the application
const app = new NotificationServiceApp();
app.start().catch(console.error);