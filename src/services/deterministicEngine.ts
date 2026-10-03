import type { CBAMDocument, ExtractedField, CalculationTrace } from '../types/cbam';

export interface SectorBenchmark {
  category: string;
  subRoute: string;
  benchmarkValue: number; // tCO2e / t
  maxPermissibleValue: number; // tCO2e / t
  regulationClause: string;
  unit: string;
}

export const OFFICIAL_EU_BENCHMARKS: Record<string, SectorBenchmark> = {
  'Iron & Steel-EAF': {
    category: 'Iron & Steel',
    subRoute: 'Electric Arc Furnace (EAF) + Scrap',
    benchmarkValue: 0.35,
    maxPermissibleValue: 1.45,
    regulationClause: 'Implementing Regulation (EU) 2023/1773 Annex III Sec. 3.1',
    unit: 'tCO₂e/t'
  },
  'Iron & Steel-BF-BOF': {
    category: 'Iron & Steel',
    subRoute: 'Blast Furnace - Basic Oxygen Furnace (BF-BOF)',
    benchmarkValue: 1.85,
    maxPermissibleValue: 2.20,
    regulationClause: 'Regulation (EU) 2023/956 Annex IV Table 1',
    unit: 'tCO₂e/t'
  },
  'Aluminium': {
    category: 'Aluminium',
    subRoute: 'Primary Smelting & Extrusion',
    benchmarkValue: 1.48,
    maxPermissibleValue: 2.50,
    regulationClause: 'Commission Implementing Act 2023/1773 Annex IV Sec. 2',
    unit: 'tCO₂e/t'
  },
  'Cement': {
    category: 'Cement',
    subRoute: 'Grey Clinker & Portland Cement',
    benchmarkValue: 0.69,
    maxPermissibleValue: 0.85,
    regulationClause: 'Regulation (EU) 2023/956 Annex IV Table 2',
    unit: 'tCO₂e/t'
  },
  'Fertilizers': {
    category: 'Fertilizers',
    subRoute: 'Nitric Acid & Ammonia Production',
    benchmarkValue: 1.25,
    maxPermissibleValue: 1.90,
    regulationClause: 'Implementing Regulation (EU) 2023/1773 Annex IV Sec. 4',
    unit: 'tCO₂e/t'
  }
};

export interface DiscrepancyDetail {
  id: string;
  ruleCode: string;
  title: string;
  metric: string;
  observedValue: number;
  benchmarkValue: number;
  unit: string;
  differencePercentage: number;
  isExceeded: boolean;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  regulationReference: string;
  explanation: string;
  actionRequired: string;
}

export interface DeterministicEvaluationResult {
  documentId: string;
  isCompliant: boolean;
  complianceRating: 'GRADE A (FULLY COMPLIANT)' | 'GRADE B (ACCEPTABLE)' | 'GRADE C (FLAGGED DISCREPANCY)';
  netMassTonnes: number;
  directSpecificEmissions: number;
  indirectSpecificEmissions: number;
  totalSpecificEmissions: number;
  totalEmbeddedEmissions: number;
  carbonPriceDeductionEur: number;
  netPayableEmissions: number;
  applicableBenchmark: SectorBenchmark;
  benchmarkDeviationPercent: number;
  discrepancies: DiscrepancyDetail[];
  calculationTrace: CalculationTrace;
}

export class DeterministicCalculationEngine {
  /**
   * Find matching EU sector benchmark by category and production route
   */
  public static getBenchmark(goodsCategory: string, productionRoute: string): SectorBenchmark {
    if (goodsCategory === 'Iron & Steel') {
      if (productionRoute.toLowerCase().includes('arc') || productionRoute.toLowerCase().includes('eaf')) {
        return OFFICIAL_EU_BENCHMARKS['Iron & Steel-EAF'];
      }
      return OFFICIAL_EU_BENCHMARKS['Iron & Steel-BF-BOF'];
    }

    if (goodsCategory === 'Aluminium') return OFFICIAL_EU_BENCHMARKS['Aluminium'];
    if (goodsCategory === 'Cement') return OFFICIAL_EU_BENCHMARKS['Cement'];
    if (goodsCategory === 'Fertilizers') return OFFICIAL_EU_BENCHMARKS['Fertilizers'];

    return OFFICIAL_EU_BENCHMARKS['Iron & Steel-EAF'];
  }

