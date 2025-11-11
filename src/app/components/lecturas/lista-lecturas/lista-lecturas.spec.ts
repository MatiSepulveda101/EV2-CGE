import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaLecturas } from './lista-lecturas';

describe('ListaLecturas', () => {
  let component: ListaLecturas;
  let fixture: ComponentFixture<ListaLecturas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaLecturas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaLecturas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
