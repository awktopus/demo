import {  MAT_DIALOG_DATA, MatOptionSelectionChange } from '@angular/material';
import { Router } from '@angular/router';
import { SenderdocumentsComponent } from '../senderdocuments/senderdocuments.component';

import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {MatDialog, MatDialogRef, MatSort, MatTable, MatTableDataSource} from '@angular/material';
import {SelectionModel} from '@angular/cdk/collections';
import { Signer } from '../../../esign/beans/ESignCase';
// import {MatContactDialogComponent} from './dialog/mat-contact-dialog.component';
// import {Filter, Methods} from '../../enums';

@Component({
  selector: 'app-addsigners',
  templateUrl: './addsigners.component.html',
  styleUrls: ['./addsigners.component.scss']
})
export class AddsignersComponent implements  OnInit, OnDestroy, OnChanges {

  senderDocumentsref: SenderdocumentsComponent;


  @ViewChild(MatTable) table: MatTable<any>;

  @ViewChild(MatSort) sort: MatSort;

  @Input()
  contacts: Signer[] = [
    {
      id: 'RnCSW7Y88iTx',
      name: 'Ranga Rachapudi',
      email: 'rvrnkumar_363@yahoo.com',
      signerSequence: '1'
    },
    {
      id: 'KXgJviXd4EL9',
      name: 'Ying Guo',
      email: 'henguo@gmail.com',
      signerSequence: '2'
    }];


  @Input()
  isLoading: boolean;

  @Input()
  readonly: boolean;

  @Input()
  enableMenu: boolean;

  @Output()
  onContactAdded: EventEmitter<Signer> = new EventEmitter<Signer>();

  @Output()
  onContactRemoved: EventEmitter<Signer> = new EventEmitter<Signer>();

  @Output()
  onAddingNewContactCanceled: EventEmitter<void> = new EventEmitter<void>();

 // methods = Methods;
 // filter: Filter;
  contactsDataSource: MatTableDataSource<Signer>;
  contactsDisplayedColumns = ['name', 'email', 'signerSequence'];
  selection = new SelectionModel<Signer>(true, []);
 // dialogRef: MatDialogRef<MatContactDialogComponent> | null;
  dialogAfterCloseSubscription: any;

  constructor(private router: Router, public dialog: MatDialog,
    public dialogRef: MatDialogRef<AddsignersComponent>) { }

  ngOnInit(): void {
    console.log('ConfigurationHelper ngOnInit');
    this.contactsDataSource = new MatTableDataSource<Signer>(this.contacts);
    // this.contactsDataSource.sort = this.sort;

    if (!this.readonly) {
      this.contactsDisplayedColumns.splice(0, 0, 'select');
      this.contactsDisplayedColumns.push('more');
      console.log('data : ', this.contactsDataSource.data);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // console.log('on changes: ', changes);
    if (!changes.contacts.isFirstChange()) {
      this.table.renderRows();
    }
  }

  ngOnDestroy(): void {
    if (this.dialogAfterCloseSubscription) {
      this.dialogAfterCloseSubscription.unsubscribe();
    }
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.contactsDataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.contactsDataSource.data.forEach(row => this.selection.select(row));
  }

  select(row: any) {
    if (!this.readonly) {
      this.selection.toggle(row);
    }
  }

  // openAddDialogContainer(method?: Methods, contact?: Contact) {
  //   const dialogData: IContactDialogData = {
  //     method: method,
  //     contact: contact
  //   };
  //   this.dialogRef = this.dialog.open(MatContactDialogComponent, {
  //     panelClass: 'new-contact-dialog',
  //     data: dialogData
  //   });
  //   this.dialogAfterCloseSubscription = this.dialogRef
  //     .afterClosed()
  //     .subscribe((result: IContactDialogData) => {
  //       if (result) {
  //         const methodFromResult: Methods = result.method;
  //         const contactFromResult: Contact = result.contact;

  //         switch (methodFromResult) {
  //           case Methods.POST:
  //             // console.log('on post');
  //             // console.log('contact added -> ', result);
  //             this.add(contactFromResult);
  //             break;
  //           case Methods.DELETE:
  //             // console.log('on delete');
  //             this.remove(contactFromResult);
  //             break;
  //         }

  //       } else {
  //         this.onAddingNewContactCanceled.emit();
  //       }
  //     });
  // }

  add(contact: Signer) {
    this.contactsDataSource.data.splice(0, 0, contact);
    this.onContactAdded.emit(contact);
    this.table.renderRows();
  }

  remove(contact: Signer) {
    console.log('contact -> ', contact);
    console.log('data.length before: ', this.contactsDataSource.data.length);
    const index = this.contactsDataSource.data.indexOf(contact);
    console.log('contactToRemove = ', index);
    if (index > -1) {
      this.contactsDataSource.data.splice(index, 1);
      console.log('data.length after: ', this.contactsDataSource.data.length);
      this.selection.clear();
      this.table.renderRows();
      this.onContactRemoved.emit(contact);
    }
  }

  removeSelected() {
    const selectedContacts = this.selection.selected;
    selectedContacts.forEach((contact) => {
      this.remove(contact);
    });
  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.contactsDataSource.filter = filterValue;
  }

  startAddingFields() {
    this.router.navigateByUrl('addsigners');
  }
  closeMe() {
    this.dialogRef.close();
   }
}
