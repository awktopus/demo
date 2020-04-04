import { Subject, Subscription, BehaviorSubject } from "rxjs";
import { Injectable } from "@angular/core";
@Injectable()
export class PubSub {
  // UI
  public static readonly MENU_ENABLED: string = "sub-menu-enabled";

  // PAGE
  public static readonly ON_APP_INIT: string = "sub-on-app-init";
  public static readonly AFTER_APP_INIT: string = "sub-after-app-init";
  public static readonly BEFORE_APP_DESTROY: string = "sub-before-app-destroy";

  // AUTH
  public static readonly AFTER_USER_AUTHORIZED: string =
    "sub-after-user-authorized";
  public static readonly BEFORE_USER_LOGOUT: string = "sub-before-user-logout";
  public static readonly AFTER_USER_LOGOUT: string = "sub-after-user-logout";

  // ENTERPRISE
  public static readonly ON_ORG_SWITCHED: string = "sub-on-org-switched";

  private _subSink: { [key: string]: BehaviorSubject<any> };

  constructor() {
    this._subSink = {};
  }

  private containsKey(key: string) {
    if (typeof this._subSink[key] === "undefined") {
      return false;
    }

    return true;
  }

  private remove(key: string) {
    if (!this.containsKey(key)) { return };
    delete this[key];
  }

  public next<T>(key: string, value?: T | null): void {
    if (!this.containsKey(key)) {
      console.log("[PubSub]-next, key: %s not found, will create one...", key);
      this._subSink[key] = new BehaviorSubject<T>(null);
    }
    this._subSink[key].next(value);
  }

  public unsubscribe(key: string): void {
    if (!this.containsKey(key)) { return };

    this._subSink[key].unsubscribe();
    this.remove(key);
  }

  public subscribe<T>(
    key: string,
    next?: (value: T | any) => void,
    error?: (error: any) => void,
    complete?: () => void
  ): Subscription {
    if (!this.containsKey(key)) {
      console.log(
        "[PubSub]-subscribe, key: %s not found, will create one...",
        key
      );
      this._subSink[key] = new BehaviorSubject<T>(null);
    }

    return this._subSink[key].subscribe(next, error, complete);
  }
}

