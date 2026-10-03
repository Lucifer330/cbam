// ==============================================================================
// CBAM-AuditTrace Database Client & Connection Gateway
// Supports Supabase PostgreSQL Connection Pool (`pg`) with In-Memory Fallback
// ==============================================================================

import pg from 'pg';

const { Pool } = pg;

export interface DbSpaceRecord {
  id: string;
  vakh_board_id: string;
  space_name: string;
  supplier_name: string;
  supplier_country: string;
  importer_name: string;
  product_name: string;
  cn_code: string;
  goods_category: string;
  production_route?: string;
  overall_status: 'Verified' | 'Discrepancy' | 'Needs Review';
  sha256_hash: string;
  pdf_source_url: string;
  created_at: string;
}

export interface DbMetricRecord {
  id: string;
  space_id: string;
  metric_key: string;
  metric_name: string;
  metric_value: string;
  numeric_value: number;
  unit: string;
  confidence?: number;
  status: 'Verified' | 'Discrepancy' | 'Needs Review';
  justification?: string;
  pdf_source_url?: string;
  highlight_coordinates: {
    page: number;
    top: string | number;
    left: string | number;
    width: string | number;
    height: string | number;
    pixel_top?: number;
    pixel_left?: number;
    pixel_width?: number;
    pixel_height?: number;
  };
  verified_by?: string;
  verified_at?: string;
  vakh_property_id?: string;
  created_at: string;
}

export interface DbCalculationTraceRecord {
  id: string;
  space_id: string;
  rule_version: string;
  rule_clause: string;
  formula_expression: string;
  formula_display?: string;
  net_mass_tonnes: number;
  direct_emissions_tonnes: number;
  indirect_emissions_tonnes: number;
  total_embedded_tonnes: number;
  carbon_price_deduction_eur?: number;
  compliance_rating: string;
  eu_sector_benchmark: number;
  benchmark_deviation_percent?: number;
  merkle_root_hash: string;
  compliance_officer?: string;
  created_at: string;
}

class DatabaseService {
  private pool: pg.Pool | null = null;
  private isConnectedToPostgres = false;

  // In-Memory Fast Cache / Storage Fallback
  private spacesCache: Map<string, DbSpaceRecord> = new Map();
  private metricsCache: Map<string, DbMetricRecord> = new Map();
  private tracesCache: Map<string, DbCalculationTraceRecord> = new Map();

  constructor() {
    this.initPool();
    this.seedInMemoryDefaults();
  }

  private initPool() {
    const connectionString = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL;
    if (connectionString) {
      try {
        this.pool = new Pool({
          connectionString,
          ssl: {
            rejectUnauthorized: false
          },
          max: 10,
          idleTimeoutMillis: 30000,
          connectionTimeoutMillis: 5000,
        });

        this.pool.on('error', (err) => {
          console.warn('⚠️ [Postgres Pool Warning]:', err.message);
        });

        this.isConnectedToPostgres = true;
        console.log('🔌 [Database] PostgreSQL / Supabase connection pool configured.');
      } catch (err: any) {
        console.warn('⚠️ [Database] Failed to initialize PostgreSQL pool, using in-memory fallback:', err.message);
        this.pool = null;
        this.isConnectedToPostgres = false;
      }
    }
  }

  /**
   * Generic database query runner with automatic Supabase pool or memory fallback
   */
  public async query<T = any>(text: string, params: any[] = []): Promise<{ rows: T[]; rowCount: number }> {
    if (this.pool && this.isConnectedToPostgres) {
      try {
        const client = await this.pool.connect();
        try {
          const res = await client.query(text, params);
          return { rows: res.rows as T[], rowCount: res.rowCount || 0 };
        } finally {
          client.release();
        }
      } catch (err: any) {
        console.warn('⚠️ [Postgres Query Error - Falling back to cache]:', err.message);
      }
    }

    // Fallback: in-memory mock resolution
    return { rows: [], rowCount: 0 };
  }

  public seedDefaultData(): void {
    this.seedInMemoryDefaults();
  }

