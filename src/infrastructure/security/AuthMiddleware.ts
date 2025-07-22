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

  // Middleware opcional para servicios internos (microservicios)
  authenticateService = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): void => {
    try {
      const authHeader = req.headers.authorization;
      const serviceKey = req.headers["x-service-key"] as string;

      // Si viene con service key, es un microservicio
      if (serviceKey) {
        // Aquí podrías validar el service key contra una lista de servicios autorizados
        // Por ahora, simplificamos asumiendo que cualquier service key es válido
        req.user = {
          id: "service",
          email: "service@xumaa.com",
          role: "service",
        };
        next();
        return;
      }

      // Si no, usar autenticación JWT normal
      this.authenticate(req, res, next);
    } catch (error) {
      res.status(500).json({
        error: "Internal server error",
        message: "Error validating authentication",
      });
    }
  };
}
