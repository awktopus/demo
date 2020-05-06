import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import {  ViewEncapsulation, ElementRef, PipeTransform, Pipe, Inject } from '@angular/core';
@Component({
  selector: 'app-income-and-expense',
  templateUrl: './income-and-expense.component.html',
  styleUrls: ['./income-and-expense.component.css']
})
export class IncomeExpenseComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    console.log('iet component created!');
  }

}

@Pipe({ name: 'ietsafe' })
export class IetSafePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) { }
  transform(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}



