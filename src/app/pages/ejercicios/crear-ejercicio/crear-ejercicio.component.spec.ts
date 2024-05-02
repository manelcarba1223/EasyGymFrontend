import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearEjercicioComponent } from './crear-ejercicio.component';

describe('CrearEjercicioComponent', () => {
  let component: CrearEjercicioComponent;
  let fixture: ComponentFixture<CrearEjercicioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CrearEjercicioComponent]
    });
    fixture = TestBed.createComponent(CrearEjercicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
