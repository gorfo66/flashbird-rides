import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing'
import {
  provideZonelessChangeDetection
} from '@angular/core'
import {
  FilterType,
  RidesComponent
} from './rides.component'
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
  LOCALE_ID
} from '@angular/core'
import localeFr from '@angular/common/locales/fr';
import {
  registerLocaleData
} from '@angular/common'
import {
  MockStatisticTileComponent
} from '../../components/mocks'
import {
  MatButtonModule
} from '@angular/material/button'
import {
  ReactiveFormsModule
} from '@angular/forms'
import {
  MatButtonToggleModule
} from '@angular/material/button-toggle'
import {
  MatCardModule
} from '@angular/material/card'
import {
  selectRides,
  selectUiState
} from '../../store'
import {
  MOCK_RIDES
} from '../../../mocks/rides'
import {
  RidesComponentFixture
} from './rides.fixture'
import {
  DefaultProjectorFn,
  MemoizedSelector
} from '@ngrx/store'
import {
  UiState
} from '../../models'

registerLocaleData(localeFr, 'fr-FR');

describe('RidesComponent', () => {
  let component: RidesComponent;
  let fixture: ComponentFixture<RidesComponent>;
  let componentFixture: RidesComponentFixture;
  let store: MockStore;
  let router: Router;
  let storeUiStageOverride: MemoizedSelector<object, UiState, DefaultProjectorFn<UiState>>;
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RidesComponent, MockStatisticTileComponent,
        MatButtonModule,
        MatCardModule,
        MatButtonToggleModule,
        ReactiveFormsModule,
        RouterModule.forRoot([{
          path: 'ride',
          redirectTo: '/'
        }])
      ],
      providers: [
        provideZonelessChangeDetection(),
        provideMockStore(),
        {
          provide: RideService,
          useValue: RideServiceFixture
        },
        { provide: LOCALE_ID,
          useValue: 'fr-FR' }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(RidesComponent);
    component = fixture.componentInstance;
    componentFixture = new RidesComponentFixture(fixture.debugElement);

    // Mock the store
    store = TestBed.inject(MockStore);
    store.overrideSelector(selectRides, MOCK_RIDES);
    storeUiStageOverride = store.overrideSelector(selectUiState, {});
    store.refreshState();

    // Mock the router
    router = TestBed.inject(Router);

    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render all the cards if not filtered', () => {
    const cards = componentFixture.getRideCards();
    expect(cards.length).toEqual(MOCK_RIDES.length);
    expect(component.filterForm.controls['filter'].value).toEqual(FilterType.all);
  });

  it('should filter the cards', async () => {
    storeUiStageOverride.setResult({
      filter: FilterType.long
    });

    store.refreshState();
    await fixture.whenStable();

    const cards = componentFixture.getRideCards();
    expect(cards.length).toEqual(1);
    expect(component.filterForm.controls['filter'].value).toEqual(FilterType.long);
  });

  it('should update the ui state store when toggle the filter', async () => {
    const spy = spyOn(store, 'dispatch').and.callThrough();
    componentFixture.clickFilterLong();

    await fixture.whenStable();
    expect(spy).toHaveBeenCalledWith({ uiState: { filter: 'long' },
      type: '[Ui] upsert state' });
  });


  it('should redirect to the ride page on click', () => {
    const spy = spyOn(router, 'navigateByUrl').and.callThrough();
    componentFixture.clickDetailsLink(0);
    expect(spy).toHaveBeenCalledWith(
      jasmine.stringMatching('/ride/'+ MOCK_RIDES[0].id),
      jasmine.anything()
    );
  })
});
