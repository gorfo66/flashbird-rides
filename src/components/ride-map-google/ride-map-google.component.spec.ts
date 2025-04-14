import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RideMapGoogleComponent } from './ride-map-google.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { RideMapGoogleComponentFixture } from './ride-map-google.fixture';
import { MOCK_RIDE } from '../../../mocks/ride';

describe('GoogleMapComponent', () => {
  let component: RideMapGoogleComponent;
  let fixture: ComponentFixture<RideMapGoogleComponent>;
  let componentFixture: RideMapGoogleComponentFixture;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RideMapGoogleComponent],
      imports: [
        MatCheckboxModule,
        MatIconModule,
        MatButtonModule,
        ReactiveFormsModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RideMapGoogleComponent);
    fixture.componentRef.setInput('ride', MOCK_RIDE);
    component = fixture.componentInstance;
    (component as any).renderMap = jasmine.createSpy('renderMap');
    componentFixture = new RideMapGoogleComponentFixture(fixture.debugElement);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle the map mode on click', () => {    
    expect((component as any).mode).toEqual('SATELLITE');
    
    componentFixture.clickShowLabelCheckbox();
    fixture.detectChanges();

    expect((component as any).mode).toEqual('HYBRID');

    componentFixture.clickShowLabelCheckbox();
    fixture.detectChanges();

    expect((component as any).mode).toEqual('SATELLITE');

  });

  it('should call the renderMap method', () => {
    expect((component as any).renderMap).toHaveBeenCalledOnceWith(MOCK_RIDE);
  });

  it('should toggle the fullscreen mode on and off', () => {
    expect(component.isFullScreen).toBeFalse();

    componentFixture.clickFullScreenButton();
    fixture.detectChanges();
    
    expect(component.isFullScreen).toBeTrue();
    expect(componentFixture.getMapContainer().classes['full-screen']).toBeTrue();

    componentFixture.clickFullScreenExitButton();
    fixture.detectChanges();

    expect(component.isFullScreen).toBeFalse();
    expect(componentFixture.getMapContainer().classes['full-screen']).toBeFalsy();
  });
});
