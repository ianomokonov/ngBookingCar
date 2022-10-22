import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RentalLocationsComponent } from './rental-locations.component';

describe('RentalLocationsComponent', () => {
  let component: RentalLocationsComponent;
  let fixture: ComponentFixture<RentalLocationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RentalLocationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RentalLocationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
