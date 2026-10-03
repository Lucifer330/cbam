-- ==============================================================================
-- CBAM-AuditTrace PostgreSQL & Supabase Database Migration Schema
-- Single Source of Truth for EU Regulation (EU) 2023/956 & Implementing Act 2023/1773
-- Integrated with Vakh Data Engine (vakh.com)
-- ==============================================================================

-- 1. Create Enums
CREATE TYPE audit_status_enum AS ENUM (
    'Verified',
    'Discrepancy',
    'Needs Review'
);

CREATE TYPE compliance_status_enum AS ENUM (
    'Needs verification',
    'Verified',
    'Calculated',
    'Flagged anomaly',
    'Archived'
);

CREATE TYPE goods_category_enum AS ENUM (
    'Iron & Steel',
    'Aluminium',
    'Cement',
    'Fertilizers',
    'Hydrogen',
    'Electricity'
);

CREATE TYPE document_type_enum AS ENUM (
    'Invoice',
    'EPD',
    'Emissions statement',
    'Mill test cert'
);

-- 2. Table: cbam_data_spaces (Vakh Spaces & Boards Mapping)
CREATE TABLE IF NOT EXISTS cbam_data_spaces (
    id VARCHAR(64) PRIMARY KEY, -- e.g. "spc_craftora_cbam_2026" or UUID
    vakh_board_id VARCHAR(64) NOT NULL, -- e.g. "brd_customs_declarations_q3"
    space_name VARCHAR(255) NOT NULL DEFAULT 'Craftora EU CBAM Compliance Space',
    board_name VARCHAR(255) NOT NULL DEFAULT 'Customs Evidence & Supplier Declarations Board',
    supplier_name VARCHAR(255) NOT NULL,
    supplier_country VARCHAR(8) NOT NULL, -- ISO 2-letter country code (e.g. TR, DE, IN)
    importer_name VARCHAR(255) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    cn_code VARCHAR(16) NOT NULL, -- Combined Nomenclature 8-digit tariff code
    goods_category goods_category_enum NOT NULL DEFAULT 'Iron & Steel',
    document_type document_type_enum NOT NULL DEFAULT 'Invoice',
    installation_name VARCHAR(255) NOT NULL,
    installation_country VARCHAR(8) NOT NULL,
    production_route VARCHAR(255) NOT NULL,
    traceability_percent INTEGER NOT NULL DEFAULT 75 CHECK (traceability_percent >= 0 AND traceability_percent <= 100),
    overall_status audit_status_enum NOT NULL DEFAULT 'Needs Review',
    sha256_hash VARCHAR(66) NOT NULL, -- 0x + 64 hex characters
    pdf_source_url TEXT NOT NULL DEFAULT 'https://vakh.com/assets/evidence/supplier_invoice_042.pdf',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Table: cbam_audit_metrics (Core Audit Metrics & Dynamic Coordinates)
CREATE TABLE IF NOT EXISTS cbam_audit_metrics (
    id VARCHAR(64) PRIMARY KEY, -- e.g. "fld_001_1" or UUID
    space_id VARCHAR(64) NOT NULL REFERENCES cbam_data_spaces(id) ON DELETE CASCADE,
    metric_key VARCHAR(64) NOT NULL, -- e.g. "net_mass", "emissions_direct", "emissions_indirect"
    metric_name VARCHAR(255) NOT NULL, -- e.g. "Direct Specific Emissions (Attr_Dir_Emiss)"
    metric_value VARCHAR(128) NOT NULL, -- e.g. "1.60 tCO2e/t"
    numeric_value NUMERIC(14, 4), -- e.g. 1.6000
    unit VARCHAR(32) NOT NULL DEFAULT 'tCO₂e/t',
    confidence NUMERIC(5, 4) NOT NULL DEFAULT 0.9500 CHECK (confidence >= 0 AND confidence <= 1),
    status audit_status_enum NOT NULL DEFAULT 'Needs Review',
    justification TEXT, -- Discrepancy details or Auditor rebuttal note
    pdf_source_url TEXT,
    
    -- Highlight Coordinates extracted directly from Vakh schema
    -- Stored as JSON: { "page": 1, "top": 418, "left": 132, "width": 160, "height": 26, "top_pct": "32%", "left_pct": "8%", "width_pct": "84%", "height_pct": "7%" }
    highlight_coordinates JSONB NOT NULL,
    
    verified_by VARCHAR(255),
    verified_at TIMESTAMPTZ,
    vakh_property_id VARCHAR(64),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Table: cbam_calculation_traces (Deterministic Audit Log Ledger)
CREATE TABLE IF NOT EXISTS cbam_calculation_traces (
    id VARCHAR(64) PRIMARY KEY,
    space_id VARCHAR(64) NOT NULL REFERENCES cbam_data_spaces(id) ON DELETE CASCADE,
    rule_version VARCHAR(32) NOT NULL DEFAULT 'v2026.1',
    rule_clause VARCHAR(255) NOT NULL DEFAULT 'Implementing Regulation (EU) 2023/1773 Annex III Sec. 3.1',
    formula_expression TEXT NOT NULL,
    formula_display TEXT NOT NULL,
    net_mass_tonnes NUMERIC(14, 4) NOT NULL,
    direct_emissions_tonnes NUMERIC(14, 4) NOT NULL,
    indirect_emissions_tonnes NUMERIC(14, 4) NOT NULL,
    total_embedded_tonnes NUMERIC(14, 4) NOT NULL,
    carbon_price_deduction_eur NUMERIC(14, 4) NOT NULL DEFAULT 0,
    compliance_rating VARCHAR(64) NOT NULL,
    eu_sector_benchmark NUMERIC(10, 4) NOT NULL,
    benchmark_deviation_percent NUMERIC(8, 2) NOT NULL,
    merkle_root_hash VARCHAR(66) NOT NULL,
    compliance_officer VARCHAR(255) NOT NULL DEFAULT 'E. Moreau (Lead CBAM Officer)',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_spaces_vakh_board ON cbam_data_spaces(vakh_board_id);
CREATE INDEX IF NOT EXISTS idx_spaces_overall_status ON cbam_data_spaces(overall_status);
CREATE INDEX IF NOT EXISTS idx_metrics_space_id ON cbam_audit_metrics(space_id);
CREATE INDEX IF NOT EXISTS idx_metrics_status ON cbam_audit_metrics(status);
CREATE INDEX IF NOT EXISTS idx_metrics_coords ON cbam_audit_metrics USING gin (highlight_coordinates);
CREATE INDEX IF NOT EXISTS idx_traces_space_id ON cbam_calculation_traces(space_id);

-- 6. Trigger to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_timestamp_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_cbam_data_spaces
BEFORE UPDATE ON cbam_data_spaces
FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

CREATE TRIGGER trg_update_cbam_audit_metrics
BEFORE UPDATE ON cbam_audit_metrics
FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();
