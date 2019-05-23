import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ESignCase, ESignCasePerson, ESignClient, ClientReminder, OrgSettings } from '../../beans/ESignCase';
import { EsignserviceService } from '../../service/esignservice.service';
import { EsignuiserviceService } from '../../service/esignuiservice.service';
import { Sort } from '@angular/material';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { FormControl } from '@angular/forms';
import { ClientreminderComponent } from '../casemain/esigncase/clientreminder/clientreminder.component';
import { EmailSettings } from '../../beans/ESignCase';
import { IdentityQuestionsComponent } from './identity/identity-questions/identity-questions.component';
import { SetClientAnswerComponent } from './identity/set-client-answer/set-client-answer.component';
import { NewidentityQuestionComponent } from './identity/newidentity-question/newidentity-question.component';
import { OrgClientQuestion } from '../../beans/ESignCase';
@Component({
  selector: 'app-esign-settings',
  templateUrl: './esign-settings.component.html',
  styleUrls: ['./esign-settings.component.scss']
})
export class EsignSettingsComponent implements OnInit, AfterViewInit {
  orgUnitName: string;
  identityQuestion: string;
  hide: any;
  changeTab: any;
  orgClientQuestions: any;
  isOrgClientIdQuestionsExists: string;
  orgClientIdQuestionCount: any = 0;
  orgUnitId: string;
  outMailServer: string;
  outMailServerPort: number;
  userName: string;
  password: string;
  inMailServer: string;
  inMailServerPort: string;
  enableSSL: boolean;
  enableSSLStr: string;
  orgWebSiteUrl: string;
  emailSettingsFilter: any = 0;
  constructor(private service: EsignserviceService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private uiservice: EsignuiserviceService
  ) { }

  ngAfterViewInit() {
  }

  ngOnInit() {
    this.route.paramMap.subscribe(para => {
    });
    this.service.getEmailSettings(
      this.service.auth.getOrgUnitID()).subscribe(resp => {
        const rr = <EmailSettings>resp;
        if (rr) {
          this.outMailServer = rr.outMailServer;
          this.outMailServerPort = rr.outMailServerPort;
          this.userName = rr.userName;
          this.password = rr.password;
          this.inMailServer = rr.inMailServer;
          this.inMailServerPort = rr.inMailServerPort;
          if (rr.enableSSL) {
            if (rr.enableSSL === 'Y') {
              this.enableSSL = true;
            } else {
              this.enableSSL = false;
            }

          } else {
            this.enableSSL = false;
          }
          if (rr.settingsType === 'CUSTOM' || rr.settingsType === null) {
            this.emailSettingsFilter = 0;
          } else if (rr.settingsType === 'YAHOO') {
            this.emailSettingsFilter = 1;
          } else if (rr.settingsType === 'GMAIL') {
            this.emailSettingsFilter = 2;
          } else if (rr.settingsType === 'DEFAULT') {
            this.emailSettingsFilter = 3;
          }
          console.log(rr);
        } else {
          this.emailSettingsFilter = 0;
        }
      });

    this.service.getOrgUnitActiveIdentityQuestion(
      this.service.auth.getOrgUnitID()).subscribe(resp => {
        this.orgClientQuestions = resp;
        console.log('getOrgUnitActiveIdentityQuestions....');
        this.orgClientIdQuestionCount = this.orgClientQuestions.length;
        console.log('number of id questions:' + this.orgClientIdQuestionCount);
        console.log(this.orgClientQuestions)
        if (this.orgClientQuestions == null) {
          this.isOrgClientIdQuestionsExists = 'N';
        } else {
          this.isOrgClientIdQuestionsExists = 'Y';
        }
      });

    this.service.getOrgSettings(this.service.auth.getOrgUnitID()).subscribe(resp => {
      const orgSet = <OrgSettings>resp;
      this.orgUnitId = orgSet.orgUnitId;
      this.orgWebSiteUrl = orgSet.websiteUrl;
      console.log(orgSet);
    });
  }
  addupdateEmailSettings() {
    if (this.enableSSL === true) {
      this.enableSSLStr = 'Y';
    } else {
      this.enableSSLStr = 'N';
    }

    let emailSetType = null;
    switch (this.emailSettingsFilter) {
      case '0':
        emailSetType = 'CUSTOM';
        break;
      case '1':
        emailSetType = 'YAHOO';
        break;
      case '2':
        emailSetType = 'GMAIL';
        break;
      case '3':
        emailSetType = 'DEFAULT';
        break;
    }
    const cjson = {
      outMailServer: this.outMailServer,
      outMailServerPort: this.outMailServerPort,
      userName: this.userName,
      password: this.password,
      inMailServer: this.inMailServer,
      inMailServerPort: this.inMailServerPort,
      enableSSL: this.enableSSLStr,
      settingsType: emailSetType
    };
    console.log(cjson);
    this.service.addUpdateEmailSettings(this.service.auth.getOrgUnitID(), cjson).subscribe(resp => {
      const res = <EmailSettings[]>resp;
    });
  }

