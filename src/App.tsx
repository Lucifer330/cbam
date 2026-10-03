import React, { useState } from 'react';
import type { 
  CBAMDocument, 
  CalculationTrace, 
  AuditEvent, 
  RuleVersion 
} from './types/cbam';
import { 
  INITIAL_DOCUMENTS, 
  INITIAL_CALCULATIONS, 
  INITIAL_AUDIT_LOGS, 
  INITIAL_RULE_VERSIONS 
} from './data/mockData';
import { AppShell } from './components/common/AppShell';
import { OverviewView } from './components/overview/OverviewView';
import { DocumentSplitView } from './components/split/DocumentSplitView';
import { DocumentTable } from './components/document/DocumentTable';
import { HumanVerificationView } from './components/verification/HumanVerificationView';
import { CalculationView } from './components/calculation/CalculationView';
import { AuditTimeline } from './components/audit/AuditTimeline';
import { ExportPanel } from './components/export/ExportPanel';
import { SettingsPanel } from './components/settings/SettingsPanel';
import { DocumentUploadModal } from './components/document/DocumentUploadModal';
import { ProvenanceDrawer } from './components/common/ProvenanceDrawer';
import { VakhSupplierPortalView } from './components/vakh/VakhSupplierPortalView';

export function App() {
  const [documents, setDocuments] = useState<CBAMDocument[]>(INITIAL_DOCUMENTS);
  const [calculations, setCalculations] = useState<CalculationTrace[]>(INITIAL_CALCULATIONS);
  const [auditLogs, setAuditLogs] = useState<AuditEvent[]>(INITIAL_AUDIT_LOGS);
  const [ruleVersions, setRuleVersions] = useState<RuleVersion[]>(INITIAL_RULE_VERSIONS);
  const [activeRuleId, setActiveRuleId] = useState<string>('rule-2026-1');
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [selectedDocId, setSelectedDocId] = useState<string>('doc-001');
  const [focusedFieldKey, setFocusedFieldKey] = useState<string | null>(null);

  // Global Provenance Drawer state
  const [drawerTrace, setDrawerTrace] = useState<CalculationTrace | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Upload Modal state
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // Spline 3D Hero Scene URL provided by user
  const [splineUrl, setSplineUrl] = useState<string>(
    'https://prod.spline.design/rU-1iN643EB-IlsO/scene.splinecode'
  );

  const activeRule = ruleVersions.find((r) => r.id === activeRuleId) || ruleVersions[0];

  const awaitingCount = documents.filter((d) => d.status === 'Needs verification').length;

  // Add a new document from upload
  const handleDocumentAdded = (newDoc: CBAMDocument) => {
    setDocuments((prev) => [newDoc, ...prev]);
    setSelectedDocId(newDoc.id);

    // Add Audit Log
    const newAudit: AuditEvent = {
      id: `evt-${Date.now()}`,
      timestamp: 'Just now',
      actor: 'E. Moreau',
      actorRole: 'Lead CBAM Officer',
      action: 'Document uploaded & fingerprinted',
      category: 'UPLOAD',
      source: newDoc.filename,
      status: 'CONFIRMED',
      hash: `SHA256: ${newDoc.sha256}`,
      details: `Received ${newDoc.documentType} for ${newDoc.productName} (${newDoc.cnCode}). Generated SHA-256 fingerprint.`
    };
    setAuditLogs((prev) => [newAudit, ...prev]);

    // Go directly to split screen to verify proposed fields
    setActiveTab('split-view');
  };

  // Add document submitted via Vakh Supplier Portal
  const handleVakhDocumentAdded = (newDoc: CBAMDocument) => {
    setDocuments((prev) => [newDoc, ...prev]);
    setSelectedDocId(newDoc.id);

    const newAudit: AuditEvent = {
      id: `evt-${Date.now()}`,
      timestamp: 'Just now',
      actor: 'Vakh Supplier Connector',
      actorRole: 'Automated Ingestion Gatekeeper',
      action: 'Vakh Supplier Self-Declaration Ingested',
      category: 'UPLOAD',
      source: newDoc.filename,
      status: 'CONFIRMED',
      hash: `SHA256: ${newDoc.sha256}`,
      details: `Received verified supplier self-declaration from ${newDoc.supplier} (${newDoc.supplierCountry}) via Vakh Form. Fingerprinted with SHA-256.`
    };
    setAuditLogs((prev) => [newAudit, ...prev]);
  };

  // Confirm an extracted field
  const handleConfirmField = (documentId: string, fieldId: string) => {
    setDocuments((prev) =>
      prev.map((doc) => {
        if (doc.id !== documentId) return doc;
        const updatedFields = doc.extractedFields.map((f) => {
          if (f.id !== fieldId) return f;
          return {
            ...f,
            status: 'human_confirmed' as const,
            verifiedBy: 'E. Moreau (Lead CBAM Officer)',
            verifiedAt: 'Just now'
          };
        });

        const allConfirmed = updatedFields.every(
          (f) => f.status === 'human_confirmed' || f.status === 'edited'
        );

        return {
          ...doc,
          extractedFields: updatedFields,
          status: allConfirmed ? ('Verified' as const) : doc.status,
          traceabilityPercent: Math.min(100, doc.traceabilityPercent + 15),
          updatedAt: 'Just now'
        };
      })
    );

    // Audit log
    const doc = documents.find((d) => d.id === documentId);
    const field = doc?.extractedFields.find((f) => f.id === fieldId);
    if (doc && field) {
      const audit: AuditEvent = {
        id: `evt-${Date.now()}`,
        timestamp: 'Just now',
        actor: 'E. Moreau',
        actorRole: 'Lead CBAM Officer (Authorized Verifier)',
        action: 'Human verification completed',
        category: 'VERIFICATION',
        source: `${doc.filename} · ${field.label}`,
        status: 'CONFIRMED',
        hash: `SIG: 0x${Math.random().toString(16).slice(2, 10)}`,
        details: `Confirmed ${field.label} = ${field.value} against Page ${field.boundingBox.page} (x=${field.boundingBox.x}, y=${field.boundingBox.y}).`
      };
      setAuditLogs((prev) => [audit, ...prev]);
    }
  };

  // Edit an extracted field
  const handleEditField = (documentId: string, fieldId: string, newValue: string, notes: string) => {
    setDocuments((prev) =>
      prev.map((doc) => {
        if (doc.id !== documentId) return doc;
        const updatedFields = doc.extractedFields.map((f) => {
          if (f.id !== fieldId) return f;
          return {
            ...f,
            value: newValue,
            notes: notes || f.notes,
            status: 'edited' as const,
            verifiedBy: 'E. Moreau (Lead CBAM Officer)',
            verifiedAt: 'Just now'
          };
        });

        return {
          ...doc,
          extractedFields: updatedFields,
          updatedAt: 'Just now'
        };
      })
    );

    // Audit log
    const doc = documents.find((d) => d.id === documentId);
    const field = doc?.extractedFields.find((f) => f.id === fieldId);
    if (doc && field) {
      const audit: AuditEvent = {
        id: `evt-${Date.now()}`,
        timestamp: 'Just now',
        actor: 'E. Moreau',
        actorRole: 'Lead CBAM Officer',
        action: 'Human corrected field value',
        category: 'VERIFICATION',
        source: `${doc.filename} · ${field.label}`,
        status: 'CONFIRMED',
        hash: `SIG: 0x${Math.random().toString(16).slice(2, 10)}`,
        details: `Auditor adjusted ${field.label} to "${newValue}". Audit note: ${notes || 'Manual correction.'}`
      };
      setAuditLogs((prev) => [audit, ...prev]);
    }
  };

  // Reject a field
  const handleRejectField = (documentId: string, fieldId: string) => {
    setDocuments((prev) =>
      prev.map((doc) => {
        if (doc.id !== documentId) return doc;
        const updatedFields = doc.extractedFields.map((f) => {
          if (f.id !== fieldId) return f;
          return {
            ...f,
            status: 'rejected' as const,
            notes: 'Rejected by compliance gatekeeper as unverified/discrepant'
          };
        });
        return {
          ...doc,
          extractedFields: updatedFields,
          status: 'Flagged anomaly' as const
        };
      })
    );
  };

  // Run Deterministic Calculation Engine
  const handleRunCalculation = (documentId: string) => {
    const doc = documents.find((d) => d.id === documentId);
    if (!doc) return;

    const netMassField = doc.extractedFields.find((f) => f.fieldKey === 'net_mass');
    const directField = doc.extractedFields.find((f) => f.fieldKey === 'emissions_direct' || f.fieldKey === 'emissions_total');
    const indirectField = doc.extractedFields.find((f) => f.fieldKey === 'emissions_indirect');

    const netMassNum = netMassField?.numericValue || 1000;
    const directNum = directField?.numericValue || 1.6;
    const indirectNum = indirectField?.numericValue || 0.3;

    const totalSpecific = directNum + (indirectField ? indirectNum : 0);
    const totalEmbedded = netMassNum * totalSpecific;
    const directTotal = netMassNum * directNum;
    const indirectTotal = indirectField ? netMassNum * indirectNum : 0;

    const newTraceId = `calc-${Date.now()}`;
    const newTrace: CalculationTrace = {
      id: newTraceId,
      documentId: doc.id,
      documentName: doc.filename,
      documentHash: doc.sha256,
      resultValue: totalEmbedded,
      resultUnit: 'tCO₂e',
      resultLabel: 'Total Embedded Emissions',
      formula: `Net Mass (${netMassNum.toLocaleString()} t) × [Direct (${directNum}) + Indirect (${indirectNum})]`,
      formulaDisplay: `${netMassNum.toLocaleString()} t × ${totalSpecific.toFixed(2)} tCO₂e/t`,
      ruleVersion: activeRule.version,
      ruleName: activeRule.title,
      regulationReference: activeRule.regulationCode,
      directEmissionsTonnes: directTotal,
      indirectEmissionsTonnes: indirectTotal,
      carbonPriceDeductionEur: 0,
      timestamp: new Date().toLocaleTimeString('en-GB') + ' CET',
      complianceOfficer: 'E. Moreau (Lead CBAM Officer)',
      verifiedInputs: doc.extractedFields.map((f) => ({
        label: f.label,
        value: f.value,
        sourceFieldKey: f.fieldKey,
        verifiedBy: f.verifiedBy || 'E. Moreau (Lead CBAM Officer)',
        verifiedAt: f.verifiedAt || '09:44 CET',
        boundingBox: f.boundingBox
      }))
    };

    setCalculations((prev) => [newTrace, ...prev]);

    // Mark doc calculated
    setDocuments((prev) =>
      prev.map((d) => (d.id === documentId ? { ...d, status: 'Calculated' as const, traceabilityPercent: 100 } : d))
    );

    // Audit logs
    const audit1: AuditEvent = {
      id: `evt-${Date.now()}-1`,
      timestamp: 'Just now',
      actor: 'Deterministic Calculation Engine',
      actorRole: 'Rule Processor',
      action: 'Rule applied & locked',
      category: 'RULE_CHANGE',
      source: activeRule.version,
      status: 'SUCCESS',
      hash: `RULE-LOCK: ${activeRule.version}`,
      details: `Enforced deterministic rule ${activeRule.version} (${activeRule.regulationCode}).`
    };

    const audit2: AuditEvent = {
      id: `evt-${Date.now()}-2`,
      timestamp: 'Just now',
      actor: 'Deterministic Calculation Engine',
      actorRole: 'Rule Processor',
      action: 'Calculation generated',
      category: 'CALCULATION',
      source: doc.filename,
      status: 'SUCCESS',
      hash: `CALC-DIGEST: 0x${Math.random().toString(16).slice(2, 12)}`,
      details: `Calculated ${totalEmbedded.toLocaleString()} tCO₂e for ${doc.productName}. Zero AI mathematical interference.`
    };

    setAuditLogs((prev) => [audit2, audit1, ...prev]);

    // Jump to calculation view to view provenance
    setActiveTab('calculations');
  };

  // Global click-to-trace trigger
  const handleOpenTraceDrawer = (trace: CalculationTrace) => {
    setDrawerTrace(trace);
    setIsDrawerOpen(true);
  };

  // Jump from calculation or verification to Split Screen
  const handleInspectDocument = (docId: string, fieldKey?: string) => {
    setSelectedDocId(docId);
    setFocusedFieldKey(fieldKey || null);
    setActiveTab('split-view');
  };

  return (
    <AppShell
      activeTab={activeTab}
      onTabChange={(tab) => {
        setFocusedFieldKey(null);
        setActiveTab(tab);
      }}
      awaitingVerificationCount={awaitingCount}
      onOpenUpload={() => setIsUploadOpen(true)}
      activeRuleVersion={activeRule.version}
    >
      {/* 1. OVERVIEW / WORKSPACE */}
      {activeTab === 'overview' && (
        <OverviewView
          documents={documents}
          calculations={calculations}
          onNavigateTab={(tab) => setActiveTab(tab)}
          onSelectDocument={(doc) => {
            setSelectedDocId(doc.id);
            setActiveTab('split-view');
          }}
          onOpenUpload={() => setIsUploadOpen(true)}
          onTraceClick={handleOpenTraceDrawer}
          splineUrl={splineUrl}
          onUpdateSplineUrl={setSplineUrl}
        />
      )}

      {/* VAKH SUPPLIER PORTAL & RESOURCE HUB */}
      {activeTab === 'vakh-portal' && (
        <VakhSupplierPortalView
          onDocumentAdded={handleVakhDocumentAdded}
          onNavigateToDocument={(docId) => {
            setSelectedDocId(docId);
            setActiveTab('split-view');
          }}
        />
      )}

      {/* 2 & 3. SPLIT DOCUMENT + EXTRACTION VIEW */}
      {activeTab === 'split-view' && (
        <DocumentSplitView
          documents={documents}
          currentDocumentId={selectedDocId}
          onSelectDocumentId={setSelectedDocId}
          onBack={() => setActiveTab('overview')}
          onConfirmField={handleConfirmField}
          onEditField={handleEditField}
          onRejectField={handleRejectField}
          onRunCalculation={handleRunCalculation}
          initialFocusedFieldKey={focusedFieldKey}
        />
      )}

      {/* 4. DOCUMENT TABLE */}
      {activeTab === 'documents' && (
        <DocumentTable
          documents={documents}
          onSelectDocument={(doc) => {
            setSelectedDocId(doc.id);
            setActiveTab('split-view');
          }}
          onOpenUpload={() => setIsUploadOpen(true)}
          onViewProvenance={(docId) => {
            const trace = calculations.find((c) => c.documentId === docId);
            if (trace) {
              handleOpenTraceDrawer(trace);
            }
          }}
          onOpenVakhPortal={() => setActiveTab('vakh-portal')}
        />
      )}

      {/* 5. HUMAN VERIFICATION SCREEN */}
      {activeTab === 'verification' && (
        <HumanVerificationView
          documents={documents}
          onConfirmField={handleConfirmField}
          onEditField={handleEditField}
          onRejectField={handleRejectField}
          onOpenDocumentViewer={handleInspectDocument}
        />
      )}

      {/* 6. CALCULATION / TRACE VIEW */}
      {activeTab === 'calculations' && (
        <CalculationView
          calculations={calculations}
          onOpenDocumentViewer={handleInspectDocument}
        />
      )}

      {/* 7. AUDIT TRAIL */}
      {activeTab === 'audit' && (
        <AuditTimeline
          logs={auditLogs}
          onExportAudit={() => setActiveTab('exports')}
        />
      )}

      {/* 8. EXPORT SCREEN */}
      {activeTab === 'exports' && (
        <ExportPanel
          calculations={calculations}
          documents={documents}
        />
      )}

      {/* 9. SETTINGS */}
      {activeTab === 'settings' && (
        <SettingsPanel
          ruleVersions={ruleVersions}
          activeRuleId={activeRuleId}
          onSelectRuleVersion={setActiveRuleId}
          splineUrl={splineUrl}
          onUpdateSplineUrl={setSplineUrl}
        />
      )}

      {/* Global Document Upload Modal */}
      <DocumentUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onDocumentAdded={handleDocumentAdded}
        onOpenVakhPortal={() => setActiveTab('vakh-portal')}
      />

      {/* Signature Click-to-Trace Provenance Drawer */}
      <ProvenanceDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        trace={drawerTrace}
        onOpenDocument={handleInspectDocument}
      />
    </AppShell>
  );
}

export default App;
