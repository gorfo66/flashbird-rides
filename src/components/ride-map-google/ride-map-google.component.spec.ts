import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing'
import {
  provideZonelessChangeDetection
} from '@angular/core'

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
      imports: [
        RideMapGoogleComponent,
        MatCheckboxModule,
        MatIconModule,
        MatButtonModule,
        ReactiveFormsModule
      ],
      providers: [
        provideZonelessChangeDetection()
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(RideMapGoogleComponent);
    component = fixture.componentInstance;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fullComponent = (component as any);
    
    spyOn(fullComponent, 'loadLibraries').and.returnValue(Promise.resolve({
      AltitudeMode,
      Map3DElement,
      Polyline3DElement
    }));
    
    spyRenderMap = spyOn(fullComponent, 'renderMap').and.callThrough();
    spyOn(fullComponent.renderer, 'appendChild').and.returnValue(undefined);
    
    fixture.componentRef.setInput('ride', MOCK_RIDE);
    componentFixture = new RideMapGoogleComponentFixture(fixture.debugElement);

    await fixture.whenStable();
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

  it('should not show the action buttons if map is not rendered', async () => {
    
    expect(componentFixture.hasActionButton()).toBeFalse();

    component.rendered.set(true);
    await fixture.whenStable();

    expect(componentFixture.hasActionButton()).toBeTrue();
  });


  it('should toggle the fullscreen mode on and off', async () => {
    // Make sure the button is present online
    component.rendered.set(true);
    await fixture.whenStable();
    
    expect(component.isFullScreen()).toBeFalse();
    
    componentFixture.clickFullScreenButton();
    await fixture.whenStable();

    expect(component.isFullScreen()).toBeTrue();
    expect(componentFixture.getMapContainer().classes['full-screen']).toBeTrue();

    componentFixture.clickFullScreenExitButton();
    await fixture.whenStable();

    expect(component.isFullScreen()).toBeFalse();
    expect(componentFixture.getMapContainer().classes['full-screen']).toBeFalsy();
  });
});
