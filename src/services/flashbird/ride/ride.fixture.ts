import {
  RideService
} from './ride.service'
import {
  MOCK_RIDE
} from '../../../../mocks/ride'
import {
  MOCK_RIDES
} from '../../../../mocks/rides'
import {
  of
} from 'rxjs'

export class RideServiceFixture implements Readonly<RideService> {

  public getRides: jasmine.Spy;
  public getRide: jasmine.Spy;
  public export: jasmine.Spy;


  constructor() {
    this.getRides = jasmine.createSpy('getRides').and.returnValue(of(MOCK_RIDES));
    this.getRide = jasmine.createSpy('getRide').and.returnValue(of(MOCK_RIDE));
    this.export = jasmine.createSpy('export').and.returnValue(of(true));
  }

}
