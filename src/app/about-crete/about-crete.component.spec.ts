import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutCreteComponent } from './about-crete.component';

describe('AboutCreteComponent', () => {
  let component: AboutCreteComponent;
  let fixture: ComponentFixture<AboutCreteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AboutCreteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutCreteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
