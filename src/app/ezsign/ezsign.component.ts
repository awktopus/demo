import { Component, OnInit } from '@angular/core';
import {  ViewEncapsulation, ElementRef, PipeTransform, Pipe, Inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-ezsign',
  templateUrl: './ezsign.component.html',
  styleUrls: ['./ezsign.component.scss']
})
export class EzsignComponent implements OnInit {

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
