import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FolioDetalleComponent } from './folio-detalle.component';

describe('FolioDetalleComponent', () => {
  let component: FolioDetalleComponent;
  let fixture: ComponentFixture<FolioDetalleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FolioDetalleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FolioDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
