import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { AppComponent } from './app/app.component';
import { tournamentReducer } from './app/store/tournament/tournament.reducer';
import { TournamentEffects } from './app/store/tournament/tournament.effects';
import { routes } from './app/app.routes';
import { XlsxService } from './app/services/xlsx.service';

void bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideStore({ tournament: tournamentReducer }),
    provideEffects([TournamentEffects]),
    XlsxService
  ]
});
