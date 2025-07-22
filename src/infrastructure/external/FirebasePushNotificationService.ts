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
    // Verificar que todas las variables de entorno estén presentes
    const requiredEnvVars = [
      "FIREBASE_PROJECT_ID",
      "FIREBASE_PRIVATE_KEY_ID",
      "FIREBASE_PRIVATE_KEY",
      "FIREBASE_CLIENT_EMAIL",
      "FIREBASE_CLIENT_ID",
    ];

    for (const envVar of requiredEnvVars) {
      if (!process.env[envVar]) {
        throw new Error(
          `Missing required Firebase environment variable: ${envVar}`
        );
      }
    }

    console.log("🔥 Inicializando Firebase con variables de entorno...");

    // Procesar la clave privada para manejar diferentes formatos
    let privateKey = process.env.FIREBASE_PRIVATE_KEY!;

    console.log(
      "🔍 Debug - Clave privada original (primeros 50 chars):",
      privateKey.substring(0, 50)
    );
    console.log(
      "🔍 Debug - Contiene \\n literales:",
      privateKey.includes("\\n")
    );
    console.log(
      "🔍 Debug - Contiene saltos de línea reales:",
      privateKey.includes("\n")
    );

    // Reemplazar \n literales con saltos de línea reales si es necesario
    if (privateKey.includes("\\n")) {
      privateKey = privateKey.replace(/\\n/g, "\n");
      console.log(
        "🔄 Clave privada procesada (primeros 50 chars):",
        privateKey.substring(0, 50)
      );
    }

    // Verificar que tenga el formato PEM correcto
    if (!privateKey.startsWith("-----BEGIN PRIVATE KEY-----")) {
      console.log("⚠️ La clave privada no tiene el formato PEM correcto");
    } else {
      console.log("✅ La clave privada tiene el formato PEM correcto");
    }

    // Crear el objeto de credenciales desde las variables de entorno
    const serviceAccount = {
      type: "service_account",
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: privateKey,
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri:
        process.env.FIREBASE_AUTH_URI ||
        "https://accounts.google.com/o/oauth2/auth",
      token_uri:
        process.env.FIREBASE_TOKEN_URI || "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
    };

    console.log("   📧 Client Email:", serviceAccount.client_email);
    console.log("   🆔 Project ID:", serviceAccount.project_id);
    console.log(
      "   🔑 Private Key ID:",
      serviceAccount.private_key_id?.substring(0, 8) + "..."
    );

    // Inicializar Firebase Admin
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(
          serviceAccount as admin.ServiceAccount
        ),
        projectId: process.env.FIREBASE_PROJECT_ID,
      });
    }
    console.log(
      "✅ Firebase inicializado correctamente con variables de entorno"
    );

    this.messaging = admin.messaging();
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
