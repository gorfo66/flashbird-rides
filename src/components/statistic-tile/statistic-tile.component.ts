import {
  ChangeDetectionStrategy,
  Component,
  input,
} from '@angular/core'

@Component({
  selector: 'app-statistic-tile',
  standalone: false,
  templateUrl: './statistic-tile.component.html',
  styleUrl: './statistic-tile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatisticTileComponent {

  label = input<string>();
  value = input<number | string | undefined | null>();
  unit = input<string | undefined>();
}
