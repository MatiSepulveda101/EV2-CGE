import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroLectura } from './registro-lectura';

describe('RegistroLectura', () => {
  let component: RegistroLectura;
  let fixture: ComponentFixture<RegistroLectura>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistroLectura]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistroLectura);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
