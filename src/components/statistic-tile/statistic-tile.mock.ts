import {
  Component,
  Input,
  ChangeDetectionStrategy
} from '@angular/core'

@Component({
  selector: 'app-statistic-tile',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ''
})
export class MockStatisticTileComponent {
  @Input() label?: string;
  @Input() value?: number | string | undefined | null;
  @Input() unit?: string | undefined;
}
