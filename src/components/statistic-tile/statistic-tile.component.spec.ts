import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing'
import {
  provideZonelessChangeDetection
} from '@angular/core'

import {
  StatisticTileComponent
} from './statistic-tile.component'
import {
  StatisticTileComponentFixture
} from './statistic-tile.fixture'

describe('StatisticTileComponent', () => {
  let component: StatisticTileComponent;
  let fixture: ComponentFixture<StatisticTileComponent>;
  let componentFixture: StatisticTileComponentFixture

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatisticTileComponent],
      providers: [
        provideZonelessChangeDetection()
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(StatisticTileComponent);
    component = fixture.componentInstance;
    componentFixture = new StatisticTileComponentFixture(fixture.debugElement);

    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render all the data', async () => {
    fixture.componentRef.setInput('label', 'label');
    fixture.componentRef.setInput('unit', 'unit');
    fixture.componentRef.setInput('value', '123');
    await fixture.whenStable();

    expect(componentFixture.getLabelText()).toEqual('label');
    expect(componentFixture.getValueText()).toEqual('123');
    expect(componentFixture.getUnitText()).toEqual('unit');
  })
});
