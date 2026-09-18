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
      <h1>Enlaces personalizados</h1>
      <p>Crea accesos rapidos hacia tu contenido profesional mas importante.</p>
    </section>

    <section class="plain-card">
      <form class="inline-form" [formGroup]="form" (ngSubmit)="add()">
        <label>Titulo<input formControlName="title" placeholder="Portafolio" /></label>
        <label>URL<input formControlName="url" placeholder="https://..." /></label>
        <button class="primary-button" type="submit" [disabled]="form.invalid"><ng-icon name="lucidePlus" />Agregar enlace</button>
      </form>
      @if (urlError) {
        <p class="error-text">{{ urlError }}</p>
      }
      <div class="editable-list">
        @for (link of data.customLinks(); track link.id) {
          <article class="editable-row">
            <span class="drag-handle" aria-hidden="true"><ng-icon name="lucideGripVertical" /></span>
            <span class="platform-icon"><ng-icon [name]="customIcon(link.icon)" /></span>
            <div>
              <strong>{{ link.title }}</strong>
              <a [href]="link.url" target="_blank" rel="noopener">{{ link.url }}</a>
            </div>
            <label class="switch">
              <input type="checkbox" [checked]="link.isVisible" (change)="data.toggleCustomLink(link.id)" />
              <span></span>
              <em>{{ link.isVisible ? 'Visible' : 'Oculto' }}</em>
            </label>
            <button class="icon-button danger" type="button" (click)="data.removeCustomLink(link.id)" [attr.aria-label]="'Eliminar ' + link.title"><ng-icon name="lucideTrash2" /></button>
          </article>
        }
      </div>
    </section>
  `,
})
export class CustomLinksPage {
  readonly data = inject(DemoDigitalCardRepository);
  urlError = '';
  readonly form = new FormGroup({
    title: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(70)] }),
    url: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(300)] }),
  });

  add(): void {
    const { title, url } = this.form.getRawValue();
    const normalized = normalizeUrl(url);
    if (!isAllowedPublicUrl(normalized)) {
      this.urlError = 'Usa una URL publica valida.';
      return;
    }

    this.urlError = '';
    this.data.addCustomLink(title, normalized);
    this.form.reset();
  }

  customIcon(icon: string): string {
    if (icon === 'folder') {
      return 'lucideFolder';
    }
    if (icon === 'document') {
      return 'lucideFileText';
    }
    if (icon === 'calendar') {
      return 'lucideCalendar';
    }
    return 'lucideLink';
  }
}
