import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { EsignserviceService } from '../../service/esignservice.service';

@Component({
  selector: 'app-receivercases',
  templateUrl: './receivercases.component.html',
  styleUrls: ['./receivercases.component.scss']
})
export class ReceivercasesComponent implements OnInit {

  selectedIndex: any;
  userRole: string;
  constructor(public dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private service: EsignserviceService) {

  }

  ngOnInit() {
  console.log('ezmain OnInit and user role:');
  console.log(this.service.auth.getUserRole());
  this.userRole = this.service.auth.getUserRole();
    // if (typeof this.userRole === "undefined" || this.userRole === null) {
    // // this.userRole = 'ADMIN';
    //   console.log(window.location.href);
    //   if (window.location.href.indexOf("localhost") !== -1) {
    //     this.userRole = "ADMIN";
    //   }
    // } else {
    //   this.userRole = this.userRole.toUpperCase();
    // }
    console.log('converted role');
    console.log(this.userRole);
  }
  changeTab(event) {
  }
}
