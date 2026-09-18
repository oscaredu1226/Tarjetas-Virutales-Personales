import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIcon } from '@ng-icons/core';
import { DemoDigitalCardRepository } from '../../digital-card/infrastructure/demo-digital-card.repository';
import { DigitalCardPreviewComponent } from '../../../shared/ui/digital-card-preview.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DigitalCardPreviewComponent, FormsModule, NgIcon],
  template: `
    <section class="page-header">
      <h1>Contacto y visibilidad</h1>
      <p>Gestiona tu informacion de contacto y decide que mostrar en tu tarjeta digital NFC.</p>
    </section>

    <section class="two-column">
      <article class="plain-card">
        <div class="tabs" aria-label="Secciones de contacto">
          <button type="button" [class.active]="activeTab() === 'contact'" (click)="activeTab.set('contact')"><ng-icon name="lucideSettings" />Informacion de contacto</button>
          <button type="button" [class.active]="activeTab() === 'visibility'" (click)="activeTab.set('visibility')"><ng-icon name="lucideEye" />Preferencias de visibilidad</button>
        </div>
        @for (item of contactRows; track item.label) {
          <div class="contact-row">
            <span class="row-icon"><ng-icon [name]="item.icon" /></span>
            <div>
              <strong>{{ item.label }}</strong>
              <small>{{ item.help }}</small>
            </div>
            <input [value]="item.value" readonly />
            <span class="badge success">Verificado</span>
            <label class="switch">
              <input type="checkbox" [checked]="item.visible" (change)="toggle(item.field, $event)" />
              <span></span>
              <em>Mostrar en mi tarjeta publica</em>
            </label>
          </div>
        }
        <div class="info-note">{{ activeTab() === 'contact' ? 'Edita estos datos desde Mi perfil y administra aqui su exposicion publica.' : 'Activa o desactiva cada campo para controlar exactamente que aparece en la tarjeta publica.' }}</div>
      </article>
      <article class="plain-card preview-pane">
        <h2><ng-icon name="lucideEye" />Vista previa de tu tarjeta</h2>
        <app-digital-card-preview [profile]="data.publicProfile()" />
      </article>
    </section>
  `,
})
export class ContactVisibilityPage {
  readonly data = inject(DemoDigitalCardRepository);
  readonly activeTab = signal<'contact' | 'visibility'>('contact');

  get contactRows() {
    const profile = this.data.profile();
    return [
      { icon: 'lucidePhone', label: 'Telefono principal', help: 'Tu numero de contacto', value: profile.phone, field: 'showPhone' as const, visible: profile.showPhone },
      { icon: 'simpleWhatsapp', label: 'WhatsApp', help: 'Enlace directo a tu WhatsApp', value: profile.whatsapp, field: 'showWhatsapp' as const, visible: profile.showWhatsapp },
      { icon: 'lucideMail', label: 'Correo principal', help: 'Tu correo profesional', value: profile.email, field: 'showEmail' as const, visible: profile.showEmail },
      { icon: 'lucideMapPin', label: 'Direccion', help: 'Tu ubicacion profesional', value: profile.address, field: 'showAddress' as const, visible: profile.showAddress },
      { icon: 'lucideGlobe', label: 'Sitio web', help: 'Tu pagina o portafolio', value: profile.website, field: 'showWebsite' as const, visible: profile.showWebsite },
    ];
  }

  toggle(field: 'showPhone' | 'showEmail' | 'showWhatsapp' | 'showWebsite' | 'showAddress', event: Event): void {
    this.data.updateContactVisibility(field, (event.target as HTMLInputElement).checked);
  }
}
