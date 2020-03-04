import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
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
  selector: 'app-singlecasearchive',
  templateUrl: './singlecasearchive.component.html',
  styleUrls: ['./singlecasearchive.component.scss']
})
export class SinglecasearchiveComponent implements OnInit, AfterViewChecked {
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
caseId: string;
  taxCaseArchiveForm: FormGroup = new FormGroup({
    // taxCaseStatusFormControl: new FormControl(Validators.required),
    // startDateFormControl: new FormControl(),
    // endDateFormControl: new FormControl()
    // startDateFormControl: new FormControl((new Date()).toISOString(), Validators.required),
    // endDateFormControl: new FormControl((new Date()).toISOString(), Validators.required)
  });



 // @ViewChild('focusField') focusField: ElementRef;

  constructor(private service: EsignserviceService,
    public dialogRef: MatDialogRef<SinglecasearchiveComponent>) {
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

  }

  ngAfterViewChecked() {
  //  this.focusField.nativeElement.focus();
  }

  setData(caseId: string) {
    this.caseId = caseId;
  }

  cancelSingleCaseArchive() {
    console.log('cancel single case archive');
    this.dialogRef.close();
  }

  archiveSingleCase() {
    this.showAddspinner = true;
        this.service.archiveSingleCase(this.caseId).subscribe(resp => {
          const res_c = <any>resp;
          console.log(res_c);
          this.historyComponentRef.loadSearchData('allcases', '');
          this.showAddspinner = false;
          this.cancelSingleCaseArchive();
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
