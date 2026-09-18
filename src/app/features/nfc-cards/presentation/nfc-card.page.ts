import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { QrCodeComponent } from '../../../shared/ui/qr-code.component';
import { DemoDigitalCardRepository } from '../../digital-card/infrastructure/demo-digital-card.repository';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIcon, QrCodeComponent, RouterLink],
  template: `
    <section class="page-header">
      <h1>Mi QR y NFC</h1>
      <p>Tu tarjeta digital en el mundo fisico y digital.</p>
    </section>

    <section class="qr-layout">
      <article class="plain-card qr-card-panel">
        <h2><ng-icon name="lucideQrCode" />Tu codigo QR personal</h2>
        <div class="qr-card">
          <app-qr-code [value]="data.publicUrl()" />
        </div>
        <label class="copy-field">
          Tu enlace publico
          <input [value]="data.publicUrl()" readonly />
        </label>
        <div class="button-row">
          <button class="primary-button" type="button" (click)="copyPublicUrl()"><ng-icon name="lucideCopy" />Copiar enlace</button>
          <a class="secondary-button" [routerLink]="['/p', data.profile().publicCode]"><ng-icon name="lucideExternalLink" />Vista publica</a>
        </div>
        @if (copyMessage()) {
          <p class="status-note success">{{ copyMessage() }}</p>
        }
        <p class="info-note">El QR representa exclusivamente la URL publica. No contiene telefono, email ni datos personales.</p>
      </article>

      <article class="plain-card">
        <div class="section-title">
          <h2><ng-icon name="lucideNfc" />Tu tarjeta fisica NFC</h2>
          <span class="badge success">{{ data.nfcCard().status === 'ASSIGNED' ? 'Activa' : data.nfcCard().status }}</span>
        </div>
        <div class="nfc-card-visual">
          <strong>CIBERSEGURIDAD.pe</strong>
          <span><ng-icon name="lucideRadio" />NFC</span>
          <b>{{ data.profile().firstName }} {{ data.profile().lastName }}</b>
          <small>{{ data.profile().jobTitle }}</small>
        </div>
        <div class="info-grid">
          <span>Codigo de tarjeta <strong>{{ data.nfcCard().cardCode }}</strong></span>
          <span>Estado <strong>Conectada</strong></span>
          <span>Ultima lectura <strong>{{ data.nfcCard().lastReadAt }}</strong></span>
          <span>Total de lecturas <strong>{{ data.nfcCard().totalReads }}</strong></span>
        </div>
      </article>
    </section>
  `,
})
export class NfcCardPage {
  readonly data = inject(DemoDigitalCardRepository);
  readonly copyMessage = signal('');

  async copyPublicUrl(): Promise<void> {
    try {
      await navigator.clipboard?.writeText(this.data.publicUrl());
      this.copyMessage.set('Enlace copiado al portapapeles.');
    } catch {
      this.copyMessage.set('No se pudo copiar automaticamente. Selecciona el enlace y copialo manualmente.');
    }
  }
}
