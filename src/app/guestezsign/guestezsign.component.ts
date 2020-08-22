import { Component, OnInit } from '@angular/core';
import {  ViewEncapsulation, ElementRef, PipeTransform, Pipe, Inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-guestezsign',
  templateUrl: './guestezsign.component.html',
  styleUrls: ['./guestezsign.component.scss']
})
export class GuestEzsignComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
@Pipe({ name: 'safe' })
export class SafePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) { }
  transform(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
