import { Component, HostBinding, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { routerAnimation } from '../../utils/page.animation';

@Component({
  selector: 'app-sign-up-page',
  templateUrl: './sign-up-page.component.html',
  styleUrls: ['./sign-up-page.component.scss'],
  animations: [routerAnimation]
})
export class SignUpPageComponent implements OnInit {
  // Add router animation
  @HostBinding('@routerAnimation') routerAnimation = true;
  constructor(private router: Router) {
  }

  ngOnInit() {
  }

  /**
   * Sign up method
   * @param login
   * @param password
   */
  signUn(login, password) {
    this.router.navigateByUrl('/');
  }

}
