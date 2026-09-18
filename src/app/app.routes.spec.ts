import { routes } from './app.routes';
import {
  RICARDO_CARD_CODE,
  RICARDO_CARD_PATH,
  ricardoAttachments,
  ricardoProfile,
  ricardoVideoUrl,
} from './features/public-profile/data/ricardo-card.data';
import { buildVCard } from './features/digital-card/domain/vcard';

describe('field-test public card', () => {
  it('keeps one permanent public route and redirects every other route to it', () => {
    expect(routes).toHaveLength(2);
    expect(routes[0]?.path).toBe(RICARDO_CARD_PATH);
    expect(routes[1]?.path).toBe('**');
    expect(routes[1]?.redirectTo).toBe(RICARDO_CARD_PATH);
    expect(ricardoProfile.publicCode).toBe(RICARDO_CARD_CODE);
  });

  it('uses Ricardo contact details and includes the provided resources', () => {
    const vcard = buildVCard(ricardoProfile);
    expect(vcard).toContain('FN:Ricardo Lanatta Forger');
    expect(vcard).toContain('TEL:+51 998 441 992');
    expect(vcard).toContain('EMAIL:rlanattaf@ciberseguridad.com.pe');
    expect(ricardoAttachments).toHaveLength(2);
    expect(ricardoVideoUrl).toMatch(/\.mp4$/);
  });
});
