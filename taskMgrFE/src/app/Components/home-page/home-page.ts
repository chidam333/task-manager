import { Component, signal } from '@angular/core';
import { LeftNav } from "../left-nav/left-nav";
import { HomeRight } from "../home-right/home-right";

@Component({
  selector: 'app-home-page',
  imports: [LeftNav, HomeRight],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css'
})
export class HomePage {
isLeftOpen = signal(false);
}
