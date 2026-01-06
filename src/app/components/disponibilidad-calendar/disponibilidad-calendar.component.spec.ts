import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisponibilidadCalendarComponent } from './disponibilidad-calendar.component';

describe('DisponibilidadCalendarComponent', () => {
  let component: DisponibilidadCalendarComponent;
  let fixture: ComponentFixture<DisponibilidadCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisponibilidadCalendarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisponibilidadCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
