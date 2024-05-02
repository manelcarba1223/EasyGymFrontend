import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AniadirHoraDisponibleComponent } from './aniadir-hora-disponible.component';

describe('AniadirHoraDisponibleComponent', () => {
  let component: AniadirHoraDisponibleComponent;
  let fixture: ComponentFixture<AniadirHoraDisponibleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AniadirHoraDisponibleComponent]
    });
    fixture = TestBed.createComponent(AniadirHoraDisponibleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
