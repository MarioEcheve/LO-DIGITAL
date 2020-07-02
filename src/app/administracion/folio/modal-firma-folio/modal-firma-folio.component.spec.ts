import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalFirmaFolioComponent } from './modal-firma-folio.component';

describe('ModalFirmaFolioComponent', () => {
  let component: ModalFirmaFolioComponent;
  let fixture: ComponentFixture<ModalFirmaFolioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalFirmaFolioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalFirmaFolioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
