import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role?: string;
  };
}

export class AuthMiddleware {
  constructor(private readonly jwtSecret: string) {}

  authenticate = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): void => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({
          error: "Access denied",
          message: "No token provided or invalid format",
        });
        return;
      }

      const token = authHeader.substring(7); // Remove 'Bearer ' prefix

      if (!token) {
        res.status(401).json({
          error: "Access denied",
          message: "Token is required",
        });
        return;
      }

      next();
    } catch (error) {
      res.status(500).json({
        error: "Internal server error",
        message: "Error processing authentication",
      });
    }
  };

  // Middleware para servicios internos (microservicios)
  authenticateService = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): void => {
    try {
      const serviceKey = req.headers["x-service-key"] as string;
      const serviceName = req.headers["x-service-name"] as string;

      // Lista de servicios autorizados con sus claves
      const authorizedServices = {
        "auth-service":
          process.env.AUTH_SERVICE_KEY || "auth-service-secret-key",
        "user-service":
          process.env.USER_SERVICE_KEY || "user-service-secret-key",
        "admin-service":
          process.env.GAMIFICATION_SERVICE_KEY || "gamification-service-secret-key",
        "quiz-challenge-service":
          process.env.QUIZ_CHALLENGE_SERVICE_KEY || "quiz-challenge-service-secret-key",
      } as const;

      // Validar que el servicio esté autorizado
      if (
        serviceKey &&
        serviceName &&
        serviceName in authorizedServices &&
        authorizedServices[serviceName as keyof typeof authorizedServices] ===
          serviceKey
      ) {
        req.user = {
          id: `service-${serviceName}`,
          email: `${serviceName}@xumaa.internal`,
          role: "service",
        };
        next();
        return;
      }

      // Si no es un servicio válido, rechazar
      if (serviceKey || serviceName) {
        res.status(403).json({
          error: "Forbidden",
          message: "Invalid service credentials",
        });
        return;
      }

      // Si no viene con headers de servicio, usar autenticación JWT normal
      this.authenticate(req, res, next);
    } catch (error) {
      res.status(500).json({
        error: "Internal server error",
        message: "Error validating service authentication",
      });
    }
  };
}
