const fs = require('fs');
const path = require('path');

// Leer las variables de entorno desde el archivo .env
require('dotenv').config();

const firebaseConfig = {
  type: "service_account",
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI || "https://accounts.google.com/o/oauth2/auth",
  token_uri: process.env.FIREBASE_TOKEN_URI || "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL
};

// Escribir el archivo JSON
const configPath = path.join(__dirname, 'firebase-service-account.json');
fs.writeFileSync(configPath, JSON.stringify(firebaseConfig, null, 2));

console.log('✅ Archivo de configuración de Firebase generado:', configPath);
console.log('🔍 Longitud de clave privada:', firebaseConfig.private_key?.length || 0);
console.log('🔍 Contiene END:', firebaseConfig.private_key?.includes('-----END PRIVATE KEY-----') || false);