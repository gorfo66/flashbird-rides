import {
  Component,
  EventEmitter,
  input,
  Output
} from '@angular/core'
import {
  Ride
} from '../../models'

@Component({
  selector: 'app-ride-map-google',
  standalone: true,
  template: ''
})
export class MockRideMapGoogleComponent {
  public ride = input.required<Ride>();
  public showLabels = input<boolean>();
  @Output() showLabelsUpdated = new EventEmitter<boolean>()
}