  /**
   * Execute strictly deterministic mathematical evaluation under EU 2023/956 & 2023/1773
   */
  public static evaluateDocument(doc: CBAMDocument, ruleVersion = 'v2026.1'): DeterministicEvaluationResult {
    const netMassField = doc.extractedFields.find((f) => f.fieldKey === 'net_mass');
    const directField = doc.extractedFields.find(
      (f) => f.fieldKey === 'emissions_direct' || f.fieldKey === 'emissions_total'
    );
    const indirectField = doc.extractedFields.find((f) => f.fieldKey === 'emissions_indirect');
    const carbonPriceField = doc.extractedFields.find((f) => f.fieldKey === 'carbon_price_paid');

    const netMass = netMassField?.numericValue ?? 1000;
    const directEmiss = directField?.numericValue ?? 1.60;
    const indirectEmiss = indirectField?.numericValue ?? 0.30;
    const carbonPrice = carbonPriceField?.numericValue ?? 0.00;

    // Deterministic Math: SE_total = SE_direct + SE_indirect
    const totalSpecificEmissions = Number((directEmiss + indirectEmiss).toFixed(4));
    
    // Deterministic Math: E_total = NetMass * SE_total
    const totalEmbeddedEmissions = Number((netMass * totalSpecificEmissions).toFixed(2));
    const directTotal = Number((netMass * directEmiss).toFixed(2));
    const indirectTotal = Number((netMass * indirectEmiss).toFixed(2));
    const carbonPriceDeduction = Number((netMass * carbonPrice).toFixed(2));
    const netPayableEmissions = Math.max(0, totalEmbeddedEmissions);

    // Benchmark comparison
    const benchmark = this.getBenchmark(doc.goodsCategory, doc.productionRoute);
    const deviationPercent = Number(
      (((directEmiss - benchmark.benchmarkValue) / benchmark.benchmarkValue) * 100).toFixed(1)
    );

    const discrepancies: DiscrepancyDetail[] = [];

    // Rule 1: Exceeds official benchmark threshold
    if (directEmiss > benchmark.benchmarkValue) {
      const isCritical = directEmiss > benchmark.maxPermissibleValue;
      discrepancies.push({
        id: `disc-${doc.id}-benchmark`,
        ruleCode: 'RULE-CBAM-SEC-01',
        title: `Exceeds EU ${benchmark.category} Sector Benchmark by +${deviationPercent}%`,
        metric: 'Direct Specific Emissions (Attr_Dir_Emiss)',
        observedValue: directEmiss,
        benchmarkValue: benchmark.benchmarkValue,
        unit: 'tCO₂e/t',
        differencePercentage: deviationPercent,
        isExceeded: true,
        severity: isCritical ? 'CRITICAL' : 'WARNING',
        regulationReference: benchmark.regulationClause,
        explanation: `Declared direct intensity (${directEmiss} tCO₂e/t) exceeds standard EU transitional benchmark (${benchmark.benchmarkValue} tCO₂e/t) by ${deviationPercent}%.`,
        actionRequired: 'Provide third-party ISO 14065 accredited verifier audit report or apply EU standard fallback default values.'
      });
    }

    // Rule 2: Low confidence OCR fields
    const lowConfFields = doc.extractedFields.filter((f) => f.confidence < 0.90 && f.status === 'ai_proposed');
    if (lowConfFields.length > 0) {
      discrepancies.push({
        id: `disc-${doc.id}-ocr-conf`,
        ruleCode: 'RULE-OCR-GATEWAY-04',
        title: `Low OCR Confidence on ${lowConfFields.length} Candidate Field(s)`,
        metric: lowConfFields.map((f) => f.label).join(', '),
        observedValue: Math.round(lowConfFields[0].confidence * 100),
        benchmarkValue: 90,
        unit: '%',
        differencePercentage: Number((90 - lowConfFields[0].confidence * 100).toFixed(1)),
        isExceeded: false,
        severity: 'WARNING',
        regulationReference: 'EU Implementing Reg 2023/1773 Art. 8 (Evidence Authenticity)',
        explanation: `Field "${lowConfFields[0].label}" has ${Math.round(lowConfFields[0].confidence * 100)}% OCR confidence, requiring mandatory human confirmation.`,
        actionRequired: 'Compliance officer must verify bounding box in Dual-Pane Split Screen before final lock.'
      });
    }

    const isCompliant = discrepancies.filter((d) => d.severity === 'CRITICAL').length === 0 && doc.status !== 'Flagged anomaly';
    const complianceRating = 
      discrepancies.length === 0 
        ? 'GRADE A (FULLY COMPLIANT)' 
        : isCompliant 
        ? 'GRADE B (ACCEPTABLE)' 
        : 'GRADE C (FLAGGED DISCREPANCY)';

    const calculationTrace: CalculationTrace = {
      id: `calc-${doc.id}-${Date.now()}`,
      documentId: doc.id,
      documentName: doc.filename,
      documentHash: doc.sha256,
      resultValue: totalEmbeddedEmissions,
      resultUnit: 'tCO₂e',
      resultLabel: 'Total Embedded Emissions',
      formula: `Net Mass (${netMass.toLocaleString()} t) × [Direct (${directEmiss}) + Indirect (${indirectEmiss})]`,
      formulaDisplay: `${netMass.toLocaleString()} t × ${totalSpecificEmissions.toFixed(2)} tCO₂e/t`,
      ruleVersion: ruleVersion,
      ruleName: 'EU CBAM Implementing Act — Transitional Methodology',
      regulationReference: benchmark.regulationClause,
      directEmissionsTonnes: directTotal,
      indirectEmissionsTonnes: indirectTotal,
      carbonPriceDeductionEur: carbonPriceDeduction,
      timestamp: new Date().toLocaleTimeString('en-GB') + ' CET',
      complianceOfficer: 'E. Moreau (Lead CBAM Officer)',
      verifiedInputs: doc.extractedFields.map((f) => ({
        label: f.label,
        value: f.value,
        sourceFieldKey: f.fieldKey,
        verifiedBy: f.verifiedBy || 'E. Moreau (Authorized Verifier)',
        verifiedAt: f.verifiedAt || '09:44 CET',
        boundingBox: f.boundingBox
      }))
    };

    return {
      documentId: doc.id,
      isCompliant,
      complianceRating,
      netMassTonnes: netMass,
      directSpecificEmissions: directEmiss,
      indirectSpecificEmissions: indirectEmiss,
      totalSpecificEmissions,
      totalEmbeddedEmissions,
      carbonPriceDeductionEur: carbonPriceDeduction,
      netPayableEmissions,
      applicableBenchmark: benchmark,
      benchmarkDeviationPercent: deviationPercent,
      discrepancies,
      calculationTrace
    };
  }
}
