import { Component, OnInit } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
// import { RouterLinkRendererComponent } from './RouterLinkRenderer.component';
// import { GridColConfigPopupComponent } from './gridcolpopup/grid-col-config-popup.component';
@Component({
  selector: 'app-senderdocuments',
  templateUrl: './senderdocuments.component.html',
  styleUrls: ['./senderdocuments.component.scss']
})
export class SenderdocumentsComponent implements OnInit {
  isLinear = false;

  ezSigngridData: any;
  gridColumnDefs: any;
  ezsignctrl: FormControl = new FormControl();
  search_val: string;
  filtertype: string;
  filterid: string;
  isSearch = false;
  pageHeading: string;
  frameworkComponents: any;
  context: any;
  ezsignapi: any = {};
  statusBar: any;
  autoHeight: any;
  selectedIndex = 0;
  constructor(  public dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.gridColumnDefs = this.configColDef();
  }

  configColDef() {
    const res = [
      {
        headerName: 'EZSign Tracking Id', field: 'ezSignTrackingId',
        cellRenderer: 'linkRenderer'
      },
      { headerName: 'Status', field: 'status', cellStyle: { color: 'blue' } },
      { headerName: 'Receiver Name', field: 'receiverName' },
      { headerName: 'Last Modified', field: 'lastModified' },
      {
        headerName: 'Delete', field: 'deleteEZSignDoc', cellRenderer: 'deleteEZSignDocRenderer'
      },
      { headerName: 'InviteSigners', field: 'inviteSigners', cellRenderer: 'inviteSignersRenderer' }
    ];
    this.context = { componentParent: this, ezsignfit: false};
    return res;
  }
}