  public seedInMemoryDefaults() {
    this.spacesCache.clear();
    this.metricsCache.clear();
    this.tracesCache.clear();

    const space: DbSpaceRecord = {
      id: 'spc_craftora_cbam_2026',
      vakh_board_id: 'brd_customs_declarations_q3',
      space_name: 'Craftora EU CBAM Compliance Space',
      supplier_name: 'Steel Components Ltd.',
      supplier_country: 'TR',
      importer_name: 'ThyssenKrupp Euro-Import S.A. [DE94827103]',
      product_name: 'Hot-rolled non-alloy steel coils',
      cn_code: '7208 39 00',
      goods_category: 'Iron & Steel',
      overall_status: 'Needs Review',
      sha256_hash: '4a8f9c73e1b209d845e2a6d3910c85e492f1b0a8d7e6c5b4a39281726354abc1',
      pdf_source_url: 'https://vakh.com/assets/evidence/supplier_invoice_042.pdf',
      created_at: new Date('2026-09-30T09:42:00Z').toISOString()
    };

    this.spacesCache.set(space.id, space);

    const metrics: DbMetricRecord[] = [
      {
        id: 'fld_001_1',
        space_id: space.id,
        metric_key: 'net_mass',
        metric_name: 'Net Mass',
        metric_value: '1,000 t',
        numeric_value: 1000,
        unit: 't',
        status: 'Verified',
        justification: 'Extracted from Line Item 1 Summary total on commercial customs invoice.',
        pdf_source_url: space.pdf_source_url,
        highlight_coordinates: { page: 1, top: '44.4%', left: '21.8%', width: '21.8%', height: '3.0%', pixel_top: 382, pixel_left: 140, pixel_width: 140, pixel_height: 26 },
        vakh_property_id: 'vakh_prop_mass_01',
        created_at: new Date().toISOString()
      },
      {
        id: 'fld_001_2',
        space_id: space.id,
        metric_key: 'emissions_direct',
        metric_name: 'Direct Specific Emissions (Attr_Dir_Emiss)',
        metric_value: '1.60 tCO₂e/t',
        numeric_value: 1.60,
        unit: 'tCO₂e/t',
        status: 'Discrepancy',
        justification: 'Exceeds EU Iron & Steel Sector Benchmark (0.35 tCO₂e/t) by +357.1%. Enforced under Implementing Regulation (EU) 2023/1773 Annex III.',
        pdf_source_url: space.pdf_source_url,
        highlight_coordinates: { page: 1, top: '48.6%', left: '20.6%', width: '25.0%', height: '3.0%', pixel_top: 418, pixel_left: 132, pixel_width: 160, pixel_height: 26 },
        vakh_property_id: 'vakh_prop_dir_emiss_02',
        created_at: new Date().toISOString()
      },
      {
        id: 'fld_001_3',
        space_id: space.id,
        metric_key: 'emissions_indirect',
        metric_name: 'Indirect Specific Emissions (Attr_Indir_Emiss)',
        metric_value: '0.30 tCO₂e/t',
        numeric_value: 0.30,
        unit: 'tCO₂e/t',
        status: 'Needs Review',
        justification: 'Grid electricity emission factor applied for TR-MAR region. Awaiting auditor review.',
        pdf_source_url: space.pdf_source_url,
        highlight_coordinates: { page: 1, top: '52.5%', left: '20.6%', width: '25.0%', height: '3.0%', pixel_top: 452, pixel_left: 132, pixel_width: 160, pixel_height: 26 },
        vakh_property_id: 'vakh_prop_indir_emiss_03',
        created_at: new Date().toISOString()
      },
      {
        id: 'fld_001_4',
        space_id: space.id,
        metric_key: 'carbon_price_paid',
        metric_name: 'Carbon Price Paid Abroad',
        metric_value: '0.00 EUR/t',
        numeric_value: 0.0,
        unit: 'EUR/t',
        status: 'Verified',
        justification: 'Confirmed no domestic carbon tax applied at source country.',
        pdf_source_url: space.pdf_source_url,
        highlight_coordinates: { page: 1, top: '48.6%', left: '65.6%', width: '20.3%', height: '2.8%', pixel_top: 418, pixel_left: 420, pixel_width: 130, pixel_height: 24 },
        vakh_property_id: 'vakh_prop_cprice_04',
        created_at: new Date().toISOString()
      }
    ];

    metrics.forEach((m) => this.metricsCache.set(m.id, m));
  }

  // --- Spaces Methods ---
  public async getAllSpaces(): Promise<DbSpaceRecord[]> {
    if (this.pool && this.isConnectedToPostgres) {
      const res = await this.query<DbSpaceRecord>('SELECT * FROM cbam_data_spaces ORDER BY created_at DESC');
      if (res.rows.length > 0) return res.rows;
    }
    return Array.from(this.spacesCache.values());
  }

  public async getSpaceById(spaceId: string): Promise<DbSpaceRecord | null> {
    if (this.pool && this.isConnectedToPostgres) {
      const res = await this.query<DbSpaceRecord>('SELECT * FROM cbam_data_spaces WHERE id = $1', [spaceId]);
      if (res.rows.length > 0) return res.rows[0];
    }
    return this.spacesCache.get(spaceId) || null;
  }

