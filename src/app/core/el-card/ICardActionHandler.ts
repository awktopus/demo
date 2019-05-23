
export interface ICardActionHandler {
  handle(actionName: string, args: any, forceRefresh?: boolean): Promise<boolean>;
}
