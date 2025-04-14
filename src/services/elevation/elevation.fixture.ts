import { ElevationService } from './elevation.service';

export class ElevationServiceFixture implements Readonly<ElevationService> {

  public getElevations: jasmine.Spy;

  constructor() { 
    this.getElevations = jasmine.createSpy('getElevations');

  }

}
