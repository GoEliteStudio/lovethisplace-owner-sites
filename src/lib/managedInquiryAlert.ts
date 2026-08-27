import { sendEmail } from './emailService';
import { FROM_EMAIL, GOELITE_INBOX } from './emailRouting';

export type ManagedInquiryFailureAlert = {
  incidentId: string;
  propertyName: string;
  fullName: string;
  email: string;
  whatsapp: string;
  checkIn: string;
  checkOut: string;
  groupSize: number;
  notes: string;
  failure: string;
};

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export async function sendManagedInquiryFailureAlert(
  alert: ManagedInquiryFailureAlert,
) {
  const attemptedAt = new Date().toISOString();
  const subject = `[ACTION REQUIRED] ${alert.propertyName} inquiry forwarding failed`;
  const text = [
    'A valid traveler inquiry could not be delivered to the managed inquiry service.',
    'Contact the traveler manually and reconcile the inquiry before retrying.',
    '',
    `Property: ${alert.propertyName}`,
    `Name: ${alert.fullName}`,
    `Email: ${alert.email}`,
    `WhatsApp: ${alert.whatsapp}`,
    `Dates: ${alert.checkIn} to ${alert.checkOut}`,
    `Guests: ${alert.groupSize}`,
    `Notes: ${alert.notes || 'None'}`,
    `Failure: ${alert.failure}`,
    `Incident ID: ${alert.incidentId}`,
    `Attempted at: ${attemptedAt}`,
  ].join('\n');
  const rows = [
    ['Property', alert.propertyName],
    ['Name', alert.fullName],
    ['Email', alert.email],
    ['WhatsApp', alert.whatsapp],
    ['Dates', `${alert.checkIn} to ${alert.checkOut}`],
    ['Guests', String(alert.groupSize)],
    ['Notes', alert.notes || 'None'],
    ['Failure', alert.failure],
    ['Incident ID', alert.incidentId],
    ['Attempted at', attemptedAt],
  ]
    .map(
      ([label, value]) =>
        `<tr><th style="padding:8px;text-align:left;vertical-align:top">${escapeHtml(label)}</th><td style="padding:8px">${escapeHtml(value)}</td></tr>`,
    )
    .join('');

  return sendEmail({
    to: GOELITE_INBOX,
    subject,
    html:
      '<h2>Managed inquiry forwarding failed</h2>' +
      '<p>A valid traveler inquiry was not delivered. Contact the traveler manually and reconcile the inquiry before retrying.</p>' +
      `<table style="border-collapse:collapse">${rows}</table>`,
    text,
    replyTo: alert.email,
    fromEmail: FROM_EMAIL,
    fromName: 'LoveThisPlace Monitoring',
  });
}
