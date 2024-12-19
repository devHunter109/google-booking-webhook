import { google } from 'googleapis';
import { config } from '../config/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Set credentials
oauth2Client.setCredentials({
  access_token: process.env.GOOGLE_ACCESS_TOKEN,
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN
});

const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

export async function getGoogleBookingDetails(eventId: string) {
  try {
    const response = await calendar.events.get({
      calendarId: config.googleCalendarId,
      eventId: eventId,
    });

    const event = response.data;

    return {
      id: event.id,
      status: event.status,
      customerName: event.summary?.replace('Reservation: ', ''),
      startTime: event.start?.dateTime || event.start?.date,
      endTime: event.end?.dateTime || event.end?.date,
      customerInfo: event.attendees?.[0] ? {
        email: event.attendees[0].email,
        responseStatus: event.attendees[0].responseStatus,
      } : null,
      partySize: extractPartySize(event.description),
      notes: event.description,
      location: event.location,
    };
  } catch (error) {
    console.error('Error fetching Google booking details:', error);
    throw error;
  }
}

function extractPartySize(description?: string | null): number | null {
  if (!description) return null;
  const partySizeMatch = description.match(/(?:Party size|Number of guests):\s*(\d+)/i);
  return partySizeMatch ? parseInt(partySizeMatch[1], 10) : null;
}

export async function saveBooking(bookingDetails: any) {
  try {
    return await prisma.booking.upsert({
      where: { googleEventId: bookingDetails.id },
      update: {
        customerName: bookingDetails.customerName,
        customerEmail: bookingDetails.customerInfo?.email,
        partySize: bookingDetails.partySize,
        startTime: new Date(bookingDetails.startTime),
        endTime: new Date(bookingDetails.endTime),
        status: bookingDetails.status,
        notes: bookingDetails.notes,
      },
      create: {
        googleEventId: bookingDetails.id,
        customerName: bookingDetails.customerName,
        customerEmail: bookingDetails.customerInfo?.email,
        partySize: bookingDetails.partySize,
        startTime: new Date(bookingDetails.startTime),
        endTime: new Date(bookingDetails.endTime),
        status: bookingDetails.status,
        notes: bookingDetails.notes,
      },
    });
  } catch (error) {
    console.error('Error saving booking:', error);
    throw error;
  }
} 