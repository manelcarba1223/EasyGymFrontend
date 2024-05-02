import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerGimnasioComponent } from './ver-gimnasio.component';

describe('VerGimnasioComponent', () => {
  let component: VerGimnasioComponent;
  let fixture: ComponentFixture<VerGimnasioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VerGimnasioComponent]
    });
    fixture = TestBed.createComponent(VerGimnasioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
