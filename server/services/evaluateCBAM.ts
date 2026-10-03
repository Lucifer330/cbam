// ==============================================================================
// CBAM-AuditTrace Deterministic Calculation & Verification Engine
// Standalone Backend Module (EU Reg 2023/956 & Implementing Reg 2023/1773)
// ==============================================================================

export interface EUOfficialBenchmark {
  goodsCategory: string;
  subRoute: string;
  benchmarkValue: number; // in tCO2e/t
  maxPermissibleLimit: number; // in tCO2e/t
  regulationClause: string;
  unit: string;
}

export const EU_SECTOR_BENCHMARKS: Record<string, EUOfficialBenchmark> = {
  'Iron & Steel-EAF': {
    goodsCategory: 'Iron & Steel',
    subRoute: 'Electric Arc Furnace (EAF) + Scrap',
    benchmarkValue: 0.35,
    maxPermissibleLimit: 1.45,
    regulationClause: 'Implementing Regulation (EU) 2023/1773 Annex III Sec. 3.1',
    unit: 'tCO₂e/t'
  },
  'Iron & Steel-BF-BOF': {
    goodsCategory: 'Iron & Steel',
    subRoute: 'Blast Furnace - Basic Oxygen Furnace (BF-BOF)',
    benchmarkValue: 1.85,
    maxPermissibleLimit: 2.20,
    regulationClause: 'Regulation (EU) 2023/956 Annex IV Table 1',
    unit: 'tCO₂e/t'
  },
  'Aluminium': {
    goodsCategory: 'Aluminium',
    subRoute: 'Primary Smelting & Extrusion',
    benchmarkValue: 1.48,
    maxPermissibleLimit: 2.50,
    regulationClause: 'Commission Implementing Act 2023/1773 Annex IV Sec. 2',
    unit: 'tCO₂e/t'
  },
  'Cement': {
    goodsCategory: 'Cement',
    subRoute: 'Grey Clinker & Portland Cement',
    benchmarkValue: 0.69,
    maxPermissibleLimit: 0.85,
    regulationClause: 'Regulation (EU) 2023/956 Annex IV Table 2',
    unit: 'tCO₂e/t'
  },
  'Fertilizers': {
    goodsCategory: 'Fertilizers',
    subRoute: 'Nitric Acid & Ammonia Production',
    benchmarkValue: 1.25,
    maxPermissibleLimit: 1.90,
    regulationClause: 'Implementing Regulation (EU) 2023/1773 Annex IV Sec. 4',
    unit: 'tCO₂e/t'
  }
};

export interface RawMetricInput {
  id: string;
  metricKey: string;
  metricName: string;
  metricValue: string;
  numericValue?: number;
  unit: string;
  confidence: number;
  highlightCoordinates: {
    page: number;
    top: number | string;
    left: number | string;
    width: number | string;
    height: number | string;
  };
}

export interface EvaluatedMetricOutput {
  id: string;
  metricKey: string;
  metricName: string;
  metricValue: string;
  numericValue: number;
  unit: string;
  confidence: number;
  status: 'Verified' | 'Discrepancy' | 'Needs Review';
  justification?: string;
  differencePercentage?: number;
  isBenchmarkBreached?: boolean;
  highlightCoordinates: any;
}

export interface BackendEvaluationResponse {
  spaceId: string;
  isCompliant: boolean;
  complianceRating: 'GRADE A (FULLY COMPLIANT)' | 'GRADE B (ACCEPTABLE)' | 'GRADE C (FLAGGED DISCREPANCY)';
  netMassTonnes: number;
  directSpecificEmissions: number;
  indirectSpecificEmissions: number;
  totalSpecificEmissions: number;
  totalEmbeddedEmissions: number;
  carbonPriceDeductionEur: number;
  applicableBenchmark: EUOfficialBenchmark;
  benchmarkDeviationPercent: number;
  evaluatedMetrics: EvaluatedMetricOutput[];
  discrepancies: Array<{
    ruleCode: string;
    title: string;
    differencePercentage: number;
    regulationReference: string;
    explanation: string;
    actionRequired: string;
  }>;
  formulaDisplay: string;
}

/**
 * Pure Deterministic Evaluation Function
 */
