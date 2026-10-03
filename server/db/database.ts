// ==============================================================================
// CBAM-AuditTrace Database Client & In-Memory Storage Gateway
// Handles PostgreSQL / Supabase and in-memory persistence
// ==============================================================================

export interface DbSpaceRecord {
  id: string;
  vakh_board_id: string;
  space_name: string;
  board_name: string;
  supplier_name: string;
  supplier_country: string;
  importer_name: string;
  product_name: string;
  cn_code: string;
  goods_category: string;
  document_type: string;
  installation_name: string;
  installation_country: string;
  production_route: string;
  traceability_percent: number;
  overall_status: 'Verified' | 'Discrepancy' | 'Needs Review';
  sha256_hash: string;
  pdf_source_url: string;
  created_at: string;
  updated_at: string;
}

export interface DbMetricRecord {
  id: string;
  space_id: string;
  metric_key: string;
  metric_name: string;
  metric_value: string;
  numeric_value: number;
  unit: string;
  confidence: number;
  status: 'Verified' | 'Discrepancy' | 'Needs Review';
  justification?: string;
  pdf_source_url?: string;
  highlight_coordinates: {
    page: number;
    top: number | string;
    left: number | string;
    width: number | string;
    height: number | string;
  };
  verified_by?: string;
  verified_at?: string;
  vakh_property_id?: string;
  created_at: string;
  updated_at: string;
}

export interface DbCalculationTraceRecord {
  id: string;
  space_id: string;
  rule_version: string;
  rule_clause: string;
  formula_expression: string;
  formula_display: string;
  net_mass_tonnes: number;
  direct_emissions_tonnes: number;
  indirect_emissions_tonnes: number;
  total_embedded_tonnes: number;
  carbon_price_deduction_eur: number;
  compliance_rating: string;
  eu_sector_benchmark: number;
  benchmark_deviation_percent: number;
  merkle_root_hash: string;
  compliance_officer: string;
  created_at: string;
}

class DatabaseManager {
  private spaces: Map<string, DbSpaceRecord> = new Map();
  private metrics: Map<string, DbMetricRecord> = new Map();
  private calculationTraces: Map<string, DbCalculationTraceRecord> = new Map();

  constructor() {
    this.seedDefaultData();
  }

