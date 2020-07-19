import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import { ActivatedRoute, Router } from '@angular/router';
import { InfoTrackerService } from '../service/infotracker.service';
import { MatDialog, MatDialogRef, MatOptionSelectionChange, MAT_CHIPS_DEFAULT_OPTIONS, MatSnackBar } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { InfoTrackerReviewFormSubmitResource, InfoTrackerReviewStatusResource } from '../../esign/beans/ESignCase';
import { AdminreportComponent } from '../adminreport/adminreport.component';
import { InfotrackerPdfPopupComponent } from '../shared/infotracker-pdf-popup/infotracker-pdf-popup.component';
import { AdminreviewsummaryComponent } from '../adminreviewsummary/adminreviewsummary.component';

@Component({
  selector: 'app-infotracker-esignature',
  templateUrl: './infotracker-esignature.component.html',
  styleUrls: ['./infotracker-esignature.component.scss']
})
export class InfotrackerEsignatureComponent implements OnInit, AfterViewInit {

  reviewReportForm: FormGroup = new FormGroup({
    locationFormControl: new FormControl('', Validators.required)
    // reportDateControl: new FormControl((new Date()).toISOString(), Validators.required),
    // reviewerNameControl: new FormControl(''),
  });
  @ViewChild(SignaturePad) public signaturePad: SignaturePad;
  reviewSubmitRes: InfoTrackerReviewFormSubmitResource;
  adminReportRef: AdminreportComponent;
  public signaturePadOptions: any = {
    'minWidth': 1,
    'canvasWidth': 420,
    'canvasHeight': 220
    // 'backgroundColor': '#f6fbff'
  };
  public signatureImage: string;
  imageData: any;
  form: any;
  signer: any;
  securitypin = '';
  myDate: Date = new Date();
  caseID: string;
  type: string;
  showSpinner = false;
  reviewDate: string;
  reviewerName: string;
  removable = true;
  locations: any = null;
  locationInput: any;
  locationName: string;
  isToBeSignedDocumentPreviewed = false;
  title: string;
  @ViewChild('location') locationElement: ElementRef;

  constructor(private service: InfoTrackerService, public dialog: MatDialog,
    private route: ActivatedRoute, private router: Router, private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<InfotrackerEsignatureComponent>) { dialogRef.disableClose = true; }

  ngOnInit() {
    console.log('info tracker esignature ng on init');
    console.log(this.reviewSubmitRes);
    if (this.reviewSubmitRes) {
      this.reviewDate = this.reviewSubmitRes.reportedDate;
      this.reviewerName = this.reviewSubmitRes.reviewedBy;
    }
    this.service.GetLocations(this.service.auth.getOrgUnitID(),
      this.service.auth.getUserID()).subscribe(lResp => {
        if (lResp) {
          this.locations = lResp;
          this.locationInput = lResp[0];
        }
      });
    console.log('locations');
    console.log(this.locations);

    // this.reviewReportForm.controls['locationFormControl'].valueChanges.subscribe(val => {
    //   console.log('location control auto typing...' + val);
    //   console.log('location name:' + this.locationName);
    //   if (this.locationName === '') {
    //     return;
    //   }
    //   if (val && typeof val !== 'object') {
    //     if (this.locationName === val.trim()) {
    //       return;
    //     } else {
    //       this.service.GetLocations(this.service.auth.getOrgUnitID(), this.service.auth.getUserID()).subscribe(vResp => {
    //         this.locations = vResp;
    //       });
    //     }
    //   } else {
    //     this.service.GetLocations(this.service.auth.getOrgUnitID(), val).subscribe(vResp => {
    //       this.vendors = vResp;
    //     });
    //   }
    // });
  }

  selectLocation(event: MatOptionSelectionChange): void {
    const value = event.source.value;
    console.log('add location:' + value);
    if ((value && event.isUserInput && this.locations)) {
      let c: any = null;
      this.locations.forEach(cc => { if (cc === value) { c = cc; } });
      this.locationName = c;
      this.reviewReportForm.controls['locationFormControl'].setValue('');
    }
    console.log('locationName:' + this.locationName);
  }

