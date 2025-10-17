import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing'

import {
  RideMapOsmComponent
} from './ride-map-osm.component'
import {
  MOCK_RIDE
} from '../../../mocks/ride'

describe('RideMapOsmComponent', () => {
  let component: RideMapOsmComponent;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let fullComponent: any;
  let fixture: ComponentFixture<RideMapOsmComponent>;
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RideMapOsmComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(RideMapOsmComponent);
    fixture.componentRef.setInput('ride', MOCK_RIDE);
    component = fixture.componentInstance;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fullComponent = (component as any);
    fullComponent.renderMap = jasmine.createSpy('renderMap');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call the renderMap method', () => {
    expect(fullComponent.renderMap).toHaveBeenCalledOnceWith(MOCK_RIDE);
  });
});
