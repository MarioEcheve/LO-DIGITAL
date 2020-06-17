import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalBuscarEntidadComponent } from './modal-buscar-entidad.component';

describe('ModalBuscarEntidadComponent', () => {
  let component: ModalBuscarEntidadComponent;
  let fixture: ComponentFixture<ModalBuscarEntidadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalBuscarEntidadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalBuscarEntidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
