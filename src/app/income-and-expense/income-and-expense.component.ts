import { Component, OnInit } from '@angular/core';

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



