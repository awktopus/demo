import { Component, OnInit } from '@angular/core';
import { EsignserviceService } from '../../../../service/esignservice.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { ESignCase, ESignDoc, ClassifyPage } from '../../../../beans/ESignCase';
import { EsigncaseComponent } from '../../esigncase/esigncase.component'
@Component({
  selector: 'app-signerselection',
  templateUrl: './signerselection.component.html',
  styleUrls: ['./signerselection.component.scss']
})
export class SignerselectionComponent implements OnInit {
  signedPartyOption: any;
  caseId: string;
  docId: string;
  pageSeqNo: string;
  eSignCaseComponent: EsigncaseComponent;
  signatureBoxCount: number;
  constructor(private service: EsignserviceService,
    public dialogRef: MatDialogRef<SignerselectionComponent>) { }

  ngOnInit() {
  }

  setSignedPartyPopupInfo(caseId: string, docId: string, pageSeqNo: string,
    signedPartyOption: string, signatureBoxCount: number) {
    this.caseId = caseId;
    this.docId = docId;
    this.pageSeqNo = pageSeqNo;
    this.signatureBoxCount = signatureBoxCount;
    if (signedPartyOption) {
      this.signedPartyOption = signedPartyOption;
    } else if (this.signatureBoxCount === 1) {
      this.signedPartyOption = 'PRIMARY_SIGNER';
    } else {
      this.signedPartyOption = 'PRIMARY_SECONDARY';
    }
  }

  saveSignedParty() {
    console.log('----->', this.signedPartyOption);
    const signedPartyjson = {
      signedPartyOption: this.signedPartyOption,
     };
    this.service.saveSignedPartyOption(this.caseId, this.docId, this.pageSeqNo, signedPartyjson).subscribe(resp => {
    const cc: ESignCase = <ESignCase> resp;
    console.log('save signed party response:')
    console.log(cc);
    const rr: any = <{classification: ESignDoc[]}> resp;
    this.service.updateCase(cc);
    this.service.updateClassificationPages(rr.classification);
     });
   this.dialogRef.close();
  }

  closeme() {
    this.dialogRef.close();
  }

}
