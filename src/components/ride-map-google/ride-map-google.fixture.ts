
import {
  By
} from '@angular/platform-browser'
import {
  DebugElement
} from '@angular/core'


export class RideMapGoogleComponentFixture {
  
  constructor(private elt: DebugElement) {}


  public clickShowLabelCheckbox() {
    this.elt.query(By.css('mat-checkbox input')).nativeElement.click();
  }

  public clickFullScreenButton() {
    this.elt.query(By.css('.full-screen-button')).nativeElement.click();
  }

  public clickFullScreenExitButton() {
    this.elt.query(By.css('.full-screen-exit-button')).nativeElement.click();
  }

  public getMapContainer() {
    return this.elt.query(By.css('.map-container'));
  }
}
