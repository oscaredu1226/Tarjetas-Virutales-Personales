import { PublicProfile } from '../../digital-card/domain/digital-card.types';

// This public code is the permanent NFC/QR destination; profile content may change independently.
export const RICARDO_CARD_CODE = 'ricardo-lanatta-forger';
export const RICARDO_CARD_PATH = `p/${RICARDO_CARD_CODE}`;

export interface PublicAttachment {
  readonly title: string;
  readonly description: string;
  readonly url: string;
  readonly icon: string;
  readonly downloadName: string;
}

export const ricardoProfile: PublicProfile = {
  publicCode: RICARDO_CARD_CODE,
  firstName: 'Ricardo',
  lastName: 'Lanatta Forger',
  jobTitle: 'Gerente General',
  companyName: 'CIBERSEGURIDAD.pe',
  profilePhotoUrl: '',
  coverImageUrl: '/assets/branding/card-preview-background.png',
  phone: '+51 998 441 992',
  email: 'rlanattaf@ciberseguridad.com.pe',
  whatsapp: '+51 998 441 992',
  website: 'https://www.ciberseguridad.com.pe/',
  address: 'Av. Guardia Civil 974 Corpac - San Isidro',
  city: 'Lima',
  bio: 'Lidero CIBERSEGURIDAD.pe con un enfoque en gestión de riesgos, sistemas de gestión de seguridad de la información y cumplimiento de ISO/IEC 27001. Acompaño a las organizaciones a fortalecer su resiliencia digital con soluciones a su medida.',
  theme: 'executive',
  primaryColor: '#0d5fc9',
  accentColor: '#57c7ff',
  buttonStyle: 'rounded',
  socialLinks: [
    {
      id: 'ricardo-linkedin',
      profileId: RICARDO_CARD_CODE,
      platform: 'LinkedIn',
      url: 'https://www.linkedin.com/company/ciberseguridad-pe',
      position: 1,
      isVisible: true,
    },
  ],
  customLinks: [
    {
      id: 'ricardo-alianzas',
      profileId: RICARDO_CARD_CODE,
      title: 'Alianzas y portafolio',
      url: 'https://www.ciberseguridad.com.pe/alianzas/',
      icon: 'folder',
      position: 1,
      isVisible: true,
    },
  ],
};

export const ricardoAttachments: readonly PublicAttachment[] = [
  {
    title: 'Presentación corporativa 2026',
    description: 'Clientes, servicios y alianzas estratégicas',
    url: '/assets/ricardo/presentacion-clientes-alianzas-2026.pdf',
    icon: 'lucidePresentation',
    downloadName: 'CiberseguridadPE-presentacion-2026.pdf',
  },
  {
    title: 'Volante de servicios',
    description: 'Resumen de nuestra propuesta de ciberseguridad',
    url: '/assets/ricardo/volante-ciberseguridad.pdf',
    icon: 'lucideFileText',
    downloadName: 'CiberseguridadPE-volante.pdf',
  },
];

export const ricardoVideoUrl = '/assets/ricardo/video-ciberseguridad-pe-web.mp4';
