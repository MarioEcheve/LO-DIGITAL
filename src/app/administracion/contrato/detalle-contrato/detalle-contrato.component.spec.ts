import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleContratoComponent } from './detalle-contrato.component';

describe('DetalleContratoComponent', () => {
  let component: DetalleContratoComponent;
  let fixture: ComponentFixture<DetalleContratoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetalleContratoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleContratoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
