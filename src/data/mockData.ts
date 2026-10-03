import type { CBAMDocument, CalculationTrace, AuditEvent, RuleVersion } from '../types/cbam';

export const INITIAL_RULE_VERSIONS: RuleVersion[] = [
  {
    id: 'rule-2026-1',
    version: 'v2026.1',
    title: 'EU CBAM Implementing Act — Transitional Methodology',
    effectiveFrom: '2026-01-01',
    regulationCode: 'Regulation (EU) 2023/956 Art. 7 & Implementing Reg (EU) 2023/1773',
    status: 'ACTIVE',
    description: 'Deterministic direct and indirect specific emissions calculation with default electricity grid factors and certified installation benchmarks.'
  },
  {
    id: 'rule-2025-4',
    version: 'v2025.4',
    title: 'Transitional Standard Default Values (Q4 Revision)',
    effectiveFrom: '2025-10-01',
    regulationCode: 'Commission Decision 2023/C 450/01',
    status: 'ARCHIVED',
    description: 'Allowed 20% estimated default values fallback for installations without accredited verifier report.'
  },
  {
    id: 'rule-2027-draft',
    version: 'v2027.0-RC',
    title: 'Definitive Period Methodology (Full Financial CBAM)',
    effectiveFrom: '2026-12-31',
    regulationCode: 'EU CBAM Certificate Surrender Mandate',
    status: 'DRAFT',
    description: 'Definitive regime requiring surrender of EU ETS-indexed CBAM certificates and mandatory third-party verifier accreditation.'
  }
];

