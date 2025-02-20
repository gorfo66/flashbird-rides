import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticTileComponent } from './statistic-tile.component';

describe('StatisticTileComponent', () => {
  let component: StatisticTileComponent;
  let fixture: ComponentFixture<StatisticTileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StatisticTileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatisticTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
