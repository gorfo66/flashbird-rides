import {
  Component,
  Input
} from '@angular/core'

@Component({
  selector: 'app-statistic-tile',
  standalone: true,
  template: ''
})
export class MockStatisticTileComponent {
  @Input() label?: string;
  @Input() value?: number | string | undefined | null;
  @Input() unit?: string | undefined;
}
