import { CustomLink, Profile, PublicProfile, SocialLink } from './digital-card.types';

export function toPublicProfile(
  profile: Profile,
  socialLinks: readonly SocialLink[],
  customLinks: readonly CustomLink[],
): PublicProfile {
  return {
    publicCode: profile.publicCode,
    firstName: profile.firstName,
    lastName: profile.lastName,
    jobTitle: profile.jobTitle,
    companyName: profile.companyName,
    profilePhotoUrl: profile.profilePhotoUrl,
    coverImageUrl: profile.coverImageUrl,
    phone: profile.showPhone ? profile.phone : undefined,
    email: profile.showEmail ? profile.email : undefined,
    whatsapp: profile.showWhatsapp ? profile.whatsapp : undefined,
    website: profile.showWebsite ? profile.website : undefined,
    address: profile.showAddress ? profile.address : undefined,
    city: profile.showCity ? profile.city : undefined,
    bio: profile.showBio ? profile.bio : undefined,
    theme: profile.theme,
    primaryColor: profile.primaryColor,
    accentColor: profile.accentColor,
    buttonStyle: profile.buttonStyle,
    socialLinks: socialLinks.filter((link) => link.isVisible).sort(byPosition),
    customLinks: customLinks.filter((link) => link.isVisible).sort(byPosition),
  };
}

function byPosition(left: { readonly position: number }, right: { readonly position: number }): number {
  return left.position - right.position;
}
