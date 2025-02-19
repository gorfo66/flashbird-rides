import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RideMapGoogleComponent } from './ride-map-google.component';

describe('GoogleMapComponent', () => {
  let component: RideMapGoogleComponent;
  let fixture: ComponentFixture<RideMapGoogleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RideMapGoogleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RideMapGoogleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
