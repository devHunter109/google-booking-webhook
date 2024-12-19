export const config = {
  port: process.env.PORT || 3000,
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  googleRedirectUri: process.env.GOOGLE_REDIRECT_URI,
  googleCalendarId: process.env.GOOGLE_CALENDAR_ID,
  webhookSecret: process.env.WEBHOOK_SECRET,
}; 