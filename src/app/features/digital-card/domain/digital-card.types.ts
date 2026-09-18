export type UserRole = 'USER' | 'ADMIN';
export type ButtonStyle = 'rounded' | 'square' | 'outline';
export type CardTheme = 'professional' | 'minimal' | 'executive' | 'technological';
export type NfcCardStatus = 'AVAILABLE' | 'ASSIGNED' | 'BLOCKED' | 'DISABLED';
export type LeadSource = 'NFC' | 'QR' | 'PUBLIC_PROFILE' | 'WHATSAPP' | 'OTHER';
export type LeadStatus = 'NEW' | 'CONTACTED' | 'RESPONDED' | 'SAVED' | 'ARCHIVED';

export interface VisibilitySettings {
  readonly showPhone: boolean;
  readonly showEmail: boolean;
  readonly showWhatsapp: boolean;
  readonly showWebsite: boolean;
  readonly showAddress: boolean;
  readonly showBio: boolean;
  readonly showCity: boolean;
}

export interface Profile extends VisibilitySettings {
  readonly id: string;
  readonly userId: string;
  readonly publicCode: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly jobTitle: string;
  readonly companyName: string;
  readonly bio: string;
  readonly profilePhotoUrl: string;
  readonly coverImageUrl: string;
  readonly phone: string;
  readonly email: string;
  readonly secondaryEmail: string;
  readonly whatsapp: string;
  readonly website: string;
  readonly address: string;
  readonly city: string;
  readonly country: string;
  readonly theme: CardTheme;
  readonly primaryColor: string;
  readonly accentColor: string;
  readonly buttonStyle: ButtonStyle;
  readonly isActive: boolean;
}

export interface SocialLink {
  readonly id: string;
  readonly profileId: string;
  readonly platform: string;
  readonly url: string;
  readonly position: number;
  readonly isVisible: boolean;
}

export interface CustomLink {
  readonly id: string;
  readonly profileId: string;
  readonly title: string;
  readonly url: string;
  readonly icon: string;
  readonly position: number;
  readonly isVisible: boolean;
}

export interface NfcCard {
  readonly id: string;
  readonly cardCode: string;
  readonly profileId: string | null;
  readonly status: NfcCardStatus;
  readonly assignedAt: string | null;
  readonly lastReadAt: string | null;
  readonly totalReads: number;
}

export interface Lead {
  readonly id: string;
  readonly profileId: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly company: string;
  readonly email: string;
  readonly phone: string;
  readonly source: LeadSource;
  readonly status: LeadStatus;
  readonly createdAt: string;
}

export interface PublicProfile {
  readonly publicCode: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly jobTitle: string;
  readonly companyName: string;
  readonly profilePhotoUrl: string;
  readonly coverImageUrl: string;
  readonly phone?: string;
  readonly email?: string;
  readonly whatsapp?: string;
  readonly website?: string;
  readonly address?: string;
  readonly city?: string;
  readonly bio?: string;
  readonly theme: CardTheme;
  readonly primaryColor: string;
  readonly accentColor: string;
  readonly buttonStyle: ButtonStyle;
  readonly socialLinks: readonly SocialLink[];
  readonly customLinks: readonly CustomLink[];
}