  public async upsertSpace(space: DbSpaceRecord): Promise<DbSpaceRecord> {
    this.spacesCache.set(space.id, space);
    if (this.pool && this.isConnectedToPostgres) {
      await this.query(
        `INSERT INTO cbam_data_spaces (id, vakh_board_id, space_name, supplier_name, supplier_country, importer_name, product_name, cn_code, goods_category, overall_status, sha256_hash, pdf_source_url)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
         ON CONFLICT (id) DO UPDATE SET
           supplier_name = EXCLUDED.supplier_name,
           product_name = EXCLUDED.product_name,
           overall_status = EXCLUDED.overall_status`,
        [space.id, space.vakh_board_id, space.space_name, space.supplier_name, space.supplier_country, space.importer_name, space.product_name, space.cn_code, space.goods_category, space.overall_status, space.sha256_hash, space.pdf_source_url]
      );
    }
    return space;
  }

  // --- Metrics Methods ---
  public async getMetricsBySpaceId(spaceId: string): Promise<DbMetricRecord[]> {
    if (this.pool && this.isConnectedToPostgres) {
      const res = await this.query<DbMetricRecord>('SELECT * FROM cbam_audit_metrics WHERE space_id = $1 ORDER BY created_at ASC', [spaceId]);
      if (res.rows.length > 0) return res.rows;
    }
    return Array.from(this.metricsCache.values()).filter((m) => m.space_id === spaceId);
  }

  public async getMetricById(metricId: string): Promise<DbMetricRecord | null> {
    if (this.pool && this.isConnectedToPostgres) {
      const res = await this.query<DbMetricRecord>('SELECT * FROM cbam_audit_metrics WHERE id = $1', [metricId]);
      if (res.rows.length > 0) return res.rows[0];
    }
    return this.metricsCache.get(metricId) || null;
  }

  public async patchMetric(metricId: string, updates: Partial<DbMetricRecord>): Promise<DbMetricRecord | null> {
    const existing = await this.getMetricById(metricId);
    if (!existing) return null;

    const updated: DbMetricRecord = { ...existing, ...updates };
    this.metricsCache.set(metricId, updated);

    if (this.pool && this.isConnectedToPostgres) {
      await this.query(
        `UPDATE cbam_audit_metrics SET status = $1, justification = $2, metric_value = $3 WHERE id = $4`,
        [updated.status, updated.justification || null, updated.metric_value, metricId]
      );
    }

    return updated;
  }

  public async insertMetric(metric: DbMetricRecord): Promise<DbMetricRecord> {
    this.metricsCache.set(metric.id, metric);
    if (this.pool && this.isConnectedToPostgres) {
      await this.query(
        `INSERT INTO cbam_audit_metrics (id, space_id, metric_key, metric_name, metric_value, numeric_value, unit, status, justification, pdf_source_url, highlight_coordinates, vakh_property_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
         ON CONFLICT (id) DO UPDATE SET
           metric_value = EXCLUDED.metric_value,
           status = EXCLUDED.status,
           justification = EXCLUDED.justification,
           highlight_coordinates = EXCLUDED.highlight_coordinates`,
        [metric.id, metric.space_id, metric.metric_key, metric.metric_name, metric.metric_value, metric.numeric_value, metric.unit, metric.status, metric.justification || null, metric.pdf_source_url || null, JSON.stringify(metric.highlight_coordinates), metric.vakh_property_id || null]
      );
    }
    return metric;
  }

  // --- Calculation Traces Methods ---
  public async saveCalculationTrace(trace: DbCalculationTraceRecord): Promise<DbCalculationTraceRecord> {
    this.tracesCache.set(trace.id, trace);
    if (this.pool && this.isConnectedToPostgres) {
      await this.query(
        `INSERT INTO cbam_calculation_traces (id, space_id, rule_version, rule_clause, formula_expression, net_mass_tonnes, direct_emissions_tonnes, indirect_emissions_tonnes, total_embedded_tonnes, compliance_rating, eu_sector_benchmark, merkle_root_hash)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
         ON CONFLICT (id) DO NOTHING`,
        [trace.id, trace.space_id, trace.rule_version, trace.rule_clause, trace.formula_expression, trace.net_mass_tonnes, trace.direct_emissions_tonnes, trace.indirect_emissions_tonnes, trace.total_embedded_tonnes, trace.compliance_rating, trace.eu_sector_benchmark, trace.merkle_root_hash]
      );
    }
    return trace;
  }
}

export const db = new DatabaseService();
