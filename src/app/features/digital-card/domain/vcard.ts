import { PublicProfile } from './digital-card.types';

export function buildVCard(profile: PublicProfile): string {
  const fullName = `${profile.firstName} ${profile.lastName}`.trim();
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${escapeVCard(fullName)}`,
    `ORG:${escapeVCard(profile.companyName)}`,
    `TITLE:${escapeVCard(profile.jobTitle)}`,
  ];

  if (profile.phone) {
    lines.push(`TEL:${escapeVCard(profile.phone)}`);
  }

  if (profile.email) {
    lines.push(`EMAIL:${escapeVCard(profile.email)}`);
  }

  if (profile.website) {
    lines.push(`URL:${escapeVCard(profile.website)}`);
  }

  lines.push('END:VCARD');
  return lines.join('\r\n');
}

function escapeVCard(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');
}
