import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { PublicProfile } from '../../features/digital-card/domain/digital-card.types';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIcon],
  selector: 'app-digital-card-preview',
  template: `
    <article class="digital-card" [style.--card-primary]="profile().primaryColor" [style.--card-accent]="profile().accentColor">
      <div class="circuit-grid" aria-hidden="true"></div>
      <header class="card-brand" aria-label="CIBERSEGURIDAD.pe - Gestores de tu seguridad">
        <img class="card-brand-icon" src="/assets/branding/app-icon.png" alt="" />
        <span class="card-wordmark"><strong>CIBERSEGURIDAD.pe</strong><small>Gestores de tu seguridad</small></span>
      </header>
      <figure class="card-portrait">
        <div class="profile-photo">
          @if (profile().profilePhotoUrl) {
            <img [src]="profile().profilePhotoUrl" [alt]="profile().firstName + ' ' + profile().lastName" />
          } @else {
            <span>{{ profile().firstName[0] }}{{ profile().lastName[0] }}</span>
          }
        </div>
        <figcaption><span class="availability-dot" aria-hidden="true"></span>Disponible para conectar</figcaption>
      </figure>
      <section class="card-identity">
        <h2>{{ profile().firstName }} {{ profile().lastName }}</h2>
        <p>{{ profile().jobTitle }}</p>
        <strong class="card-company"><ng-icon name="lucideBuilding2" />{{ profile().companyName }}</strong>
        <div class="card-contact">
          @if (profile().bio) {
            <span class="card-specialty" [title]="profile().bio"><ng-icon name="lucideShieldCheck" /><span class="card-contact-text">{{ profile().bio }}</span></span>
          }
          @if (profile().city) {
            <span><ng-icon name="lucideMapPin" /><span class="card-contact-text">{{ profile().city }}, Peru</span></span>
          }
          @if (profile().email) {
            <span><ng-icon name="lucideMail" /><span class="card-contact-text">{{ profile().email }}</span></span>
          }
          @if (profile().website) {
            <span><ng-icon name="lucideLink" /><span class="card-contact-text">{{ profile().website }}</span></span>
          }
        </div>
      </section>
      <footer>
        <span>"Personas seguras, organizaciones mas fuertes"</span>
      </footer>
      <div class="card-actions">
        <button type="button" class="secondary-button compact" (click)="downloadContact()"><ng-icon name="lucideUserPlus" />Guardar contacto</button>
        @if (profile().whatsapp || profile().phone) {
          <a class="whatsapp-button compact" [href]="whatsappUrl()" target="_blank" rel="noopener noreferrer"><ng-icon name="simpleWhatsapp" />WhatsApp</a>
        }
        @if (profile().email) {
          <a class="primary-button compact" [href]="'mailto:' + profile().email"><ng-icon name="lucideMail" />Email</a>
        }
      </div>
    </article>
  `,
})
export class DigitalCardPreviewComponent {
  readonly profile = input.required<PublicProfile>();

  whatsappUrl(): string {
    return `https://wa.me/${(this.profile().whatsapp || this.profile().phone || '').replace(/\D/g, '')}`;
  }

  downloadContact(): void {
    const profile = this.profile();
    const escape = (value: string) => value.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');
    const lines = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `N:${escape(profile.lastName)};${escape(profile.firstName)};;;`,
      `FN:${escape(`${profile.firstName} ${profile.lastName}`)}`,
      `ORG:${escape(profile.companyName)}`,
      `TITLE:${escape(profile.jobTitle)}`,
    ];
    if (profile.phone) lines.push(`TEL;TYPE=CELL:${escape(profile.phone)}`);
    if (profile.email) lines.push(`EMAIL;TYPE=WORK:${escape(profile.email)}`);
    if (profile.website) lines.push(`URL:${escape(profile.website)}`);
    lines.push('END:VCARD');

    const url = URL.createObjectURL(new Blob([lines.join('\r\n')], { type: 'text/vcard;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `${profile.firstName}-${profile.lastName}.vcf`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}
