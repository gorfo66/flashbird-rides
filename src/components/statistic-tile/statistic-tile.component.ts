import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-statistic-tile',
  standalone: false,
  templateUrl: './statistic-tile.component.html',
  styleUrl: './statistic-tile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatisticTileComponent {

  @Input() label?: string;
  @Input() value?: number | string | undefined | null;
  @Input() unit?: string | undefined;
}
