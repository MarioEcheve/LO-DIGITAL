import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalBuscarFolioComponent } from './modal-buscar-folio.component';

describe('ModalBuscarFolioComponent', () => {
  let component: ModalBuscarFolioComponent;
  let fixture: ComponentFixture<ModalBuscarFolioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalBuscarFolioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalBuscarFolioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
