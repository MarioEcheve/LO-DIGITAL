import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FolioFirmadoComponent } from './folio-firmado.component';

describe('FolioFirmadoComponent', () => {
  let component: FolioFirmadoComponent;
  let fixture: ComponentFixture<FolioFirmadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FolioFirmadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FolioFirmadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
