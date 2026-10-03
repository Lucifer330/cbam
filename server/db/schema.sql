-- ==============================================================================
-- CBAM-AuditTrace PostgreSQL & Supabase Database Migration Schema & Seeding
-- Complies with EU Regulation (EU) 2023/956 & Implementing Act 2023/1773
-- Integrated with Vakh Data Engine (vakh.com)
-- ==============================================================================

-- 1. Create Enums
DO $$ BEGIN
    CREATE TYPE audit_status_enum AS ENUM ('Verified', 'Discrepancy', 'Needs Review');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE goods_category_enum AS ENUM ('Iron & Steel', 'Aluminium', 'Cement', 'Fertilizers', 'Hydrogen', 'Electricity');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Table: cbam_data_spaces
CREATE TABLE IF NOT EXISTS cbam_data_spaces (
    id VARCHAR(64) PRIMARY KEY,
    vakh_board_id VARCHAR(64) NOT NULL,
    space_name VARCHAR(255) NOT NULL DEFAULT 'Craftora EU CBAM Compliance Space',
    supplier_name VARCHAR(255) NOT NULL,
    supplier_country VARCHAR(8) NOT NULL,
    importer_name VARCHAR(255) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    cn_code VARCHAR(16) NOT NULL,
    goods_category goods_category_enum NOT NULL DEFAULT 'Iron & Steel',
    overall_status audit_status_enum NOT NULL DEFAULT 'Needs Review',
    sha256_hash VARCHAR(66) NOT NULL,
    pdf_source_url TEXT NOT NULL DEFAULT 'https://vakh.com/assets/evidence/supplier_invoice_042.pdf',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Table: cbam_audit_metrics
CREATE TABLE IF NOT EXISTS cbam_audit_metrics (
    id VARCHAR(64) PRIMARY KEY,
    space_id VARCHAR(64) NOT NULL REFERENCES cbam_data_spaces(id) ON DELETE CASCADE,
    metric_key VARCHAR(64) NOT NULL,
    metric_name VARCHAR(255) NOT NULL,
    metric_value VARCHAR(128) NOT NULL,
    numeric_value NUMERIC(14, 4),
    unit VARCHAR(32) NOT NULL DEFAULT 'tCO₂e/t',
    status audit_status_enum NOT NULL DEFAULT 'Needs Review',
    justification TEXT,
    pdf_source_url TEXT,
    highlight_coordinates JSONB NOT NULL, -- e.g. { "page": 1, "top": "48.6%", "left": "20.6%", "width": "25.0%", "height": "3.0%" }
    vakh_property_id VARCHAR(64),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Table: cbam_calculation_traces
CREATE TABLE IF NOT EXISTS cbam_calculation_traces (
    id VARCHAR(64) PRIMARY KEY,
    space_id VARCHAR(64) NOT NULL REFERENCES cbam_data_spaces(id) ON DELETE CASCADE,
    rule_version VARCHAR(32) NOT NULL DEFAULT 'v2026.1',
    rule_clause VARCHAR(255) NOT NULL DEFAULT 'Implementing Regulation (EU) 2023/1773 Annex III Sec. 3.1',
    formula_expression TEXT NOT NULL,
    net_mass_tonnes NUMERIC(14, 4) NOT NULL,
    direct_emissions_tonnes NUMERIC(14, 4) NOT NULL,
    indirect_emissions_tonnes NUMERIC(14, 4) NOT NULL,
    total_embedded_tonnes NUMERIC(14, 4) NOT NULL,
    compliance_rating VARCHAR(64) NOT NULL,
    eu_sector_benchmark NUMERIC(10, 4) NOT NULL,
    merkle_root_hash VARCHAR(66) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Indexes
CREATE INDEX IF NOT EXISTS idx_spaces_vakh_board ON cbam_data_spaces(vakh_board_id);
CREATE INDEX IF NOT EXISTS idx_metrics_space_id ON cbam_audit_metrics(space_id);
CREATE INDEX IF NOT EXISTS idx_metrics_status ON cbam_audit_metrics(status);
CREATE INDEX IF NOT EXISTS idx_metrics_coords ON cbam_audit_metrics USING gin (highlight_coordinates);

-- 6. Initial Seed Data
INSERT INTO cbam_data_spaces (
    id,
    vakh_board_id,
    space_name,
    supplier_name,
    supplier_country,
    importer_name,
    product_name,
    cn_code,
    goods_category,
    overall_status,
    sha256_hash,
    pdf_source_url,
    created_at
) VALUES (
    'spc_craftora_cbam_2026',
    'brd_customs_declarations_q3',
    'Craftora EU CBAM Compliance Space',
    'Steel Components Ltd.',
    'TR',
    'ThyssenKrupp Euro-Import S.A. [DE94827103]',
    'Hot-rolled non-alloy steel coils',
    '7208 39 00',
    'Iron & Steel',
    'Needs Review',
    '4a8f9c73e1b209d845e2a6d3910c85e492f1b0a8d7e6c5b4a39281726354abc1',
    'https://vakh.com/assets/evidence/supplier_invoice_042.pdf',
    NOW()
) ON CONFLICT (id) DO UPDATE SET
    supplier_name = EXCLUDED.supplier_name,
    product_name = EXCLUDED.product_name,
    overall_status = EXCLUDED.overall_status;

INSERT INTO cbam_audit_metrics (
    id,
    space_id,
    metric_key,
    metric_name,
    metric_value,
    numeric_value,
    unit,
    status,
    justification,
    pdf_source_url,
    highlight_coordinates,
    vakh_property_id,
    created_at
) VALUES 
(
    'fld_001_1',
    'spc_craftora_cbam_2026',
    'net_mass',
    'Net Mass',
    '1,000 t',
    1000.0000,
    't',
    'Verified',
    'Extracted from Line Item 1 Summary total on commercial customs invoice.',
    'https://vakh.com/assets/evidence/supplier_invoice_042.pdf',
    '{"page": 1, "top": "44.4%", "left": "21.8%", "width": "21.8%", "height": "3.0%", "pixel_top": 382, "pixel_left": 140, "pixel_width": 140, "pixel_height": 26}'::jsonb,
    'vakh_prop_mass_01',
    NOW()
),
(
    'fld_001_2',
    'spc_craftora_cbam_2026',
    'emissions_direct',
    'Direct Specific Emissions (Attr_Dir_Emiss)',
    '1.60 tCO₂e/t',
    1.6000,
    'tCO₂e/t',
    'Discrepancy',
    'Exceeds EU Iron & Steel Sector Benchmark (0.35 tCO₂e/t) by +357.1%. Enforced under Implementing Regulation (EU) 2023/1773 Annex III.',
    'https://vakh.com/assets/evidence/supplier_invoice_042.pdf',
    '{"page": 1, "top": "48.6%", "left": "20.6%", "width": "25.0%", "height": "3.0%", "pixel_top": 418, "pixel_left": 132, "pixel_width": 160, "pixel_height": 26}'::jsonb,
    'vakh_prop_dir_emiss_02',
    NOW()
),
(
    'fld_001_3',
    'spc_craftora_cbam_2026',
    'emissions_indirect',
    'Indirect Specific Emissions (Attr_Indir_Emiss)',
    '0.30 tCO₂e/t',
    0.3000,
    'tCO₂e/t',
    'Needs Review',
    'Grid electricity emission factor applied for TR-MAR region. Awaiting auditor review.',
    'https://vakh.com/assets/evidence/supplier_invoice_042.pdf',
    '{"page": 1, "top": "52.5%", "left": "20.6%", "width": "25.0%", "height": "3.0%", "pixel_top": 452, "pixel_left": 132, "pixel_width": 160, "pixel_height": 26}'::jsonb,
    'vakh_prop_indir_emiss_03',
    NOW()
),
(
    'fld_001_4',
    'spc_craftora_cbam_2026',
    'carbon_price_paid',
    'Carbon Price Paid Abroad',
    '0.00 EUR/t',
    0.0000,
    'EUR/t',
    'Verified',
    'Confirmed no domestic carbon tax applied at source country.',
    'https://vakh.com/assets/evidence/supplier_invoice_042.pdf',
    '{"page": 1, "top": "48.6%", "left": "65.6%", "width": "20.3%", "height": "2.8%", "pixel_top": 418, "pixel_left": 420, "pixel_width": 130, "pixel_height": 24}'::jsonb,
    'vakh_prop_cprice_04',
    NOW()
)
ON CONFLICT (id) DO UPDATE SET
    metric_value = EXCLUDED.metric_value,
    status = EXCLUDED.status,
    justification = EXCLUDED.justification,
    highlight_coordinates = EXCLUDED.highlight_coordinates;
