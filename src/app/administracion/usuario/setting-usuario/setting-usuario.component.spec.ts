import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingUsuarioComponent } from './setting-usuario.component';

describe('SettingUsuarioComponent', () => {
  let component: SettingUsuarioComponent;
  let fixture: ComponentFixture<SettingUsuarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingUsuarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
