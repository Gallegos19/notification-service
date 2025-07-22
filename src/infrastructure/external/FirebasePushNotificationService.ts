import * as admin from "firebase-admin";
import {
  PushNotificationService,
  PushNotificationData,
} from "../../application/ports/PushNotificationService";

export class FirebasePushNotificationService
  implements PushNotificationService
{
  private messaging: admin.messaging.Messaging;

  constructor() {
    try {
      console.log("🔥 Inicializando Firebase...");
      
      // Intentar usar archivo JSON generado primero
      const configPath = require('path').join(__dirname, '../../../firebase-service-account.json');
      
      try {
        const serviceAccount = require(configPath);
        console.log("✅ Usando archivo JSON de configuración");
        
        if (!admin.apps.length) {
          admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            projectId: serviceAccount.project_id,
          });
        }
        
        console.log("   📧 Client Email:", serviceAccount.client_email);
        console.log("   🆔 Project ID:", serviceAccount.project_id);
        
      } catch (jsonError) {
        console.log("⚠️ No se encontró archivo JSON, usando variables de entorno...");
        
        // Fallback a variables de entorno
        const requiredEnvVars = [
          "FIREBASE_PROJECT_ID",
          "FIREBASE_PRIVATE_KEY_ID", 
          "FIREBASE_PRIVATE_KEY",
          "FIREBASE_CLIENT_EMAIL",
          "FIREBASE_CLIENT_ID",
        ];

        for (const envVar of requiredEnvVars) {
          if (!process.env[envVar]) {
            throw new Error(`Missing required Firebase environment variable: ${envVar}`);
          }
        }

        const serviceAccount = {
          type: "service_account",
          project_id: process.env.FIREBASE_PROJECT_ID,
          private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
          private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
          client_email: process.env.FIREBASE_CLIENT_EMAIL,
          client_id: process.env.FIREBASE_CLIENT_ID,
          auth_uri: process.env.FIREBASE_AUTH_URI || "https://accounts.google.com/o/oauth2/auth",
          token_uri: process.env.FIREBASE_TOKEN_URI || "https://oauth2.googleapis.com/token",
          auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
          client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
        };

        if (!admin.apps.length) {
          admin.initializeApp({
            credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
            projectId: process.env.FIREBASE_PROJECT_ID,
          });
        }
        
        console.log("   📧 Client Email:", serviceAccount.client_email);
        console.log("   🆔 Project ID:", serviceAccount.project_id);
      }
      
      console.log("✅ Firebase inicializado correctamente");
      this.messaging = admin.messaging();
      
    } catch (error) {
      console.error("❌ Error inicializando Firebase:", error);
      throw error;
    }
  }

  async sendNotification(
    notificationData: PushNotificationData
  ): Promise<void> {
    const message: admin.messaging.Message = {
      token: notificationData.deviceToken,
      notification: {
        title: notificationData.title,
        body: notificationData.body,
        imageUrl: notificationData.imageUrl,
      },
      data: notificationData.data,
      android: {
        notification: {
          icon: "ic_notification",
          color: "#4CAF50", // Verde para Xuma'a
          sound: "default",
        },
      },
      apns: {
        payload: {
          aps: {
            sound: "default",
            badge: 1,
          },
        },
      },
    };

    try {
      const response = await admin.messaging().send(message);
      console.log("Successfully sent message:", response);
    } catch (error: any) {
      console.error("Error sending message:", error);
      throw new Error(`Failed to send push notification: ${error.message}`);
    }
  }
}
