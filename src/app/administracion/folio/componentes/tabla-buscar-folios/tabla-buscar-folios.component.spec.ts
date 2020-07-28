import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaBuscarFoliosComponent } from './tabla-buscar-folios.component';

describe('TablaBuscarFoliosComponent', () => {
  let component: TablaBuscarFoliosComponent;
  let fixture: ComponentFixture<TablaBuscarFoliosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablaBuscarFoliosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaBuscarFoliosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
