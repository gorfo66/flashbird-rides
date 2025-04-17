
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';


export class RideComponentFixture {
  
  constructor(private elt: DebugElement) {}


  public clickBackButton() {
    this.elt.query(By.css('#back-button')).nativeElement.click();
  }

  public clickExportButton() {
    this.elt.query(By.css('#export-button')).nativeElement.click();
  }

  public getTitleText() {
    return this.elt.query(By.css('h1')).nativeElement.innerText;
  }

  public getStartDateText() {
    return this.elt.query(By.css('.start-date')).nativeElement.innerText;
  }

  public getStatisticDistanceValue() {
    return this.getStatisticValue('#stat-distance');
  }

  public getStatisticAverageSpeedValue() {
    return this.getStatisticValue('#stat-average-speed');
  }

  public getStatisticMaxSpeedValue() {
    return this.getStatisticValue('#stat-max-speed');
  }

  public getStatisticMaxTiltValue() {
    return this.getStatisticValue('#stat-max-tilt');
  }

  public getInterpolationCheckbox() {
    return this.elt.query(By.css('.chart-controls mat-checkbox input'));
  }

  public toggleInterpolationCheckbox() {
    return this.getInterpolationCheckbox().nativeElement.click();
  }

  private getStatisticValue(selector: string) {
    return this.elt.query(By.css(selector)).componentInstance.value;
  }
}
