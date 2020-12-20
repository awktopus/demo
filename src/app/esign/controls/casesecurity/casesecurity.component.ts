import { Component, OnInit ,EventEmitter,Output} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EsignserviceService } from '../../service/esignservice.service';

@Component({
  selector: 'app-casesecurity',
  templateUrl: './casesecurity.component.html',
  styleUrls: ['./casesecurity.component.scss']
})
export class CaseSecurityComponent implements OnInit {
  @Output("switchToGridView") switchToGrid: EventEmitter<any> = new EventEmitter();
  viewType:any ;
  form:any ;
  signer:any;
  orgClientQuestions: any = null;
  cliIdQuestion1: any = null;
  cliIdAnswer1: any = null;
  cliIdQuestion2: any = null;
  cliIdAnswer2: any = null;
  cliIdQuestion3: any = null;
  cliIdAnswer3: any = null;
  message1: any = null;
  message2: any = null;
  message3: any = null;
  isValidAnswer1: any = 'N';
  isValidAnswer2: any = 'N';
  isValidAnswer3: any = 'N';
  secQuestionsCount: any;
  constructor(private route: ActivatedRoute, private router: Router, private service: EsignserviceService) {
    
  }

  ngOnInit() {
   console.log("inside casesecurity init");
   this.loadSecurityQuestion();
  }

  loadSecurityQuestion(){
    this.signer=this.service.getCacheData("signer");
    this.form=this.service.getCacheData("form");
    this.message1 = null;
    this.message2 = null;
    this.message3 = null;
    this.isValidAnswer1 = 'N';
    this.isValidAnswer2 = 'N';
    this.isValidAnswer3 = 'N';
    this.cliIdAnswer1 = null;
    this.cliIdAnswer2 = null;
    this.cliIdAnswer3 = null;
    this.cliIdQuestion1 = null;
    this.cliIdQuestion2 = null;
    this.cliIdQuestion3 = null;

    this.service.getSecurityQuestions(this.signer.receiverId, this.form.caseId, this.signer.type)
      .subscribe(resp => {
        const obj = <any[]>resp;
        console.log('get security questions response');
        console.log(obj);
        this.orgClientQuestions = obj;
        this.secQuestionsCount = this.orgClientQuestions.length;
        console.log('org client id questions count:' + this.orgClientQuestions.length);
        for (let index = 0; index < this.orgClientQuestions.length; index++) {
          if (index === 0) {
            this.cliIdQuestion1 = this.orgClientQuestions[index];
          } else if (index === 1) {
            this.cliIdQuestion2 = this.orgClientQuestions[index];
          } else if (index === 2) {
            this.cliIdQuestion3 = this.orgClientQuestions[index];
          }
        }
        this.viewType="Security";
      });
  }
  goFormPage() {
  }

  goFormViewPage() {
  }

  securityQuestionComplete() {
    const signertype=this.service.getCacheData("signer_type");
    console.log(signertype);
    if(signertype=="PRIMARY_SIGNER"||signertype=="SECONDARY_SIGNER"){
      this.viewType="Agreement";
    }
    else if(signertype=="PAPER"){
      this.viewType="paperagreement";
      //this.switchToGrid.emit({view:'paper'});
    }
  }

  validateAnswer() {
    this.message1 = null;
    this.message2 = null;
    this.message3 = null;
    console.log('validate Answer - start');
    console.log(this.secQuestionsCount);
    let ansId: any;
    let ans2Id: any;
    let ans3Id: any;
    if (this.cliIdQuestion1) {
      ansId = this.cliIdQuestion1.ansId;
    }
    if (this.cliIdQuestion2) {
      ans2Id = this.cliIdQuestion2.ansId;
    }
    if (this.cliIdQuestion3) {
      ans3Id = this.cliIdQuestion3.ansId;
    }
    const data = {
      'clientId': this.signer.clientId,
      'answerId': ansId,
      'answer2Id': ans2Id,
      'answer3Id': ans3Id,
      'answer': this.cliIdAnswer1,
      'answer2': this.cliIdAnswer2,
      'answer3': this.cliIdAnswer3
    };
    console.log('client identity answer data:');
    console.log(data);
    this.service.validateSecAnswers(this.service.auth.getOrgUnitID(), this.cliIdQuestion1.clientId,
      this.form.caseId, data)
      .subscribe(resp => {
        const obj = <any>resp;
        console.log('validateSecAnswers');
        console.log(obj);
        let counter: any;
        if (obj) {
          counter = 0;
          obj.forEach(element => {
            counter += 1;
            if (this.cliIdQuestion1 && counter === 1) {
              if (element.ansId === this.cliIdQuestion1.ansId && element.isValidAnswer === 'Y') {
                this.isValidAnswer1 = 'Y';
                console.log('validated answer1');
                if (this.secQuestionsCount === 1) {
                  console.log('all the questions are answered..');
                  this.securityQuestionComplete();
                }
              } else {
                this.isValidAnswer1 = 'N';
                this.message1 = 'Invalid Answer';
              }
            }
            if (this.cliIdQuestion2 && counter === 2) {
              if (element.ansId === this.cliIdQuestion2.ansId && element.isValidAnswer === 'Y') {
                this.isValidAnswer2 = 'Y';
                console.log('validated answer2');
                if (this.isValidAnswer1 === 'Y' && this.secQuestionsCount === 2) {
                  console.log('all the questions are answered..');
                  this.securityQuestionComplete();
                }
              } else {
                this.isValidAnswer2 = 'N';
                this.message2 = 'Invalid Answer';
              }
            }
            if (this.cliIdQuestion3 && counter === 3) {
              if (element.ansId === this.cliIdQuestion3.ansId && element.isValidAnswer === 'Y') {
                this.isValidAnswer3 = 'Y';
                console.log('validated answer3');
                if (this.isValidAnswer1 === 'Y' && this.isValidAnswer2 === 'Y' && this.secQuestionsCount === 3) {
                  console.log('all the questions are answered..');
                  this.securityQuestionComplete();
                }
              } else {
                this.isValidAnswer3 = 'N';
                this.message3 = 'Invalid Answer';
              }
            }
          });
        }
      });
  }

  completeConsent() {
    let firstName=this.signer.firstName;
    let lastName=this.signer.lastName;
    console.log('inside display consent view:' + firstName + ' ' + lastName);
    const activityLog = {
      typeofActivity: 'eSign consent',
      auditInfo: 'Client read and agreed the consent',
      updatedBy: firstName
    }
    const signertype=this.service.getCacheData("signer_type");
    this.service.updateCaseActivityLog(this.form.caseId, activityLog).subscribe(respAL => {
      const obj = <any>respAL;
      if (obj.statusCode === '200') {
        //this.switchToGrid.emit({view:'signing'});
        if(signertype=="PAPER"){
          this.switchToGrid.emit({view:'paper'});
        } else {
          this.switchToGrid.emit({view:'signing'});
        }
      }
    });
  }


  

}
