import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIcon } from '@ng-icons/core';
import { DemoDigitalCardRepository } from '../../digital-card/infrastructure/demo-digital-card.repository';
import { isAllowedPublicUrl, normalizeUrl } from '../../../shared/utils/url-policy';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIcon, ReactiveFormsModule],
  template: `
    <section class="page-header">
      <h1>Redes sociales</h1>
      <p>Anade y gestiona tus redes sociales. Puedes activar o desactivar su visibilidad.</p>
    </section>

    <section class="plain-card">
      <form class="inline-form" [formGroup]="form" (ngSubmit)="add()">
        <label>Red social<input formControlName="platform" placeholder="LinkedIn" /></label>
        <label>URL<input formControlName="url" placeholder="https://..." /></label>
        <button class="primary-button" type="submit" [disabled]="form.invalid"><ng-icon name="lucidePlus" />Agregar red</button>
      </form>
      @if (urlError) {
        <p class="error-text">{{ urlError }}</p>
      }
      <div class="editable-list">
        @for (link of data.socialLinks(); track link.id) {
          <article class="editable-row">
            <span class="drag-handle" aria-hidden="true"><ng-icon name="lucideGripVertical" /></span>
            <span class="platform-icon"><ng-icon [name]="platformIcon(link.platform)" /></span>
            <div>
              <strong>{{ link.platform }}</strong>
              <a [href]="link.url" target="_blank" rel="noopener">{{ link.url }}</a>
            </div>
            <label class="switch">
              <input type="checkbox" [checked]="link.isVisible" (change)="data.toggleSocialLink(link.id)" />
              <span></span>
              <em>{{ link.isVisible ? 'Visible' : 'Oculto' }}</em>
            </label>
            <button class="icon-button danger" type="button" (click)="data.removeSocialLink(link.id)" [attr.aria-label]="'Eliminar ' + link.platform"><ng-icon name="lucideTrash2" /></button>
          </article>
        }
      </div>
      <p class="info-note">Los enlaces se validan para evitar protocolos peligrosos como javascript:, data: o file:.</p>
    </section>
  `,
})
export class SocialLinksPage {
  readonly data = inject(DemoDigitalCardRepository);
  urlError = '';
  readonly form = new FormGroup({
    platform: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(40)] }),
    url: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(300)] }),
  });

  add(): void {
    const { platform, url } = this.form.getRawValue();
    const normalized = normalizeUrl(url);
    if (!isAllowedPublicUrl(normalized)) {
      this.urlError = 'Usa una URL publica valida.';
      return;
    }

    this.urlError = '';
    this.data.addSocialLink(platform, normalized);
    this.form.reset();
  }

  platformIcon(platform: string): string {
    const value = platform.toLowerCase();
    if (value.includes('whatsapp')) {
      return 'simpleWhatsapp';
    }
    if (value.includes('youtube')) {
      return 'lucideMonitor';
    }
    if (value.includes('facebook') || value.includes('instagram') || value.includes('linkedin')) {
      return 'lucideShare2';
    }
    return 'lucideGlobe';
  }
}
