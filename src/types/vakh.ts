import type { ComplianceStatus } from './cbam';

export interface VakhCoordinateBox {
  top: number;
  left: number;
  width: number;
  height: number;
}

export interface VakhProvenanceCoordinates {
  pdfPage: number;
  highlightBox: VakhCoordinateBox;
  confidenceScore: number;
  rawOcrSnippet?: string;
}

export interface VakhExtractedFieldProperty {
  id: string;
  fieldKey: string;
  label: string;
  value: string;
  numericValue?: number;
  unit?: string;
  confidence: number;
  provenance: VakhProvenanceCoordinates;
  status: 'ai_proposed' | 'human_confirmed' | 'edited' | 'rejected';
  verifiedBy?: string;
  verifiedAt?: string;
  notes?: string;
  lowConfidenceFlag?: boolean;
}

export type VakhAuditStatus = 'Verified' | 'Discrepancy' | 'Needs Review';

export interface VakhBoardItemProperties {
  documentId: string;
  filename: string;
  fileSize: string;
  sha256: string;
  supplier: string;
  supplierCountry: string;
  importer: string;
  productName: string;
  cnCode: string;
  goodsCategory: 'Iron & Steel' | 'Aluminium' | 'Cement' | 'Fertilizers' | 'Hydrogen' | 'Electricity';
  documentType: 'Invoice' | 'EPD' | 'Emissions statement' | 'Mill test cert';
  installationName: string;
  installationCountry: string;
  productionRoute: string;
  traceabilityPercent: number;
  auditStatus: VakhAuditStatus;
  auditNotes?: string;
  complianceStatus: ComplianceStatus;
  extractedFields: VakhExtractedFieldProperty[];
  uploadedAt: string;
  updatedAt: string;
}

export interface VakhBoardItem {
  id: string;
  boardId: string;
  spaceId: string;
  title: string;
  status: VakhAuditStatus;
  createdAt: string;
  updatedAt: string;
  version: number;
  properties: VakhBoardItemProperties;
}

export interface VakhSpacePayload {
  spaceId: string;
  spaceName: string;
  boardId: string;
  boardName: string;
  endpointUrl: string;
  lastSyncedAt: string;
  totalRecords: number;
  items: VakhBoardItem[];
}

export type VakhSyncState = 'synced' | 'syncing' | 'connecting' | 'waiting' | 'error';

export interface VakhPatchPayload {
  itemId: string;
  boardId: string;
  auditStatus?: VakhAuditStatus;
  auditNotes?: string;
  complianceStatus?: ComplianceStatus;
  fieldUpdates?: {
    fieldId: string;
    status: 'ai_proposed' | 'human_confirmed' | 'edited' | 'rejected';
    value?: string;
    notes?: string;
    verifiedBy: string;
    verifiedAt: string;
  }[];
}
