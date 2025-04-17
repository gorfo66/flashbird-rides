import { Injectable, OnDestroy } from "@angular/core";
import { MatSnackBar, MatSnackBarRef, TextOnlySnackBar } from "@angular/material/snack-bar";
import { SwUpdate, VersionReadyEvent } from "@angular/service-worker";
import { filter, interval, Subscription } from "rxjs";

@Injectable({ providedIn: 'root' })
export class PromptUpdateService implements OnDestroy {

  public static FREQUENCY = 60000;
  private subscriptions: Subscription[] = [];
  private snackBarRef?: MatSnackBarRef<TextOnlySnackBar>


  constructor(private updates: SwUpdate, private snackBar: MatSnackBar) {
    this.checkPeriodically();
    this.showSnackBarOnUpdate();
  }

  public checkPeriodically() {
    this.subscriptions.push(
      interval(PromptUpdateService.FREQUENCY).subscribe(async () => {
        try {
          const updateFound = await this.updates.checkForUpdate();
          console.log(updateFound ? 'A new version is available.' : 'Already on the latest version.');
        } catch (err) {
          console.error('Failed to check for updates:', err);
        }
      })
    )
  }

  public showSnackBarOnUpdate() {
    this.subscriptions.push(
      this.updates.versionUpdates
        .pipe(filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'))
        .subscribe(() => {

          // Simple message with an action.
          this.snackBarRef = this.snackBar.open('Une nouvelle version de l\'application est disponible', 'Mettre à jour', {
            duration: 0
          });

          this.snackBarRef.onAction().subscribe(() => {
            this.installNewVersion();
          });

        })
    )
  }

  public installNewVersion() {
    document.location.reload();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(value => value.unsubscribe());
  }
}