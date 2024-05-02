import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearGimnasioComponent } from './crear-gimnasio.component';

describe('CrearGimnasioComponent', () => {
  let component: CrearGimnasioComponent;
  let fixture: ComponentFixture<CrearGimnasioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CrearGimnasioComponent]
    });
    fixture = TestBed.createComponent(CrearGimnasioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
