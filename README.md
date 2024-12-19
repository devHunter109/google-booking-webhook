# Google Calendar Webhook Test

This project demonstrates integration with Google Calendar API, including OAuth2 authentication, webhook notifications, and event management.

## Prerequisites

- Node.js and npm
- PostgreSQL database
- ngrok for webhook testing
- Google Cloud Console account

## Initial Setup

1. Create a new project:
```bash
mkdir och-test
cd och-test
npm init -y
```

2. Install dependencies:
```bash
npm install express cors dotenv googleapis @prisma/client
npm install --save-dev typescript @types/express @types/node @types/cors
```

3. Initialize TypeScript:
```bash
npx tsc --init
```

## Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable Google Calendar API
4. Create OAuth 2.0 credentials
   - Set authorized redirect URI: `http://localhost:3000/auth/google/callback`
   - Download client credentials

## Environment Configuration

Create `.env` file:
```env
PORT=3000
DATABASE_URL="postgresql://och:och@localhost:5432/och_test"
GOOGLE_CLIENT_ID="your_client_id"
GOOGLE_CLIENT_SECRET="your_client_secret"
GOOGLE_REDIRECT_URI="http://localhost:3000/auth/google/callback"
GOOGLE_CALENDAR_ID="your_calendar_id"
WEBHOOK_SECRET="your_webhook_secret"
```

## Project Structure

```
och-test/
├── src/
│   ├── app.ts                    # Main application file
│   ├── routes/
│   │   ├── auth.ts              # OAuth routes
│   │   ├── events.ts            # Calendar event routes
│   │   └── webhooks.ts          # Webhook handling
│   └── services/
│       ├── googleCalendar.ts    # Calendar service
│       └── verification.ts       # Webhook verification
├── .env
└── package.json
```

## Authentication Setup

1. Start the server:
```bash
npm start
```

2. Get OAuth tokens:
   - Visit `http://localhost:3000/auth/google`
   - Complete Google OAuth flow
   - Copy tokens from console output

3. Update `.env` with tokens:
```env
GOOGLE_ACCESS_TOKEN="your_access_token"
GOOGLE_REFRESH_TOKEN="your_refresh_token"
```

## Webhook Setup

1. Install ngrok:
```bash
npm install -g ngrok
```

2. Start ngrok:
```bash
ngrok http 3000
```

3. Update webhook URL in setupWebhook.ts with your ngrok URL
4. Run webhook setup:
```bash
ts-node src/setupWebhook.ts
```

## Testing Endpoints

### 1. Test Google Calendar Connection
```bash
GET http://localhost:3000/api/webhooks/test-google-auth
```

### 2. Create Calendar Event
```bash
POST http://localhost:3000/api/events/create
Content-Type: application/json

{
  "summary": "Test Event",
  "description": "Test Description",
  "startTime": "2024-01-20T10:00:00Z",
  "endTime": "2024-01-20T11:00:00Z",
  "attendees": [
    {"email": "attendee@example.com"}
  ]
}
```

### 3. Test Webhook
```bash
POST http://localhost:3000/api/webhooks/google-booking-webhook
Headers:
x-goog-channel-id: {from setupWebhook console log}
x-goog-resource-id: {from setupWebhook console log}
x-goog-resource-state: exists

Body:
{
  "resource": {
    "id": "{event_id from test-google-auth response}"
  }
}
```

## Key Files Description

### app.ts
```typescript
// Main Express application setup
// Routes registration
// Middleware configuration
```

### routes/auth.ts
```typescript
// OAuth2 authentication routes
// Scopes: calendar.events, calendar.readonly
```

### routes/events.ts
```typescript
// Calendar event creation and management
// Event CRUD operations
```

### routes/webhooks.ts
```typescript
// Webhook endpoint for Calendar notifications
// Event updates handling
```

### services/googleCalendar.ts
```typescript
// Google Calendar API integration
// OAuth2 client configuration
```

## Troubleshooting

1. OAuth Errors:
   - Verify credentials in Google Cloud Console
   - Check redirect URI matches exactly
   - Ensure scopes are properly configured

2. Webhook Issues:
   - Verify ngrok URL is current
   - Check webhook secret matches
   - Ensure proper headers in requests

3. Event Creation Errors:
   - Verify access token is valid
   - Check calendar ID is correct
   - Ensure datetime format is correct

## Required Scopes
```typescript
[
  'https://www.googleapis.com/auth/calendar.events',
  'https://www.googleapis.com/auth/calendar.readonly'
]
```

## Development Flow

1. Start development server:
```bash
npm run dev
```

2. Start ngrok:
```bash
ngrok http 3000
```

3. Setup webhook:
```bash
ts-node src/setupWebhook.ts
```

4. Monitor webhook notifications in server logs

## Notes

- Keep your .env file secure and never commit it
- Refresh tokens periodically
- Monitor ngrok URL changes
- Test webhook with different event states
```

This README provides a complete guide from project initialization to testing, including all necessary setup steps and configurations.
