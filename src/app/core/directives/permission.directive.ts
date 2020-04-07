import { Directive, Input, ElementRef, OnInit, OnChanges } from '@angular/core';
import { Subscription } from 'rxjs'
import { initDomAdapter } from '../../../../node_modules/@angular/platform-browser/src/browser';
import { EsignStateSelector } from '../../esign/service/esign.state.selector';
import { AbstractStateSelector } from '../states/abstract.state.selector';


/**
 * Generated class for the PermissionDirective directive.
 *
 * See https://angular.io/api/core/Directive for more info on Angular
 * Directives.
 */
@Directive({
    selector: '[el-permission]' // Attribute selector
})
export class PermissionDirective implements OnInit, OnChanges {
    @Input('permission-type') permissionType: string;
    @Input('resource-owner-id') resourceOwnerId: string;
    @Input('list-permission') listPermission = []; // show if has at least 1 permission from list

    private _subscriber: Subscription;
    private _onPermissionChange: Subscription;
    private _allPermissions: any[];

    private defaultDisplay: string;
    constructor( private esignstate: EsignStateSelector,
        private el: ElementRef) {
    }

    ngOnChanges(): void {
        // if any changes, recheck
        this.hideOrShow();
    }

    ngOnInit() {
        this.defaultDisplay = this.el.nativeElement.style.display;
        this.hideOrShow();
    }

    checkPermission(): Promise<boolean> {
        //let pObj = this.localDb.getPermissions();
        let pObj: any = {};
        this._allPermissions = pObj.permissions;
        if (this._allPermissions) {
            //  get list of permission types
            let permissionTypes = Object.keys(this._allPermissions);
            //  check if input permission type exists
            if (this.listPermission.length > 1) {
                // if has at least 1 permission, return true;
                let hasPermission = false;
                // if list exists, check via list
                for (let permission of this.listPermission) {
                    if (permissionTypes.find(t => t === permission)) {
                        hasPermission = this._allPermissions[permission];
                        if (hasPermission) {
                            break;
                        }
                    }
                }
                return Promise.resolve(hasPermission);
            } else {
                if (permissionTypes.find(t => t === this.permissionType)) {
                    let hasPermission = this._allPermissions[this.permissionType];
                    if (hasPermission) {
                        return Promise.resolve(true);
                    } else {
                        return Promise.resolve(false);
                    }
                }
            }
            // default = true
            return Promise.resolve(true);
        } else {
            // no permissions detected
            return Promise.resolve(false);
        }

    }

    isResourceOwner(): boolean {
        if (this.resourceOwnerId) {
            // check if current user is resource owner
            if (this.resourceOwnerId === this.esignstate.getCurrentUser().userId) {
                return true
            }
        }
        return false;
    }

    hideOrShow(): void {
        if (this._subscriber) {
            this._subscriber.unsubscribe();
        }


        if (this._onPermissionChange) {
            this._onPermissionChange.unsubscribe();
        }

        // recheck permission when ou changed
        /*
        this._subscriber = this.localDb.onOUChanged.subscribe(res => {
            this.runPermission();
        });

        // recheck permission when permission changed
        this._onPermissionChange = this.localDb.onPermissionChanged.subscribe(res => {
            this.runPermission();
        })
        */
    }

    runPermission() {
        if (!this.isResourceOwner()) {
            this.checkPermission()
                .then(hasPermission => {
                    if (!hasPermission) {
                        this.hideContent();
                    } else {
                        this.showContent();
                    }
                });
        } else {
            this.showContent();
        }
    }

    hideContent(): void {
        this.el.nativeElement.style.display = 'none';
    }

    showContent() {
        if (!this.defaultDisplay) {
            this.defaultDisplay = 'block';
        }
        this.el.nativeElement.style.display = this.defaultDisplay;
    }
}
