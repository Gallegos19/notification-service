import { PrismaClient } from "@prisma/client";

export class DatabaseConfig {
  private static instance: PrismaClient;

  static getInstance(): PrismaClient {
    if (!DatabaseConfig.instance) {
      DatabaseConfig.instance = new PrismaClient({
        log:
          process.env.NODE_ENV === "development"
            ? ["query", "info", "warn", "error"]
            : ["error"],
      });
    }
    return DatabaseConfig.instance;
  }

  static async connect(): Promise<void> {
    try {
      const prisma = DatabaseConfig.getInstance();
      await prisma.$connect();
      console.log("✅ Database connected successfully");
    } catch (error) {
      console.error("❌ Database connection failed:", error);
      throw error;
    }
  }

  static async disconnect(): Promise<void> {
    try {
      const prisma = DatabaseConfig.getInstance();
      await prisma.$disconnect();
      console.log("✅ Database disconnected successfully");
    } catch (error) {
      console.error("❌ Database disconnection failed:", error);
      throw error;
    }
  }
}
