import { MAT_DIALOG_DATA, MatOptionSelectionChange } from '@angular/material';
import { Router } from '@angular/router';
import { SenderdocumentsComponent } from '../senderdocuments/senderdocuments.component';
import { EzsigndataService } from '../../service/ezsigndata.service';
import { CompanyStaff } from './../../../esign/beans/ESignCase';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges,  ViewChild,
  ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef, MatSort, MatTable, MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { Signer, ESignClient, ESignCPA } from '../../../esign/beans/ESignCase';
import { EsignserviceService } from '../../../esign/service/esignservice.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EsignuiserviceService } from '../../../esign/service/esignuiservice.service';
import { AddfieldsComponent } from '../addfields/addfields.component';
@Component({
  selector: 'app-addsigners',
  templateUrl: './addsigners.component.html',
  styleUrls: ['./addsigners.component.scss']
})
export class AddsignersComponent implements OnInit, OnDestroy, OnChanges {

  senderDocumentsref: SenderdocumentsComponent;
  addFieldsRef: AddfieldsComponent;
  ezSignTrackingId: string;
  primarysigner: CompanyStaff = null;
  clients: CompanyStaff[];
  senderId = '';
  client_var = '';
  cpas: ESignCPA[] = [];
  removable = true;
  launchComponent: string;
  showProcessSpinner = false;
  isImageDataUrlFetched = false;
  signerSearchForm: FormGroup = new FormGroup({
    clientctrl: new FormControl('', Validators.required),
  });
  @ViewChild(MatTable) table: MatTable<any>;

  @ViewChild(MatSort) sort: MatSort;

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

   contactsDataSource: MatTableDataSource<Signer>;
  contactsDisplayedColumns = ['receiverSeqNo', 'receiverFullName', 'receiverEmailId'];
  selection = new SelectionModel<Signer>(true, []);

  dialogAfterCloseSubscription: any;

  constructor(private router: Router, public dialog: MatDialog,
    private service: EsignserviceService,
    private ezSignDataService: EzsigndataService,
    public dialogRef: MatDialogRef<AddsignersComponent>) {
      dialogRef.disableClose = true;
     }

  ngOnInit(): void {
    console.log('Add signers ngOnInit');
    this.isImageDataUrlFetched = true;
    console.log(this.ezSignTrackingId);
    this.contactsDisplayedColumns.push('more');

    this.ezSignDataService.getOrganizationEZSignSigners().subscribe(results => {
      console.log('get company staff');
      console.log(results);
      this.senderId = this.service.auth.getUserID();
      this.clients = <CompanyStaff[]>results;
      console.log('sender clients');
      console.log(this.clients);
      this.ezSignDataService.getEZSignSigners(this.ezSignTrackingId).subscribe(resp => {
        console.log('getEZSignSigners response');
        console.log(resp);
        if (resp) {
          this.contactsDataSource = new MatTableDataSource<Signer>(resp);
          this.isImageDataUrlFetched = false;
          // this.contactsDataSource.sort = this.sort;
          // if (!this.readonly) {
          //   this.contactsDisplayedColumns.splice(0, 0, 'select');
          // this.contactsDisplayedColumns.push('more');
          //   console.log('data : ', this.contactsDataSource.data);
          // }
        }
        this.isImageDataUrlFetched = false;
      });
    });

    this.signerSearchForm.controls['clientctrl'].valueChanges.subscribe(val => {
      console.log('clientctrl search clients called');
      console.log(val.trim());
      console.log(this.client_var);
      console.log(typeof val);
      console.log(this.primarysigner);
      if (this.senderId === '') {
        return;
      }
      if (this.primarysigner) {
        return;
      }
      if (val && typeof val !== 'object') {
        if (this.client_var === val.trim()) {
          return;
        } else {
          this.ezSignDataService.getOrganizationEZSignSignersBySearchToken(val).subscribe(resp => {
            this.clients = <CompanyStaff[]>resp;
          });
        }
      } else {
        console.log('else');
        console.log(this.senderId);
        console.log(val);
        val = val.trim();
        this.ezSignDataService.getOrganizationEZSignSignersBySearchToken(val).subscribe(resp => {
          this.clients = <CompanyStaff[]>resp;
        });
      }
    });
  }

