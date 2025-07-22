// Ejemplos de uso del Xuma'a Notification Service
// Estos ejemplos muestran cómo otros microservicios pueden usar este servicio

const axios = require('axios');

const BASE_URL = 'http://localhost:3005/api/notifications';
const JWT_TOKEN = 'tu_jwt_token_aqui'; // Reemplazar con un token válido

const headers = {
  'Authorization': `Bearer ${JWT_TOKEN}`,
  'Content-Type': 'application/json'
};

// Ejemplo 1: Enviar correo de bienvenida
async function sendWelcomeEmail() {
  try {
    const response = await axios.post(`${BASE_URL}/email/welcome`, {
      to: 'nuevo.usuario@ejemplo.com',
      userName: 'Juan Pérez',
      appUrl: 'https://xumaa.com'
    }, { headers });

    console.log('✅ Correo de bienvenida enviado:', response.data);
  } catch (error) {
    console.error('❌ Error enviando correo de bienvenida:', error.response?.data || error.message);
  }
}

// Ejemplo 2: Enviar correo de recordatorio
async function sendReminderEmail() {
  try {
    const response = await axios.post(`${BASE_URL}/email/reminder`, {
      to: 'usuario@ejemplo.com',
      userName: 'María García',
      reminderType: 'Desafío pendiente',
      reminderMessage: 'Tienes un desafío de reciclaje esperándote. ¡Complétalo y gana puntos!',
      ecoFact: '¿Sabías que reciclar una tonelada de papel salva 17 árboles?',
      appUrl: 'https://xumaa.com/challenges'
    }, { headers });

    console.log('✅ Correo de recordatorio enviado:', response.data);
  } catch (error) {
    console.error('❌ Error enviando correo de recordatorio:', error.response?.data || error.message);
  }
}

// Ejemplo 3: Enviar notificación push
async function sendPushNotification() {
  try {
    const response = await axios.post(`${BASE_URL}/push`, {
      deviceToken: 'token_del_dispositivo_firebase',
      title: '🌱 ¡Nueva misión disponible!',
      body: 'Completa tu desafío diario de ahorro de agua y gana 50 puntos',
      data: {
        type: 'challenge',
        challengeId: '123',
        points: '50'
      },
      imageUrl: 'https://xumaa.com/images/water-challenge.jpg'
    }, { headers });

    console.log('✅ Notificación push enviada:', response.data);
  } catch (error) {
    console.error('❌ Error enviando notificación push:', error.response?.data || error.message);
  }
}

// Ejemplo 4: Enviar correo personalizado
async function sendCustomEmail() {
  try {
    const response = await axios.post(`${BASE_URL}/email`, {
      to: 'usuario@ejemplo.com',
      subject: '🏆 ¡Felicidades por tu logro!',
      templateName: 'general',
      templateData: {
        content: `
          <h2>¡Increíble trabajo! 🎉</h2>
          <p>Has completado <strong>10 desafíos ambientales</strong> este mes.</p>
          <p>Tu impacto:</p>
          <ul>
            <li>🌊 Ahorraste 500 litros de agua</li>
            <li>♻️ Reciclaste 15 kg de materiales</li>
            <li>🌱 Redujiste 25 kg de CO₂</li>
          </ul>
          <p>¡Sigue así y ayuda a salvar nuestro planeta!</p>
        `
      }
    }, { headers });

    console.log('✅ Correo personalizado enviado:', response.data);
  } catch (error) {
    console.error('❌ Error enviando correo personalizado:', error.response?.data || error.message);
  }
}

// Ejemplo 5: Obtener historial de notificaciones
async function getNotificationHistory() {
  try {
    const response = await axios.get(`${BASE_URL}/history?limit=10`, { headers });

    console.log('✅ Historial obtenido:', response.data);
  } catch (error) {
    console.error('❌ Error obteniendo historial:', error.response?.data || error.message);
  }
}

// Ejemplo 6: Verificar estado del servicio
async function checkHealth() {
  try {
    const response = await axios.get('http://localhost:3005/health');
    console.log('✅ Servicio funcionando:', response.data);
  } catch (error) {
    console.error('❌ Servicio no disponible:', error.message);
  }
}

// Ejecutar ejemplos
async function runExamples() {
  console.log('🌱 Ejecutando ejemplos del Xuma\'a Notification Service...\n');

  await checkHealth();
  console.log('---');

  await sendWelcomeEmail();
  console.log('---');

  await sendReminderEmail();
  console.log('---');

  await sendPushNotification();
  console.log('---');

  await sendCustomEmail();
  console.log('---');

  await getNotificationHistory();
  console.log('---');

  console.log('✅ Ejemplos completados!');
}

// Ejecutar si se llama directamente
if (require.main === module) {
  runExamples().catch(console.error);
}

module.exports = {
  sendWelcomeEmail,
  sendReminderEmail,
  sendPushNotification,
  sendCustomEmail,
  getNotificationHistory,
  checkHealth
};