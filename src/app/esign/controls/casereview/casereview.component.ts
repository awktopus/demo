import { Component, OnInit ,EventEmitter,Output} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EsignserviceService } from '../../service/esignservice.service';
import { CaseReviewDocViewButtonRendererComponent } from './CaseReviewDocViewButton-renderer.component';

@Component({
  selector: 'app-casereview',
  templateUrl: './casereview.component.html',
  styleUrls: ['./casereview.component.scss']
})
export class CaseReviewComponent implements OnInit {
  @Output("switchToGridView") switchToGrid: EventEmitter<any> = new EventEmitter();
  mycase:any;
  casedocs:any=[];
  reviewdocgridData:any=[];
  dataloaded=false;
  gridColumnDefs;
  frameworkComponents;
  context:any;
  rowHeight:any;
  domLayout:any;
  private rowClass;
  constructor(private route: ActivatedRoute, private router: Router, private service: EsignserviceService) {
    this.gridColumnDefs = this.configColDef();
    this.frameworkComponents={
      viewDocumentButtonRender:CaseReviewDocViewButtonRendererComponent
    };
  }

  ngOnInit() {
   console.log("inside casesecurity init");
   this.loadCaseReviewDocuments();
  }

  configColDef(){
    const res = [
      {
        headerName: 'Doc ID #', field: 'docId', width: 120,
        cellStyle:{ 'background-color': '#d2f8d2', 'justify-content': "center" }
      },
      { headerName: 'File Name', field: 'name',  width: 320,
      cellStyle:{ 'background-color': '#d2f8d2', 'justify-content': "center" }
      },
     
      {
        headerName: 'view', width: 120,
        cellRenderer: 'viewDocumentButtonRender',
        cellRendererParams: {
          onClick: this.viewDocument.bind(this)
        },
        cellStyle:{ 'background-color': '#d2f8d2', 'justify-content': "center" }
      },
      { headerName: 'size(kB)', field: 'docSizeKB',  width: 100 ,
      cellStyle:{ 'background-color': '#d2f8d2', 'justify-content': "center" }
      }
    ];
    this.context = { componentParent: this, ustaxfit: true };
    this.rowHeight = 40;
    this.domLayout = 'autoHeight';
    return res;
  }

  loadCaseReviewDocuments(){
    this.mycase=this.service.getCacheData("case");
    this.service.getESignReviewPDF(this.mycase.caseId).subscribe(resp => {
      console.log(resp);
      this.casedocs = resp;
      this.buildGridData();
    });
  }
  onGridReady(params, gridname) {
    console.log('onGridReady');
    console.log(params);
    console.log(gridname);
  }
  onFirstDataRendered (params, gridname)
  {
    console.log(params);
    console.log(gridname);
    params.api.sizeColumnsToFit();
  }
  viewDocument(event){
    console.log(event);
    const url = this.service.auth.baseurl + '/Contents/' + event.rowData.docId;
    this.service.getPDFBlob(url).subscribe(res=>{
      const file = new Blob([<any>res], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL, '_blank');
    });
  }
  buildGridData(){
    this.reviewdocgridData=this.casedocs;
    this.dataloaded=true;
  }
  goFormPage() {
  }

  goFormViewPage() {
  }

  

}
