
import {
  By
} from '@angular/platform-browser'
import {
  DebugElement
} from '@angular/core'


export class LoginComponentFixture {
  
  constructor(private elt: DebugElement) {}


  public hasServerErrorText() {
    return !!this.elt.query(By.css('.server-error'));
  }

  public getServerErrorText() {
    return this.elt.query(By.css('.server-error'))?.nativeElement.innerText;
  }
}