export const INITIAL_DOCUMENTS: CBAMDocument[] = [
  {
    id: 'doc-001',
    filename: 'supplier_invoice_042.pdf',
    fileSize: '1.8 MB',
    sha256: '4a8f9c73e1b209d845e2a6d3910c85e492f1b0a8d7e6c5b4a39281726354abc1',
    supplier: 'Steel Components Ltd.',
    supplierCountry: 'TR (Turkey)',
    importer: 'ThyssenKrupp Euro-Import S.A. [DE94827103]',
    productName: 'Hot-rolled non-alloy steel coils',
    cnCode: '7208 39 00',
    goodsCategory: 'Iron & Steel',
    documentType: 'Invoice',
    uploadedAt: 'Today, 09:42 CET',
    updatedAt: 'Today, 09:45 CET',
    status: 'Needs verification',
    traceabilityPercent: 78,
    installationName: 'Dilovasi Rolling Mill #2',
    installationCountry: 'TR',
    productionRoute: 'Electric Arc Furnace (EAF) + Scrap',
    extractedFields: [
      {
        id: 'f-001-1',
        fieldKey: 'net_mass',
        label: 'Net mass',
        value: '1,000 t',
        numericValue: 1000,
        unit: 't',
        confidence: 0.98,
        boundingBox: { page: 1, x: 140, y: 382, width: 140, height: 26 },
        status: 'ai_proposed',
        notes: 'Extracted from Line Item 1 Summary total'
      },
      {
        id: 'f-001-2',
        fieldKey: 'cn_code',
        label: 'CN code',
        value: '7208 39 00',
        confidence: 0.94,
        boundingBox: { page: 1, x: 110, y: 264, width: 130, height: 24 },
        status: 'ai_proposed',
        notes: 'EU Combined Nomenclature 8-digit tariff code matched with TARIC'
      },
      {
        id: 'f-001-3',
        fieldKey: 'emissions_direct',
        label: 'Direct specific emissions',
        value: '1.60 tCO₂e/t',
        numericValue: 1.60,
        unit: 'tCO₂e/t',
        confidence: 0.91,
        boundingBox: { page: 1, x: 132, y: 418, width: 160, height: 26 },
        status: 'ai_proposed',
        notes: 'Calculated at supplier installation EAF boundary'
      },
      {
        id: 'f-001-4',
        fieldKey: 'emissions_indirect',
        label: 'Indirect specific emissions',
        value: '0.30 tCO₂e/t',
        numericValue: 0.30,
        unit: 'tCO₂e/t',
        confidence: 0.88,
        boundingBox: { page: 1, x: 132, y: 452, width: 160, height: 26 },
        status: 'ai_proposed',
        notes: 'Electricity grid factor applied for TR-MAR region'
      },
      {
        id: 'f-001-5',
        fieldKey: 'carbon_price_paid',
        label: 'Carbon price paid abroad',
        value: '0.00 EUR/t',
        numericValue: 0.0,
        unit: 'EUR/t',
        confidence: 0.95,
        boundingBox: { page: 1, x: 420, y: 418, width: 130, height: 24 },
        status: 'human_confirmed',
        verifiedBy: 'E. Moreau (Lead CBAM Officer)',
        verifiedAt: '09:44 CET',
        notes: 'Confirmed no domestic carbon tax applied at source'
      }
    ]
  },
  {
    id: 'doc-002',
    filename: 'arcelormittal_epd_coil_2026.pdf',
    fileSize: '3.4 MB',
    sha256: '9f83ac127e5b021a8c3d4f5e6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b',
    supplier: 'ArcelorMittal Tubarão Works',
    supplierCountry: 'BR (Brazil)',
    importer: 'ThyssenKrupp Euro-Import S.A. [DE94827103]',
    productName: 'Heavy plate alloy steel',
    cnCode: '7225 40 40',
    goodsCategory: 'Iron & Steel',
    documentType: 'EPD',
    uploadedAt: 'Yesterday, 14:15 CET',
    updatedAt: 'Yesterday, 16:30 CET',
    status: 'Verified',
    traceabilityPercent: 100,
    installationName: 'Espírito Santo BF-BOF Plant',
    installationCountry: 'BR',
    productionRoute: 'Blast Furnace - Basic Oxygen Furnace (BF-BOF)',
    extractedFields: [
      {
        id: 'f-002-1',
        fieldKey: 'net_mass',
        label: 'Net mass',
        value: '2,400 t',
        numericValue: 2400,
        unit: 't',
        confidence: 0.99,
        boundingBox: { page: 1, x: 135, y: 340, width: 130, height: 24 },
        status: 'human_confirmed',
        verifiedBy: 'H. Lindqvist (Senior Auditor)',
        verifiedAt: 'Yesterday, 15:10 CET'
      },
      {
        id: 'f-002-2',
        fieldKey: 'cn_code',
        label: 'CN code',
        value: '7225 40 40',
        confidence: 0.97,
        boundingBox: { page: 1, x: 120, y: 240, width: 120, height: 24 },
        status: 'human_confirmed',
        verifiedBy: 'H. Lindqvist (Senior Auditor)',
        verifiedAt: 'Yesterday, 15:10 CET'
      },
      {
        id: 'f-002-3',
        fieldKey: 'emissions_total',
        label: 'Total specific emissions',
        value: '2.18 tCO₂e/t',
        numericValue: 2.18,
        unit: 'tCO₂e/t',
        confidence: 0.93,
        boundingBox: { page: 2, x: 145, y: 460, width: 150, height: 25 },
        status: 'human_confirmed',
        verifiedBy: 'H. Lindqvist (Senior Auditor)',
        verifiedAt: 'Yesterday, 15:12 CET'
      }
    ]
  },
  {
    id: 'doc-003',
    filename: 'ega_aluminium_ingots_cert88.pdf',
    fileSize: '2.1 MB',
    sha256: 'c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4',
    supplier: 'Emirates Global Aluminium PJSC',
    supplierCountry: 'AE (United Arab Emirates)',
    importer: 'ThyssenKrupp Euro-Import S.A. [DE94827103]',
    productName: 'Unwrought non-alloy aluminium ingots',
    cnCode: '7601 10 00',
    goodsCategory: 'Aluminium',
    documentType: 'Emissions statement',
    uploadedAt: 'Sep 29, 11:20 CET',
    updatedAt: 'Sep 29, 14:05 CET',
    status: 'Calculated',
    traceabilityPercent: 100,
    installationName: 'Jebel Ali Aluminium Smelter',
    installationCountry: 'AE',
    productionRoute: 'Electrolytic Reduction (Hall-Héroult)',
    extractedFields: [
      {
        id: 'f-003-1',
        fieldKey: 'net_mass',
        label: 'Net mass',
        value: '500 t',
        numericValue: 500,
        unit: 't',
        confidence: 0.98,
        boundingBox: { page: 1, x: 140, y: 320, width: 110, height: 24 },
        status: 'human_confirmed',
        verifiedBy: 'E. Moreau (Lead CBAM Officer)',
        verifiedAt: 'Sep 29, 12:40 CET'
      },
      {
        id: 'f-003-2',
        fieldKey: 'emissions_direct',
        label: 'Direct specific emissions',
        value: '1.95 tCO₂e/t',
        numericValue: 1.95,
        unit: 'tCO₂e/t',
        confidence: 0.94,
        boundingBox: { page: 1, x: 132, y: 410, width: 140, height: 24 },
        status: 'human_confirmed',
        verifiedBy: 'E. Moreau (Lead CBAM Officer)',
        verifiedAt: 'Sep 29, 12:41 CET'
      },
      {
        id: 'f-003-3',
        fieldKey: 'emissions_indirect',
        label: 'Indirect specific emissions',
        value: '5.20 tCO₂e/t',
        numericValue: 5.20,
        unit: 'tCO₂e/t',
        confidence: 0.91,
        boundingBox: { page: 1, x: 132, y: 440, width: 140, height: 24 },
        status: 'human_confirmed',
        verifiedBy: 'E. Moreau (Lead CBAM Officer)',
        verifiedAt: 'Sep 29, 12:42 CET'
      }
    ]
  },
  {
    id: 'doc-004',
    filename: 'heidelberg_grey_cement_mill07.pdf',
    fileSize: '1.2 MB',
    sha256: '7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b',
    supplier: 'Çimsa Çimento Sanayi T.A.Ş.',
    supplierCountry: 'TR (Turkey)',
    importer: 'ThyssenKrupp Euro-Import S.A. [DE94827103]',
    productName: 'Portland cement CEM I 52.5 R',
    cnCode: '2523 29 00',
    goodsCategory: 'Cement',
    documentType: 'EPD',
    uploadedAt: 'Sep 28, 16:40 CET',
    updatedAt: 'Sep 28, 17:15 CET',
    status: 'Needs verification',
    traceabilityPercent: 62,
    installationName: 'Mersin Clinker Kiln #3',
    installationCountry: 'TR',
    productionRoute: 'Dry process with precalciner',
    extractedFields: [
      {
        id: 'f-004-1',
        fieldKey: 'net_mass',
        label: 'Net mass',
        value: '3,200 t',
        numericValue: 3200,
        unit: 't',
        confidence: 0.97,
        boundingBox: { page: 1, x: 150, y: 350, width: 120, height: 24 },
        status: 'ai_proposed'
      },
      {
        id: 'f-004-2',
        fieldKey: 'clinker_ratio',
        label: 'Clinker factor',
        value: '0.92',
        numericValue: 0.92,
        confidence: 0.72,
        lowConfidenceFlag: true,
        boundingBox: { page: 1, x: 150, y: 390, width: 110, height: 24 },
        status: 'ai_proposed',
        notes: 'Low OCR clarity near footnote 4. Requires physical verification.'
      },
      {
        id: 'f-004-3',
        fieldKey: 'emissions_direct',
        label: 'Direct specific emissions',
        value: '0.78 tCO₂e/t',
        numericValue: 0.78,
        unit: 'tCO₂e/t',
        confidence: 0.89,
        boundingBox: { page: 1, x: 150, y: 430, width: 140, height: 24 },
        status: 'ai_proposed'
      }
    ]
  },
  {
    id: 'doc-005',
    filename: 'eurochem_urea_statement_912.pdf',
    fileSize: '2.7 MB',
    sha256: '1f2e3d4c5b6a7089123456789abcdef0123456789abcdef0123456789abcdef0',
    supplier: 'EuroChem Agro North Sea',
    supplierCountry: 'NO (Norway)',
    importer: 'ThyssenKrupp Euro-Import S.A. [DE94827103]',
    productName: 'Urea prills 46% N fertilizer',
    cnCode: '3102 10 10',
    goodsCategory: 'Fertilizers',
    documentType: 'Emissions statement',
    uploadedAt: 'Sep 25, 10:00 CET',
    updatedAt: 'Sep 26, 09:20 CET',
    status: 'Calculated',
    traceabilityPercent: 100,
    installationName: 'Porsgrunn Ammonia Complex',
    installationCountry: 'NO',
    productionRoute: 'Steam Methane Reforming (SMR) + CO2 Capture',
    extractedFields: [
      {
        id: 'f-005-1',
        fieldKey: 'net_mass',
        label: 'Net mass',
        value: '1,500 t',
        numericValue: 1500,
        unit: 't',
        confidence: 0.99,
        boundingBox: { page: 1, x: 130, y: 330, width: 120, height: 24 },
        status: 'human_confirmed',
        verifiedBy: 'E. Moreau (Lead CBAM Officer)',
        verifiedAt: 'Sep 26, 09:12 CET'
      },
      {
        id: 'f-005-2',
        fieldKey: 'emissions_total',
        label: 'Specific direct emissions',
        value: '1.45 tCO₂e/t',
        numericValue: 1.45,
        unit: 'tCO₂e/t',
        confidence: 0.96,
        boundingBox: { page: 1, x: 130, y: 410, width: 140, height: 24 },
        status: 'human_confirmed',
        verifiedBy: 'E. Moreau (Lead CBAM Officer)',
        verifiedAt: 'Sep 26, 09:15 CET'
      }
    ]
  },
  {
    id: 'doc-006',
    filename: 'posco_billet_mill_test_55.pdf',
    fileSize: '4.1 MB',
    sha256: '55aa66bb77cc88dd99ee00ff112233445566778899aabbccddeeff0011223344',
    supplier: 'POSCO Pohang Steelworks',
    supplierCountry: 'KR (South Korea)',
    importer: 'ThyssenKrupp Euro-Import S.A. [DE94827103]',
    productName: 'Semi-finished steel billets',
    cnCode: '7207 11 14',
    goodsCategory: 'Iron & Steel',
    documentType: 'Mill test cert',
    uploadedAt: 'Sep 24, 08:30 CET',
    updatedAt: 'Sep 24, 11:55 CET',
    status: 'Verified',
    traceabilityPercent: 100,
    installationName: 'Pohang Steelmaking Plant #1',
    installationCountry: 'KR',
    productionRoute: 'BF-BOF with Corex off-gas recovery',
    extractedFields: [
      {
        id: 'f-006-1',
        fieldKey: 'net_mass',
        label: 'Net mass',
        value: '800 t',
        numericValue: 800,
        unit: 't',
        confidence: 0.98,
        boundingBox: { page: 1, x: 140, y: 340, width: 120, height: 24 },
        status: 'human_confirmed',
        verifiedBy: 'H. Lindqvist (Senior Auditor)',
        verifiedAt: 'Sep 24, 11:30 CET'
      },
      {
        id: 'f-006-2',
        fieldKey: 'emissions_direct',
        label: 'Direct specific emissions',
        value: '1.82 tCO₂e/t',
        numericValue: 1.82,
        unit: 'tCO₂e/t',
        confidence: 0.92,
        boundingBox: { page: 1, x: 140, y: 420, width: 150, height: 24 },
        status: 'human_confirmed',
        verifiedBy: 'H. Lindqvist (Senior Auditor)',
        verifiedAt: 'Sep 24, 11:32 CET'
      }
    ]
  }
];

