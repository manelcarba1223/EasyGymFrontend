import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearRutinaComponent } from './crear-actividad.component';

describe('CrearRutinaComponent', () => {
  let component: CrearRutinaComponent;
  let fixture: ComponentFixture<CrearRutinaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CrearRutinaComponent]
    });
    fixture = TestBed.createComponent(CrearRutinaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
