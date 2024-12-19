import { google } from 'googleapis';
import { oauth2Client } from './services/googleCalendar';
import crypto from 'crypto';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function setupWebhook() {
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
  
  try {
    const channelId = crypto.randomUUID();
    const response = await calendar.events.watch({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      requestBody: {
        id: channelId, // Unique channel ID
        type: 'web_hook',
        address: `https://${process.env.NGROK_URL}/api/webhooks/google-booking-webhook`, // Update with your ngrok URL
        token: process.env.WEBHOOK_SECRET
      }
    });
    
    console.log('Channel ID:', channelId);
    console.log('Resource ID:', response.data.resourceId);
    console.log('Webhook setup successful:', response.data);
  } catch (error) {
    console.error('Webhook setup failed:', error);
  }
}

setupWebhook(); 