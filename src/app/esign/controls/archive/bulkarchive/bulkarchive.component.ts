import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked, AfterViewInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatOptionSelectionChange, MatSelect, MatInput } from '@angular/material';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { disableDebugTools } from '@angular/platform-browser';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NumberFormatStyle } from '@angular/common';
import { CurrencyMaskModule } from "ng2-currency-mask";
import { EsignserviceService } from '../../../service/esignservice.service';
import { HistoryComponent } from '../../history/history.component';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { of as observableOf } from 'rxjs';
import { FlatTreeControl } from '@angular/cdk/tree';
import { TreeNode, FileNode } from '../../../beans/ESignCase';

@Component({
  selector: 'app-bulkarchive',
  templateUrl: './bulkarchive.component.html',
  styleUrls: ['./bulkarchive.component.scss']
})
export class BulkarchiveComponent implements OnInit, AfterViewInit {

  /** The TreeControl controls the expand/collapse state of tree nodes.  */
  treeControl: FlatTreeControl<TreeNode>;

  /** The TreeFlattener is used to generate the flat list of items from hierarchical data. */
  treeFlattener: MatTreeFlattener<FileNode, TreeNode>;

  /** The MatTreeFlatDataSource connects the control and flattener to provide data. */
  dataSource: MatTreeFlatDataSource<FileNode, TreeNode>;

  files: any = [
    {
      name: '',
      type: 'folder',
      children: [
        {
          name: 'Archive',
          type: 'Archive'
          //     children: [
          //       {
          //         name: 'cdk',
          //         children: [
          //           { name: 'package.json', type: 'file' },
          //           { name: 'BUILD.bazel', type: 'file' },
          //         ]
          //       },
          //       { name: 'lib', type: 'folder' }
          //     ]
        }
      ]
    }
  ];
  activeNode: any;
  historyComponentRef: HistoryComponent;
  showAddspinner: any;
  taxCaseStatuses: any;
  source: string;
  bulkArchiveForm: FormGroup = new FormGroup({
    taxCaseStatusFormControl: new FormControl('', Validators.required),
    startDateFormControl: new FormControl(),
    endDateFormControl: new FormControl()
    // startDateFormControl: new FormControl((new Date()).toISOString(), Validators.required),
    // endDateFormControl: new FormControl((new Date()).toISOString(), Validators.required)
  });

  @ViewChild('focusField') focusField: MatSelect;

  constructor(private service: EsignserviceService,
    public dialogRef: MatDialogRef<BulkarchiveComponent>) {
    dialogRef.disableClose = true;

    this.treeFlattener = new MatTreeFlattener(
      this.transformer,
      this.getLevel,
      this.isExpandable,
      this.getChildren);
    this.treeControl = new FlatTreeControl<TreeNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    this.dataSource.data = this.files;
  }

  ngOnInit() {
    if (this.source === "allcases") {
      this.service.getDistinctTaxCaseStatuses().subscribe(resp => {
        this.taxCaseStatuses = resp;
      });
    } else if (this.source === "reviewcases") {
      this.service.getDistinctMyWorklistTaxCaseStatuses().subscribe(resp => {
        this.taxCaseStatuses = resp;
      });
    }
    this.focusField.focused = true;
  }

  setData(source: string) {
    this.source = source;
  }

  ngAfterViewInit() {

  }

  cancelBulkArchive() {
    this.dialogRef.close();
  }

  archiveBulkCases() {
    this.showAddspinner = true;
    // let startDate: Date = new Date(this.planModel.start_time)
    let finalStartDate: any;
    let startDate: Date = new Date(this.bulkArchiveForm.controls['startDateFormControl'].value);
    console.log('date:' + startDate.getDate());
    console.log('month:' + startDate.getMonth());
    console.log('year:' + startDate.getFullYear());
    finalStartDate = startDate.getMonth() + 1 + '/' + startDate.getDate() + '/' + startDate.getFullYear();
    console.log('start date:' + finalStartDate);

    let finalEndDate: any;
    let endDate: Date = new Date(this.bulkArchiveForm.controls['endDateFormControl'].value);
    console.log('date:' + endDate.getDate());
    console.log('month:' + endDate.getMonth());
    console.log('year:' + endDate.getFullYear());
    finalEndDate = endDate.getMonth() + 1 + '/' + endDate.getDate() + '/' + endDate.getFullYear();
    console.log('end date:' + finalEndDate);

    let taxCaseStatus: string;
    taxCaseStatus = this.bulkArchiveForm.controls['taxCaseStatusFormControl'].value;

    if (typeof taxCaseStatus === 'undefined') {
      taxCaseStatus = '';
    }

    const bulkCaseArchivejson = {
      startDate: finalStartDate,
      endDate: finalEndDate,
      taxCaseStatus: taxCaseStatus
    };
    console.log(bulkCaseArchivejson);
    this.service.bulkTaxCaseArchive(bulkCaseArchivejson).subscribe(resp => {
      const res_c = <any>resp;
      console.log(res_c);
      if (res_c.statusCode === "200") {
        if (this.source === "allcases") {
        this.historyComponentRef.loadSearchData('allcases', '');
        this.showAddspinner = false;
        this.cancelBulkArchive();
      } else if (this.source === "reviewcases") {
        this.historyComponentRef.loadSearchData('reviewcases', '');
        this.showAddspinner = false;
        this.cancelBulkArchive();
      }
      } else  {
        this.showAddspinner = false;
        this.cancelBulkArchive();
      }
    });
  }

  /** Transform the data to something the tree can read. */
  transformer(node: FileNode, level: number) {
    return {
      name: node.name,
      type: node.type,
      level: level,
      expandable: !!node.children
    };
  }

  /** Get the level of the node */
  getLevel(node: TreeNode) {
    return node.level;
  }

  /** Return whether the node is expanded or not. */
  isExpandable(node: TreeNode) {
    return node.expandable;
  };

  /** Get the children for the node. */
  getChildren(node: FileNode) {
    return observableOf(node.children);
  }

  /** Get whether the node has children or not. */
  hasChild(index: number, node: TreeNode) {
    return node.expandable;
  }
}
