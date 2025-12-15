import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { AppComponent } from './app/app.component';
import { tournamentReducer } from './app/store/tournament.reducer';
import { TournamentEffects } from './app/store/tournament.effects';
import { routes } from './app/app.routes';
import {provideHttpClient} from '@angular/common/http';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { isDevMode } from '@angular/core';

void bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideRouter(routes),
    provideStore({ tournament: tournamentReducer }),
    provideEffects([TournamentEffects]),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() })
]
});
