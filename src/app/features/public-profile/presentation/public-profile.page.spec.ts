import { TestBed } from '@angular/core/testing';
import { provideIcons } from '@ng-icons/core';
import { appIcons } from '../../../shared/ui/app-icons';
import { PublicProfilePage } from './public-profile.page';

describe('Ricardo public profile actions', () => {
  it('downloads the contact from the primary action and links to corporate LinkedIn', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [PublicProfilePage],
      providers: [provideIcons(appIcons)],
    }).createComponent(PublicProfilePage);
    fixture.detectChanges();

    const download = vi.spyOn(fixture.componentInstance, 'downloadVCard').mockImplementation(() => {});
    const action = fixture.nativeElement.querySelector('.rc-actions button') as HTMLButtonElement;
    action.click();

    expect(action.textContent).toContain('Guardar contacto');
    expect(download).toHaveBeenCalledOnce();
    const linkedIn = fixture.nativeElement.querySelector('.rc-action-linkedin') as HTMLAnchorElement;
    expect(linkedIn.href).toBe('https://www.linkedin.com/company/ciberseguridad-pe');
    expect(linkedIn.querySelector('ng-icon[name="bootstrapLinkedin"]')).not.toBeNull();
    fixture.destroy();
  });

  it('hides the loading screen after critical assets or the safety timeout', async () => {
    vi.useFakeTimers();
    const fixture = TestBed.configureTestingModule({
      imports: [PublicProfilePage],
      providers: [provideIcons(appIcons)],
    }).createComponent(PublicProfilePage);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.rc-loader')).not.toBeNull();
    await vi.advanceTimersByTimeAsync(4000);
    fixture.detectChanges();

    expect(fixture.componentInstance.loading()).toBe(false);
    expect(fixture.nativeElement.querySelector('.rc-loader')).toBeNull();
    fixture.destroy();
    vi.useRealTimers();
  });

  it('opens the QR in a large dialog and closes it from its control', () => {
    const fixture = TestBed.configureTestingModule({
      imports: [PublicProfilePage],
      providers: [provideIcons(appIcons)],
    }).createComponent(PublicProfilePage);
    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('.rc-qr') as HTMLButtonElement;
    trigger.click();
    fixture.detectChanges();

    const dialog = fixture.nativeElement.querySelector('.rc-qr-dialog-panel') as HTMLElement;
    expect(dialog).not.toBeNull();
    expect(dialog.querySelector('.rc-qr-large')).not.toBeNull();

    (dialog.querySelector('.rc-qr-close') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.rc-qr-dialog-panel')).toBeNull();
    fixture.destroy();
  });
});
