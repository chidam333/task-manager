import { Component, inject, input } from '@angular/core';
import { AuthFetch } from '../auth/auth-service/auth-fetch';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile {
  invert = input<boolean>(false);
  nonHoverMode = input<boolean>(false);
  about_me = inject(AuthFetch);
  router = inject(Router);
  user = this.about_me.getUniqueName();
  email = this.about_me.getUserEmail();
  firstchar: string = '';
  constructor(){
    if(typeof this.user==="string"){
      this.firstchar  = this.user.charAt(0).toUpperCase();
    }
  }
  logout(){
    this.about_me.logout();
    console.log("User logged out");
    this.router.navigate(['/auth']);
  }
}
