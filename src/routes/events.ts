import express from 'express';
import { google } from 'googleapis';
import { oauth2Client } from '../services/googleCalendar';

const router = express.Router();

router.post('/create', async (req, res) => {
  try {
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    
    const event = {
      summary: req.body.summary,
      description: req.body.description,
      start: {
        dateTime: req.body.startTime,
        timeZone: 'UTC',
      },
      end: {
        dateTime: req.body.endTime,
        timeZone: 'UTC',
      },
      attendees: req.body.attendees || [],
    };

    const response = await calendar.events.insert({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      requestBody: event,
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Failed to create event' });
  }
});

export default router; 