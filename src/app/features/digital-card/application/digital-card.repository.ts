import { CustomLink, Lead, NfcCard, Profile, SocialLink } from '../domain/digital-card.types';

export abstract class DigitalCardRepository {
  abstract getCurrentProfile(): Profile;
  abstract getSocialLinks(): readonly SocialLink[];
  abstract getCustomLinks(): readonly CustomLink[];
  abstract getNfcCard(): NfcCard;
  abstract getLeads(): readonly Lead[];
}
