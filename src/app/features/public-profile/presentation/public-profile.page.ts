import { AfterViewInit, ChangeDetectionStrategy, Component, HostListener, OnDestroy, signal } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { buildVCard } from '../../digital-card/domain/vcard';
import {
  RICARDO_CARD_PATH,
  ricardoAttachments,
  ricardoProfile,
  ricardoVideoUrl,
} from '../data/ricardo-card.data';
import { QrCodeComponent } from '../../../shared/ui/qr-code.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIcon, QrCodeComponent],
  template: `
    @if (loading()) {
      <div class="rc-loader" [class.rc-loader-leaving]="loaderLeaving()" role="status" aria-live="polite">
        <div class="rc-loader-content">
          <img src="/assets/branding/ciberseguridad-logo-sidebar.png" alt="" />
          <p>Preparando tarjeta digital</p>
          <div class="rc-loader-track" aria-hidden="true"><span></span></div>
        </div>
      </div>
    }

    <main
      class="rc-page"
      [class.rc-page-revealing]="loaderLeaving()"
      [class.rc-page-ready]="!loading()"
      [attr.aria-hidden]="loading() ? 'true' : null"
      [attr.inert]="loading() ? '' : null"
    >
      <article class="rc-showcase" aria-labelledby="ricardo-name">
        <div class="rc-hero">
          <header class="rc-header">
            <img class="rc-logo" src="/assets/branding/ciberseguridad-logo-sidebar.png" alt="CIBERSEGURIDAD.pe - Gestores de tu seguridad" />
            <p class="rc-motto">Personas seguras,<br />organizaciones más fuertes.</p>
          </header>

          <div class="rc-hero-grid">
            <div class="rc-portrait-column">
              <div class="rc-portrait" aria-label="Foto de Ricardo pendiente">
                @if (profile.profilePhotoUrl) {
                  <img [src]="profile.profilePhotoUrl" alt="Ricardo Lanatta Forger" />
                } @else {
                  <ng-icon name="lucideUserRound" aria-hidden="true" />
                }
                <span class="rc-availability" aria-hidden="true"></span>
              </div>
              <div class="rc-credential">
                <ng-icon name="lucideShieldCheck" aria-hidden="true" />
                <span>Implementador Líder Senior<br /><strong>ISO/IEC 27001</strong></span>
              </div>
              <p class="rc-focus">GESTIÓN <b></b> CUMPLIMIENTO <b></b> RESILIENCIA</p>
            </div>

            <section class="rc-identity">
              <h1 id="ricardo-name">{{ profile.firstName }} {{ profile.lastName }}</h1>
              <p class="rc-role">{{ profile.jobTitle }}</p>
              <p class="rc-company">{{ profile.companyName }}</p>
              <ul class="rc-contact-list">
                <li><ng-icon name="lucidePhone" aria-hidden="true" /><a [href]="phoneHref">{{ profile.phone }}</a></li>
                <li><ng-icon name="lucideMail" aria-hidden="true" /><a [href]="emailHref">{{ profile.email }}</a></li>
                <li><ng-icon name="lucideMapPin" aria-hidden="true" /><span>{{ profile.address }}</span></li>
                <li><ng-icon name="lucideGlobe" aria-hidden="true" /><a [href]="profile.website" target="_blank" rel="noopener noreferrer">ciberseguridad.com.pe</a></li>
              </ul>
              <p class="rc-bio">{{ profile.bio }}</p>
            </section>

            <section class="rc-media" aria-labelledby="video-title">
              <div class="rc-video-frame">
                <video controls playsinline preload="none" poster="/assets/ricardo/video-poster.jpg" [attr.aria-label]="'Video de presentación de ' + profile.companyName">
                  <source [src]="videoUrl" type="video/mp4" />
                  Tu navegador no admite este video.
                </video>
              </div>
              <p id="video-title">Conoce nuestra propuesta de valor</p>
              <a class="rc-video-link" [href]="videoUrl" download="CiberseguridadPE-video.mp4"><ng-icon name="lucideDownload" />Descargar video</a>
            </section>
          </div>
        </div>

        <section class="rc-actions" aria-label="Acciones de contacto">
          <a class="rc-action rc-action-whatsapp" [href]="whatsappHref" target="_blank" rel="noopener noreferrer">
            <ng-icon name="simpleWhatsapp" aria-hidden="true" />
            <span><strong>WhatsApp</strong><small>Escríbeme ahora</small></span>
            <ng-icon class="rc-chevron" name="lucideChevronRight" aria-hidden="true" />
          </a>
          <button class="rc-action rc-action-blue" type="button" (click)="downloadVCard()">
            <ng-icon name="lucideUserPlus" aria-hidden="true" />
            <span><strong>Guardar contacto</strong><small>Ricardo Lanatta Forger</small></span>
            <ng-icon class="rc-chevron" name="lucideDownload" aria-hidden="true" />
          </button>
          <a class="rc-action rc-action-blue" [href]="emailHref">
            <ng-icon name="lucideMail" aria-hidden="true" />
            <span><strong>Email</strong><small>Enviar un correo</small></span>
            <ng-icon class="rc-chevron" name="lucideChevronRight" aria-hidden="true" />
          </a>
          <a class="rc-action rc-action-light" [href]="profile.website" target="_blank" rel="noopener noreferrer">
            <ng-icon name="lucideGlobe" aria-hidden="true" />
            <span><strong>Visitar web</strong><small>CIBERSEGURIDAD.pe</small></span>
            <ng-icon class="rc-chevron" name="lucideChevronRight" aria-hidden="true" />
          </a>
          <a class="rc-action rc-action-linkedin" [href]="linkedinHref" target="_blank" rel="noopener noreferrer">
            <ng-icon name="bootstrapLinkedin" aria-hidden="true" />
            <span><strong>LinkedIn</strong><small>CIBERSEGURIDAD.pe</small></span>
            <ng-icon class="rc-chevron" name="lucideChevronRight" aria-hidden="true" />
          </a>
        </section>

        <div class="rc-lower">
          <section class="rc-resources" aria-labelledby="resources-title">
            <div class="rc-section-heading">
              <div>
                <span class="rc-eyebrow">PARA CONOCERNOS MEJOR</span>
                <h2 id="resources-title">Material corporativo</h2>
              </div>
            </div>
            <div class="rc-files">
              @for (attachment of attachments; track attachment.url) {
                <div class="rc-file">
                  <ng-icon [name]="attachment.icon" aria-hidden="true" />
                  <div class="rc-file-copy">
                    <strong>{{ attachment.title }}</strong>
                    <span>{{ attachment.description }}</span>
                  </div>
                  <div class="rc-file-actions">
                    <a [href]="attachment.url" target="_blank" rel="noopener noreferrer" [attr.aria-label]="'Abrir ' + attachment.title" title="Abrir PDF"><ng-icon name="lucideExternalLink" /></a>
                    <a [href]="attachment.url" [attr.download]="attachment.downloadName" [attr.aria-label]="'Descargar ' + attachment.title" title="Descargar PDF"><ng-icon name="lucideDownload" /></a>
                  </div>
                </div>
              }
            </div>
          </section>

          <section class="rc-connect" aria-labelledby="connect-title">
            <span class="rc-eyebrow">SIGAMOS EN CONTACTO</span>
            <h2 id="connect-title">Más sobre CIBERSEGURIDAD.pe</h2>
            <a [href]="portfolioHref" target="_blank" rel="noopener noreferrer"><ng-icon name="lucideFolder" /><span>Alianzas y portafolio</span><ng-icon name="lucideChevronRight" /></a>
          </section>
        </div>
      </article>

      <div class="rc-share">
        <button
          #qrTrigger
          class="rc-qr"
          type="button"
          (click)="openQr(qrTrigger)"
          aria-label="Ampliar codigo QR para compartir la tarjeta"
          title="Ampliar codigo QR"
        >
          <app-qr-code [value]="publicUrl" />
        </button>
        <div><strong>Tarjeta digital de Ricardo Lanatta Forger</strong><span>Escanea o comparte este enlace.</span></div>
        <button type="button" (click)="copyUrl()"><ng-icon name="lucideCopy" />{{ copyStatus() === 'copied' ? 'Enlace copiado' : copyStatus() === 'error' ? 'No se pudo copiar' : 'Copiar enlace' }}</button>
      </div>
      <footer class="rc-footer"><strong>CIBERSEGURIDAD.pe</strong><span>Gestores de tu seguridad</span></footer>
    </main>

    @if (qrExpanded()) {
      <div class="rc-qr-dialog" role="presentation" (click)="closeQr()">
        <section
          class="rc-qr-dialog-panel"
          role="dialog"
          aria-modal="true"
          aria-labelledby="qr-dialog-title"
          (click)="$event.stopPropagation()"
        >
          <button class="rc-qr-close" type="button" (click)="closeQr()" aria-label="Cerrar codigo QR" title="Cerrar">
            <ng-icon name="lucideX" aria-hidden="true" />
          </button>
          <div class="rc-qr-dialog-heading">
            <ng-icon name="lucideQrCode" aria-hidden="true" />
            <div>
              <h2 id="qr-dialog-title">Compartir tarjeta digital</h2>
              <p>Escanea este código con la cámara del celular.</p>
            </div>
          </div>
          <div class="rc-qr-large"><app-qr-code [value]="publicUrl" /></div>
          <button class="rc-qr-copy" type="button" (click)="copyUrl()">
            <ng-icon name="lucideCopy" aria-hidden="true" />
            {{ copyStatus() === 'copied' ? 'Enlace copiado' : copyStatus() === 'error' ? 'No se pudo copiar' : 'Copiar enlace' }}
          </button>
        </section>
      </div>
    }
  `,
})
export class PublicProfilePage implements AfterViewInit, OnDestroy {
  readonly profile = ricardoProfile;
  readonly attachments = ricardoAttachments;
  readonly videoUrl = ricardoVideoUrl;
  readonly portfolioHref = 'https://www.ciberseguridad.com.pe/alianzas/';
  readonly linkedinHref = 'https://www.linkedin.com/company/ciberseguridad-pe';
  readonly phoneHref = `tel:${(this.profile.phone ?? '').replace(/\D/g, '')}`;
  readonly emailHref = `mailto:${this.profile.email}`;
  readonly whatsappHref = `https://wa.me/${(this.profile.whatsapp ?? '').replace(/\D/g, '')}`;
  readonly publicUrl = `${window.location.origin}/${RICARDO_CARD_PATH}`;
  readonly copyStatus = signal<'idle' | 'copied' | 'error'>('idle');
  readonly qrExpanded = signal(false);
  readonly loading = signal(true);
  readonly loaderLeaving = signal(false);
  private destroyed = false;
  private qrTrigger?: HTMLButtonElement;

