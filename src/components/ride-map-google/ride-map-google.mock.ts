import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core'
import {
  Ride
} from '../../models'

@Component({
  selector: 'app-ride-map-google',
  standalone: false,
  template: ''
})
export class MockRideMapGoogleComponent {
  @Input() ride?: Ride;
  @Input() showLabels = false;
  @Output() showLabelsUpdated = new EventEmitter<boolean>()
}
