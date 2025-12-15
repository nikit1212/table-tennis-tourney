import { Component } from '@angular/core';
import {MatTabLink, MatTabNav} from '@angular/material/tabs';
import {RouterLink, RouterLinkActive} from '@angular/router';

@Component({
  selector: 'app-navigation-bar',
  imports: [
    MatTabLink,
    RouterLink,
    RouterLinkActive,
    MatTabNav,
  ],
  templateUrl: './navigation-bar.html',
  styleUrl: './navigation-bar.scss',
})
export class NavigationBar {

}
