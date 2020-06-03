import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlacesOfInterestComponent } from './places-of-interest.component';

describe('PlacesOfInterestComponent', () => {
  let component: PlacesOfInterestComponent;
  let fixture: ComponentFixture<PlacesOfInterestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlacesOfInterestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlacesOfInterestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
