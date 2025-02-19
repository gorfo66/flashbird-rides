import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RideMapOsmComponent } from './ride-map-osm.component';

describe('RideMapOsmComponent', () => {
  let component: RideMapOsmComponent;
  let fixture: ComponentFixture<RideMapOsmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RideMapOsmComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RideMapOsmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
