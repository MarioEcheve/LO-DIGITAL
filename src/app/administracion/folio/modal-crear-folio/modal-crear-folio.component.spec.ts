import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCrearFolioComponent } from './modal-crear-folio.component';

describe('ModalCrearFolioComponent', () => {
  let component: ModalCrearFolioComponent;
  let fixture: ComponentFixture<ModalCrearFolioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalCrearFolioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCrearFolioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
