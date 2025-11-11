import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroMedidores } from './registro-medidores';

describe('RegistroMedidores', () => {
  let component: RegistroMedidores;
  let fixture: ComponentFixture<RegistroMedidores>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistroMedidores]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistroMedidores);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
