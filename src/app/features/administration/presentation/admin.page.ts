import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIcon } from '@ng-icons/core';
import { DemoDigitalCardRepository } from '../../digital-card/infrastructure/demo-digital-card.repository';

interface AdminCardRow {
  readonly code: string;
  readonly user: string;
  readonly company: string;
  readonly status: string;
  readonly lastRead: string;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, NgIcon],
  template: `
    <section class="page-header">
      <p class="breadcrumb">Administracion > Usuarios y tarjetas</p>
      <h1>Administracion de usuarios y tarjetas</h1>
      <p>Gestiona usuarios, tarjetas NFC, empresas y permisos desde un solo lugar.</p>
    </section>

    <section class="stats-grid">
      <article class="stat-card success"><ng-icon name="lucideUsers" /><span>Usuarios activos</span><strong>128</strong><small>de 156 registrados</small></article>
      <article class="stat-card"><ng-icon name="lucideNfc" /><span>Tarjetas asignadas</span><strong>342</strong><small>de 500 tarjetas</small></article>
      <article class="stat-card warning"><ng-icon name="lucideCreditCard" /><span>Tarjetas disponibles</span><strong>158</strong><small>de 500 tarjetas</small></article>
      <article class="stat-card"><ng-icon name="lucideBuilding2" /><span>Empresas corporativas</span><strong>24</strong><small>activas en plataforma</small></article>
    </section>

    <section class="admin-grid">
      <article class="plain-card">
        <div class="section-title">
          <div><h2>Listado de tarjetas NFC</h2><p>Consulta, filtra y gestiona el estado de todas las tarjetas registradas.</p></div>
          <button class="primary-button" type="button" (click)="registerCard()"><ng-icon name="lucidePlus" />Registrar tarjeta</button>
        </div>
        <div class="filters">
          <input type="search" [ngModel]="query()" (ngModelChange)="query.set($event)" placeholder="Buscar por codigo, usuario o empresa..." />
          <select [ngModel]="statusFilter()" (ngModelChange)="statusFilter.set($event)">
            <option>Todos los estados</option>
            <option>Asignada</option>
            <option>Disponible</option>
            <option>Bloqueada</option>
          </select>
        </div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Codigo</th><th>Usuario</th><th>Empresa</th><th>Estado</th><th>Ultima lectura</th><th>Acciones</th></tr></thead>
            <tbody>
              @for (row of filteredRows(); track row.code) {
                <tr>
                  <td>{{ row.code }}</td>
                  <td>{{ row.user }}</td>
                  <td>{{ row.company }}</td>
                  <td><span class="badge" [class.success]="row.status === 'Asignada'" [class.error]="row.status === 'Bloqueada'">{{ row.status }}</span></td>
                  <td>{{ row.lastRead }}</td>
                  <td><button class="secondary-button compact" type="button" (click)="selectedRow.set(row)"><ng-icon name="lucideEye" />Ver</button></td>
                </tr>
              }
            </tbody>
          </table>
        </div>
        @if (selectedRow()) {
          <div class="detail-panel">
            <div>
              <strong>{{ selectedRow()?.code }}</strong>
              <p>{{ selectedRow()?.user }} · {{ selectedRow()?.company }}</p>
            </div>
            <span class="badge" [class.success]="selectedRow()?.status === 'Asignada'" [class.error]="selectedRow()?.status === 'Bloqueada'">{{ selectedRow()?.status }}</span>
            <button class="icon-button" type="button" aria-label="Cerrar detalle" (click)="selectedRow.set(null)"><ng-icon name="lucideX" /></button>
          </div>
        }
      </article>
      <aside class="plain-card">
        <h2>Asignar tarjeta NFC</h2>
        <p>Vincula una tarjeta disponible a un usuario de la plataforma.</p>
        <label>Codigo de tarjeta<input [ngModel]="assignCode()" (ngModelChange)="assignCode.set($event)" /></label>
        <label>Buscar usuario<input [ngModel]="assignUser()" (ngModelChange)="assignUser.set($event)" /></label>
        <label>Empresa<input [ngModel]="assignCompany()" (ngModelChange)="assignCompany.set($event)" /></label>
        <label>Perfil<select [ngModel]="assignProfile()" (ngModelChange)="assignProfile.set($event)"><option>Colaborador</option><option>Administrador</option></select></label>
        <div class="info-note">Se notificara al usuario sobre la asignacion por correo y/o WhatsApp.</div>
        <button class="primary-button" type="button" (click)="assignCard()"><ng-icon name="lucideLink" />Asignar tarjeta</button>
        @if (message()) {
          <p class="status-note success">{{ message() }}</p>
        }
      </aside>
    </section>
  `,
})
export class AdminPage {
  readonly data = inject(DemoDigitalCardRepository);
  readonly query = signal('');
  readonly statusFilter = signal('Todos los estados');
  readonly selectedRow = signal<AdminCardRow | null>(null);
  readonly message = signal('');
  readonly assignCode = signal('NFC-9B2F6A1D');
  readonly assignUser = signal('Ana Rodriguez');
  readonly assignCompany = signal('Tech Solutions SAC');
  readonly assignProfile = signal('Colaborador');
  readonly rows = signal<readonly AdminCardRow[]>([
    { code: 'NFC-7F3A9B1C', user: 'Ana Rodriguez', company: 'Tech Solutions SAC', status: 'Asignada', lastRead: 'Hoy, 10:42 a. m.' },
    { code: 'NFC-4D8E2C7F', user: 'Carlos Mendoza', company: 'Innovatech S.A.C.', status: 'Asignada', lastRead: 'Ayer, 04:18 p. m.' },
    { code: 'NFC-9B2F6A1D', user: '-', company: '-', status: 'Disponible', lastRead: '-' },
    { code: 'NFC-6F2D8C3B', user: 'Miguel Torres', company: 'Grupo Andino', status: 'Bloqueada', lastRead: '12 Jun. 2024' },
    { code: 'NFC-8E4A1F0D', user: 'Sofia Ramirez', company: 'DataSecure SAC', status: 'Asignada', lastRead: 'Hoy, 11:03 a. m.' },
  ]);
  readonly filteredRows = computed(() => {
    const term = this.query().trim().toLowerCase();
    const status = this.statusFilter();
    return this.rows().filter((row) => {
      const matchesTerm = !term || `${row.code} ${row.user} ${row.company}`.toLowerCase().includes(term);
      const matchesStatus = status === 'Todos los estados' || row.status === status;
      return matchesTerm && matchesStatus;
    });
  });

  registerCard(): void {
    const code = `NFC-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
    const row = { code, user: '-', company: '-', status: 'Disponible', lastRead: '-' };
    this.rows.update((rows) => [row, ...rows]);
    this.assignCode.set(code);
    this.selectedRow.set(row);
    this.message.set(`Tarjeta ${code} registrada y lista para asignar.`);
  }

  assignCard(): void {
    const code = this.assignCode().trim();
    const user = this.assignUser().trim() || 'Usuario sin nombre';
    const company = this.assignCompany().trim() || 'Sin empresa';
    const updated: AdminCardRow = { code, user, company, status: 'Asignada', lastRead: 'Sin lecturas aun' };
    this.rows.update((rows) => {
      const exists = rows.some((row) => row.code === code);
      if (!exists) {
        return [updated, ...rows];
      }

      return rows.map((row) => row.code === code ? updated : row);
    });
    this.selectedRow.set(updated);
    this.message.set(`${code} asignada a ${user} como ${this.assignProfile()}.`);
  }
}
