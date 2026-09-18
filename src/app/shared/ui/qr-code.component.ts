import { ChangeDetectionStrategy, Component, Input, OnChanges, signal } from '@angular/core';
import * as QRCode from 'qrcode';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-qr-code',
  template: `
    @if (qrDataUrl()) {
      <img class="qr-image" [src]="qrDataUrl()" alt="Codigo QR de la tarjeta digital" />
    } @else {
      <div class="qr-fallback" aria-label="Codigo QR en preparacion"></div>
    }
  `,
})
export class QrCodeComponent implements OnChanges {
  @Input({ required: true }) value = '';
  readonly qrDataUrl = signal('');

  ngOnChanges(): void {
    void QRCode.toDataURL(this.value, {
      errorCorrectionLevel: 'M',
      margin: 1,
      scale: 7,
      color: {
        dark: '#071e42',
        light: '#ffffff',
      },
    }).then((dataUrl) => this.qrDataUrl.set(dataUrl));
  }
}
