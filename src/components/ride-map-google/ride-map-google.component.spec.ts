import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing'

import {
  RideMapGoogleComponent
} from './ride-map-google.component'
import {
  ReactiveFormsModule
} from '@angular/forms'
import {
  MatButtonModule
} from '@angular/material/button'
import {
  MatCheckboxModule
} from '@angular/material/checkbox'
import {
  MatIconModule
} from '@angular/material/icon'
import {
  RideMapGoogleComponentFixture
} from './ride-map-google.fixture'
import {
  MOCK_RIDE
} from '../../../mocks/ride'
import {
  AltitudeMode,
  Map3DElement,
  Polyline3DElement
} from './google-libraries.mock'

describe('GoogleMapComponent', () => {
  let component: RideMapGoogleComponent;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let fullComponent: any;
  let fixture: ComponentFixture<RideMapGoogleComponent>;
  let componentFixture: RideMapGoogleComponentFixture;
  let spyRenderMap: jasmine.Spy;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RideMapGoogleComponent],
      imports: [
        MatCheckboxModule,
        MatIconModule,
        MatButtonModule,
        ReactiveFormsModule
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(RideMapGoogleComponent);
    fixture.componentRef.setInput('ride', MOCK_RIDE);
    component = fixture.componentInstance;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fullComponent = (component as any);
    spyRenderMap = spyOn(fullComponent, 'renderMap').and.callThrough();
    fullComponent.loadLibraries = () => ({
      AltitudeMode,
      Map3DElement,
      Polyline3DElement
    });
    componentFixture = new RideMapGoogleComponentFixture(fixture.debugElement);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the map', () => {
    expect(spyRenderMap).toHaveBeenCalledOnceWith(MOCK_RIDE);

    const map = fullComponent.map3d;
    expect(map).toBeDefined();
    expect(map.lines.length).toEqual(MOCK_RIDE.logs.length - 1);
    expect(map.mode).toEqual('SATELLITE');
    expect(map.range).toEqual(10000);
    expect(map.tilt).toEqual(60);
    expect(map.heading).toEqual(0);
  });

  it('should toggle the map mode on click', () => {
    const map = fullComponent.map3d;

    expect(fullComponent.mode()).toEqual('SATELLITE');

    componentFixture.clickShowLabelCheckbox();
    fixture.detectChanges();

    expect(fullComponent.mode()).toEqual('HYBRID');
    expect(map.mode).toEqual('HYBRID');

    componentFixture.clickShowLabelCheckbox();
    fixture.detectChanges();

    expect(fullComponent.mode()).toEqual('SATELLITE');
    expect(map.mode).toEqual('SATELLITE');

  });

  it('should not show the action buttons if map is not rendered', () => {
    
    expect(componentFixture.hasActionButton()).toBeFalse();

    component.rendered.set(true);
    fixture.detectChanges();

    expect(componentFixture.hasActionButton()).toBeTrue();
  });


  it('should toggle the fullscreen mode on and off', () => {
    // Make sure the button is present online
    component.rendered.set(true);
    fixture.detectChanges();
    
    expect(component.isFullScreen()).toBeFalse();
    
    componentFixture.clickFullScreenButton();
    fixture.detectChanges();

    expect(component.isFullScreen()).toBeTrue();
    expect(componentFixture.getMapContainer().classes['full-screen']).toBeTrue();

    componentFixture.clickFullScreenExitButton();
    fixture.detectChanges();

    expect(component.isFullScreen()).toBeFalse();
    expect(componentFixture.getMapContainer().classes['full-screen']).toBeFalsy();
  });
});
