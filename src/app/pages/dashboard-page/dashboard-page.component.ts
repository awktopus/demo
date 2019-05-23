import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { routerAnimation } from '../../utils/page.animation';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss'],
  animations: [routerAnimation]
})
export class DashboardPageComponent implements OnInit, OnDestroy {
  // Add router animation
  @HostBinding('@routerAnimation') routerAnimation = true;

  constructor() {
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }
}
