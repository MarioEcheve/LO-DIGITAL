import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FolioBorradorComponent } from './folio-borrador.component';

describe('FolioBorradorComponent', () => {
  let component: FolioBorradorComponent;
  let fixture: ComponentFixture<FolioBorradorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FolioBorradorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FolioBorradorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
