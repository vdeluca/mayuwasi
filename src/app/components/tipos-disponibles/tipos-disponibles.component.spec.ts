import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TiposDisponiblesComponent } from './tipos-disponibles.component';

describe('TiposDisponiblesComponent', () => {
  let component: TiposDisponiblesComponent;
  let fixture: ComponentFixture<TiposDisponiblesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TiposDisponiblesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TiposDisponiblesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
