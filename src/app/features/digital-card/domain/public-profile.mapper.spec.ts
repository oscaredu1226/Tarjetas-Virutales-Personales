import { CustomLink, Profile, SocialLink } from './digital-card.types';
import { toPublicProfile } from './public-profile.mapper';
import { buildVCard } from './vcard';

const profile: Profile = {
  id: 'profile-1',
  userId: 'user-1',
  publicCode: 'ST-2048',
  firstName: 'Sebastian',
  lastName: 'Torres',
  jobTitle: 'Consultor',
  companyName: 'CIBERSEGURIDAD.pe',
  bio: 'Bio privada',
  profilePhotoUrl: '',
  coverImageUrl: '',
  phone: '+51 999 999 999',
  email: 'privado@example.com',
  secondaryEmail: 'otro@example.com',
  whatsapp: '+51 999 999 999',
  website: 'https://example.com',
  address: 'Direccion privada',
  city: 'Lima',
  country: 'Peru',
  showPhone: true,
  showEmail: false,
  showWhatsapp: false,
  showWebsite: true,
  showAddress: false,
  showBio: false,
  showCity: true,
  theme: 'professional',
  primaryColor: '#0866ff',
  accentColor: '#00d9ff',
  buttonStyle: 'rounded',
  isActive: true,
};

const socialLinks: readonly SocialLink[] = [
  { id: 'hidden', profileId: 'profile-1', platform: 'Facebook', url: 'https://facebook.com/x', position: 1, isVisible: false },
  { id: 'visible', profileId: 'profile-1', platform: 'LinkedIn', url: 'https://linkedin.com/in/x', position: 2, isVisible: true },
];

const customLinks: readonly CustomLink[] = [
  { id: 'portfolio', profileId: 'profile-1', title: 'Portafolio', url: 'https://example.com', icon: 'folder', position: 1, isVisible: true },
];

describe('toPublicProfile', () => {
  it('only exposes fields explicitly marked as public', () => {
    const publicProfile = toPublicProfile(profile, socialLinks, customLinks);

    expect(publicProfile.email).toBeUndefined();
    expect(publicProfile.whatsapp).toBeUndefined();
    expect(publicProfile.address).toBeUndefined();
    expect(publicProfile.bio).toBeUndefined();
    expect(publicProfile.phone).toBe(profile.phone);
    expect(publicProfile.website).toBe(profile.website);
    expect(publicProfile.socialLinks).toHaveLength(1);
    expect(publicProfile.socialLinks[0]?.platform).toBe('LinkedIn');
  });

  it('builds vCard without private fields', () => {
    const vcard = buildVCard(toPublicProfile(profile, socialLinks, customLinks));

    expect(vcard).toContain('FN:Sebastian Torres');
    expect(vcard).toContain(`TEL:${profile.phone}`);
    expect(vcard).not.toContain(profile.email);
    expect(vcard).not.toContain(profile.address);
  });
});