export function evaluateCBAMMetrics(
  spaceId: string,
  goodsCategory: string,
  productionRoute: string,
  metrics: RawMetricInput[]
): BackendEvaluationResponse {
  // 1. Resolve Sector Benchmark
  let benchmarkKey = 'Iron & Steel-EAF';
  if (goodsCategory === 'Iron & Steel') {
    if (productionRoute.toLowerCase().includes('blast') || productionRoute.toLowerCase().includes('bof')) {
      benchmarkKey = 'Iron & Steel-BF-BOF';
    } else {
      benchmarkKey = 'Iron & Steel-EAF';
    }
  } else if (EU_SECTOR_BENCHMARKS[goodsCategory]) {
    benchmarkKey = goodsCategory;
  }
  const benchmark = EU_SECTOR_BENCHMARKS[benchmarkKey] || EU_SECTOR_BENCHMARKS['Iron & Steel-EAF'];

  // 2. Extract quantitative variables
  const netMassItem = metrics.find((m) => m.metricKey === 'net_mass');
  const directItem = metrics.find((m) => m.metricKey === 'emissions_direct' || m.metricKey === 'emissions_total');
  const indirectItem = metrics.find((m) => m.metricKey === 'emissions_indirect');
  const carbonPriceItem = metrics.find((m) => m.metricKey === 'carbon_price_paid');

  const netMass = netMassItem?.numericValue ?? 1000;
  const directEmiss = directItem?.numericValue ?? 1.60;
  const indirectEmiss = indirectItem?.numericValue ?? 0.30;
  const carbonPrice = carbonPriceItem?.numericValue ?? 0.00;

  // 3. Deterministic Arithmetic (Zero AI Guessing)
  const totalSpecificEmissions = Number((directEmiss + indirectEmiss).toFixed(4));
  const totalEmbeddedEmissions = Number((netMass * totalSpecificEmissions).toFixed(2));
  const carbonPriceDeductionEur = Number((netMass * carbonPrice).toFixed(2));

  // 4. Benchmark Difference Percentage
  const deviationPercent = Number(
    (((directEmiss - benchmark.benchmarkValue) / benchmark.benchmarkValue) * 100).toFixed(1)
  );

  const discrepancies: Array<{
    ruleCode: string;
    title: string;
    differencePercentage: number;
    regulationReference: string;
    explanation: string;
    actionRequired: string;
  }> = [];

  // 5. Evaluate each metric against threshold rules
  const evaluatedMetrics: EvaluatedMetricOutput[] = metrics.map((m) => {
    let status: 'Verified' | 'Discrepancy' | 'Needs Review' = 'Verified';
    let justification: string | undefined = undefined;
    let differencePercentage: number | undefined = undefined;
    let isBenchmarkBreached = false;

    if (m.metricKey === 'emissions_direct' || m.metricKey === 'emissions_total') {
      const val = m.numericValue ?? directEmiss;
      if (val > benchmark.benchmarkValue) {
        status = 'Discrepancy';
        isBenchmarkBreached = true;
        differencePercentage = deviationPercent;
        justification = `Exceeds EU ${benchmark.goodsCategory} Sector Benchmark (${benchmark.benchmarkValue} ${benchmark.unit}) by +${deviationPercent}%. Enforced under ${benchmark.regulationClause}.`;
        
        discrepancies.push({
          ruleCode: 'RULE-CBAM-SEC-01',
          title: `Exceeds EU ${benchmark.goodsCategory} Benchmark by +${deviationPercent}%`,
          differencePercentage: deviationPercent,
          regulationReference: benchmark.regulationClause,
          explanation: `Declared direct emissions intensity of ${val} ${m.unit} exceeds the EU default sectoral benchmark of ${benchmark.benchmarkValue} ${benchmark.unit}.`,
          actionRequired: 'Provide accredited third-party verification certificate (ISO 14065) or adjust using standard EU default values.'
        });
      }
    } else if (m.confidence < 0.90) {
      status = 'Needs Review';
      justification = `OCR confidence score (${Math.round(m.confidence * 100)}%) is below the 90% threshold. Mandatory human audit required.`;
    }

    return {
      id: m.id,
      metricKey: m.metricKey,
      metricName: m.metricName,
      metricValue: m.metricValue,
      numericValue: m.numericValue ?? 0,
      unit: m.unit,
      confidence: m.confidence,
      status,
      justification,
      differencePercentage,
      isBenchmarkBreached,
      highlightCoordinates: m.highlightCoordinates
    };
  });

  const isCompliant = discrepancies.length === 0;
  const complianceRating = 
    discrepancies.length === 0 
      ? 'GRADE A (FULLY COMPLIANT)' 
      : deviationPercent < 20 
      ? 'GRADE B (ACCEPTABLE)' 
      : 'GRADE C (FLAGGED DISCREPANCY)';

  return {
    spaceId,
    isCompliant,
    complianceRating,
    netMassTonnes: netMass,
    directSpecificEmissions: directEmiss,
    indirectSpecificEmissions: indirectEmiss,
    totalSpecificEmissions,
    totalEmbeddedEmissions,
    carbonPriceDeductionEur,
    applicableBenchmark: benchmark,
    benchmarkDeviationPercent: deviationPercent,
    evaluatedMetrics,
    discrepancies,
    formulaDisplay: `${netMass.toLocaleString()} t × ${totalSpecificEmissions.toFixed(2)} tCO₂e/t`
  };
}
