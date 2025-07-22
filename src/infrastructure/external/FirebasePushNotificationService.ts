import * as admin from 'firebase-admin';
import * as path from 'path';
import { PushNotificationService, PushNotificationData } from '../../application/ports/PushNotificationService';

export class FirebasePushNotificationService implements PushNotificationService {
  private messaging: admin.messaging.Messaging;

  constructor() {
    try {
      // Intentar usar variables de entorno primero
      if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
        console.log('🔥 Intentando inicializar Firebase con variables de entorno...');
        
        // Procesar la clave privada para manejar diferentes formatos
        let privateKey = process.env.FIREBASE_PRIVATE_KEY;
        if (privateKey) {
          // Reemplazar \n literales con saltos de línea reales
          privateKey = privateKey.replace(/\\n/g, '\n');
          
          // Si no tiene el formato PEM correcto, agregarlo
          if (!privateKey.includes('-----BEGIN PRIVATE KEY-----')) {
            privateKey = `-----BEGIN PRIVATE KEY-----\n${privateKey}\n-----END PRIVATE KEY-----`;
          }
        }

        // Crear el objeto de credenciales desde las variables de entorno
        const serviceAccount = {
          type: 'service_account',
          project_id: process.env.FIREBASE_PROJECT_ID,
          private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
          private_key: privateKey,
          client_email: process.env.FIREBASE_CLIENT_EMAIL,
          client_id: process.env.FIREBASE_CLIENT_ID,
          auth_uri: process.env.FIREBASE_AUTH_URI || 'https://accounts.google.com/o/oauth2/auth',
          token_uri: process.env.FIREBASE_TOKEN_URI || 'https://oauth2.googleapis.com/token',
          auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
          client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL
        };

        console.log('   📧 Client Email:', serviceAccount.client_email);
        console.log('   🆔 Project ID:', serviceAccount.project_id);
        console.log('   🔑 Private Key ID:', serviceAccount.private_key_id?.substring(0, 8) + '...');

        // Inicializar Firebase Admin
        if (!admin.apps.length) {
          admin.initializeApp({
            credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
            projectId: process.env.FIREBASE_PROJECT_ID
          });
        }
        console.log('✅ Firebase inicializado con variables de entorno');
      } else {
        throw new Error('Variables de entorno incompletas, usando fallback');
      }
    } catch (error) {
      // Fallback a archivo JSON
      console.log('⚠️ Error con variables de entorno, usando archivo JSON como fallback...');
      console.log('🔥 Inicializando Firebase con archivo JSON...');
      
      try {
        const serviceAccountPath = path.join(__dirname, '../../../xuma-6f453-firebase-adminsdk-fbsvc-9239927607.json');
        
        if (!admin.apps.length) {
          admin.initializeApp({
            credential: admin.credential.cert(require(serviceAccountPath))
          });
        }
        console.log('✅ Firebase inicializado correctamente con archivo JSON');
      } catch (jsonError) {
        console.error('❌ Error inicializando Firebase con archivo JSON:', jsonError);
        throw new Error(`No se pudo inicializar Firebase: ${jsonError}`);
      }
    }

    this.messaging = admin.messaging();
  }

  async sendNotification(notificationData: PushNotificationData): Promise<void> {
    const message: admin.messaging.Message = {
      token: notificationData.deviceToken,
      notification: {
        title: notificationData.title,
        body: notificationData.body,
        imageUrl: notificationData.imageUrl
      },
      data: notificationData.data,
      android: {
        notification: {
          icon: 'ic_notification',
          color: '#4CAF50', // Verde para Xuma'a
          sound: 'default'
        }
      },
      apns: {
        payload: {
          aps: {
            sound: 'default',
            badge: 1
          }
        }
      }
    };

    try {
      const response = await admin.messaging().send(message);
      console.log('Successfully sent message:', response);
    } catch (error: any) {
      console.error('Error sending message:', error);
      throw new Error(`Failed to send push notification: ${error.message}`);
    }
  }
}