  resetToDefaultSettings() {
    this.service.resetToDefaultSettings(this.service.auth.getOrgUnitID()).subscribe(resp => {
      const res = <EmailSettings>resp;
      if (res) {
        this.outMailServer = res.outMailServer;
        this.outMailServerPort = res.outMailServerPort;
        this.userName = res.userName;
        this.password = res.password;
        this.inMailServer = res.inMailServer;
        this.inMailServerPort = res.inMailServerPort;
        if (res.enableSSL) {
          if (res.enableSSL === 'Y') {
            this.enableSSL = true;
          } else {
            this.enableSSL = false;
          }
        } else {
          this.enableSSL = false;
        }
        console.log(res);
      }
    });
  }

  public makeIdentityQuestionInactive(orgCliQuestion: OrgClientQuestion) {
    this.service.makeIdentityQuestionInactive(
      this.service.auth.getOrgUnitID(), orgCliQuestion.orgQtnId).subscribe(resp => {
        this.orgClientQuestions = resp;
        console.log('getOrgUnitActiveIdentityQuestions....');
        console.log(this.orgClientQuestions)
        if (this.orgClientQuestions == null) {
          this.isOrgClientIdQuestionsExists = 'N';
          this.orgClientIdQuestionCount  = 0;
        } else {
          this.isOrgClientIdQuestionsExists = 'Y';
          this.orgClientIdQuestionCount -= 1;
        }
      });
  }

  public addIdentityQuestion() {
    const dialogRef = this.dialog.open(IdentityQuestionsComponent, {
      width: '700px',
    });
    dialogRef.componentInstance.esignSettingsRef = this;
    dialogRef.componentInstance.setIdentityQuestionInfo(this.service.auth.getOrgUnitID());
  }

  public setClientAnswer() {
    const dialogRef = this.dialog.open(SetClientAnswerComponent, {
      width: '1460px',
    });
  }

  createNewQuestion() {
    const dialogRef = this.dialog.open(NewidentityQuestionComponent, {
      width: '560px',
    });
    dialogRef.componentInstance.esignSettingsRef = this;
    dialogRef.componentInstance.setNewQuestionInfo(this.service.auth.getOrgUnitID());
  }

  addUpdateOrgSettings() {
    const cjson = {
      websiteUrl: this.orgWebSiteUrl,
      orgUnitName: this.service.auth.getOrgUnitName()
    };
    console.log(cjson);
    this.service.addUpdateOrgSettings(this.service.auth.getOrgUnitID(), cjson).subscribe(resp => {
      const res = <OrgSettings[]>resp;
    });
  }
  onEmailSettingsChange(e) {
    console.log('email settings:');
    console.log(e.value);
    switch (e.value) {
      case '0':
        this.setEmailSettingsByType('CUSTOM');
        break;
      case '1':
        this.setEmailSettingsByType('YAHOO');
        break;
      case '2':
        console.log('setEmailSettingsByType:' + e.value);
        this.setEmailSettingsByType('GMAIL');
        break;
      case '3':
        this.setEmailSettingsByType('DEFAULT');
        break;
    }
  }

  setEmailSettingsByType(settingsType: string) {
    console.log('setEmailSettingsByType:' + settingsType);
    this.service.getEmailSettingsByType(
      this.service.auth.getOrgUnitID(), settingsType).subscribe(resp => {
        const rr = <EmailSettings>resp;
        if (rr) {
          this.outMailServer = rr.outMailServer;
          this.outMailServerPort = rr.outMailServerPort;
          this.userName = rr.userName;
          this.password = rr.password;
          this.inMailServer = rr.inMailServer;
          this.inMailServerPort = rr.inMailServerPort;
          if (rr.enableSSL) {
            if (rr.enableSSL === 'Y') {
              this.enableSSL = true;
            } else {
              this.enableSSL = false;
            }

          } else {
            this.enableSSL = false;
          }
          // if (rr.settingsType === 'CUSTOM') {
          //   this.emailSettingsFilter = 0;
          // } else if (rr.settingsType === 'DEFAULT') {
          //   this.emailSettingsFilter = 1;
          // } else if (rr.settingsType === 'YAHOO') {
          //   this.emailSettingsFilter = 2;
          // } else if (rr.settingsType === 'GMAIL') {
          //   this.emailSettingsFilter = 3;
          // }
          console.log(rr);
        }
      });
  }
}
