import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { DemoDigitalCardRepository } from '../../digital-card/infrastructure/demo-digital-card.repository';
import { DigitalCardPreviewComponent } from '../../../shared/ui/digital-card-preview.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DigitalCardPreviewComponent, NgIcon, RouterLink],
  template: `
    <section class="page-header dashboard-header">
      <h1>Panel principal</h1>
      <p>Hola, {{ data.profile().firstName }}. Aqui tienes un resumen de tu tarjeta digital NFC.</p>
    </section>

    <section class="stats-grid dashboard-stats">
      <article class="stat-card dashboard-stat-card success">
        <span class="stat-icon"><ng-icon name="lucideUser" /></span>
        <div><span>Perfil activo</span><small>Tu tarjeta esta publicada</small><em>Activo</em></div>
        <ng-icon class="stat-chevron" name="lucideChevronRight" />
      </article>
      <article class="stat-card dashboard-stat-card info">
        <span class="stat-icon"><ng-icon name="lucideChartColumn" /></span>
        <div><span>Escaneos esta semana</span><strong>128</strong><small><b>+24%</b> vs. semana anterior</small></div>
        <ng-icon class="stat-chevron" name="lucideChevronRight" />
      </article>
      <article class="stat-card dashboard-stat-card whatsapp">
        <span class="stat-icon"><ng-icon name="simpleWhatsapp" /></span>
        <div><span>Clicks en WhatsApp</span><strong>36</strong><small><b>+38%</b> vs. semana anterior</small></div>
        <ng-icon class="stat-chevron" name="lucideChevronRight" />
      </article>
      <article class="stat-card dashboard-stat-card nfc">
        <span class="stat-icon"><ng-icon name="lucideNfc" /></span>
        <div><span>Estado de la tarjeta NFC</span><strong>Conectada</strong><small>{{ data.nfcCard().lastReadAt }}</small></div>
        <ng-icon class="stat-chevron" name="lucideChevronRight" />
      </article>
    </section>

    <section class="dashboard-grid">
      <article class="plain-card wide dashboard-preview-card">
        <div class="section-title">
          <h2><ng-icon name="lucideEye" />Vista previa de tu tarjeta digital</h2>
          <div class="segmented" aria-label="Modo de vista previa">
            <button type="button" [class.active]="previewMode() === 'desktop'" (click)="previewMode.set('desktop')"><ng-icon name="lucideMonitor" />Vista de escritorio</button>
            <button type="button" [class.active]="previewMode() === 'mobile'" (click)="previewMode.set('mobile')"><ng-icon name="lucideSmartphone" />Vista movil</button>
          </div>
        </div>
        <div class="preview-frame" [class.mobile]="previewMode() === 'mobile'">
          <app-digital-card-preview [profile]="data.publicProfile()" />
        </div>
      </article>
      <aside class="stack">
        <article class="plain-card dashboard-side-card quick-actions-card">
          <h2><ng-icon name="lucideZap" />Accesos rapidos</h2>
          <div class="quick-action-list">
            @for (action of quickActions; track action.path) {
              <a class="action-row {{ action.tone }}" [routerLink]="action.path">
                <span class="action-icon"><ng-icon [name]="action.icon" /></span>
                <span><strong>{{ action.label }}</strong><small>{{ action.help }}</small></span>
                <em><ng-icon name="lucideChevronRight" /></em>
              </a>
            }
          </div>
        </article>
        <article class="plain-card dashboard-side-card impact-card">
          <div class="section-title compact-title">
            <h2><ng-icon name="lucideChartColumn" />Tu impacto</h2>
            <small>Ultimos 7 dias</small>
          </div>
          <div class="impact-summary">
            <strong>52</strong>
            <span>escaneos</span>
            <em>+24%</em>
          </div>
          <div class="mini-chart" aria-label="Grafico de escaneos de los ultimos 7 dias">
            @for (bar of impactBars; track bar.day) {
              <span class="impact-bar" [class.active]="bar.active" [style.height.%]="bar.height" [attr.aria-label]="bar.day + ': ' + bar.value + ' escaneos'">
                @if (bar.active) {
                  <b>{{ bar.day }}<br />{{ bar.value }} escaneos</b>
                }
              </span>
            }
          </div>
          <div class="chart-labels" aria-hidden="true">
            @for (bar of impactBars; track bar.day) {
              <span [class.active]="bar.active">{{ bar.day }}</span>
            }
          </div>
        </article>
      </aside>
    </section>
  `,
})
export class DashboardPage {
  readonly data = inject(DemoDigitalCardRepository);
  readonly previewMode = signal<'desktop' | 'mobile'>('desktop');
  readonly quickActions = [
    {
      icon: 'lucidePencil',
      label: 'Editar perfil',
      help: 'Actualiza tu informacion personal',
      path: '/dashboard/profile',
      tone: 'profile',
    },
    {
      icon: 'lucidePalette',
      label: 'Personalizar diseno',
      help: 'Cambia colores, fondo y estilo',
      path: '/dashboard/appearance',
      tone: 'design',
    },
    {
      icon: 'lucideQrCode',
      label: 'Ver QR',
      help: 'Descarga o comparte tu codigo QR',
      path: '/dashboard/card',
      tone: 'qr',
    },
  ] as const;
  readonly impactBars = [
    { day: 'Lun', value: 24, height: 43, active: false },
    { day: 'Mar', value: 42, height: 75, active: false },
    { day: 'Mie', value: 25, height: 45, active: false },
    { day: 'Jue', value: 48, height: 86, active: false },
    { day: 'Vie', value: 52, height: 93, active: true },
    { day: 'Sab', value: 38, height: 68, active: false },
    { day: 'Dom', value: 42, height: 75, active: false },
  ] as const;
}