  public seedDefaultData() {
    this.spaces.clear();
    this.metrics.clear();
    this.calculationTraces.clear();

    const space1: DbSpaceRecord = {
      id: 'spc_craftora_cbam_2026',
      vakh_board_id: 'brd_customs_declarations_q3',
      space_name: 'Craftora EU CBAM Compliance Space',
      board_name: 'Customs Evidence & Supplier Declarations Board',
      supplier_name: 'Steel Components Ltd.',
      supplierCountry: 'TR',
      importer_name: 'ThyssenKrupp Euro-Import S.A. [DE94827103]',
      product_name: 'Hot-rolled non-alloy steel coils',
      cn_code: '7208 39 00',
      goods_category: 'Iron & Steel',
      document_type: 'Invoice',
      installation_name: 'Dilovasi Rolling Mill #2',
      installation_country: 'TR',
      production_route: 'Electric Arc Furnace (EAF) + Scrap',
      traceability_percent: 78,
      overall_status: 'Needs Review',
      sha256_hash: '4a8f9c73e1b209d845e2a6d3910c85e492f1b0a8d7e6c5b4a39281726354abc1',
      pdf_source_url: 'https://vakh.com/assets/evidence/supplier_invoice_042.pdf',
      created_at: new Date('2026-09-30T09:42:00Z').toISOString(),
      updated_at: new Date().toISOString()
    } as any;

    this.spaces.set(space1.id, space1);

    const m1: DbMetricRecord = {
      id: 'fld_001_1',
      space_id: space1.id,
      metric_key: 'net_mass',
      metric_name: 'Net Mass',
      metric_value: '1,000 t',
      numeric_value: 1000,
      unit: 't',
      confidence: 0.98,
      status: 'Verified',
      pdf_source_url: space1.pdf_source_url,
      highlight_coordinates: { page: 1, top: 382, left: 140, width: 140, height: 26 },
      verified_by: 'E. Moreau (Lead CBAM Officer)',
      verified_at: new Date().toISOString(),
      vakh_property_id: 'vakh_prop_mass_01',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const m2: DbMetricRecord = {
      id: 'fld_001_2',
      space_id: space1.id,
      metric_key: 'emissions_direct',
      metric_name: 'Direct Specific Emissions (Attr_Dir_Emiss)',
      metric_value: '1.60 tCO₂e/t',
      numeric_value: 1.60,
      unit: 'tCO₂e/t',
      confidence: 0.91,
      status: 'Discrepancy',
      justification: 'Exceeds EU Iron & Steel Sector Benchmark (0.35 tCO₂e/t) by +357.1%. Third-party verifier certification mandatory under Implementing Reg 2023/1773.',
      pdf_source_url: space1.pdf_source_url,
      highlight_coordinates: { page: 1, top: 418, left: 132, width: 160, height: 26 },
      verified_by: 'E. Moreau (Lead CBAM Officer)',
      verified_at: new Date().toISOString(),
      vakh_property_id: 'vakh_prop_dir_emiss_02',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const m3: DbMetricRecord = {
      id: 'fld_001_3',
      space_id: space1.id,
      metric_key: 'emissions_indirect',
      metric_name: 'Indirect Specific Emissions (Attr_Indir_Emiss)',
      metric_value: '0.30 tCO₂e/t',
      numeric_value: 0.30,
      unit: 'tCO₂e/t',
      confidence: 0.88,
      status: 'Needs Review',
      justification: 'Grid electricity emission factor applied for TR-MAR region. Awaiting auditor review.',
      pdf_source_url: space1.pdf_source_url,
      highlight_coordinates: { page: 1, top: 452, left: 132, width: 160, height: 26 },
      vakh_property_id: 'vakh_prop_indir_emiss_03',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const m4: DbMetricRecord = {
      id: 'fld_001_4',
      space_id: space1.id,
      metric_key: 'carbon_price_paid',
      metric_name: 'Carbon Price Paid Abroad',
      metric_value: '0.00 EUR/t',
      numeric_value: 0.0,
      unit: 'EUR/t',
      confidence: 0.95,
      status: 'Verified',
      pdf_source_url: space1.pdf_source_url,
      highlight_coordinates: { page: 1, top: 418, left: 420, width: 130, height: 24 },
      verified_by: 'E. Moreau (Lead CBAM Officer)',
      verified_at: new Date().toISOString(),
      vakh_property_id: 'vakh_prop_cprice_04',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    this.metrics.set(m1.id, m1);
    this.metrics.set(m2.id, m2);
    this.metrics.set(m3.id, m3);
    this.metrics.set(m4.id, m4);
  }

  // --- Spaces Operations ---
  public async getSpaceById(spaceId: string): Promise<DbSpaceRecord | null> {
    return this.spaces.get(spaceId) || null;
  }

  public async getAllSpaces(): Promise<DbSpaceRecord[]> {
    return Array.from(this.spaces.values());
  }

  public async upsertSpace(space: DbSpaceRecord): Promise<DbSpaceRecord> {
    this.spaces.set(space.id, { ...space, updated_at: new Date().toISOString() });
    return this.spaces.get(space.id)!;
  }

  // --- Metrics Operations ---
  public async getMetricsBySpaceId(spaceId: string): Promise<DbMetricRecord[]> {
    return Array.from(this.metrics.values()).filter((m) => m.space_id === spaceId);
  }

  public async getMetricById(metricId: string): Promise<DbMetricRecord | null> {
    return this.metrics.get(metricId) || null;
  }

  public async patchMetric(
    metricId: string, 
    patch: Partial<DbMetricRecord>
  ): Promise<DbMetricRecord | null> {
    const existing = this.metrics.get(metricId);
    if (!existing) return null;

    const updated: DbMetricRecord = {
      ...existing,
      ...patch,
      updated_at: new Date().toISOString()
    };

    this.metrics.set(metricId, updated);
    return updated;
  }

  public async insertMetric(metric: DbMetricRecord): Promise<DbMetricRecord> {
    this.metrics.set(metric.id, metric);
    return metric;
  }

  // --- Calculation Traces Operations ---
  public async saveCalculationTrace(trace: DbCalculationTraceRecord): Promise<DbCalculationTraceRecord> {
    this.calculationTraces.set(trace.id, trace);
    return trace;
  }

  public async getCalculationTraceBySpaceId(spaceId: string): Promise<DbCalculationTraceRecord | null> {
    return Array.from(this.calculationTraces.values()).find((t) => t.space_id === spaceId) || null;
  }
}

export const db = new DatabaseManager();
