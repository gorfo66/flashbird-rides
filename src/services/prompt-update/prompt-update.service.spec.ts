import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { PromptUpdateService } from './prompt-update.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';


describe('PromptUpdateService', () => {
  let service: PromptUpdateService;
  let versionUpdates$: Subject<VersionReadyEvent>;
  let mockSwUpdate: jasmine.SpyObj<SwUpdate>;
  
  const versionUpdateEvent: VersionReadyEvent = {
    type: 'VERSION_READY',
    currentVersion: {
    hash: '' 
    },
    latestVersion: {
      hash: ''
    }
  }

  let snackBar: MatSnackBar;
  let spySnackBarOpen: jasmine.Spy;
  let spyInstall: jasmine.Spy;

  beforeEach(() => {
    versionUpdates$ = new Subject<VersionReadyEvent>();
    mockSwUpdate = jasmine.createSpyObj('SwUpdate', ['checkForUpdate'], { versionUpdates: versionUpdates$ });
    
    TestBed.configureTestingModule({
      imports: [
        MatSnackBarModule
      ],
      providers: [
        { provide: SwUpdate, useValue: mockSwUpdate }
      ]
    });

    snackBar = TestBed.inject(MatSnackBar);
    spySnackBarOpen = spyOn(snackBar, 'open').and.callThrough();
    service = TestBed.inject(PromptUpdateService);
    spyInstall = spyOn(service, 'installNewVersion').and.stub();
    
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should trigger the checkForUpdate periodically', fakeAsync(() => {
    service.checkPeriodically();

    mockSwUpdate.checkForUpdate.and.resolveTo(true);
    tick(PromptUpdateService.FREQUENCY);
    expect(mockSwUpdate.checkForUpdate).toHaveBeenCalledTimes(1);

    mockSwUpdate.checkForUpdate.and.resolveTo(false);
    tick(PromptUpdateService.FREQUENCY);
    expect(mockSwUpdate.checkForUpdate).toHaveBeenCalledTimes(2);

    mockSwUpdate.checkForUpdate.and.rejectWith('error');
    tick(PromptUpdateService.FREQUENCY);
    expect(mockSwUpdate.checkForUpdate).toHaveBeenCalledTimes(3);
  }));

  it('should display the snack bar for update', () => {
    versionUpdates$.next(versionUpdateEvent);

    expect(spySnackBarOpen).toHaveBeenCalled();
  });

  it('should trigger the new installation on click', () => {
    versionUpdates$.next(versionUpdateEvent);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (service as any).snackBarRef.dismissWithAction();
    expect(spyInstall).toHaveBeenCalled();
  });

});
