
export class ESignCase {
  caseId?: string ;
  primarySigner?: ESignClient;
  secondarySigner?: ESignClient;
  recipientClients?: ESignClient[];
  copyCpas?: ESignCPA[];
  status?: string;
  cate?: ESignCate;
  subCate?: ESignCate;
  reviewCPA?: ESignCPA;
  createdDate?: string;
  reviewDocs?: ESignDoc[];
  esignDocs?: ESignDoc[];
  paymentDocs?: ESignDoc[];
  paperDocs?: ESignDoc[];
  orgUnitId?: string;
  // classification documents
  coverLetters?: ESignDoc[];
  cpages?: ClassifyPage[];
  upages?: ClassifyPage[];
  type?: string;
  cpa?: ESignCPA;
  notes?: string;
  notification?: string;
  splitNotes?: string[];
  rejectReason?: string;
  splitRejectReason?: string[];
  cpaId?: string;
  clientReminder?: ClientReminder;
  clientReminderFlag: string;
  returnName: string;
  taxReturnIdNo: string;
  k1Docs?: ESignDoc[];
  taxYear: string;
}

export interface ESignCate {
  id: number;
  name: string;
  subCates?: ESignCate[];
}

export interface ESignConfig {
  eSignCates: ESignCate[];
}

export interface ESignClient {
  clientId: string;
  firstName: string;
  lastName: string;
  emailId: string;
  esignAccountability: string;
  selectedForReminder: string;
  isIdentityAnswerSet: string;
  ansId: string;
}
export interface ESignCPA {
  cpaId: string;
  firstName: string;
  lastName: string;
  cpaClients: ESignClient[];
}

export class ESignDoc {
  docId: string;
  fileName: string;
  type: string;
  pages: ClassifyPage[];
  getCPages() {
    if ( this.pages ) {
      return this.pages.filter(p => p.formCode !== '');
    }
  }
  getUPages() {
    if ( this.pages ) {
      return this.pages.filter(p => p.formCode === '');
    }
  }
}

export class ESignUI {
  stepperIndex: number;
  constructor() {
    this.stepperIndex = 0;
  }
}

export class ClassifyPage {
  fileName?: string;
  formCode?: string;
  seqNo?: number;
  docId?: string;
  signerManualSelection?: string;
  signedPartyOption?: string;
  signatureBoxCount?: number;
  esignFields?: ESignField[];
  approvedForEsign?: string;
}

export class ESignField {
  name?: string;
  type?: string;
}

export class ESignCasePerson {
  type?: string;
  id?: string;
  firstName?: string;
  lastName?: string;
}
export class ClientReminder {
  caseId: string;
  status: string;
  clients: ESignClient[];
  recurrenceInDays: number;
  subject: string;
  body: string;
  cpaId: string;
  cpaEmailId: string;
  lastReminderDateTime: string;
  sendReminderNow: string;
}
export class ClientAnswer {
  orgUnitId: string;
  clientId: string;
  orgQtnId: string;
  question: string;
  ansId: string;
  answer: string;
  isValidAnswer: string;
  shareForEmailEncryptionInd: string;
}
export class OrgClientQuestion {
  orgUnitId: string;
  orgQtnId: string;
  qtnId: string;
  question: string;
  activeInd: string;
}
export class IdentityQuestion {
  qtnId: string;
  question: string;
}
export class   EmailSettings {
  orgUnitId: string;
  outAccountType: string;
  outMailServer: string;
  outMailServerPort: number;
  userName: string;
  password: string;
  inAccountType: string;
  inMailServer: string;
  inMailServerPort: string;
  enableSSL: string;
  settingsType: string;
}
export class   OrgSettings {
  orgUnitId: string;
  websiteUrl: string;
}
export class TaxYears {
  id: string;
  name: string;
}

export class CaseActivityLog {
  seqNo: string;
  activityDate: string;
  typeofActivity: string;
  updatedBy: string;
  auditInfo: string;
  esignDate: string;
}
export class OrgClientsIdentityAnswerSetup {
  clientName: string;
  clientId: string;
  question: string;
  questionId: string;
  answer: string;
  answerId: string;
  question2: string;
  question2Id: string;
  answer2: string;
  answer2Id: string;
  question3: string;
  question3Id: string;
  answer3: string;
  answer3Id: string;
  shareForEmailEncryptionInd: string;
}
export class ResponseStatusResource {
  statusCode: string;
}
export class CompanyType {
  companyType: string;
  companyTypeId: number;
}
export class CompanyStaff {
  clientId: string;
  firstName: string;
  lastName: string;
  emailId: string;
  mobileNumber: string;
  role: string;
}
export class TaxYearReceipts {
  fiscalYear: string;
  yearlySummaryAmount: string;
  chartOfAccounts: ChartOfAccounts[];
}
export class ChartOfAccounts {
  accountTypeSeqNo: string;
  accountType: string;
  accountSummaryAmount: string;
  coaReceipts: CoAReceipts[];
}
export class CoAReceipts {
  amount: string;
  notes: string;
  uploadCustomerId: string;
  receiptDate: string;
  docId: string;
  dataUrl: string;
  attachment: string;
  vendorName: string
}
export class Receipts {
  accountType: string;
  accountTypeSeqNo: string;
  receiptDate: string;
  vendorName: string
  amount: string;
  notes: string;
  attachment: string;
  docId: string;
  contentType: string;
}
export class Company {
companyId: string;
companyTypeId: number;
companyType: string;
companyName: string;
companyOwner: string;
closingMonthName: string;
lastUpdate: string;
sharedUsers: string;
sharedUsersList: CompanyStaff[];
closeDate: number;
includeAccountNumber: string;
hasSettingsAccess: string;
}
export class FormMirrorImageData {
  docId: string;
  seqNo: string;
  formCode: string;
  signatureBoxCount: number;
  dataUrl: string;
  esignFields: EsignFormField[];
}
export class EsignFormField {
name: string;
type: string;
posX: number;
posY: number;
length: number;
width: number;
}
