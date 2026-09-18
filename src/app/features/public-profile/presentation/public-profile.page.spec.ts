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
  });
});
