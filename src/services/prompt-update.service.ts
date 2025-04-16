import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { SwUpdate, VersionReadyEvent } from "@angular/service-worker";
import { filter, interval } from "rxjs";

@Injectable({ providedIn: 'root' })
export class PromptUpdateService {

  constructor(private updates: SwUpdate, private snackBar: MatSnackBar) {

    const everyHour$ = interval(60000);
    everyHour$.subscribe(async () => {
      try {
        const updateFound = await this.updates.checkForUpdate();
        console.log(updateFound ? 'A new version is available.' : 'Already on the latest version.');
      } catch (err) {
        console.error('Failed to check for updates:', err);
      }
    });

    
    this.updates.versionUpdates
      .pipe(filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'))
      .subscribe(() => {

        // Simple message with an action.
        const snackBarRef = this.snackBar.open('Une nouvelle version de l\'application est disponible', 'Mettre à jour', {
          duration: 0
        });
        snackBarRef.onAction().subscribe(() => {
          document.location.reload();
        });

      });
  }
}