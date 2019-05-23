import { Component, OnInit } from '@angular/core';
import { EsignserviceService } from '../../../service/esignservice.service';
import { EmailSettings } from '../../../beans/ESignCase';
@Component({
  selector: 'app-emailsettings',
  templateUrl: './emailsettings.component.html',
  styleUrls: ['./emailsettings.component.scss']
})
export class EmailsettingsComponent implements OnInit {
  outMailServer: string;
  outMailServerPort: number;
  userName: string;
  password: string;
  inMailServer: string;
  inMailServerPort: string;
  enableSSL: boolean;
  enableSSLStr: string;
  hide: any;
  constructor(private service: EsignserviceService) { }

  ngOnInit() {
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
          console.log(rr);
        }
      });
  }
  addupdateEmailSettings() {
    if (this.enableSSL === true) {
      this.enableSSLStr = 'Y';
    } else {
      this.enableSSLStr = 'N';
    }
    const cjson = {
      outMailServer: this.outMailServer,
      outMailServerPort: this.outMailServerPort,
      userName: this.userName,
      password: this.password,
      inMailServer: this.inMailServer,
      inMailServerPort: this.inMailServerPort,
      enableSSL: this.enableSSLStr
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
}
