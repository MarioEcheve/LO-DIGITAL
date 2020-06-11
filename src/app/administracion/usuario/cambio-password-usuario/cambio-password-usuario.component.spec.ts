import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CambioPasswordUsuarioComponent } from './cambio-password-usuario.component';

describe('CambioPasswordUsuarioComponent', () => {
  let component: CambioPasswordUsuarioComponent;
  let fixture: ComponentFixture<CambioPasswordUsuarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CambioPasswordUsuarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CambioPasswordUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
