import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuarioEntidadComponent } from './usuario-entidad.component';

describe('UsuarioEntidadComponent', () => {
  let component: UsuarioEntidadComponent;
  let fixture: ComponentFixture<UsuarioEntidadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsuarioEntidadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsuarioEntidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