  loadEZSignSigners() {
    this.ezSignDataService.getEZSignSigners(this.ezSignTrackingId).subscribe(resp => {
      console.log(resp);
      this.contactsDataSource = new MatTableDataSource<Signer>(resp);
      this.contactsDisplayedColumns.push('more');
    });
  }

  setData(ezSignTrackingId: string, launchComponent: string) {
    this.ezSignTrackingId = ezSignTrackingId;
    this.launchComponent = launchComponent;
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


  // add(contact: Signer) {
  //   this.contactsDataSource.data.splice(0, 0, contact);
  //   this.onContactAdded.emit(contact);
  //   this.table.renderRows();
  // }

  deleteSigner(contact: Signer) {
    console.log('delete signer');
    console.log(contact);

    this.ezSignDataService.deleteSigner(this.ezSignTrackingId, contact.receiverId).subscribe(resp => {
      console.log(resp);
      if (resp) {
        this.contactsDataSource = new MatTableDataSource<Signer>(resp);
      } else {
        this.contactsDataSource = null;
      }
    //  this.contactsDisplayedColumns.push('more');
    });
    // console.log('contact -> ', contact);
    // console.log('data.length before: ', this.contactsDataSource.data.length);
    // const index = this.contactsDataSource.data.indexOf(contact);
    // console.log('contactToRemove = ', index);
    // if (index > -1) {
    //   this.contactsDataSource.data.splice(index, 1);
    //   console.log('data.length after: ', this.contactsDataSource.data.length);
    //   this.selection.clear();
    //   this.table.renderRows();
    //   this.onContactRemoved.emit(contact);
    // }
  }

  // removeSelected() {
  //   const selectedContacts = this.selection.selected;
  //   selectedContacts.forEach((contact) => {
  //     this.deleteSigner(contact);
  //   });
  // }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.contactsDataSource.filter = filterValue;
  }

  startAddingFields() {
    const url = '/main/ezsign/addfields/' + this.ezSignTrackingId;
    this.router.navigateByUrl(url);
    this.closeMe();
  }

  addPrimary(event: MatOptionSelectionChange): void {
    const value = event.source.value;
    console.log('add primary client' + value);
    if ((value && event.isUserInput && this.clients)) {
      let c: CompanyStaff = null;
      this.clients.forEach(cc => { if (cc.clientId === value) { c = cc; } });
      this.primarysigner = c;
      this.signerSearchForm.controls['clientctrl'].setValue('');
    }
  }

  removeSinger(s: string): void {
    console.log(s + 'remove singer');
    if (s === 'primary') {
      this.primarysigner = null;
      this.ezSignDataService.getOrganizationEZSignSignersBySearchToken('').subscribe(resp => {
        this.clients = <CompanyStaff[]>resp
      });
    }
  }

  addNewSigner() {
this.showProcessSpinner = true;
    console.log('add new signer');
    console.log(this.primarysigner);
    console.log('checking if the signer is already added');
    if (this.contactsDataSource) {
    this.contactsDataSource.data.forEach(cc => {
      if (cc.receiverId === this.primarysigner.clientId) {
        console.log('signer is already added..hence skipping add new signer process');
        this.showProcessSpinner = false;
        return;
      }
    });
  }
    console.log('signer is not added');
    let isSender = "N";
    let isSenderSigner = "N";
    if (this.primarysigner.clientId === this.service.auth.getUserID()) {
      isSender = "Y";
      isSenderSigner = "Y";
    }
    const newSignerJson = {
      receiverId: this.primarysigner.clientId,
      receiverFirstName: this.primarysigner.firstName,
      receiverLastName: this.primarysigner.lastName,
      receiverEmailId: this.primarysigner.emailId,
      isSenderSigner: isSenderSigner,
      isSender: isSender
    };
    console.log(newSignerJson);

    this.ezSignDataService.addNewSigner(this.ezSignTrackingId, newSignerJson).subscribe(resp => {
      console.log(resp);
      this.contactsDataSource = new MatTableDataSource<Signer>(resp);
      this.removeSinger('primary');
      this.showProcessSpinner = false;
    });
  }


  closeMe() {
    this.dialogRef.close();
  }
}