export const INITIAL_CALCULATIONS: CalculationTrace[] = [
  {
    id: 'calc-001',
    documentId: 'doc-001',
    documentName: 'supplier_invoice_042.pdf',
    documentHash: '4a8f9c73e1b209d845e2a6d3910c85e492f1b0a8d7e6c5b4a39281726354abc1',
    resultValue: 1900.0,
    resultUnit: 'tCO₂e',
    resultLabel: 'Total Embedded Emissions',
    formula: 'Net Mass (1,000 t) × [Specific Direct (1.60) + Specific Indirect (0.30)]',
    formulaDisplay: '1,000 t × 1.90 tCO₂e/t',
    ruleVersion: 'v2026.1',
    ruleName: 'EU CBAM Implementing Act — Transitional Methodology',
    regulationReference: 'Regulation (EU) 2023/956, Annex IV, Section 3.1',
    directEmissionsTonnes: 1600.0,
    indirectEmissionsTonnes: 300.0,
    carbonPriceDeductionEur: 0.0,
    timestamp: '2026-10-02 09:45:12 CET',
    complianceOfficer: 'E. Moreau (Lead CBAM Officer)',
    verifiedInputs: [
      {
        label: 'Net Mass (t)',
        value: '1,000 t',
        sourceFieldKey: 'net_mass',
        verifiedBy: 'E. Moreau (Lead CBAM Officer)',
        verifiedAt: '2026-10-02 09:44:08 CET',
        boundingBox: { page: 1, x: 140, y: 382, width: 140, height: 26 }
      },
      {
        label: 'Direct Specific Emissions',
        value: '1.60 tCO₂e/t',
        sourceFieldKey: 'emissions_direct',
        verifiedBy: 'E. Moreau (Lead CBAM Officer)',
        verifiedAt: '2026-10-02 09:44:15 CET',
        boundingBox: { page: 1, x: 132, y: 418, width: 160, height: 26 }
      },
      {
        label: 'Indirect Specific Emissions',
        value: '0.30 tCO₂e/t',
        sourceFieldKey: 'emissions_indirect',
        verifiedBy: 'E. Moreau (Lead CBAM Officer)',
        verifiedAt: '2026-10-02 09:44:22 CET',
        boundingBox: { page: 1, x: 132, y: 452, width: 160, height: 26 }
      }
    ]
  },
  {
    id: 'calc-002',
    documentId: 'doc-002',
    documentName: 'arcelormittal_epd_coil_2026.pdf',
    documentHash: '9f83ac127e5b021a8c3d4f5e6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b',
    resultValue: 5232.0,
    resultUnit: 'tCO₂e',
    resultLabel: 'Total Embedded Emissions',
    formula: 'Net Mass (2,400 t) × Total Specific Emissions (2.18 tCO₂e/t)',
    formulaDisplay: '2,400 t × 2.18 tCO₂e/t',
    ruleVersion: 'v2026.1',
    ruleName: 'EU CBAM Implementing Act — Transitional Methodology',
    regulationReference: 'Regulation (EU) 2023/956, Annex IV, Section 3.1',
    directEmissionsTonnes: 4800.0,
    indirectEmissionsTonnes: 432.0,
    carbonPriceDeductionEur: 0.0,
    timestamp: '2026-10-01 16:30:45 CET',
    complianceOfficer: 'H. Lindqvist (Senior Auditor)',
    verifiedInputs: [
      {
        label: 'Net Mass (t)',
        value: '2,400 t',
        sourceFieldKey: 'net_mass',
        verifiedBy: 'H. Lindqvist (Senior Auditor)',
        verifiedAt: '2026-10-01 15:10:00 CET',
        boundingBox: { page: 1, x: 135, y: 340, width: 130, height: 24 }
      },
      {
        label: 'Total Specific Emissions',
        value: '2.18 tCO₂e/t',
        sourceFieldKey: 'emissions_total',
        verifiedBy: 'H. Lindqvist (Senior Auditor)',
        verifiedAt: '2026-10-01 15:12:00 CET',
        boundingBox: { page: 2, x: 145, y: 460, width: 150, height: 25 }
      }
    ]
  },
  {
    id: 'calc-003',
    documentId: 'doc-003',
    documentName: 'ega_aluminium_ingots_cert88.pdf',
    documentHash: 'c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4',
    resultValue: 3575.0,
    resultUnit: 'tCO₂e',
    resultLabel: 'Total Embedded Emissions',
    formula: 'Net Mass (500 t) × [Specific Direct (1.95) + Specific Indirect (5.20)]',
    formulaDisplay: '500 t × 7.15 tCO₂e/t',
    ruleVersion: 'v2026.1',
    ruleName: 'EU CBAM Implementing Act — Transitional Methodology',
    regulationReference: 'Regulation (EU) 2023/956, Annex IV, Section 3.2 (Aluminium)',
    directEmissionsTonnes: 975.0,
    indirectEmissionsTonnes: 2600.0,
    carbonPriceDeductionEur: 0.0,
    timestamp: '2026-09-29 14:05:22 CET',
    complianceOfficer: 'E. Moreau (Lead CBAM Officer)',
    verifiedInputs: [
      {
        label: 'Net Mass (t)',
        value: '500 t',
        sourceFieldKey: 'net_mass',
        verifiedBy: 'E. Moreau (Lead CBAM Officer)',
        verifiedAt: '2026-09-29 12:40:00 CET',
        boundingBox: { page: 1, x: 140, y: 320, width: 110, height: 24 }
      },
      {
        label: 'Direct Specific Emissions',
        value: '1.95 tCO₂e/t',
        sourceFieldKey: 'emissions_direct',
        verifiedBy: 'E. Moreau (Lead CBAM Officer)',
        verifiedAt: '2026-09-29 12:41:00 CET',
        boundingBox: { page: 1, x: 132, y: 410, width: 140, height: 24 }
      },
      {
        label: 'Indirect Specific Emissions',
        value: '5.20 tCO₂e/t',
        sourceFieldKey: 'emissions_indirect',
        verifiedBy: 'E. Moreau (Lead CBAM Officer)',
        verifiedAt: '2026-09-29 12:42:00 CET',
        boundingBox: { page: 1, x: 132, y: 440, width: 140, height: 24 }
      }
    ]
  },
  {
    id: 'calc-005',
    documentId: 'doc-005',
    documentName: 'eurochem_urea_statement_912.pdf',
    documentHash: '1f2e3d4c5b6a7089123456789abcdef0123456789abcdef0123456789abcdef0',
    resultValue: 2175.0,
    resultUnit: 'tCO₂e',
    resultLabel: 'Total Embedded Emissions',
    formula: 'Net Mass (1,500 t) × Specific Direct Emissions (1.45 tCO₂e/t)',
    formulaDisplay: '1,500 t × 1.45 tCO₂e/t',
    ruleVersion: 'v2026.1',
    ruleName: 'EU CBAM Implementing Act — Transitional Methodology',
    regulationReference: 'Regulation (EU) 2023/956, Annex IV, Section 3.3 (Fertilizers)',
    directEmissionsTonnes: 2175.0,
    indirectEmissionsTonnes: 0.0,
    carbonPriceDeductionEur: 0.0,
    timestamp: '2026-09-26 09:20:18 CET',
    complianceOfficer: 'E. Moreau (Lead CBAM Officer)',
    verifiedInputs: [
      {
        label: 'Net Mass (t)',
        value: '1,500 t',
        sourceFieldKey: 'net_mass',
        verifiedBy: 'E. Moreau (Lead CBAM Officer)',
        verifiedAt: '2026-09-26 09:12:00 CET',
        boundingBox: { page: 1, x: 130, y: 330, width: 120, height: 24 }
      },
      {
        label: 'Specific Direct Emissions',
        value: '1.45 tCO₂e/t',
        sourceFieldKey: 'emissions_total',
        verifiedBy: 'E. Moreau (Lead CBAM Officer)',
        verifiedAt: '2026-09-26 09:15:00 CET',
        boundingBox: { page: 1, x: 130, y: 410, width: 140, height: 24 }
      }
    ]
  }
];

