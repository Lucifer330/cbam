/**
 * CBAM-AuditTrace End-to-End Automated Integration Test Suite
 * Validates Vakh Engine Sync, Deterministic Evaluation, Bi-Directional State Patching & PDF Report Generation
 */

interface TestResult {
  name: string;
  passed: boolean;
  durationMs: number;
  details?: string;
  error?: string;
}

const CANDIDATE_PORTS = [5175, 5174, 5173, 3001, 3000];

async function resolveBaseUrl(): Promise<string> {
  if (process.env.TEST_BASE_URL) {
    return process.env.TEST_BASE_URL.replace(/\/$/, '');
  }

  for (const port of CANDIDATE_PORTS) {
    try {
      const url = `http://localhost:${port}/api/vakh/sync`;
      const res = await fetch(url, { signal: AbortSignal.timeout(1500) });
      if (res.status === 200) {
        console.log(`📡 [Test Runner] Discovered active backend server on port ${port}`);
        return `http://localhost:${port}`;
      }
    } catch {
      // try next
    }
  }

  return 'http://localhost:5175';
}

async function runTestSuite() {
  console.log('\n============================================================');
  console.log('🧪 CBAM-AuditTrace End-to-End Integration Test Runner');
  console.log('============================================================\n');

  const baseUrl = await resolveBaseUrl();
  console.log(`🎯 Target Base URL: ${baseUrl}\n`);

  const results: TestResult[] = [];

  // Helper assertion
  function assert(condition: boolean, message: string) {
    if (!condition) {
      throw new Error(`Assertion Failed: ${message}`);
    }
  }

  // --------------------------------------------------------------------------
  // TEST 1: Vakh Sync Endpoint
  // --------------------------------------------------------------------------
  {
    const start = Date.now();
    const testName = 'Test 1: Vakh Sync & Coordinate Integrity (GET /api/vakh/sync)';
    try {
      const res = await fetch(`${baseUrl}/api/vakh/sync`);
      assert(res.status === 200, `Expected HTTP 200, got ${res.status}`);

      const data = await res.json();
      assert(data.success === true, `Expected success === true, got ${data.success}`);
      assert(Array.isArray(data.spaces), 'Expected spaces array');
      assert(data.spaces.length > 0, 'Expected at least 1 registered space in Vakh Board');
      assert(typeof data.vakhBoardId === 'string', 'Expected valid vakhBoardId');

      results.push({
        name: testName,
        passed: true,
        durationMs: Date.now() - start,
        details: `Synced ${data.spaces.length} spaces from board '${data.vakhBoardId}'`
      });
    } catch (err: any) {
      results.push({
        name: testName,
        passed: false,
        durationMs: Date.now() - start,
        error: err.message
      });
    }
  }

  // --------------------------------------------------------------------------
  // TEST 2: Structured Metrics & Deterministic Mathematical Evaluation
  // --------------------------------------------------------------------------
  {
    const start = Date.now();
    const testName = 'Test 2: Deterministic Rule Engine Evaluation (GET /api/metrics/:spaceId)';
    try {
      const targetSpace = 'spc_craftora_cbam_2026';
      const res = await fetch(`${baseUrl}/api/metrics/${targetSpace}`);
      assert(res.status === 200, `Expected HTTP 200, got ${res.status}`);

      const data = await res.json();
      assert(data.success === true, `Expected success === true, got ${data.success}`);
      assert(Array.isArray(data.metrics) && data.metrics.length > 0, 'Expected metrics array with >0 items');

      const evaluation = data.evaluation;
      assert(evaluation !== undefined && evaluation !== null, 'Expected evaluation payload');
      assert(typeof evaluation.netMassTonnes === 'number', 'Expected numeric netMassTonnes');
      assert(typeof evaluation.directSpecificEmissions === 'number', 'Expected numeric directSpecificEmissions');
      assert(typeof evaluation.totalEmbeddedEmissions === 'number', 'Expected numeric totalEmbeddedEmissions');

      // Verify deterministic math: 1000t * (1.60 + 0.30) = 1900.00 tCO2e
      const expectedTotalEmissions = Number((evaluation.netMassTonnes * (evaluation.directSpecificEmissions + evaluation.indirectSpecificEmissions)).toFixed(2));
      assert(
        Math.abs(evaluation.totalEmbeddedEmissions - expectedTotalEmissions) < 0.01,
        `Deterministic calculation mismatch: expected ${expectedTotalEmissions}, got ${evaluation.totalEmbeddedEmissions}`
      );

      // Verify compliance rating reflects benchmark discrepancy when emissions > 0.35
      assert(
        evaluation.complianceRating.includes('GRADE C') || evaluation.complianceRating.includes('DISCREPANCY'),
        `Expected GRADE C discrepancy for emissions (${evaluation.directSpecificEmissions} > 0.35), got '${evaluation.complianceRating}'`
      );

      results.push({
        name: testName,
        passed: true,
        durationMs: Date.now() - start,
        details: `Rating: ${evaluation.complianceRating} | Embedded: ${evaluation.totalEmbeddedEmissions} tCO₂e | Formula: ${evaluation.formulaDisplay}`
      });
    } catch (err: any) {
      results.push({
        name: testName,
        passed: false,
        durationMs: Date.now() - start,
        error: err.message
      });
    }
  }

  // --------------------------------------------------------------------------
  // TEST 3: Bi-Directional Metric Patching (Real-Time Synchronous Update)
  // --------------------------------------------------------------------------
  {
    const start = Date.now();
    const testName = 'Test 3: Bi-Directional Field Patching (PATCH /api/metrics/:id)';
    try {
      const metricId = 'fld_001_1';
      const patchPayload = {
        status: 'Verified',
        justification: 'Manually verified by lead auditor via customs Bill of Lading.',
        verified_by: 'E. Moreau (Lead CBAM Officer)'
      };

      const res = await fetch(`${baseUrl}/api/metrics/${metricId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patchPayload)
      });

      assert(res.status === 200, `Expected HTTP 200, got ${res.status}`);

      const data = await res.json();
      assert(data.success === true, `Expected success === true, got ${data.success}`);
      assert(data.metric && data.metric.status === 'Verified', `Expected patched status to be 'Verified', got '${data.metric?.status}'`);
      assert(data.metric.justification === patchPayload.justification, 'Expected updated justification to persist');

      results.push({
        name: testName,
        passed: true,
        durationMs: Date.now() - start,
        details: `Field ${metricId} status patched to '${data.metric.status}' with timestamp '${data.vakhSyncTimestamp}'`
      });
    } catch (err: any) {
      results.push({
        name: testName,
        passed: false,
        durationMs: Date.now() - start,
        error: err.message
      });
    }
  }

  // --------------------------------------------------------------------------
  // TEST 4: Audit Certificate Compliance Report Generation
  // --------------------------------------------------------------------------
  {
    const start = Date.now();
    const testName = 'Test 4: Merkle Cryptographic Audit Report (POST /api/reports/generate)';
    try {
      const payload = {
        spaceId: 'spc_craftora_cbam_2026',
        complianceOfficer: 'E. Moreau (Senior Accredited Verifier)'
      };

      const res = await fetch(`${baseUrl}/api/reports/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      assert(res.status === 200, `Expected HTTP 200, got ${res.status}`);

      const data = await res.json();
      assert(data.success === true, `Expected success === true, got ${data.success}`);
      assert(typeof data.merkleRoot === 'string' && data.merkleRoot.startsWith('0x'), `Expected 0x hex Merkle Root, got '${data.merkleRoot}'`);
      assert(typeof data.certificateId === 'string', 'Expected generated certificateId');
      assert(Array.isArray(data.itemizedVerificationTable), 'Expected itemized verification breakdown');

      results.push({
        name: testName,
        passed: true,
        durationMs: Date.now() - start,
        details: `Certificate: ${data.certificateId} | Merkle Root: ${data.merkleRoot}`
      });
    } catch (err: any) {
      results.push({
        name: testName,
        passed: false,
        durationMs: Date.now() - start,
        error: err.message
      });
    }
  }

  // --------------------------------------------------------------------------
  // TEST 5: DB Reseed Handler
  // --------------------------------------------------------------------------
  {
    const start = Date.now();
    const testName = 'Test 5: Instant DB Reseed & State Reset (POST /api/seed)';
    try {
      const res = await fetch(`${baseUrl}/api/seed`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      assert(res.status === 200, `Expected HTTP 200, got ${res.status}`);

      const data = await res.json();
      assert(data.success === true, `Expected success === true, got ${data.success}`);

      // Verify reset state by re-querying metrics
      const verifyRes = await fetch(`${baseUrl}/api/metrics/spc_craftora_cbam_2026`);
      const verifyData = await verifyRes.json();
      assert(verifyData.success === true, 'Expected valid metrics after reseed');
      assert(verifyData.metrics.length >= 4, 'Expected default 4 metrics re-hydrated');

      results.push({
        name: testName,
        passed: true,
        durationMs: Date.now() - start,
        details: `Reseed verified with ${verifyData.metrics.length} clean default items`
      });
    } catch (err: any) {
      results.push({
        name: testName,
        passed: false,
        durationMs: Date.now() - start,
        error: err.message
      });
    }
  }

  // --------------------------------------------------------------------------
  // REPORT RESULTS
  // --------------------------------------------------------------------------
  console.log('------------------------------------------------------------');
  console.log('📊 TEST RESULTS SUMMARY');
  console.log('------------------------------------------------------------\n');

  let passedCount = 0;
  for (const r of results) {
    if (r.passed) {
      passedCount++;
      console.log(`✅ [PASS] ${r.name} (${r.durationMs}ms)`);
      if (r.details) console.log(`   └─ ${r.details}`);
    } else {
      console.log(`❌ [FAIL] ${r.name} (${r.durationMs}ms)`);
      if (r.error) console.log(`   └─ Error: ${r.error}`);
    }
  }

  console.log(`\n📈 Score: ${passedCount} / ${results.length} tests passed (${Math.round((passedCount / results.length) * 100)}%)\n`);

  if (passedCount !== results.length) {
    process.exit(1);
  }
}

runTestSuite().catch((err) => {
  console.error('💥 [Fatal Test Error]:', err);
  process.exit(1);
});
