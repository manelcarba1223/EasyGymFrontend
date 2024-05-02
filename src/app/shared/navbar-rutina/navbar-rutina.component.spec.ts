import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarRutinaComponent } from './navbar-rutina.component';

describe('NavbarRutinaComponent', () => {
  let component: NavbarRutinaComponent;
  let fixture: ComponentFixture<NavbarRutinaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NavbarRutinaComponent]
    });
    fixture = TestBed.createComponent(NavbarRutinaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
