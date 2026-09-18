import { computed, Injectable, signal } from '@angular/core';
import {
  ButtonStyle,
  CardTheme,
  CustomLink,
  Lead,
  NfcCard,
  Profile,
  SocialLink,
} from '../domain/digital-card.types';
import { toPublicProfile } from '../domain/public-profile.mapper';
import { DigitalCardRepository } from '../application/digital-card.repository';

const profileId = '1f73f3e2-1b83-4bfb-9e0d-75cdd67ddf20';

const initialProfile: Profile = {
  id: profileId,
  userId: 'd9b9726c-b1eb-4b10-8e47-9e515e901c6c',
  publicCode: 'ST-2048',
  firstName: 'Sebastian',
  lastName: 'Torres',
  jobTitle: 'Consultor de Ciberseguridad',
  companyName: 'CIBERSEGURIDAD.pe',
  bio: 'Especialista en ciberseguridad con mas de 8 anos de experiencia asesorando a empresas en gestion de riesgos, proteccion de la informacion y transformacion digital segura.',
  profilePhotoUrl: '/assets/branding/profile-sebastian.png',
  coverImageUrl: '',
  phone: '+51 987 654 321',
  email: 'sebastian.torres@ciberseguridad.pe',
  secondaryEmail: 'storres.consultor@gmail.com',
  whatsapp: '+51 987 654 321',
  website: 'https://www.ciberseguridad.com.pe',
  address: 'Lima, Peru',
  city: 'Lima',
  country: 'Peru',
  showPhone: true,
  showEmail: true,
  showWhatsapp: true,
  showWebsite: true,
  showAddress: true,
  showBio: true,
  showCity: true,
  theme: 'technological',
  primaryColor: '#0866ff',
  accentColor: '#00d9ff',
  buttonStyle: 'rounded',
  isActive: true,
};

const initialSocialLinks: readonly SocialLink[] = [
  { id: 'sl-1', profileId, platform: 'LinkedIn', url: 'https://www.linkedin.com/in/sebastiantorres', position: 1, isVisible: true },
  { id: 'sl-2', profileId, platform: 'WhatsApp', url: 'https://wa.me/51987654321', position: 2, isVisible: true },
  { id: 'sl-3', profileId, platform: 'Facebook', url: 'https://www.facebook.com/ciberseguridad.pe', position: 3, isVisible: false },
  { id: 'sl-4', profileId, platform: 'Instagram', url: 'https://www.instagram.com/ciberseguridad.pe', position: 4, isVisible: true },
  { id: 'sl-5', profileId, platform: 'YouTube', url: 'https://www.youtube.com/@ciberseguridadpe', position: 5, isVisible: true },
];

const initialCustomLinks: readonly CustomLink[] = [
  { id: 'cl-1', profileId, title: 'Portafolio', url: 'https://www.ciberseguridad.com.pe/portafolio', icon: 'folder', position: 1, isVisible: true },
  { id: 'cl-2', profileId, title: 'Catalogo de servicios', url: 'https://www.ciberseguridad.com.pe/servicios', icon: 'document', position: 2, isVisible: true },
  { id: 'cl-3', profileId, title: 'Agenda una reunion', url: 'https://calendly.com/ciberseguridad/reunion', icon: 'calendar', position: 3, isVisible: true },
];

const initialLeads: readonly Lead[] = [
  { id: 'lead-1', profileId, firstName: 'Maria Fernanda', lastName: 'Lopez', company: 'Banco de Credito del Peru', email: 'maria.lopez@bcp.com.pe', phone: '+51 987 654 321', source: 'NFC', status: 'NEW', createdAt: 'Hoy, 10:42 a. m.' },
  { id: 'lead-2', profileId, firstName: 'Carlos', lastName: 'Ramirez', company: 'Microsoft', email: 'carlos.ramirez@microsoft.com', phone: '+51 999 123 456', source: 'WHATSAPP', status: 'CONTACTED', createdAt: 'Hoy, 09:15 a. m.' },
  { id: 'lead-3', profileId, firstName: 'Ana Lucia', lastName: 'Torres', company: 'Universidad de Lima', email: 'ana.torres@ulima.edu.pe', phone: '+51 982 321 987', source: 'QR', status: 'NEW', createdAt: 'Ayer, 05:23 p. m.' },
  { id: 'lead-4', profileId, firstName: 'Javier', lastName: 'Mendoza', company: 'Telefonica del Peru', email: 'javier.mendoza@telefonica.com', phone: '+51 944 776 655', source: 'NFC', status: 'RESPONDED', createdAt: 'Ayer, 11:08 a. m.' },
  { id: 'lead-5', profileId, firstName: 'Sofia', lastName: 'Chacon', company: 'Kyndryl', email: 'sofia.chacon@kyndryl.com', phone: '+51 936 887 766', source: 'PUBLIC_PROFILE', status: 'SAVED', createdAt: '15 Jun 2024' },
];