export const INITIAL_AUDIT_LOGS: AuditEvent[] = [
  {
    id: 'evt-001',
    timestamp: '09:42:04 CET',
    actor: 'E. Moreau',
    actorRole: 'Lead CBAM Officer',
    action: 'Document uploaded',
    category: 'UPLOAD',
    source: 'supplier_invoice_042.pdf',
    status: 'SUCCESS',
    hash: 'SHA256: 4a8f9c73e1b209d845e2a6d3910c85e492f1b0a8d7e6c5b4a39281726354abc1',
    details: 'Received 1.8 MB commercial invoice via secure customs EDI gateway.'
  },
  {
    id: 'evt-002',
    timestamp: '09:43:18 CET',
    actor: 'AuditTrace Extraction Service (OCR v4.2)',
    actorRole: 'Automated Extraction',
    action: 'Fields extracted',
    category: 'EXTRACTION',
    source: 'AI-assisted extraction',
    status: 'CONFIRMED',
    hash: 'PROPOSAL-HASH: 7721a9c3904',
    details: 'Detected 5 candidate fields with avg confidence 93.2%. Flagged for mandatory human review.'
  },
  {
    id: 'evt-003',
    timestamp: '09:44:30 CET',
    actor: 'E. Moreau',
    actorRole: 'Lead CBAM Officer (Authorized Verifier)',
    action: 'Human verification completed',
    category: 'VERIFICATION',
    source: 'Human Verification Gatekeeper',
    status: 'CONFIRMED',
    hash: 'SIG-VERIFY: 0x93b4827103aae',
    details: '3 critical fields confirmed against mill certificate: Net mass (1,000 t), Direct (1.60), Indirect (0.30).'
  },
  {
    id: 'evt-004',
    timestamp: '09:45:02 CET',
    actor: 'Deterministic Calculation Engine',
    actorRole: 'Rule Processor',
    action: 'Rule applied',
    category: 'RULE_CHANGE',
    source: 'Rule version v2026.1',
    status: 'SUCCESS',
    hash: 'RULE-REG-2023-956',
    details: 'Locked rule engine version v2026.1 (Implementing Act transitional formula).'
  },
  {
    id: 'evt-005',
    timestamp: '09:45:12 CET',
    actor: 'Deterministic Calculation Engine',
    actorRole: 'Rule Processor',
    action: 'Calculation generated',
    category: 'CALCULATION',
    source: 'Engine v2026.1',
    status: 'SUCCESS',
    hash: 'CALC-HASH: 8b4492ef103d',
    details: 'Computed 1,900.00 tCO₂e (Direct: 1,600 tCO₂e, Indirect: 300 tCO₂e). No AI intervention.'
  },
  {
    id: 'evt-006',
    timestamp: '09:46:00 CET',
    actor: 'AuditTrace Cryptographic Ledger',
    actorRole: 'System Daemon',
    action: 'Traceability record created',
    category: 'CALCULATION',
    source: 'Ledger Block #8492',
    status: 'AUDITED',
    hash: 'MERKLE: 38f9021a8b417c8d9e0f',
    details: 'Bi-directional link established: Result → Formula → Rule v2026.1 → Inputs → PDF p.1 (x=132, y=418).'
  },
  {
    id: 'evt-007',
    timestamp: 'Yesterday, 16:30 CET',
    actor: 'H. Lindqvist',
    actorRole: 'Senior Auditor',
    action: 'Calculation generated',
    category: 'CALCULATION',
    source: 'arcelormittal_epd_coil_2026.pdf',
    status: 'SUCCESS',
    hash: 'CALC-HASH: a937b82cd012',
    details: 'Calculated 5,232.00 tCO₂e for 2,400 t heavy plate under v2026.1.'
  },
  {
    id: 'evt-008',
    timestamp: 'Sep 29, 14:05 CET',
    actor: 'E. Moreau',
    actorRole: 'Lead CBAM Officer',
    action: 'Export package created',
    category: 'EXPORT',
    source: 'Dossier #CBAM-2026-Q3-088',
    status: 'SUCCESS',
    hash: 'EXPORT-SIG: ff00281b392a',
    details: 'Generated Transitional CBAM Declaration Assistant Dossier (PDF + JSON).'
  }
];
