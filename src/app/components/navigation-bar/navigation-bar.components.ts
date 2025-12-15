import { Component } from '@angular/core';
import {MatTabLink, MatTabNav} from '@angular/material/tabs';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {MatToolbar} from "@angular/material/toolbar";

@Component({
  selector: 'app-navigation-bar',
    imports: [
        MatTabLink,
        RouterLink,
        RouterLinkActive,
        MatTabNav,
        MatToolbar,
    ],
  templateUrl: './navigation-bar.components.html',
  styleUrl: './navigation-bar.components.scss',
})
export class NavigationBarComponents {

}
