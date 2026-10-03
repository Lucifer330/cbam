// ==============================================================================
// CBAM-AuditTrace Database Seeder
// Populates realistic EU CBAM records, Vakh reference IDs, and exact PDF coordinates
// ==============================================================================

import { db, type DbSpaceRecord, type DbMetricRecord } from './db/database.ts';

export async function runDatabaseSeed() {
  console.log('🌱 [CBAM-AuditTrace] Starting database seed...');

  // 1. Primary Turkish Steel Declaration (Dilovasi EAF Rolling Mill)
  const steelSpace: DbSpaceRecord = {
    id: 'spc_craftora_cbam_2026',
    vakh_board_id: 'brd_customs_declarations_q3',
    space_name: 'Craftora EU CBAM Compliance Space',
    board_name: 'Customs Evidence & Supplier Declarations Board',
    supplier_name: 'Steel Components Ltd.',
    supplier_country: 'TR',
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
  };

  await db.upsertSpace(steelSpace);

  const steelMetrics: DbMetricRecord[] = [
    {
      id: 'fld_001_1',
      space_id: steelSpace.id,
      metric_key: 'net_mass',
      metric_name: 'Net Mass',
      metric_value: '1,000 t',
      numeric_value: 1000,
      unit: 't',
      confidence: 0.98,
      status: 'Verified',
      pdf_source_url: steelSpace.pdf_source_url,
      highlight_coordinates: { page: 1, top: 382, left: 140, width: 140, height: 26 },
      verified_by: 'E. Moreau (Lead CBAM Officer)',
      verified_at: new Date().toISOString(),
      vakh_property_id: 'vakh_prop_mass_01',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'fld_001_2',
      space_id: steelSpace.id,
      metric_key: 'emissions_direct',
      metric_name: 'Direct Specific Emissions (Attr_Dir_Emiss)',
      metric_value: '1.60 tCO₂e/t',
      numeric_value: 1.60,
      unit: 'tCO₂e/t',
      confidence: 0.91,
      status: 'Discrepancy',
      justification: 'Exceeds EU Iron & Steel Sector Benchmark (0.35 tCO₂e/t) by +357.1%. Third-party verifier certification mandatory under Implementing Reg 2023/1773.',
      pdf_source_url: steelSpace.pdf_source_url,
      highlight_coordinates: { page: 1, top: 418, left: 132, width: 160, height: 26 },
      verified_by: 'E. Moreau (Lead CBAM Officer)',
      verified_at: new Date().toISOString(),
      vakh_property_id: 'vakh_prop_dir_emiss_02',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'fld_001_3',
      space_id: steelSpace.id,
      metric_key: 'emissions_indirect',
      metric_name: 'Indirect Specific Emissions (Attr_Indir_Emiss)',
      metric_value: '0.30 tCO₂e/t',
      numeric_value: 0.30,
      unit: 'tCO₂e/t',
      confidence: 0.88,
      status: 'Needs Review',
      justification: 'Grid electricity emission factor applied for TR-MAR region. Awaiting auditor review.',
      pdf_source_url: steelSpace.pdf_source_url,
      highlight_coordinates: { page: 1, top: 452, left: 132, width: 160, height: 26 },
      vakh_property_id: 'vakh_prop_indir_emiss_03',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'fld_001_4',
      space_id: steelSpace.id,
      metric_key: 'carbon_price_paid',
      metric_name: 'Carbon Price Paid Abroad',
      metric_value: '0.00 EUR/t',
      numeric_value: 0.0,
      unit: 'EUR/t',
      confidence: 0.95,
      status: 'Verified',
      pdf_source_url: steelSpace.pdf_source_url,
      highlight_coordinates: { page: 1, top: 418, left: 420, width: 130, height: 24 },
      verified_by: 'E. Moreau (Lead CBAM Officer)',
      verified_at: new Date().toISOString(),
      vakh_property_id: 'vakh_prop_cprice_04',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  for (const m of steelMetrics) {
    await db.insertMetric(m);
  }

  // 2. German ArcelorMittal EPD Declaration
  const epdSpace: DbSpaceRecord = {
    id: 'spc_arcelor_epd_2026',
    vakh_board_id: 'brd_customs_declarations_q3',
    space_name: 'ArcelorMittal Bremen Environmental Declarations',
    board_name: 'Customs Evidence & Supplier Declarations Board',
    supplier_name: 'ArcelorMittal Bremen GmbH',
    supplier_country: 'DE',
    importer_name: 'Alpine Metal Works AG [AT83920192]',
    product_name: 'Galvanized cold-formed structural steel',
    cn_code: '7210 49 00',
    goods_category: 'Iron & Steel',
    document_type: 'EPD',
    installation_name: 'Bremen Smelting Unit #4',
    installation_country: 'DE',
    production_route: 'Blast Furnace - Basic Oxygen Furnace (BF-BOF)',
    traceability_percent: 92,
    overall_status: 'Needs Review',
    sha256_hash: '9f83ac127e5b021a8c3d4f5e6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b',
    pdf_source_url: 'https://vakh.com/assets/evidence/arcelormittal_epd_coil_2026.pdf',
    created_at: new Date('2026-10-01T14:10:00Z').toISOString(),
    updated_at: new Date().toISOString()
  };

  await db.upsertSpace(epdSpace);

  const epdMetrics: DbMetricRecord[] = [
    {
      id: 'fld_002_1',
      space_id: epdSpace.id,
      metric_key: 'net_mass',
      metric_name: 'Net Mass',
      metric_value: '450 t',
      numeric_value: 450,
      unit: 't',
      confidence: 0.99,
      status: 'Verified',
      pdf_source_url: epdSpace.pdf_source_url,
      highlight_coordinates: { page: 1, top: 382, left: 140, width: 140, height: 26 },
      verified_by: 'E. Moreau (Lead CBAM Officer)',
      verified_at: new Date().toISOString(),
      vakh_property_id: 'vakh_prop_epd_mass_01',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'fld_002_2',
      space_id: epdSpace.id,
      metric_key: 'emissions_direct',
      metric_name: 'Direct Specific Emissions (Attr_Dir_Emiss)',
      metric_value: '2.14 tCO₂e/t',
      numeric_value: 2.14,
      unit: 'tCO₂e/t',
      confidence: 0.96,
      status: 'Discrepancy',
      justification: 'Exceeds EU BF-BOF Benchmark (1.85 tCO₂e/t) by +15.7%. Certified by TÜV Rheinland.',
      pdf_source_url: epdSpace.pdf_source_url,
      highlight_coordinates: { page: 1, top: 418, left: 132, width: 160, height: 26 },
      vakh_property_id: 'vakh_prop_epd_dir_02',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  for (const m of epdMetrics) {
    await db.insertMetric(m);
  }

  console.log('✅ [CBAM-AuditTrace] Database successfully seeded with Vakh Data Spaces and exact coordinates.');
}

// Execute if run directly
if (typeof require !== 'undefined' && require.main === module) {
  runDatabaseSeed().catch(console.error);
}
