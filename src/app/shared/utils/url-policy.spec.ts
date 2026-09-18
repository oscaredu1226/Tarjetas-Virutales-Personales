import { isAllowedPublicUrl, normalizeUrl } from './url-policy';

describe('url-policy', () => {
  it('normalizes common web urls', () => {
    expect(normalizeUrl('www.ciberseguridad.com.pe')).toBe('https://www.ciberseguridad.com.pe');
  });

  it('blocks dangerous schemes', () => {
    expect(isAllowedPublicUrl('javascript:alert(1)')).toBe(false);
    expect(isAllowedPublicUrl('data:text/html,hi')).toBe(false);
    expect(isAllowedPublicUrl('file:///etc/passwd')).toBe(false);
  });

  it('allows explicitly supported public protocols', () => {
    expect(isAllowedPublicUrl('https://www.ciberseguridad.com.pe')).toBe(true);
    expect(isAllowedPublicUrl('mailto:soporte@ciberseguridad.pe')).toBe(true);
    expect(isAllowedPublicUrl('tel:+51987654321')).toBe(true);
  });
});
