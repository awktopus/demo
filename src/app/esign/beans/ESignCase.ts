
export class ESignCase {
  caseId?: string;
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
    if (this.pages) {
      return this.pages.filter(p => p.formCode !== '');
    }
  }
  getUPages() {
    if (this.pages) {
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
export class EmailSettings {
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
export class OrgSettings {
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
  accountNumber: number;
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
  closingMonth: number;
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
export class CaseTemplate {
  taxReturnIdNumber: string;
  returnName: string;
  signer: string;
  coSigner: string;
  taxYear: number;
}

export class Signer {
  receiverId: string;
  receiverSeqNo: number;
  receiverFullName: string
  receiverFirstName: string;
  receiverLastName: string;
  receiverEmailId: string;
  isSenderSigner: string;
  isSender: string;
  signerSequenceNo: number;
  status: string
}

export class MetaData {
  created_at: Date;
  updated_at: Date;
}

export class EZSignDocResource {
  ezSignTrackingId: string;
  status: string;
  thumbnailDataUrl: string;
  documentName: string;
  docId: string;
  lastModifiedDateTime: string;
  ezSignDocSigners?: EZSignDocSigner[];
  eZSignDocPages?: EZSignDocPage[];
}

export class EZSignDocSigner {
  receiverSeqNo: number;
  receiverId: string;
  receiverFirstName: string;
  receiverLastName: string;
  receiverEmailId: string
}

export class EZSignDocPage {
  pageSeqNo: number;
  status: string;
  contentMergeFlag: string;
  signatureFields?: SignatureField[];
  textFields?: TextField[];
  dateFields?: DateField[];
}

export class EZSignDocPageField {
  fieldSeqNo: number;
  fieldTypeId: number;
  labelName: string;
  boxX: number;
  boxY: number;
  width: number;
  height: number;
  receiverId: string;
  status: string;
  createdDateTime: string;
}

export class EZSignPageImageData {
  docId: string;
  status: string;
  pageSeqNo: number;
  dataUrl: string;
  esignFields: EsignFormField[];
  pageCount: number;
  title: string;
  signatureFields?: SignatureField[];
  textFields?: TextField[];
  dateFields?: DateField[];
  pageWidth: number;
  pageHeight: number;
}

export class SignatureField {
  fieldSeqNo: number;
  showSignaturebox: boolean;
  isSignatureTagExists: boolean;
  signaturePosX: number;
  signaturePosY: number;
  signatureWidth: number;
  signatureHeight: number;
  signatureFieldName: string;
  receiverId: string;
  status: string;
  createdDateTime: string;
  labelName: string;
}

export class TextField {
  fieldSeqNo: number;
  showTextbox: boolean;
  isTextTagExists: boolean;
  textPosX: number;
  textPosY: number;
  textWidth: number;
  textHeight: number;
  textFieldName: string;
  receiverId: string;
  status: string;
  createdDateTime: string;
  labelName: string;
}

export class DateField {
  fieldSeqNo: number;
  showDatebox: boolean;
  isDateTagExists: boolean;
  datePosX: number;
  datePosY: number;
  dateWidth: number;
  dateHeight: number;
  dateFieldName: string;
  receiverId: string;
  status: string;
  createdDateTime: string;
  labelName: string;
}

export class EzSignHistory {
  seqNo: string;
  activityDate: string;
  typeofActivity: string;
  updatedBy: string;
  auditInfo: string;
  ezsignDate: string;
}

/** File node data with nested structure. */
export interface FileNode {
  name: string;
  type: string;
  children?: FileNode[];
}

/** Flat node with expandable and level information */
export interface TreeNode {
  name: string;
  type: string;
  level: number;
  expandable: boolean;
}

/** Info tracker related */
export class InfoTrackForm {
  templateId: number;
  formName: string;
  description: string;
  isOrgActiveForm: boolean;
  isDefaultCheckedForm: boolean;
}

export class ELCompanyStaff {
  orgUnitId: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  emailId: string;
  phone: string;
  role: string;
}

export class InfoTrackLocation {
orgUnitId: string;
locSeqNo: number;
geoLocation: string;
address: string;
zipCode: string;
phone: string;
isActive: string;
}
export class InfoTrackUserStatusReport {
  reportedDate: string;
  trackerId: string;
  formName: string;
  userName: string;
  recordStatus: string;
  finalResult: string;
  lastCriticalReportedDate: string;
  question1: string;
  answer1: string;
  question2: string;
  answer2: string;
  question3: string;
  answer3: string;
  question4: string;
  answer4: string;
}

export class PageQuestionResource {
  questionId: number;
  question: string;
  questionDisplayIndex: number;
  description: string;
  isRequired: string;
  questionFieldType: string;
  questionItemsJson: string;
  yesSelected: boolean;
  noSelected: boolean;
  isQuestionAnswered: boolean;
}

export class FormPageResource {
pageId: number;
pageName: string;
description: string;
questions?: PageQuestionResource[];
}

export class FormTemplateResource {
  templateId: number;
  orgUnitId: string;
  formName: string;
  description: string;
  isActive: string;
  pages?: FormPageResource[];
}
export class InfoTrackerAnswerResource {
  questionId: number;
  question: string;
  questionDisplayIndex: number;
  answer: string;
}
export class InfoTrackerInputResource {
  empId: string;
  empFirstName: string;
  empLastName: string;
  userId: string;
  userFirstName: string;
  userLastName: string;
  geoLocation: string;
  reportedDate: string;
  answers?: InfoTrackerAnswerResource[];
}

export class InfoTrackerDocumentResource {
  docId: string;
  docSize: number;
  notes: string;
}
export class InfoTrackerAmmendmentResource {
  addendumSeqNo: number;
  docId: string;
  reviewedBy: string;
  reviewedDateTime: string;
  auditTrailId: number
}
export class InfoTrackerReviewStatusResource {
  reviewTrackerId: string;
  docId: string;
  reviewedBy: string;
  reviewedDateTime: string;
  status: string;
  addendumCount: number;
  addendums?: InfoTrackerAmmendmentResource[];
}
export class InfoTrackerResource {
  trackerId: string;
  orgUnitId: string;
  templateId: number;
  templateName: string;
  userId: string;
  firstName: string;
  lastName: string;
  employeeId: string;
  empFirstName: string;
  empLastName: string;
  infoTrackRole: string;
  geoLocation: string;
  reportedDate: string;
  finalResult: string;
  status: string;
  recordStatus: string;
  displayPriority: number;
  fourTeenDaysStatus: string;
  quarantineCountDown: number;
  lastCriticalReportedDate: string;
  notes?: string[];
  answers?:  InfoTrackerAnswerResource[];
  attachments?: InfoTrackerDocumentResource[];
  reviewStatus: InfoTrackerReviewStatusResource;
}
