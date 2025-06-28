import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Profile } from "../profile/profile";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-left-nav',
  imports: [Profile, RouterModule, CommonModule],
  templateUrl: './left-nav.html',
  styleUrl: './left-nav.css'
})
export class LeftNav {
  
  constructor(private router: Router) {}

  navItems = [
    {
      label: 'Home',
      route: '/',
     },
    {
      label: 'Dashboard',
      route: '/dashboard',
     }
  ];

  isActiveRoute(route: string): boolean {
    return this.router.url === route;
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
