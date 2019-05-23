import { PipeTransform, Pipe } from '@angular/core';
/*
 * Shows date as Today, Yesterday or locale date
*/
@Pipe({ name: 'relativeDate' })
export class RelativeDatePipe implements PipeTransform {
  transform(timeStamp: number): string {

    // nullcheck
    if (!timeStamp) {
      return null;
    }

    let givenTime = new Date(timeStamp);

    // Get today's date
    var todaysDate = new Date();
    var yesterdaysDate = new Date(todaysDate);
    yesterdaysDate.setDate(yesterdaysDate.getDate() - 1);

    // call setHours to take the time out of the comparison
    if (givenTime.setHours(0, 0, 0, 0) === todaysDate.setHours(0, 0, 0, 0)) {
      return 'Today';
    }

    if (givenTime.setHours(0, 0, 0, 0) === yesterdaysDate.setHours(0, 0, 0, 0)) {
      return 'Yesterday';
    }

    // default return
    return givenTime.toLocaleDateString();
  }

}

