import {
  Component,
  EventEmitter,
  input,
  Output,
  ChangeDetectionStrategy
} from '@angular/core'
import {
  Ride
} from '../../models'

@Component({
  selector: 'app-ride-map-google',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ''
})
export class MockRideMapGoogleComponent {
  public ride = input.required<Ride>();
  public showLabels = input<boolean>();
  @Output() showLabelsUpdated = new EventEmitter<boolean>()
}
