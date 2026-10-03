export type DocumentType = 'Invoice' | 'EPD' | 'Emissions statement' | 'Mill test cert';

export type ComplianceStatus = 
  | 'Needs verification' 
  | 'Verified' 
  | 'Calculated' 
  | 'Flagged anomaly' 
  | 'Archived';

export interface BoundingBox {
  page: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ExtractedField {
  id: string;
  fieldKey: string;
  label: string;
  value: string;
  numericValue?: number;
  unit?: string;
  confidence: number; // e.g. 0.98
  boundingBox: BoundingBox;
  status: 'ai_proposed' | 'human_confirmed' | 'edited' | 'rejected';
  verifiedBy?: string;
  verifiedAt?: string;
  notes?: string;
  lowConfidenceFlag?: boolean;
}

export interface CBAMDocument {
  id: string;
  filename: string;
  fileSize: string;
  sha256: string;
  supplier: string;
  supplierCountry: string;
  importer: string;
  productName: string;
  cnCode: string;
  goodsCategory: 'Iron & Steel' | 'Aluminium' | 'Cement' | 'Fertilizers' | 'Hydrogen' | 'Electricity';
  documentType: DocumentType;
  uploadedAt: string;
  updatedAt: string;
  status: ComplianceStatus;
  traceabilityPercent: number;
  extractedFields: ExtractedField[];
  installationName: string;
  installationCountry: string;
  productionRoute: string;
}

export interface CalculationTrace {
  id: string;
  documentId: string;
  documentName: string;
  documentHash: string;
  resultValue: number;
  resultUnit: string;
  resultLabel: string;
  formula: string;
  formulaDisplay: string;
  ruleVersion: string;
  ruleName: string;
  regulationReference: string;
  verifiedInputs: {
    label: string;
    value: string;
    sourceFieldKey: string;
    verifiedBy: string;
    verifiedAt: string;
    boundingBox: BoundingBox;
  }[];
  directEmissionsTonnes: number;
  indirectEmissionsTonnes: number;
  carbonPriceDeductionEur: number;
  timestamp: string;
  complianceOfficer: string;
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: string;
  action: string;
  category: 'UPLOAD' | 'EXTRACTION' | 'VERIFICATION' | 'CALCULATION' | 'RULE_CHANGE' | 'EXPORT';
  source: string;
  status: 'SUCCESS' | 'FLAGGED' | 'CONFIRMED' | 'AUDITED';
  hash: string;
  details: string;
}

export interface RuleVersion {
  id: string;
  version: string;
  title: string;
  effectiveFrom: string;
  regulationCode: string;
  status: 'ACTIVE' | 'ARCHIVED' | 'DRAFT';
  description: string;
}
