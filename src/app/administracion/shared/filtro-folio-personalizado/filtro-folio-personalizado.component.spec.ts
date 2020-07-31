import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltroFolioPersonalizadoComponent } from './filtro-folio-personalizado.component';

describe('FiltroFolioPersonalizadoComponent', () => {
  let component: FiltroFolioPersonalizadoComponent;
  let fixture: ComponentFixture<FiltroFolioPersonalizadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltroFolioPersonalizadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltroFolioPersonalizadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
