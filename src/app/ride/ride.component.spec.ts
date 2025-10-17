import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing'

import {
  RideComponent
} from './ride.component'
import {
  MockStore,
  provideMockStore
} from '@ngrx/store/testing'
import {
  Router,
  RouterModule
} from '@angular/router'
import {
  RideService
} from '../../services'
import {
  RideServiceFixture
} from '../../services/flashbird/ride/ride.fixture'
import {
  selectRide
} from '../../store'
import {
  MOCK_RIDE
} from '../../../mocks/ride'
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
  MatInputModule
} from '@angular/material/input'
import {
  MatSnackBarModule
} from '@angular/material/snack-bar'
import {
  MockRideMapGoogleComponent,
  MockStatisticTileComponent
} from '../../components/mocks'
import {
  RideComponentFixture
} from './ride.fixture'
import {
  LOCALE_ID
} from '@angular/core'

import localeFr from '@angular/common/locales/fr';
import {
  registerLocaleData
} from '@angular/common'
import {
  DefaultProjectorFn,
  MemoizedSelector
} from '@ngrx/store'
import {
  Ride
} from '../../models'
registerLocaleData(localeFr, 'fr-FR');

describe('RideComponent', () => {
  let component: RideComponent;
  let fixture: ComponentFixture<RideComponent>;
  let componentFixture: RideComponentFixture;
  let store: MockStore;
  let router: Router;
  let mockSelectRideOverride: MemoizedSelector<object, Ride, DefaultProjectorFn<Ride>>;

  const rideServiceFixture = new RideServiceFixture()

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        RideComponent, 
        MockStatisticTileComponent,
        MockRideMapGoogleComponent,
        MockRideMapGoogleComponent
      ],
      imports: [
        MatSnackBarModule,
        MatButtonModule,
        MatCheckboxModule,
        MatInputModule,
        ReactiveFormsModule,
        RouterModule.forRoot([{
          path: 'rides',
          redirectTo: '/'
        }])
      ],
      providers: [
        provideMockStore(),
        {
          provide: RideService,
          useValue: rideServiceFixture
        },
        { provide: LOCALE_ID,
          useValue: 'fr-FR' }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(RideComponent);
    component = fixture.componentInstance;
    componentFixture = new RideComponentFixture(fixture.debugElement);

    // Mock the store
    store = TestBed.inject(MockStore);
    mockSelectRideOverride = store.overrideSelector(selectRide, MOCK_RIDE);
  
    // Mock the router
    router = TestBed.inject(Router);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show the correct ride title', () => {
    expect(componentFixture.getTitleText()).toEqual(MOCK_RIDE.name);
  });

  it('should show the correct formated ride date', () => {
    expect(componentFixture.getStartDateText()).toEqual('dimanche 13 avril 2025');
  });

  it('should show the correct statistics', () => {
    expect(componentFixture.getStatisticDistanceValue()).toEqual(6);
    expect(componentFixture.getStatisticAverageSpeedValue()).toEqual(24);
    expect(componentFixture.getStatisticMaxSpeedValue()).toEqual(73);
    expect(componentFixture.getStatisticMaxTiltValue()).toEqual(18);
  });

  it('should show the inerpolation checkbox if less than 1000 log entries', () => {
    // Force the logs to have more than 1000 items
    mockSelectRideOverride.setResult({
      ...MOCK_RIDE,
      logs: Array(1000).fill(MOCK_RIDE.logs[0])
    });

    store.refreshState();
    fixture.detectChanges();

    expect(componentFixture.getInterpolationCheckbox()).toBeFalsy();
  });

  it('should show the inerpolation checkbox if more than 1000 log entries', () => {
    // Force the logs to have more than 1000 items
    mockSelectRideOverride.setResult({
      ...MOCK_RIDE,
      logs: Array(1001).fill(MOCK_RIDE.logs[0])
    });
    
    store.refreshState();
    fixture.detectChanges();

    expect(componentFixture.getInterpolationCheckbox()).toBeTruthy();
  });

  it('should redirect to rides when clicking on back', () => {
    const routerSpy = spyOn(router, 'navigate').and.callThrough();
    componentFixture.clickBackButton();

    // Redirect to the rides page
    expect(routerSpy).toHaveBeenCalledOnceWith(['rides'])
  });

  it('should trigger the export when clicking on the export button',  () => {
    componentFixture.clickExportButton();
    expect(rideServiceFixture.export).toHaveBeenCalledWith(MOCK_RIDE.id);
  });
});
