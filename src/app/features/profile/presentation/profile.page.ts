import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIcon } from '@ng-icons/core';
import { DemoDigitalCardRepository } from '../../digital-card/infrastructure/demo-digital-card.repository';
import { DigitalCardPreviewComponent } from '../../../shared/ui/digital-card-preview.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DigitalCardPreviewComponent, NgIcon, ReactiveFormsModule],
  template: `
    <section class="page-header">
      <h1>Mi perfil</h1>
      <p>Edita tu informacion profesional. Manten tus datos actualizados para una mejor conexion.</p>
    </section>

    <section class="two-column">
      <form class="plain-card form-grid" [formGroup]="form" (ngSubmit)="save()">
        <h2>Informacion profesional</h2>
        <div class="profile-photo large">{{ data.profile().firstName[0] }}{{ data.profile().lastName[0] }}</div>
        <label>Nombres<input formControlName="firstName" /></label>
        <label>Apellidos<input formControlName="lastName" /></label>
        <label>Cargo<input formControlName="jobTitle" /></label>
        <label>Empresa<input formControlName="companyName" /></label>
        <label class="full">Biografia profesional<textarea rows="5" formControlName="bio"></textarea></label>
        <label>Ciudad<input formControlName="city" /></label>
        <label>Sitio web<input formControlName="website" /></label>
        <div class="form-actions full">
          <button class="secondary-button" type="button" (click)="reset()"><ng-icon name="lucideX" />Cancelar</button>
          <button class="primary-button" type="submit" [disabled]="form.invalid"><ng-icon name="lucideSave" />Guardar cambios</button>
        </div>
        @if (message()) {
          <p class="status-note success full">{{ message() }}</p>
        }
      </form>

      <article class="plain-card preview-pane">
        <h2><ng-icon name="lucideEye" />Vista previa de tu tarjeta digital</h2>
        <app-digital-card-preview [profile]="data.publicProfile()" />
        <p class="info-note">Los cambios se reflejan automaticamente en la tarjeta digital NFC.</p>
      </article>
    </section>
  `,
})
export class ProfilePage {
  readonly data = inject(DemoDigitalCardRepository);
  readonly message = signal('');
  readonly form = new FormGroup({
    firstName: new FormControl(this.data.profile().firstName, { nonNullable: true, validators: [Validators.required] }),
    lastName: new FormControl(this.data.profile().lastName, { nonNullable: true, validators: [Validators.required] }),
    jobTitle: new FormControl(this.data.profile().jobTitle, { nonNullable: true, validators: [Validators.required] }),
    companyName: new FormControl(this.data.profile().companyName, { nonNullable: true, validators: [Validators.required] }),
    bio: new FormControl(this.data.profile().bio, { nonNullable: true, validators: [Validators.maxLength(500)] }),
    city: new FormControl(this.data.profile().city, { nonNullable: true }),
    website: new FormControl(this.data.profile().website, { nonNullable: true, validators: [Validators.required] }),
  });

  save(): void {
    this.data.updateProfile(this.form.getRawValue());
    this.message.set('Perfil actualizado correctamente.');
  }

  reset(): void {
    this.form.reset(this.data.profile());
    this.message.set('Cambios descartados.');
  }
}
