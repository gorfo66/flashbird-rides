import {
  ChangeDetectionStrategy,
  Component,
  input,
} from '@angular/core'
import {
  CommonModule
} from '@angular/common'

@Component({
  selector: 'app-statistic-tile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './statistic-tile.component.html',
  styleUrl: './statistic-tile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatisticTileComponent {

  label = input<string>();
  value = input<number | string | undefined | null>();
  unit = input<string | undefined>();
}