  removeLocation(): void {
    console.log('remove location');
    this.reviewReportForm.controls['locationFormControl'].setValue('');
    this.locationName = null;
    this.service.GetLocations(this.service.auth.getOrgUnitID(), this.service.auth.getUserID()).subscribe(vResp => {
      this.locations = vResp;
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EsignsigcapPage');
  }

  goformview() {
    console.log('go to form view');
    // this.navCtrl.setRoot(EsignformviewPage,{form:this.form,caseID:this.form.caseId});
  }

  drawClear() {
    this.signaturePad.clear();
  }

  canvasResize() {
    const canvas = document.querySelector('canvas');
    this.signaturePad.set('minWidth', 1);
    this.signaturePad.set('canvasWidth', canvas.offsetWidth);
    this.signaturePad.set('canvasHeight', canvas.offsetHeight);
  }

  ngAfterViewInit() {
    this.signaturePad.clear();
    // this.canvasResize();
  }

  setData(reviewSubmitRes: InfoTrackerReviewFormSubmitResource) {
    this.reviewSubmitRes = reviewSubmitRes;
    if (this.reviewSubmitRes) {
      if (this.reviewSubmitRes.actionType === 'review') {
        this.title = "Submit Admin Review";
      } else if (this.reviewSubmitRes.actionType === 'addendum') {
        this.title = "Submit Addendum";
      }
    }
  }

  previewToBeSignedDocument() {
    console.log('previewToBeSignedDocument');
    this.isToBeSignedDocumentPreviewed = true;
    let location = this.reviewReportForm.controls['locationFormControl'].value;
    console.log('location');
    console.log(location);
    if (typeof location === "undefined" || location === '' || location === null) {
      this.snackBar.open("Please enter the location", '', { duration: 3000 });
      this.locationElement.nativeElement.focus();
      return;
    }
    this.reviewSubmitRes.location = location;
    const dialogRef = this.dialog.open(InfotrackerPdfPopupComponent, { width: '520pt' });
    dialogRef.componentInstance.getTobeSignedPDF(this.service.auth.getOrgUnitID(),
      this.service.auth.getUserID(), this.reviewSubmitRes);
  }

  submitReview() {
    console.log('submit review');
    console.log(this.signaturePad);
    let location = this.reviewReportForm.controls['locationFormControl'].value;
    console.log('location');
    console.log(location);
    if (typeof location === "undefined" || location === '' || location === null) {
      this.snackBar.open("Please enter the location", '', { duration: 3000 });
      this.locationElement.nativeElement.focus();
      return;
    }

    console.log('isToBeSignedDocumentPreviewed');
    console.log(this.isToBeSignedDocumentPreviewed);
    if (!this.isToBeSignedDocumentPreviewed) {
      this.snackBar.open("Please preview signed document before signing", '', { duration: 3000 });
      return;
    }
    // console.log('signagure empty status');
    // console.log(this.signaturePad.isEmpty);
    // if (this.signaturePad.isEmpty) {
    //   this.snackBar.open("Please sign to submit the review process", '', { duration: 3000 });
    //   return;
    // }
    this.showSpinner = true;
    this.reviewSubmitRes.location = location;
    this.reviewSubmitRes.signatureDataUrl = this.signaturePad.toDataURL();
    console.log(this.reviewSubmitRes);
    this.service.ReviewedFormsFinalPosting(this.service.auth.getOrgUnitID(),
      this.service.auth.getUserID(), this.reviewSubmitRes).subscribe(resp => {
        console.log('Reviewed forms final posting response');
        console.log(resp);
        if (resp) {
            const dialogRef = this.dialog.open(AdminreviewsummaryComponent, {
            width: '700px', height: '950px'
          });
          dialogRef.componentInstance.adminreportComponent = this.adminReportRef;
          dialogRef.componentInstance.setData(resp);
          this.cancelEsignature();
        }
        this.showSpinner = false;
      });
  }

  cancelEsignature() {
    this.dialogRef.close();
  }
}