@Injectable({ providedIn: 'root' })
export class DemoDigitalCardRepository extends DigitalCardRepository {
  readonly profile = signal<Profile>(initialProfile);
  readonly socialLinks = signal<readonly SocialLink[]>(initialSocialLinks);
  readonly customLinks = signal<readonly CustomLink[]>(initialCustomLinks);
  readonly nfcCard = signal<NfcCard>({
    id: 'card-1',
    cardCode: 'NFC-ST-2048',
    profileId,
    status: 'ASSIGNED',
    assignedAt: '2024-06-12',
    lastReadAt: 'Hoy, 10:42 a. m.',
    totalReads: 248,
  });
  readonly leads = signal<readonly Lead[]>(initialLeads);
  readonly publicProfile = computed(() => toPublicProfile(this.profile(), this.socialLinks(), this.customLinks()));
  readonly publicUrl = computed(() => `https://ciberseguridad.com.pe/p/${this.profile().publicCode}`);

  override getCurrentProfile(): Profile {
    return this.profile();
  }

  override getSocialLinks(): readonly SocialLink[] {
    return this.socialLinks();
  }

  override getCustomLinks(): readonly CustomLink[] {
    return this.customLinks();
  }

  override getNfcCard(): NfcCard {
    return this.nfcCard();
  }

  override getLeads(): readonly Lead[] {
    return this.leads();
  }

  updateProfile(changes: Partial<Profile>): void {
    this.profile.update((profile) => ({ ...profile, ...changes }));
  }

  updateContactVisibility(field: keyof Pick<Profile, 'showPhone' | 'showEmail' | 'showWhatsapp' | 'showWebsite' | 'showAddress' | 'showBio' | 'showCity'>, visible: boolean): void {
    this.profile.update((profile) => ({ ...profile, [field]: visible }));
  }

  updateTheme(theme: CardTheme): void {
    this.profile.update((profile) => ({ ...profile, theme }));
  }

  updateColors(primaryColor: string, accentColor: string): void {
    this.profile.update((profile) => ({ ...profile, primaryColor, accentColor }));
  }

  updateButtonStyle(buttonStyle: ButtonStyle): void {
    this.profile.update((profile) => ({ ...profile, buttonStyle }));
  }

  toggleSocialLink(id: string): void {
    this.socialLinks.update((links) => links.map((link) => link.id === id ? { ...link, isVisible: !link.isVisible } : link));
  }

  removeSocialLink(id: string): void {
    this.socialLinks.update((links) => links.filter((link) => link.id !== id));
  }

  addSocialLink(platform: string, url: string): void {
    this.socialLinks.update((links) => [
      ...links,
      { id: crypto.randomUUID(), profileId, platform, url, position: links.length + 1, isVisible: true },
    ]);
  }

  toggleCustomLink(id: string): void {
    this.customLinks.update((links) => links.map((link) => link.id === id ? { ...link, isVisible: !link.isVisible } : link));
  }

  removeCustomLink(id: string): void {
    this.customLinks.update((links) => links.filter((link) => link.id !== id));
  }

  addCustomLink(title: string, url: string): void {
    this.customLinks.update((links) => [
      ...links,
      { id: crypto.randomUUID(), profileId, title, url, icon: 'link', position: links.length + 1, isVisible: true },
    ]);
  }
}
