import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import {  ViewEncapsulation, ElementRef, PipeTransform, Pipe, Inject } from '@angular/core';

@Component({
  selector: 'app-esign',
  templateUrl: './esign.component.html',
  styleUrls: ['./esign.component.css']
})
export class EsignComponent implements OnInit {

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

