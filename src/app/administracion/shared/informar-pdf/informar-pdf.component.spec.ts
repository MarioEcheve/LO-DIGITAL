import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InformarPdfComponent } from './informar-pdf.component';

describe('InformarPdfComponent', () => {
  let component: InformarPdfComponent;
  let fixture: ComponentFixture<InformarPdfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InformarPdfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InformarPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
