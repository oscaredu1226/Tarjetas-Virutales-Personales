import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { DemoDigitalCardRepository } from '../../digital-card/infrastructure/demo-digital-card.repository';
import { ButtonStyle, CardTheme } from '../../digital-card/domain/digital-card.types';
import { DigitalCardPreviewComponent } from '../../../shared/ui/digital-card-preview.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DigitalCardPreviewComponent, NgIcon],
  template: `
    <section class="page-header">
      <h1>Apariencia</h1>
      <p>Personaliza el diseno de tu tarjeta digital NFC. Los cambios se aplican en tiempo real.</p>
    </section>

    <section class="two-column">
      <div class="stack">
        <article class="plain-card">
        <h2><ng-icon name="lucidePalette" />Plantillas de diseno</h2>
          <div class="template-grid">
            @for (template of templates; track template.value) {
              <button type="button" [class.active]="data.profile().theme === template.value" (click)="data.updateTheme(template.value)">
                <span class="template-preview"></span>
                <strong><ng-icon name="lucidePalette" />{{ template.label }}</strong>
                <small>{{ template.help }}</small>
              </button>
            }
          </div>
        </article>
        <article class="plain-card">
        <h2><ng-icon name="lucidePalette" />Colores de tu marca</h2>
          <div class="color-grid">
            <label>Color principal<input type="color" [value]="data.profile().primaryColor" (input)="setPrimary($event)" /></label>
            <label>Color de acento<input type="color" [value]="data.profile().accentColor" (input)="setAccent($event)" /></label>
          </div>
        </article>
        <article class="plain-card">
          <h2>Imagen de fondo / portada</h2>
          <div class="cover-uploader">
            <span>{{ coverFileName() || 'Circuitos tecnologicos corporativos' }}</span>
            <input #coverInput class="visually-hidden" type="file" accept="image/png,image/jpeg,image/webp" (change)="selectCover($event)" />
            <button class="secondary-button" type="button" (click)="coverInput.click()"><ng-icon name="lucideUpload" />Subir imagen</button>
          </div>
          <h3>Estilo de botones</h3>
          <div class="segmented">
            @for (style of buttonStyles; track style.value) {
              <button type="button" [class.active]="data.profile().buttonStyle === style.value" (click)="data.updateButtonStyle(style.value)"><ng-icon name="lucideSettings" />{{ style.label }}</button>
            }
          </div>
        </article>
      </div>
      <article class="plain-card preview-pane">
        <h2><ng-icon name="lucideEye" />Vista previa en tiempo real</h2>
        <app-digital-card-preview [profile]="data.publicProfile()" />
      </article>
    </section>
  `,
})
export class AppearancePage {
  readonly data = inject(DemoDigitalCardRepository);
  readonly coverFileName = signal('');
  readonly templates: readonly { readonly label: string; readonly help: string; readonly value: CardTheme }[] = [
    { label: 'Profesional', help: 'Moderno y confiable', value: 'professional' },
    { label: 'Minimal', help: 'Limpio y elegante', value: 'minimal' },
    { label: 'Ejecutivo', help: 'Sofisticado y corporativo', value: 'executive' },
    { label: 'Tecnologico', help: 'Innovador y dinamico', value: 'technological' },
  ];
  readonly buttonStyles: readonly { readonly label: string; readonly value: ButtonStyle }[] = [
    { label: 'Redondeado', value: 'rounded' },
    { label: 'Cuadrado', value: 'square' },
    { label: 'Contorno', value: 'outline' },
  ];

  setPrimary(event: Event): void {
    this.data.updateColors((event.target as HTMLInputElement).value, this.data.profile().accentColor);
  }

  setAccent(event: Event): void {
    this.data.updateColors(this.data.profile().primaryColor, (event.target as HTMLInputElement).value);
  }

  selectCover(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) {
      return;
    }

    this.coverFileName.set(file.name);
  }
}
