import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CambioAdministradorComponent } from './cambio-administrador.component';

describe('CambioAdministradorComponent', () => {
  let component: CambioAdministradorComponent;
  let fixture: ComponentFixture<CambioAdministradorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CambioAdministradorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CambioAdministradorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