  ngAfterViewInit(): void {
    document.documentElement.classList.add('rc-loading');
    void this.prepareCard();
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    document.documentElement.classList.remove('rc-loading');
    document.documentElement.classList.remove('rc-qr-open');
  }

  @HostListener('document:keydown.escape')
  closeQr(): void {
    if (!this.qrExpanded()) {
      return;
    }

    this.qrExpanded.set(false);
    document.documentElement.classList.remove('rc-qr-open');
    setTimeout(() => this.qrTrigger?.focus());
  }

  openQr(trigger: HTMLButtonElement): void {
    this.qrTrigger = trigger;
    this.qrExpanded.set(true);
    document.documentElement.classList.add('rc-qr-open');
  }

  downloadVCard(): void {
    const blob = new Blob([buildVCard(this.profile)], { type: 'text/vcard;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Ricardo-Lanatta-Forger.vcf';
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 30000);
  }

  async copyUrl(): Promise<void> {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(this.publicUrl);
      } else if (!this.copyUrlWithSelection()) {
        throw new Error('Clipboard unavailable');
      }
      this.copyStatus.set('copied');
    } catch {
      this.copyStatus.set(this.copyUrlWithSelection() ? 'copied' : 'error');
    }
    setTimeout(() => this.copyStatus.set('idle'), 2500);
  }

  private copyUrlWithSelection(): boolean {
    const field = document.createElement('textarea');
    field.value = this.publicUrl;
    field.readOnly = true;
    field.style.position = 'fixed';
    field.style.opacity = '0';
    document.body.appendChild(field);
    field.select();
    try {
      return document.execCommand('copy');
    } catch {
      return false;
    } finally {
      field.remove();
    }
  }

  private async prepareCard(): Promise<void> {
    const criticalAssets = [
      '/assets/branding/panel-background.png',
      '/assets/branding/card-preview-background.png',
      '/assets/branding/ciberseguridad-logo-sidebar.png',
      '/assets/ricardo/video-poster.jpg',
    ];

    await Promise.all([
      delay(750),
      Promise.race([
        Promise.all(criticalAssets.map((asset) => preloadImage(asset))),
        delay(3500),
      ]),
    ]);

    if (this.destroyed) {
      return;
    }

    this.loaderLeaving.set(true);
    await delay(420);

    if (!this.destroyed) {
      this.loading.set(false);
      document.documentElement.classList.remove('rc-loading');
    }
  }
}

function preloadImage(source: string): Promise<void> {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => resolve();
    image.onerror = () => resolve();
    image.src = source;

    if (image.complete) {
      resolve();
    }
  });
}

function delay(duration: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, duration));
}
