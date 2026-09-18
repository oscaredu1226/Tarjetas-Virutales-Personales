import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIcon } from '@ng-icons/core';
import { Lead } from '../../digital-card/domain/digital-card.types';
import { DemoDigitalCardRepository } from '../../digital-card/infrastructure/demo-digital-card.repository';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, NgIcon],
  template: `
    <section class="page-header">
      <h1>Contactos recibidos</h1>
      <p>Gestiona y da seguimiento a las personas que han interactuado con tu tarjeta digital NFC.</p>
    </section>

    <section class="stats-grid">
      <article class="stat-card"><ng-icon name="lucideUserPlus" /><span>Nuevos esta semana</span><strong>52</strong><small>+24%</small></article>
      <article class="stat-card whatsapp"><ng-icon name="simpleWhatsapp" /><span>Conversaciones abiertas</span><strong>18</strong><small>requieren seguimiento</small></article>
      <article class="stat-card"><ng-icon name="lucideContact" /><span>Contactos guardados</span><strong>128</strong><small>en tu base de contactos</small></article>
      <article class="stat-card"><ng-icon name="lucideChartColumn" /><span>Total de contactos</span><strong>342</strong><small>desde el inicio</small></article>
    </section>

    <section class="plain-card">
      <div class="filters">
        <label>Buscar<input type="search" [ngModel]="query()" (ngModelChange)="query.set($event)" placeholder="Nombre, empresa o correo" /></label>
        <label>Origen<select [ngModel]="sourceFilter()" (ngModelChange)="sourceFilter.set($event)"><option>Todos</option><option>NFC</option><option>QR</option><option>WHATSAPP</option><option>PUBLIC_PROFILE</option></select></label>
        <label>Estado<select [ngModel]="statusFilter()" (ngModelChange)="statusFilter.set($event)"><option>Todos</option><option>NEW</option><option>CONTACTED</option><option>RESPONDED</option><option>SAVED</option></select></label>
        <button class="primary-button" type="button" (click)="addNewLead()"><ng-icon name="lucidePlus" />Nuevo contacto</button>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Nombre</th><th>Empresa</th><th>Correo</th><th>Telefono</th><th>Fecha</th><th>Origen</th><th>Estado</th><th>Acciones</th></tr></thead>
          <tbody>
            @for (lead of filteredLeads(); track lead.id) {
              <tr>
                <td>{{ lead.firstName }} {{ lead.lastName }}</td>
                <td>{{ lead.company }}</td>
                <td>{{ lead.email }}</td>
                <td>{{ lead.phone }}</td>
                <td>{{ lead.createdAt }}</td>
                <td><span class="badge">{{ lead.source }}</span></td>
                <td><span class="badge success">{{ lead.status }}</span></td>
                <td><button class="secondary-button compact" type="button" (click)="selectedLead.set(lead)"><ng-icon name="lucideEye" />Ver detalle</button></td>
              </tr>
            }
          </tbody>
        </table>
      </div>
      @if (selectedLead()) {
        <aside class="detail-panel">
          <div>
            <strong>{{ selectedLead()?.firstName }} {{ selectedLead()?.lastName }}</strong>
            <p>{{ selectedLead()?.company }} · {{ selectedLead()?.email }} · {{ selectedLead()?.phone }}</p>
          </div>
          <a class="secondary-button compact" [href]="'mailto:' + selectedLead()?.email"><ng-icon name="lucideMail" />Email</a>
          <a class="whatsapp-button compact" [href]="whatsappUrl(selectedLead())" target="_blank" rel="noopener"><ng-icon name="simpleWhatsapp" />WhatsApp</a>
          <button class="icon-button" type="button" aria-label="Cerrar detalle" (click)="selectedLead.set(null)"><ng-icon name="lucideX" /></button>
        </aside>
      }
    </section>
  `,
})
export class LeadsPage {
  readonly data = inject(DemoDigitalCardRepository);
  readonly query = signal('');
  readonly sourceFilter = signal('Todos');
  readonly statusFilter = signal('Todos');
  readonly selectedLead = signal<Lead | null>(null);
  readonly filteredLeads = computed(() => {
    const term = this.query().trim().toLowerCase();
    const source = this.sourceFilter();
    const status = this.statusFilter();
    return this.data.leads().filter((lead) => {
      const matchesTerm = !term || `${lead.firstName} ${lead.lastName} ${lead.company} ${lead.email}`.toLowerCase().includes(term);
      const matchesSource = source === 'Todos' || lead.source === source;
      const matchesStatus = status === 'Todos' || lead.status === status;
      return matchesTerm && matchesSource && matchesStatus;
    });
  });

  addNewLead(): void {
    const lead: Lead = {
      id: crypto.randomUUID(),
      profileId: this.data.profile().id,
      firstName: 'Nuevo',
      lastName: 'Contacto',
      company: 'Empresa demo',
      email: `contacto.${this.data.leads().length + 1}@demo.pe`,
      phone: '+51 900 000 000',
      source: 'QR',
      status: 'NEW',
      createdAt: 'Ahora',
    };
    this.data.leads.update((leads) => [lead, ...leads]);
    this.selectedLead.set(lead);
  }

  whatsappUrl(lead: Lead | null): string {
    return `https://wa.me/${(lead?.phone ?? '').replace(/\D/g, '')}`;
  }
}
