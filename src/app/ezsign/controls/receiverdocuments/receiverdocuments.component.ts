import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { EzsigndataService } from '../../service/ezsigndata.service';
import { EZSignDocResource } from '../../../esign/beans/ESignCase'

@Component({
  selector: 'app-receiverdocuments',
  templateUrl: './receiverdocuments.component.html',
  styleUrls: ['./receiverdocuments.component.scss']
})
export class ReceiverdocumentsComponent implements OnInit, OnDestroy {
  ezSignDocsFilteredByCategory: any[];
  ezSignDocs: any[];
  currentCategory: string;

  // Private
  private _unsubscribeAll: Subject<any>;

  constructor(
      private ezSignDataService: EzsigndataService
  ) {
      // Set the defaults
      this.currentCategory = 'all';

      // Set the private defaults
      this._unsubscribeAll = new Subject();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
      // Subscribe to categories
      // this.ezSignDataService.onCategoriesChanged
      //     .pipe(takeUntil(this._unsubscribeAll))
      //     .subscribe(ezSignDocs => {
      //         this.ezSignDocs = ezSignDocs;
      //     });
      this.ezSignDataService.getEZSignDocuments().subscribe(ezSignDocs => {
        this.ezSignDocs = ezSignDocs;
      });
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
      // Unsubscribe from all subscriptions
      // this._unsubscribeAll.next();
      // this._unsubscribeAll.complete();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Filter documents by category
   */
  filterDocumentsByCategory(): void {
      // Filter
      if ( this.currentCategory === 'all' ) {
          this.ezSignDocsFilteredByCategory = this.ezSignDocs;
      } else {
          this.ezSignDocsFilteredByCategory = this.ezSignDocs.filter((ezSignDoc) => {
              return ezSignDoc.status === this.currentCategory;
          });
//          this.filteredCourses = [...this.ezSignDocsFilteredByCategory];
      }

      // Re-filter by search term
  //    this.filterCoursesByTerm();
  }

  /**
   * Filter courses by term
   */
  // filterCoursesByTerm(): void {
  //     const searchTerm = this.searchTerm.toLowerCase();

  //     // Search
  //     if ( searchTerm === '' ) {
  //         this.filteredCourses = this.coursesFilteredByCategory;
  //     } else {
  //         this.filteredCourses = this.coursesFilteredByCategory.filter((course) => {
  //             return course.title.toLowerCase().includes(searchTerm);
  //         });
  //     }
  // }
}
