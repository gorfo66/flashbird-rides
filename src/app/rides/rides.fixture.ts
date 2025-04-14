
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';


export class RidesComponentFixture {
  
  constructor(private elt: DebugElement) {}

  public getRideCards() {
    return this.elt.queryAll(By.css('.ride-card'));
  }

  public clickDetailsLink(index: number) {
    const elements = this.elt.queryAll(By.css('.ride-card a'));
    elements[index].nativeElement.click();
  }

  public clickFilterAll() {
    this.elt.queryAll(By.css('mat-button-toggle button'))[0].nativeElement.click();
  }

  public clickFilterLong() {
    this.elt.queryAll(By.css('mat-button-toggle button'))[1].nativeElement.click();
  }

}
