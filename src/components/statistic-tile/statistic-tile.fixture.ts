
import {
  By
} from '@angular/platform-browser'
import {
  DebugElement
} from '@angular/core'


export class StatisticTileComponentFixture {
  
  constructor(private elt: DebugElement) {}

  public getLabelText() {
    return this.getText('.label');
  }

  public getValueText() {
    return this.getText('.amount');
  }

  public getUnitText() {
    return this.getText('.unit');
  }

  private getText(selector: string) {
    return this.elt.query(By.css(selector)).nativeElement.innerText;
  }

}
