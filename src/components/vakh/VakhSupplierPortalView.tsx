import React, { useState } from 'react';
import type { CBAMDocument, ExtractedField, DocumentType } from '../../types/cbam';
import {
  Globe,
  Send,
  CheckCircle2,
  ExternalLink,
  Copy,
  Check,
  Sparkles,
  Building2,
  Factory,
  FileText,
  Calendar,
  Users,
  BookOpen,
  Search,
  ArrowRight,
  Share2,
  Clock,
  AlertCircle,
  HelpCircle,
  MessageSquare
} from 'lucide-react';

interface VakhSupplierPortalViewProps {
  onDocumentAdded: (newDoc: CBAMDocument) => void;
  onNavigateToDocument: (docId: string) => void;
}

export const VakhSupplierPortalView: React.FC<VakhSupplierPortalViewProps> = ({
  onDocumentAdded,
  onNavigateToDocument,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'form' | 'directory' | 'tracker' | 'community'>('form');
  const [copiedLink, setCopiedLink] = useState(false);
  const [submittedDocId, setSubmittedDocId] = useState<string | null>(null);

  // Form State for Vakh Supplier Self-Declaration Form
  const [supplierName, setSupplierName] = useState('Jindal Steel & Power Ltd.');
  const [country, setCountry] = useState('IN (India)');
  const [installationName, setInstallationName] = useState('Raigarh Integrated Steel Plant #4');
  const [productName, setProductName] = useState('Hot-rolled high-strength structural steel coils');
  const [cnCode, setCnCode] = useState('7208 39 00');
  const [goodsCategory, setGoodsCategory] = useState<'Iron & Steel' | 'Aluminium' | 'Cement' | 'Fertilizers'>('Iron & Steel');
  const [productionRoute, setProductionRoute] = useState('Direct Reduced Iron (DRI) + EAF');
  const [netMass, setNetMass] = useState('1250');
  const [directEmissions, setDirectEmissions] = useState('1.72');
  const [indirectEmissions, setIndirectEmissions] = useState('0.48');
  const [gridFactor, setGridFactor] = useState('0.713');
  const [electricitySource, setElectricitySource] = useState('Captive Solar PV (35%) + State Grid (65%)');
  const [verifierName, setVerifierName] = useState('TÜV SÜD South Asia Private Ltd.');
  const [verifierCertId, setVerifierCertId] = useState('TUV-IN-CBAM-2026-0849');
  const [notes, setNotes] = useState('Includes on-site solar PPA offset documentation and certified weighbridge receipts.');

  // Directory Search State
  const [directorySearch, setDirectorySearch] = useState('');
  const [directoryCountryFilter, setDirectoryCountryFilter] = useState('ALL');

  // Community State
  const [newCommunityTopic, setNewCommunityTopic] = useState('');
  const [communityPosts, setCommunityPosts] = useState([
    {
      id: 'post-1',
      author: 'Rajesh K. (Plant VP)',
      company: 'Tata Steel Tubes Division',
      location: 'Jamshedpur, India',
      time: '2 hours ago',
      title: 'How to calculate indirect electricity emissions when using captive rooftop solar?',
      content: 'Under Article 7 of the CBAM Implementing Act, can we deduct the solar generation directly from our installation specific consumption if the solar meter is certified by CEA?',
      answers: 4,
      hearts: 18,
      tag: 'Methodology'
    },
    {
      id: 'post-2',
      author: 'Mehmet Y. (Quality Auditor)',
      company: 'Erdemir Steelworks',
      location: 'Ereğli, Turkey',
      time: 'Yesterday',
      title: 'Accredited verifier list for Q2 2026 submissions in Vakh directory',
      content: 'Has anyone received validation from Türkak for the new 2026 ISO 14065 verification reports for EAF billets? Please share sample templates in the Vakh hub.',
      answers: 7,
      hearts: 29,
      tag: 'Accreditation'
    },
    {
      id: 'post-3',
      author: 'Sophie Becker',
      company: 'ThyssenKrupp Euro-Import S.A.',
      location: 'Duisburg, Germany',
      time: '3 days ago',
      title: 'EU Importer guidance: Default values vs. Actual supplier data',
      content: 'Reminder to all our Indian and Turkish suppliers: From 2026 onward, the EU Commission limits default value usage to a max of 20%. Please submit through this Vakh portal before the quarter cutoff!',
      answers: 12,
      hearts: 45,
      tag: 'EU Regulation'
    }
  ]);

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText('https://vakh.com/form/cbam-supplier-declaration?importer=DE94827103');
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handlePreFillPreset = (preset: 'india' | 'turkey') => {
    if (preset === 'india') {
      setSupplierName('Jindal Steel & Power Ltd.');
      setCountry('IN (India)');
      setInstallationName('Raigarh Integrated Steel Plant #4');
      setProductName('Hot-rolled high-strength structural steel coils');
      setCnCode('7208 39 00');
      setGoodsCategory('Iron & Steel');
      setProductionRoute('Direct Reduced Iron (DRI) + EAF');
      setNetMass('1250');
      setDirectEmissions('1.72');
      setIndirectEmissions('0.48');
      setGridFactor('0.713');
      setElectricitySource('Captive Solar PV (35%) + State Grid (65%)');
      setVerifierName('TÜV SÜD South Asia Private Ltd.');
      setVerifierCertId('TUV-IN-CBAM-2026-0849');
    } else {
      setSupplierName('Erdemir Ereğli Iron and Steel Works');
      setCountry('TR (Turkey)');
      setInstallationName('Zonguldak Heavy Rolling Complex');
      setProductName('Galvanized steel sheets');
      setCnCode('7210 49 00');
      setGoodsCategory('Iron & Steel');
      setProductionRoute('Blast Furnace - Basic Oxygen Furnace (BF-BOF)');
      setNetMass('850');
      setDirectEmissions('1.95');
      setIndirectEmissions('0.31');
      setGridFactor('0.460');
      setElectricitySource('Turkish National Transmission Grid TEİAŞ');
      setVerifierName('Bureau Veritas Turkey');
      setVerifierCertId('BV-TR-2026-CBAM-1102');
    }
  };

  // Submit from Vakh Form directly to App state
  const handleSubmitVakhForm = (e: React.FormEvent) => {
    e.preventDefault();

    const newDocId = `doc-vakh-${Date.now()}`;
    const netMassNum = parseFloat(netMass) || 1000;
    const directNum = parseFloat(directEmissions) || 1.7;
    const indirectNum = parseFloat(indirectEmissions) || 0.4;
    const totalSpecific = directNum + indirectNum;

    const extractedFields: ExtractedField[] = [
      {
        id: `f-${newDocId}-1`,
        fieldKey: 'supplier_name',
        label: 'Supplier Name',
        value: supplierName,
        status: 'human_confirmed',
        confidence: 0.99,
        boundingBox: { page: 1, x: 120, y: 140, width: 220, height: 20 },
        notes: `Supplier entity: ${supplierName}`,
        verifiedBy: 'Vakh Verified Digital Signature',
        verifiedAt: 'Just now'
      },
      {
        id: `f-${newDocId}-2`,
        fieldKey: 'net_mass',
        label: 'Net mass',
        value: `${netMassNum.toLocaleString()} t`,
        numericValue: netMassNum,
        unit: 't',
        status: 'human_confirmed',
        confidence: 0.98,
        boundingBox: { page: 1, x: 120, y: 180, width: 140, height: 20 },
        notes: `Net dispatch quantity: ${netMassNum} metric tonnes`,
        verifiedBy: 'Vakh Verified Digital Signature',
        verifiedAt: 'Just now'
      },
      {
        id: `f-${newDocId}-3`,
        fieldKey: 'cn_code',
        label: 'CN Code',
        value: cnCode,
        status: 'human_confirmed',
        confidence: 0.99,
        boundingBox: { page: 1, x: 120, y: 220, width: 140, height: 20 },
        notes: `Harmonised Commodity Code: ${cnCode}`,
        verifiedBy: 'Vakh Verified Digital Signature',
        verifiedAt: 'Just now'
      },
      {
        id: `f-${newDocId}-4`,
        fieldKey: 'emissions_direct',
        label: 'Specific direct emissions',
        value: `${directNum} tCO₂e/t`,
        numericValue: directNum,
        unit: 'tCO₂e/t',
        status: 'human_confirmed',
        confidence: 0.96,
        boundingBox: { page: 1, x: 120, y: 260, width: 160, height: 20 },
        notes: `Direct specific emissions: ${directNum} tCO2e/t`,
        verifiedBy: 'Vakh Verified Digital Signature',
        verifiedAt: 'Just now'
      },
      {
        id: `f-${newDocId}-5`,
        fieldKey: 'emissions_indirect',
        label: 'Specific indirect emissions',
        value: `${indirectNum} tCO₂e/t`,
        numericValue: indirectNum,
        unit: 'tCO₂e/t',
        status: 'human_confirmed',
        confidence: 0.95,
        boundingBox: { page: 1, x: 120, y: 300, width: 160, height: 20 },
        notes: `Indirect electricity specific emissions: ${indirectNum} tCO2e/t`,
        verifiedBy: 'Vakh Verified Digital Signature',
        verifiedAt: 'Just now'
      },
      {
        id: `f-${newDocId}-6`,
        fieldKey: 'emissions_total',
        label: 'Total specific emissions',
        value: `${totalSpecific.toFixed(2)} tCO₂e/t`,
        numericValue: totalSpecific,
        unit: 'tCO₂e/t',
        status: 'human_confirmed',
        confidence: 0.97,
        boundingBox: { page: 1, x: 120, y: 340, width: 160, height: 20 },
        notes: `Combined specific intensity: ${totalSpecific.toFixed(2)} tCO2e/t`,
        verifiedBy: 'Vakh Verified Digital Signature',
        verifiedAt: 'Just now'
      }
    ];

    const newDoc: CBAMDocument = {
      id: newDocId,
      filename: `vakh_decl_${supplierName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_q1.pdf`,
      fileSize: '1.4 MB',
      sha256: `vakh_${Math.random().toString(16).slice(2, 10)}${Math.random().toString(16).slice(2, 10)}9f8a7e6c`,
      supplier: supplierName,
      supplierCountry: country,
      importer: 'ThyssenKrupp Euro-Import S.A. [DE94827103]',
      productName,
      cnCode,
      goodsCategory,
      documentType: 'Emissions statement' as DocumentType,
      uploadedAt: 'Just now (via Vakh)',
      updatedAt: 'Just now',
      status: 'Verified',
      traceabilityPercent: 96,
      installationName,
      installationCountry: country.slice(0, 2),
      productionRoute,
      extractedFields
    };

    onDocumentAdded(newDoc);
    setSubmittedDocId(newDocId);
  };

  const directoryEntries = [
    {
      name: 'Tata Steel Kalinganagar Plant',
      country: 'IN (India)',
      code: 'IN',
      goods: 'Iron & Steel',
      tech: 'BF-BOF + Waste Heat Recovery',
      direct: '1.82 tCO₂e/t',
      grid: '0.710 tCO₂e/MWh',
      verifier: 'SGS India Pvt Ltd',
      status: 'Accredited'
    },
    {
      name: 'Jindal Steel & Power Raigarh',
      country: 'IN (India)',
      code: 'IN',
      goods: 'Iron & Steel',
      tech: 'Coal DRI + EAF + Captive Solar',
      direct: '1.72 tCO₂e/t',
      grid: '0.713 tCO₂e/MWh',
      verifier: 'TÜV SÜD South Asia',
      status: 'Accredited'
    },
    {
      name: 'Erdemir Ereğli Works',
      country: 'TR (Turkey)',
      code: 'TR',
      goods: 'Iron & Steel',
      tech: 'BF-BOF Integrated',
      direct: '1.95 tCO₂e/t',
      grid: '0.460 tCO₂e/MWh',
      verifier: 'Bureau Veritas Turkey',
      status: 'Accredited'
    },
    {
      name: 'Alba Aluminium Smelter Line 6',
      country: 'BH (Bahrain)',
      code: 'BH',
      goods: 'Aluminium',
      tech: 'Hall-Héroult Electrolysis + Gas Turbine',
      direct: '1.85 tCO₂e/t',
      grid: '0.520 tCO₂e/MWh',
      verifier: 'DNV GL Middle East',
      status: 'Accredited'
    },
    {
      name: 'POSCO Gwangyang Steelworks',
      country: 'KR (South Korea)',
      code: 'KR',
      goods: 'Iron & Steel',
      tech: 'FINEX + EAF Low Carbon',
      direct: '1.58 tCO₂e/t',
      grid: '0.450 tCO₂e/MWh',
      verifier: 'Korean Standards Association',
      status: 'Accredited'
    }
  ].filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(directorySearch.toLowerCase()) ||
      item.goods.toLowerCase().includes(directorySearch.toLowerCase()) ||
      item.tech.toLowerCase().includes(directorySearch.toLowerCase());
    const matchesCountry = directoryCountryFilter === 'ALL' || item.code === directoryCountryFilter;
    return matchesSearch && matchesCountry;
  });

  return (
    <div className="space-y-6">
      {/* 1. Craftora Hackathon & Vakh Hero Banner */}
      <div className="rounded-lg p-6 bg-gradient-to-r from-[#191c1e] via-[#243329] to-[#1c2c20] text-white border border-[#3b4c3e] shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#3d5a44] text-[#c5e8cc] text-[11px] font-semibold tracking-wide uppercase">
              <Sparkles className="w-3 h-3 text-[#a3e635]" />
              Craftora Hackathon · Build with Vakh Track (₹5,000 Prize)
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
              <span>CBAM Supplier Connect</span>
              <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-white/10 text-[#d2f3d8] border border-white/15">
                Built with Vakh
              </span>
            </h1>
            <p className="text-xs text-[#c0c7cb] leading-relaxed">
              Empowering overseas steel, aluminium, and fertilizer exporters to submit verified installation emissions directly to EU importers. Built using
              <strong className="text-white"> Vakh Forms, Trackers, Directories, and Community Spaces</strong> to solve real-world cross-border CBAM reporting bottlenecks.
            </p>
          </div>

          <div className="flex flex-wrap lg:flex-col items-stretch gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleCopyShareLink}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-[4px] bg-[#34d399] hover:bg-[#10b981] text-[#0d2a1b] font-semibold text-xs transition-colors shadow-xs"
            >
              {copiedLink ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
              <span>{copiedLink ? 'Link Copied!' : 'Copy Supplier Vakh Link'}</span>
            </button>

            <a
              href="https://vakh.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-[4px] bg-white/10 hover:bg-white/15 text-white text-xs font-medium border border-white/10 transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-[#a3e635]" />
              <span>Explore Vakh.com</span>
              <ExternalLink className="w-3 h-3 opacity-70" />
            </a>

            <a
              href="https://get.vakh.com/for/builders/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-[4px] bg-white/5 hover:bg-white/10 text-[#c5d3c8] text-xs font-medium transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Vakh Builders Guide</span>
            </a>
          </div>
        </div>

        {/* 4 Feature Sub-Tabs */}
        {/* 4 Feature Sub-Tabs */}
        <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveSubTab('form')}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${activeSubTab === 'form'
                ? 'bg-[var(--cyber-cyan)] text-black shadow-md font-bold'
                : 'text-[#c0c7cb] hover:text-white hover:bg-white/10'
              }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>1. Supplier Form (Vakh Forms)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('directory')}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${activeSubTab === 'directory'
                ? 'bg-[var(--cyber-cyan)] text-black shadow-md font-bold'
                : 'text-[#c0c7cb] hover:text-white hover:bg-white/10'
              }`}
          >
            <Factory className="w-3.5 h-3.5" />
            <span>2. Mill & Grid Directory (Vakh Hub)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('tracker')}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${activeSubTab === 'tracker'
                ? 'bg-[var(--cyber-cyan)] text-black shadow-md font-bold'
                : 'text-[#c0c7cb] hover:text-white hover:bg-white/10'
              }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>3. Quarterly Filing Tracker (Vakh Tracker)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('community')}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${activeSubTab === 'community'
                ? 'bg-[var(--cyber-cyan)] text-black shadow-md font-bold'
                : 'text-[#c0c7cb] hover:text-white hover:bg-white/10'
              }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>4. Exporter Community & Docs</span>
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: LIVE VAKH SUPPLIER FORM */}
      {activeSubTab === 'form' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form Left (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="glass-3d rounded-xl border border-[var(--border-subtle)] p-5 shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[var(--border-subtle)]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[var(--cyber-emerald)] animate-pulse" />
                    <h2 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wide">
                      Vakh Live Form: Non-EU Supplier CBAM Self-Declaration
                    </h2>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                    This form is dispatched via Vakh to overseas factory operators to report actual production route emissions.
                  </p>
                </div>


                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-[#5a6065]">Quick demo presets:</span>
                  <button
                    type="button"
                    onClick={() => handlePreFillPreset('india')}
                    className="px-2 py-1 rounded bg-[#f4f4f0] hover:bg-[#e8e8e2] text-xs font-medium text-[#2c3d31] border border-[#d8d8ce]"
                  >
                    🇮🇳 Indian Mill
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePreFillPreset('turkey')}
                    className="px-2 py-1 rounded bg-[#f4f4f0] hover:bg-[#e8e8e2] text-xs font-medium text-[#2c3d31] border border-[#d8d8ce]"
                  >
                    🇹🇷 Turkish Mill
                  </button>
                </div>
              </div>

              {submittedDocId && (
                <div className="mt-4 p-4 rounded-md bg-[#eaf4eb] border border-[#b6deb9] text-[#1b6830] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                    <div className="text-xs">
                      <div className="font-semibold">Successfully Synced into CBAM Audit Engine!</div>
                      <div>Document ID: <span className="font-mono">{submittedDocId}</span>. All extracted fields are fingerprinted.</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onNavigateToDocument(submittedDocId)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#1b6830] text-white text-xs font-medium hover:bg-[#155426]"
                  >
                    <span>View in Split Screen</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <form onSubmit={handleSubmitVakhForm} className="mt-4 space-y-4 text-xs">
                {/* Section A: Installation & Company */}
                <div className="p-3.5 rounded bg-[#fbfbfa] border border-[#ededeb] space-y-3">
                  <div className="font-semibold text-[#191c1e] text-[11px] uppercase tracking-wider text-[#3d5042] flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5" />
                    1. Supplier Facility & Declarant Metadata
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-[#5a6065] mb-1">Company / Entity Name</label>
                      <input
                        type="text"
                        value={supplierName}
                        onChange={(e) => setSupplierName(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded bg-white border border-[#d8d8ce] text-xs text-[#191c1e] focus:border-[#3d5042] focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-[#5a6065] mb-1">Country of Origin</label>
                      <input
                        type="text"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded bg-white border border-[#d8d8ce] text-xs text-[#191c1e] focus:border-[#3d5042] focus:outline-none"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-[#5a6065] mb-1">Installation Name & Plant Code</label>
                    <input
                      type="text"
                      value={installationName}
                      onChange={(e) => setInstallationName(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded bg-white border border-[#d8d8ce] text-xs text-[#191c1e] focus:border-[#3d5042] focus:outline-none"
                      required
                    />
                  </div>
                </div>

                {/* Section B: Goods & Production Route */}
                <div className="p-3.5 rounded bg-[#fbfbfa] border border-[#ededeb] space-y-3">
                  <div className="font-semibold text-[#191c1e] text-[11px] uppercase tracking-wider text-[#3d5042] flex items-center gap-1.5">
                    <Factory className="w-3.5 h-3.5" />
                    2. Product Classification & Production Route
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-[#5a6065] mb-1">Goods Category</label>
                      <select
                        value={goodsCategory}
                        onChange={(e) => setGoodsCategory(e.target.value as any)}
                        className="w-full px-2.5 py-1.5 rounded bg-white border border-[#d8d8ce] text-xs text-[#191c1e]"
                      >
                        <option value="Iron & Steel">Iron & Steel</option>
                        <option value="Aluminium">Aluminium</option>
                        <option value="Cement">Cement</option>
                        <option value="Fertilizers">Fertilizers</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-[#5a6065] mb-1">CN / HS Code (8-digit)</label>
                      <input
                        type="text"
                        value={cnCode}
                        onChange={(e) => setCnCode(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded bg-white border border-[#d8d8ce] text-xs font-mono text-[#191c1e]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-[#5a6065] mb-1">Net Mass (Tonnes)</label>
                      <input
                        type="number"
                        value={netMass}
                        onChange={(e) => setNetMass(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded bg-white border border-[#d8d8ce] text-xs font-mono text-[#191c1e]"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-[#5a6065] mb-1">Product Description</label>
                      <input
                        type="text"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded bg-white border border-[#d8d8ce] text-xs text-[#191c1e]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-[#5a6065] mb-1">Production Route Technology</label>
                      <input
                        type="text"
                        value={productionRoute}
                        onChange={(e) => setProductionRoute(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded bg-white border border-[#d8d8ce] text-xs text-[#191c1e]"
                      />
                    </div>
                  </div>
                </div>

                {/* Section C: Actual Specific Emissions */}
                <div className="p-3.5 rounded bg-[#fbfbfa] border border-[#ededeb] space-y-3">
                  <div className="font-semibold text-[#191c1e] text-[11px] uppercase tracking-wider text-[#3d5042] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#1b6830]" />
                    3. Direct & Indirect Emissions Parameters
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-[#5a6065] mb-1">
                        Specific Direct (tCO₂e/t)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={directEmissions}
                        onChange={(e) => setDirectEmissions(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded bg-white border border-[#d8d8ce] text-xs font-mono font-medium text-[#191c1e]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-[#5a6065] mb-1">
                        Specific Indirect (tCO₂e/t)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={indirectEmissions}
                        onChange={(e) => setIndirectEmissions(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded bg-white border border-[#d8d8ce] text-xs font-mono font-medium text-[#191c1e]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-[#5a6065] mb-1">
                        Grid Factor (tCO₂e/MWh)
                      </label>
                      <input
                        type="number"
                        step="0.001"
                        value={gridFactor}
                        onChange={(e) => setGridFactor(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded bg-white border border-[#d8d8ce] text-xs font-mono text-[#191c1e]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-[#5a6065] mb-1">Electricity Generation / Source</label>
                      <input
                        type="text"
                        value={electricitySource}
                        onChange={(e) => setElectricitySource(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded bg-white border border-[#d8d8ce] text-xs text-[#191c1e]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-[#5a6065] mb-1">Verifier & Certificate ID</label>
                      <input
                        type="text"
                        value={`${verifierName} (${verifierCertId})`}
                        onChange={(e) => setVerifierName(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded bg-white border border-[#d8d8ce] text-xs text-[#191c1e]"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="text-[11px] text-[#5a6065] flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#1b6830]" />
                    <span>Auto-generates SHA-256 cryptographic provenance hash upon submission.</span>
                  </div>

                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-[4px] bg-[#191c1e] hover:bg-[#2c3d31] text-white text-xs font-semibold shadow-xs transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit & Sync to CBAM Engine</span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Sidebar: Vakh Benefits & Real-World Solution */}
          <div className="space-y-4">
            {/* Real World Impact Card */}
            <div className="bg-white border border-[#e5e5de] rounded-lg p-5 shadow-2xs space-y-3">
              <h3 className="text-xs font-semibold text-[#191c1e] uppercase tracking-wide flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#3d5042]" />
                How Vakh Solves the Real Problem
              </h3>
              <p className="text-xs text-[#5a6065] leading-relaxed">
                European CBAM rules heavily penalize importers if foreign factories don’t disclose exact numbers, forcing default EU penalties.
              </p>
              <div className="space-y-2 pt-1 text-xs">
                <div className="flex items-start gap-2 p-2 rounded bg-[#f6f6f3] border border-[#e5e5de]">
                  <CheckCircle2 className="w-4 h-4 text-[#1b6830] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#191c1e]">Zero Software Install for Mills:</strong>
                    <div className="text-[11px] text-[#5a6065]">Suppliers simply open the Vakh web link to declare their blast furnace / EAF metrics.</div>
                  </div>
                </div>

                <div className="flex items-start gap-2 p-2 rounded bg-[#f6f6f3] border border-[#e5e5de]">
                  <CheckCircle2 className="w-4 h-4 text-[#1b6830] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#191c1e]">One-Click Sync into Audit Engine:</strong>
                    <div className="text-[11px] text-[#5a6065]">Submissions directly populate your calculation traces and legal XML exports.</div>
                  </div>
                </div>

                <div className="flex items-start gap-2 p-2 rounded bg-[#f6f6f3] border border-[#e5e5de]">
                  <CheckCircle2 className="w-4 h-4 text-[#1b6830] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#191c1e]">Cryptographic Fingerprinting:</strong>
                    <div className="text-[11px] text-[#5a6065]">Ensures EU customs auditors can verify no alterations were made to the supplier’s data.</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Share Widget */}
            <div className="bg-[#f0f4f1] border border-[#c8e6ce] rounded-lg p-4 text-xs space-y-2">
              <div className="font-semibold text-[#2c3d31] flex items-center gap-1.5">
                <Share2 className="w-3.5 h-3.5 text-[#1b6830]" />
                Share Vakh Form with Exporters
              </div>
              <div className="p-2 bg-white rounded border border-[#c8e6ce] text-[11px] font-mono text-[#5a6065] break-all select-all">
                https://vakh.com/form/cbam-supplier-declaration?importer=DE94827103
              </div>
              <button
                type="button"
                onClick={handleCopyShareLink}
                className="w-full py-1.5 rounded bg-[#2c3d31] hover:bg-[#1b271f] text-white text-xs font-medium transition-colors"
              >
                {copiedLink ? 'Copied to Clipboard!' : 'Copy Shareable Vakh URL'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: GLOBAL DIRECTORY & BENCHMARKS */}
      {activeSubTab === 'directory' && (
        <div className="space-y-4">
          <div className="bg-white border border-[#e5e5de] rounded-lg p-5 shadow-2xs">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#f0f0eb]">
              <div>
                <h2 className="text-sm font-semibold text-[#191c1e] tracking-tight flex items-center gap-2">
                  <Factory className="w-4 h-4 text-[#3d5042]" />
                  Global Installation & Grid Benchmark Directory (Vakh Hub)
                </h2>
                <p className="text-xs text-[#5a6065] mt-0.5">
                  Curated directory of certified manufacturing sites, verified verifiers, and EU transitional default grid emission factors.
                </p>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-[#848a90] absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    value={directorySearch}
                    onChange={(e) => setDirectorySearch(e.target.value)}
                    placeholder="Search plant, country, technology..."
                    className="pl-8 pr-3 py-1.5 rounded bg-[#fbfbfa] border border-[#d8d8ce] text-xs text-[#191c1e] w-64"
                  />
                </div>

                <select
                  value={directoryCountryFilter}
                  onChange={(e) => setDirectoryCountryFilter(e.target.value)}
                  className="px-2.5 py-1.5 rounded bg-[#fbfbfa] border border-[#d8d8ce] text-xs font-medium text-[#191c1e]"
                >
                  <option value="ALL">All Countries</option>
                  <option value="IN">India (IN)</option>
                  <option value="TR">Turkey (TR)</option>
                  <option value="KR">South Korea (KR)</option>
                  <option value="BH">Bahrain (BH)</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto mt-4">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#e5e5de] bg-[#fbfbfa] text-[#5a6065] text-[11px] uppercase tracking-wider font-semibold">
                    <th className="py-2.5 px-3">Installation & Facility</th>
                    <th className="py-2.5 px-3">Country</th>
                    <th className="py-2.5 px-3">Sector</th>
                    <th className="py-2.5 px-3">Process Route</th>
                    <th className="py-2.5 px-3">Direct Benchmark</th>
                    <th className="py-2.5 px-3">Grid Factor</th>
                    <th className="py-2.5 px-3">Accredited Verifier</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0f0eb]">
                  {directoryEntries.map((item, idx) => (
                    <tr key={idx} className="hover:bg-[#fcfcfa] transition-colors">
                      <td className="py-3 px-3 font-medium text-[#191c1e]">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-3.5 h-3.5 text-[#3d5042]" />
                          <span>{item.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-[#5a6065] font-mono">{item.country}</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded bg-[#f0f4f1] text-[#2c3d31] font-medium text-[11px]">
                          {item.goods}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-[#5a6065]">{item.tech}</td>
                      <td className="py-3 px-3 font-mono font-medium text-[#191c1e]">{item.direct}</td>
                      <td className="py-3 px-3 font-mono text-[#5a6065]">{item.grid}</td>
                      <td className="py-3 px-3 text-[#5a6065]">{item.verifier}</td>
                      <td className="py-3 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            setSupplierName(item.name);
                            setCountry(item.country);
                            setInstallationName(item.name);
                            setGoodsCategory(item.goods as any);
                            setProductionRoute(item.tech);
                            setActiveSubTab('form');
                          }}
                          className="px-2.5 py-1 rounded bg-[#191c1e] text-white text-[11px] font-medium hover:bg-[#2c3d31]"
                        >
                          Use in Form
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: QUARTERLY FILING TRACKER */}
      {activeSubTab === 'tracker' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white border border-[#e5e5de] p-4 rounded-lg shadow-2xs">
              <div className="text-[11px] font-semibold text-[#5a6065] uppercase">Total Mills Tracked</div>
              <div className="text-2xl font-bold text-[#191c1e] mt-1">18</div>
              <div className="text-[11px] text-[#1b6830] mt-1">Across 6 non-EU nations</div>
            </div>
            <div className="bg-white border border-[#e5e5de] p-4 rounded-lg shadow-2xs">
              <div className="text-[11px] font-semibold text-[#5a6065] uppercase">Synced via Vakh</div>
              <div className="text-2xl font-bold text-[#1b6830] mt-1">14</div>
              <div className="text-[11px] text-[#5a6065] mt-1">77% compliance rate</div>
            </div>
            <div className="bg-white border border-[#e5e5de] p-4 rounded-lg shadow-2xs">
              <div className="text-[11px] font-semibold text-[#5a6065] uppercase">Pending Declaration</div>
              <div className="text-2xl font-bold text-[#b45309] mt-1">3</div>
              <div className="text-[11px] text-[#b45309] mt-1">Reminders sent via Vakh</div>
            </div>
            <div className="bg-white border border-[#e5e5de] p-4 rounded-lg shadow-2xs">
              <div className="text-[11px] font-semibold text-[#5a6065] uppercase">Next Cut-Off Date</div>
              <div className="text-2xl font-bold text-[#191c1e] mt-1">April 30</div>
              <div className="text-[11px] text-[#5a6065] mt-1">Q1 Transitional Registry Deadline</div>
            </div>
          </div>

          <div className="bg-white border border-[#e5e5de] rounded-lg p-5 shadow-2xs">
            <h2 className="text-sm font-semibold text-[#191c1e] mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#b45309]" />
              Quarterly Overseas Supplier Compliance Status (Vakh Tracker)
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#e5e5de] bg-[#fbfbfa] text-[#5a6065] text-[11px] uppercase tracking-wider font-semibold">
                    <th className="py-2.5 px-3">Supplier Entity</th>
                    <th className="py-2.5 px-3">Origin</th>
                    <th className="py-2.5 px-3">Commodity Goods</th>
                    <th className="py-2.5 px-3">Target Quarter</th>
                    <th className="py-2.5 px-3">Vakh Workflow Status</th>
                    <th className="py-2.5 px-3">Last Submission</th>
                    <th className="py-2.5 px-3 text-right">Reminder Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0f0eb]">
                  <tr className="hover:bg-[#fcfcfa]">
                    <td className="py-3 px-3 font-medium text-[#191c1e]">Tata Steel Nederland BV</td>
                    <td className="py-3 px-3 text-[#5a6065]">NL / IN</td>
                    <td className="py-3 px-3">Hot-rolled steel plate</td>
                    <td className="py-3 px-3 font-mono">Q1 2026</td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#eaf4eb] text-[#1b6830]">
                        <CheckCircle2 className="w-3 h-3" /> Synced & Verified
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[#5a6065]">Today, 09:42 CET</td>
                    <td className="py-3 px-3 text-right">
                      <span className="text-[11px] text-[#5a6065]">Audit Ready</span>
                    </td>
                  </tr>

                  <tr className="hover:bg-[#fcfcfa]">
                    <td className="py-3 px-3 font-medium text-[#191c1e]">Jindal Steel & Power Ltd.</td>
                    <td className="py-3 px-3 text-[#5a6065]">IN (India)</td>
                    <td className="py-3 px-3">Structural steel coils</td>
                    <td className="py-3 px-3 font-mono">Q1 2026</td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#eaf4eb] text-[#1b6830]">
                        <CheckCircle2 className="w-3 h-3" /> Synced via Vakh
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[#5a6065]">Yesterday</td>
                    <td className="py-3 px-3 text-right">
                      <button
                        type="button"
                        onClick={handleCopyShareLink}
                        className="px-2 py-1 rounded bg-[#f4f4f0] hover:bg-[#e8e8e2] text-[11px] font-medium text-[#191c1e]"
                      >
                        Resend Link
                      </button>
                    </td>
                  </tr>

                  <tr className="hover:bg-[#fcfcfa]">
                    <td className="py-3 px-3 font-medium text-[#191c1e]">Alba Aluminium Bahrain</td>
                    <td className="py-3 px-3 text-[#5a6065]">BH (Bahrain)</td>
                    <td className="py-3 px-3">Primary aluminium ingots</td>
                    <td className="py-3 px-3 font-mono">Q1 2026</td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#fef3c7] text-[#92400e]">
                        <Clock className="w-3 h-3" /> Awaiting Mill Upload
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[#5a6065]">Pending</td>
                    <td className="py-3 px-3 text-right">
                      <button
                        type="button"
                        onClick={handleCopyShareLink}
                        className="px-2 py-1 rounded bg-[#b45309] text-white hover:bg-[#92400e] text-[11px] font-medium"
                      >
                        Send Vakh Ping
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: COMMUNITY & REGULATORY DOCS */}
      {activeSubTab === 'community' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white border border-[#e5e5de] rounded-lg p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#f0f0eb]">
                <div>
                  <h2 className="text-sm font-semibold text-[#191c1e] flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#2563eb]" />
                    CBAM Exporter Community Board (Powered by Vakh)
                  </h2>
                  <p className="text-xs text-[#5a6065] mt-0.5">
                    Peer-to-peer exchange between foreign plant engineers, EU declarants, and verifiers.
                  </p>
                </div>
              </div>

              {/* Community posts */}
              <div className="space-y-3">
                {communityPosts.map((post) => (
                  <div key={post.id} className="p-4 rounded-md bg-[#fbfbfa] border border-[#ededeb] space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-semibold text-[#191c1e]">{post.author}</span>
                        <span className="text-[#848a90]">·</span>
                        <span className="text-[#5a6065]">{post.company} ({post.location})</span>
                        <span className="text-[#848a90]">·</span>
                        <span className="text-[10px] text-[#848a90]">{post.time}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-[#e8effe] text-[#1e40af] text-[10px] font-medium">
                        {post.tag}
                      </span>
                    </div>

                    <h3 className="text-xs font-bold text-[#191c1e]">{post.title}</h3>
                    <p className="text-xs text-[#5a6065] leading-relaxed">{post.content}</p>

                    <div className="flex items-center gap-4 pt-2 text-[11px] text-[#5a6065]">
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5" />
                        {post.answers} Answers
                      </span>
                      <span className="flex items-center gap-1 text-[#b45309]">
                        ♥ {post.hearts} Helpful Votes
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add discussion */}
              <div className="pt-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCommunityTopic}
                    onChange={(e) => setNewCommunityTopic(e.target.value)}
                    placeholder="Ask a technical CBAM calculation question in Vakh Community..."
                    className="flex-1 px-3 py-2 rounded bg-[#fbfbfa] border border-[#d8d8ce] text-xs text-[#191c1e]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!newCommunityTopic) return;
                      setCommunityPosts([
                        {
                          id: `post-${Date.now()}`,
                          author: 'E. Moreau (Compliance Lead)',
                          company: 'ThyssenKrupp Euro-Import S.A.',
                          location: 'Germany',
                          time: 'Just now',
                          title: newCommunityTopic,
                          content: 'Looking for advice and verifier certifications on this methodology.',
                          answers: 0,
                          hearts: 1,
                          tag: 'Discussion'
                        },
                        ...communityPosts
                      ]);
                      setNewCommunityTopic('');
                    }}
                    className="px-4 py-2 rounded bg-[#191c1e] text-white text-xs font-semibold hover:bg-[#2c3d31]"
                  >
                    Post Query
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Reference Docs & Craftora Links */}
          <div className="space-y-4">
            <div className="bg-white border border-[#e5e5de] rounded-lg p-5 shadow-2xs space-y-3">
              <h3 className="text-xs font-semibold text-[#191c1e] uppercase tracking-wide flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#3d5042]" />
                Official Guidelines & Templates
              </h3>
              <div className="space-y-2 text-xs">
                <a
                  href="https://docs.google.com/document/d/1Pb_a-klsqh6uP1IsEjcnIGgFEo-n3CNmIP12j1brQdVk/edit?usp=sharing"
                  target="_blank"
                  rel="noreferrer"
                  className="block p-2.5 rounded bg-[#fbfbfa] hover:bg-[#f0f4f1] border border-[#e5e5de] transition-colors"
                >
                  <div className="font-semibold text-[#191c1e] flex items-center justify-between">
                    <span>Craftora Track Project Guide</span>
                    <ExternalLink className="w-3 h-3 text-[#5a6065]" />
                  </div>
                  <div className="text-[11px] text-[#5a6065] mt-0.5">Official prompt document from the contest organizers.</div>
                </a>

                <a
                  href="https://vakh.com"
                  target="_blank"
                  rel="noreferrer"
                  className="block p-2.5 rounded bg-[#fbfbfa] hover:bg-[#f0f4f1] border border-[#e5e5de] transition-colors"
                >
                  <div className="font-semibold text-[#191c1e] flex items-center justify-between">
                    <span>Vakh.com Platform Home</span>
                    <ExternalLink className="w-3 h-3 text-[#5a6065]" />
                  </div>
                  <div className="text-[11px] text-[#5a6065] mt-0.5">Explore public boards, forms, and custom workflows.</div>
                </a>

                <a
                  href="https://get.vakh.com/for/builders/"
                  target="_blank"
                  rel="noreferrer"
                  className="block p-2.5 rounded bg-[#fbfbfa] hover:bg-[#f0f4f1] border border-[#e5e5de] transition-colors"
                >
                  <div className="font-semibold text-[#191c1e] flex items-center justify-between">
                    <span>Vakh for Builders</span>
                    <ExternalLink className="w-3 h-3 text-[#5a6065]" />
                  </div>
                  <div className="text-[11px] text-[#5a6065] mt-0.5">Documentation for creating custom spaces and widgets.</div>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
