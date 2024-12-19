import express from 'express';
import { getGoogleBookingDetails, saveBooking } from '../services/googleCalendar';
import { verifyGoogleNotification } from '../services/verification';
import { google } from 'googleapis';
import { oauth2Client } from '../services/googleCalendar';

const router = express.Router();

// Add this test route to verify your credentials
router.get('/test-google-auth', async (req, res) => {
    try {
        const calendar = google.calendar({
            version: 'v3',
            auth: oauth2Client
        });

        const response = await calendar.events.list({
            calendarId: process.env.GOOGLE_CALENDAR_ID,
            timeMin: (new Date()).toISOString(),
            maxResults: 10,
            singleEvents: true,
            orderBy: 'startTime',
        });

        res.json(response.data);
    } catch (err: unknown) {
        console.error('Error testing Google Calendar API:', err);
        res.status(500).json({ error: err instanceof Error ? err.message : 'Unknown error' });
    }
});

router.post('/google-booking-webhook', async (req, res) => {
    try {
        const { headers, body } = req;

        if (!verifyGoogleNotification(headers)) {
            res.status(401).send('Unauthorized');
        } else {
            const eventId = body.resource.id;
            const bookingDetails = await getGoogleBookingDetails(eventId);
            await saveBooking(bookingDetails);

            res.status(200).send('OK');
        }
    } catch (error) {
        console.error('Webhook error:', error);
        res.status(500).send('Internal Server Error');
    }
});

export default router; 