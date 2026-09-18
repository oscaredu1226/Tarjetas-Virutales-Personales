import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIcon, ReactiveFormsModule, RouterLink],
  template: `
    <main class="center-page">
      <section class="plain-card narrow">
        <a class="brand" routerLink="/login">
          <span class="brand-mark"><ng-icon name="lucideShieldCheck" /></span>
          <span><strong>CIBERSEGURIDAD.pe</strong><small>Gestores de tu seguridad</small></span>
        </a>
        <h1>Recuperar acceso</h1>
        <p>Esta pantalla queda preparada para integrarse con Supabase Auth y su flujo seguro de recuperacion de contrasena.</p>
        <form class="stack" (submit)="sendInstructions($event)">
          <label>
            Correo
            <input type="email" [formControl]="email" placeholder="tu@empresa.com" />
          </label>
          <button class="primary-button" type="submit" [disabled]="email.invalid"><ng-icon name="lucideKeyRound" />Enviar instrucciones</button>
        </form>
        @if (message()) {
          <p class="status-note success">{{ message() }}</p>
        }
      </section>
    </main>
  `,
})
export class RecoveryPage {
  readonly email = new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] });
  readonly message = signal('');

  sendInstructions(event: SubmitEvent): void {
    event.preventDefault();

    if (this.email.invalid) {
      this.email.markAsTouched();
      return;
    }

    this.message.set(`Listo. Enviamos instrucciones demo a ${this.email.value}.`);
  }
}
