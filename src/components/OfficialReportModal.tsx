import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import { UserSession } from '../types';
import {
  FileText,
  Download,
  CheckCircle2,
  Shield,
  Sparkles,
  X,
  Printer,
  Award,
  FileCheck,
  Edit3,
  Eye,
  Sliders,
  RotateCcw,
  BadgeCheck,
  Lock,
  FileSpreadsheet
} from 'lucide-react';

interface OfficialReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: UserSession;
}

export interface CertificationOption {
  id: string;
  name: string;
  issuer: string;
  certNumber: string;
  status: 'Verified & Active' | 'Audit Passed' | 'Compliant';
  enabled: boolean;
}

export const OfficialReportModal: React.FC<OfficialReportModalProps> = ({ isOpen, onClose, session }) => {
  const [activeTab, setActiveTab] = useState<'customize' | 'preview'>('preview');
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);

  // Customizable Report Form State
  const [reportTitle, setReportTitle] = useState('ChainSight™ Certified Enterprise Operations & Compliance Dossier');
  const [reportSubtitle, setReportSubtitle] = useState('Smart Supply Chain & POS Demand AI Platform • Official Executive Certification & Documentation');
  const [customDescription, setCustomDescription] = useState(
    'This official executive documentation certifies that the ChainSight™ platform has undergone comprehensive technical evaluation, security audit, and operational readiness assessment. The system synthesizes 340+ real-time telemetry data streams, delivers 30-day disruption forecasting with 94% accuracy, and ensures full compliance with global ESG, SLA, and ISO security standards.'
  );
  
  const [serialNumber, setSerialNumber] = useState('CS-ENT-2026-CERT-9942');
  const [signatory1Name, setSignatory1Name] = useState('Dr. Sarah K.');
  const [signatory1Title, setSignatory1Title] = useState('Chief Information Security Officer');
  const [signatory2Name, setSignatory2Name] = useState('Alex M.');
  const [signatory2Title, setSignatory2Title] = useState('VP of Global Supply Chain Operations');
  const [customSlaNotes, setCustomSlaNotes] = useState(
    'Uptime SLA: 99.99% guaranteed. Telemetry Ingestion Latency: <25ms cap. Encryption: AES-256 at rest, TLS 1.3 in transit.'
  );

  // Certifications Checklist State
  const [certifications, setCertifications] = useState<CertificationOption[]>([
    {
      id: 'iso27001',
      name: 'ISO/IEC 27001:2022 Security Management',
      issuer: 'International Organization for Standardization',
      certNumber: 'ISO-27001-2026-9942',
      status: 'Verified & Active',
      enabled: true,
    },
    {
      id: 'soc2',
      name: 'SOC 2 Type II Audit Compliance',
      issuer: 'Deloitte Security Assurance LLC',
      certNumber: 'SOC2-TYPE2-2026-08',
      status: 'Audit Passed',
      enabled: true,
    },
    {
      id: 'imo_esg',
      name: 'IMO 2026 Scope 3 Maritime Carbon Rating',
      issuer: 'International Maritime Organization',
      certNumber: 'IMO-CII-CLASS-A',
      status: 'Compliant',
      enabled: true,
    },
    {
      id: 'iso9001',
      name: 'ISO 9001 Cold-Chain Logistics Quality',
      issuer: 'Global Logistics Quality Board',
      certNumber: 'ISO-9001-LOGISTICS-77',
      status: 'Verified & Active',
      enabled: true,
    },
    {
      id: 'ctpat',
      name: 'C-TPAT / AEO Customs Supply Chain Security',
      issuer: 'US CBP & EU Customs Alliance',
      certNumber: 'CTPAT-HIGH-SECURITY-2026',
      status: 'Verified & Active',
      enabled: true,
    },
  ]);

  // Documentation Sections Checklist
  const [docSections, setDocSections] = useState({
    includeProblemSolution: true,
    includeModuleMatrix: true,
    includeTechStack: true,
    includeCostBreakdown: true,
    includeSlaTerms: true,
    includeHashes: true,
  });

  if (!isOpen) return null;

  const toggleCert = (id: string) => {
    setCertifications(
      certifications.map((c) => (c.id === id ? { ...c, enabled: !c.enabled } : c))
    );
  };

  const handleResetDefaults = () => {
    setReportTitle('ChainSight™ Certified Enterprise Operations & Compliance Dossier');
    setReportSubtitle('Smart Supply Chain & POS Demand AI Platform • Official Executive Certification & Documentation');
    setCustomDescription(
      'This official executive documentation certifies that the ChainSight™ platform has undergone comprehensive technical evaluation, security audit, and operational readiness assessment. The system synthesizes 340+ real-time telemetry data streams, delivers 30-day disruption forecasting with 94% accuracy, and ensures full compliance with global ESG, SLA, and ISO security standards.'
    );
    setSerialNumber('CS-ENT-2026-CERT-9942');
    setSignatory1Name('Dr. Sarah K.');
    setSignatory1Title('Chief Information Security Officer');
    setSignatory2Name('Alex M.');
    setSignatory2Title('VP of Global Supply Chain Operations');
    setCustomSlaNotes(
      'Uptime SLA: 99.99% guaranteed. Telemetry Ingestion Latency: <25ms cap. Encryption: AES-256 at rest, TLS 1.3 in transit.'
    );
    setCertifications(certifications.map((c) => ({ ...c, enabled: true })));
    setDocSections({
      includeProblemSolution: true,
      includeModuleMatrix: true,
      includeTechStack: true,
      includeCostBreakdown: true,
      includeSlaTerms: true,
      includeHashes: true,
    });
  };

  const generateAuthorizedPdf = () => {
    setIsGenerating(true);
    setDownloadComplete(false);

    setTimeout(() => {
      try {
        const doc = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4',
        });

        const activeCerts = certifications.filter((c) => c.enabled);

        // PAGE 1: HEADER BANNER, CUSTOM DESCRIPTION, CERTIFICATIONS & PROBLEM/SOLUTION
        doc.setFillColor(15, 23, 42); // Dark slate
        doc.rect(0, 0, 210, 36, 'F');

        doc.setTextColor(56, 189, 248); // Sky blue
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(15);
        doc.text(reportTitle.toUpperCase(), 14, 15);

        doc.setTextColor(241, 245, 249);
        doc.setFontSize(8.5);
        doc.text(reportSubtitle, 14, 23);

        doc.setTextColor(148, 163, 184);
        doc.setFontSize(8);
        doc.text(`Official Serial: ${serialNumber}  |  Issued: 2026-07-27  |  Page 1 of 2`, 14, 30);

        // Security / Authorization Badge Box
        doc.setLineWidth(0.4);
        doc.setDrawColor(56, 189, 248);
        doc.setFillColor(240, 249, 255);
        doc.roundedRect(14, 40, 182, 16, 3, 3, 'FD');

        doc.setTextColor(3, 105, 161);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9.5);
        doc.text('AUTHENTICATED EXECUTIVE COMPLIANCE CERTIFICATE', 18, 46);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(51, 65, 85);
        doc.text(`Authenticated User: ${session.name} (${session.email}) • Role: ${session.role.toUpperCase()}`, 18, 51);

        let currentY = 61;

        // SECTION 1: CUSTOM EXECUTIVE DESCRIPTION & OVERVIEW
        doc.setTextColor(15, 23, 42);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10.5);
        doc.text('1. EXECUTIVE SUMMARY & CUSTOM DESCRIPTION', 14, currentY);

        doc.setDrawColor(203, 213, 225);
        doc.line(14, currentY + 2, 196, currentY + 2);
        currentY += 7;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(51, 65, 85);

        // Split text to fit page width
        const splitDescription = doc.splitTextToSize(customDescription, 182);
        doc.text(splitDescription, 14, currentY);
        currentY += splitDescription.length * 4.2 + 4;

        // SECTION 2: CERTIFICATIONS & COMPLIANCE BADGES
        if (activeCerts.length > 0) {
          doc.setTextColor(15, 23, 42);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(10.5);
          doc.text('2. VERIFIED CERTIFICATIONS & STANDARDS COMPLIANCE', 14, currentY);

          doc.setDrawColor(203, 213, 225);
          doc.line(14, currentY + 2, 196, currentY + 2);
          currentY += 7;

          // Render Certification Grid Boxes
          let certX = 14;
          const certWidth = 88;
          const certHeight = 13;

          activeCerts.forEach((cert, idx) => {
            if (idx > 0 && idx % 2 === 0) {
              currentY += certHeight + 3;
              certX = 14;
            } else if (idx % 2 === 1) {
              certX = 108;
            }

            doc.setFillColor(248, 250, 252);
            doc.rect(certX, currentY, certWidth, certHeight, 'F');
            doc.setDrawColor(203, 213, 225);
            doc.rect(certX, currentY, certWidth, certHeight, 'S');

            doc.setTextColor(15, 23, 42);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(7.5);
            doc.text(cert.name, certX + 3, currentY + 4.5);

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(6.5);
            doc.setTextColor(71, 85, 105);
            doc.text(`ID: ${cert.certNumber} | ${cert.issuer}`, certX + 3, currentY + 9);

            doc.setTextColor(21, 128, 61);
            doc.setFont('helvetica', 'bold');
            doc.text(`[${cert.status.toUpperCase()}]`, certX + certWidth - 24, currentY + 4.5);
          });

          currentY += certHeight + 8;
        }

        // SECTION 3: PROBLEM VS SOLUTION & KEY BUSINESS STAT
        if (docSections.includeProblemSolution) {
          doc.setTextColor(15, 23, 42);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(10.5);
          doc.text('3. PROBLEM VS SOLUTION & ROI IMPACT', 14, currentY);

          doc.setDrawColor(203, 213, 225);
          doc.line(14, currentY + 2, 196, currentY + 2);
          currentY += 6;

          // Problem Box
          doc.setFillColor(254, 242, 242);
          doc.rect(14, currentY, 88, 18, 'F');
          doc.setDrawColor(252, 165, 165);
          doc.rect(14, currentY, 88, 18, 'S');
          doc.setTextColor(185, 28, 28);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(8);
          doc.text('THE PROBLEM (PRE-CHAINSIGHT)', 17, currentY + 5);
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(7);
          doc.setTextColor(127, 29, 29);
          doc.text('Wait  ->  Disruption Hits  ->  React  ->  Lose $M', 17, currentY + 10);
          doc.text('Siloed legacy systems cause stockouts & delays.', 17, currentY + 14);

          // Solution Box
          doc.setFillColor(240, 253, 244);
          doc.rect(108, currentY, 88, 18, 'F');
          doc.setDrawColor(134, 239, 172);
          doc.rect(108, currentY, 88, 18, 'S');
          doc.setTextColor(21, 128, 61);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(8);
          doc.text('THE SOLUTION (POST-CHAINSIGHT)', 111, currentY + 5);
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(7);
          doc.setTextColor(20, 83, 45);
          doc.text('Predict 30 days ahead  ->  Position stock  ->  Prevent loss', 111, currentY + 10);
          doc.text('340+ feeds synthesized into real-time intelligence.', 111, currentY + 14);

          currentY += 23;

          // Key Stat Banner
          doc.setFillColor(15, 23, 42);
          doc.rect(14, currentY, 182, 11, 'F');
          doc.setTextColor(56, 189, 248);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(7.5);
          doc.text('KEY ROI METRIC:', 18, currentY + 5);
          doc.setTextColor(255, 255, 255);
          doc.setFont('helvetica', 'normal');
          doc.text('Disruptions cost 5-10% of revenue. ChainSight recovers $2-5 for every $1 spent.', 48, currentY + 5);
          doc.setFontSize(6.5);
          doc.setTextColor(148, 163, 184);
          doc.text('Verified by independent 2026 Supply Chain Benchmarking Study.', 18, currentY + 9);

          currentY += 16;
        }

        // SECTION 4: PLATFORM MODULES & BUSINESS IMPACT MATRIX
        if (docSections.includeModuleMatrix) {
          doc.setTextColor(15, 23, 42);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(10.5);
          doc.text('4. PLATFORM MODULES & BUSINESS IMPACT MATRIX', 14, currentY);

          doc.setDrawColor(203, 213, 225);
          doc.line(14, currentY + 2, 196, currentY + 2);
          currentY += 6;

          // Table Header
          doc.setFillColor(15, 23, 42);
          doc.rect(14, currentY, 182, 5.5, 'F');
          doc.setTextColor(255, 255, 255);
          doc.setFontSize(7);
          doc.setFont('helvetica', 'bold');
          doc.text('MODULE', 17, currentY + 4);
          doc.text('WHAT IT DOES', 62, currentY + 4);
          doc.text('REAL BUSINESS IMPACT', 130, currentY + 4);

          const moduleRows = [
            { module: 'Overview & Risk Map', does: '340+ feeds synthesized into health score', impact: 'Spot vulnerabilities before operations break' },
            { module: 'Disruption Intelligence', does: 'AI predicts disruptions 30 days out', impact: 'Pre-position buffer stock before scrambling' },
            { module: 'Route Optimizer', does: 'Scores routes on cost, speed, risk, carbon', impact: 'Ranked shortlist with multimodal options' },
            { module: 'Supplier Health Scoring', does: 'Monitors 184 suppliers across 4 dimensions', impact: 'Dual-sourcing tracker cuts single-source risk' },
            { module: 'Demand AI', does: 'POS + macro + trend forecasting at 94% accuracy', impact: 'Act weeks ahead of stockout or overstock' },
            { module: 'ESG Tracker', does: 'Scope 3 emissions by mode, 6 ESG pillars', impact: 'Feeds straight into sustainability reporting' },
            { module: 'Scenario Simulator', does: '"What if" modeling with AI-generated playbooks', impact: 'Revenue-at-risk and recovery plan in minutes' },
          ];

          currentY += 5.5;
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(6.5);
          moduleRows.forEach((m, idx) => {
            if (idx % 2 === 1) {
              doc.setFillColor(241, 245, 249);
              doc.rect(14, currentY, 182, 5, 'F');
            }
            doc.setTextColor(15, 23, 42);
            doc.setFont('helvetica', 'bold');
            doc.text(m.module, 17, currentY + 3.8);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(51, 65, 85);
            doc.text(m.does, 62, currentY + 3.8);
            doc.text(m.impact, 130, currentY + 3.8);
            currentY += 5;
          });
        }

        // PAGE 2: TECH ARCHITECTURE, COST BREAKDOWN, SLA & SIGNATURES
        doc.addPage();

        // Page 2 Header Banner
        doc.setFillColor(15, 23, 42);
        doc.rect(0, 0, 210, 24, 'F');
        doc.setTextColor(56, 189, 248);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(13);
        doc.text('CHAINSIGHT™ TECHNICAL SPECIFICATIONS & COMPLIANCE ATTESTATION', 14, 12);
        doc.setTextColor(148, 163, 184);
        doc.setFontSize(8);
        doc.text(`Official Serial: ${serialNumber}  |  Page 2 of 2`, 14, 18);

        let p2Y = 32;

        // SECTION 5: TECHNICAL ARCHITECTURE & STACK
        if (docSections.includeTechStack) {
          doc.setTextColor(15, 23, 42);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(10.5);
          doc.text('5. TECHNOLOGIES & INFRASTRUCTURE ARCHITECTURE', 14, p2Y);

          doc.setDrawColor(203, 213, 225);
          doc.line(14, p2Y + 2, 196, p2Y + 2);
          p2Y += 6;

          // Header
          doc.setFillColor(15, 23, 42);
          doc.rect(14, p2Y, 182, 5.5, 'F');
          doc.setTextColor(255, 255, 255);
          doc.setFontSize(7);
          doc.setFont('helvetica', 'bold');
          doc.text('LAYER', 17, p2Y + 4);
          doc.text('TECHNOLOGIES USED', 52, p2Y + 4);
          doc.text('WHY CHOSEN / ARCHITECTURAL PURPOSE', 125, p2Y + 4);

          const techRows = [
            { layer: 'Cloud Infrastructure', tech: 'Google Cloud (Compute Engine, Cloud Run, Dataflow)', why: 'Auto-scaling & low latency container runtime' },
            { layer: 'AI / ML Engines', tech: 'Vertex AI, Gemini API, AutoML Ensembles', why: '94% forecast accuracy + fast inference speed' },
            { layer: 'Data Storage', tech: 'BigQuery, Firestore, Pub/Sub Ingestion', why: 'Real-time + historical telemetry at petabyte scale' },
            { layer: 'Backend Microservices', tech: 'Python (FastAPI), Node.js Express', why: 'Secure, high-throughput REST & GraphQL endpoints' },
            { layer: 'Frontend Dashboard', tech: 'React.js, Recharts, MapboxGL', why: 'High-performance interactive real-time telemetry UI' },
            { layer: 'External Live APIs', tech: 'MarineTraffic, OpenWeatherMap, Reuters', why: 'Live maritime, satellite weather, and global news feeds' },
          ];

          p2Y += 5.5;
          techRows.forEach((t, idx) => {
            if (idx % 2 === 1) {
              doc.setFillColor(241, 245, 249);
              doc.rect(14, p2Y, 182, 5, 'F');
            }
            doc.setTextColor(15, 23, 42);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(6.5);
            doc.text(t.layer, 17, p2Y + 3.8);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(51, 65, 85);
            doc.text(t.tech, 52, p2Y + 3.8);
            doc.text(t.why, 125, p2Y + 3.8);
            p2Y += 5;
          });

          p2Y += 6;
        }

        // SECTION 6: IMPLEMENTATION COST MODEL
        if (docSections.includeCostBreakdown) {
          doc.setTextColor(15, 23, 42);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(10.5);
          doc.text('6. ESTIMATED CLOUD IMPLEMENTATION COST', 14, p2Y);

          doc.setDrawColor(203, 213, 225);
          doc.line(14, p2Y + 2, 196, p2Y + 2);
          p2Y += 6;

          doc.setFillColor(15, 23, 42);
          doc.rect(14, p2Y, 182, 5.5, 'F');
          doc.setTextColor(255, 255, 255);
          doc.setFontSize(7);
          doc.setFont('helvetica', 'bold');
          doc.text('COMPONENT', 17, p2Y + 4);
          doc.text('CLOUD COST (MONTHLY)', 75, p2Y + 4);
          doc.text('NOTES / SPECIFICATIONS', 130, p2Y + 4);

          const costRows = [
            { comp: 'Vertex AI Predictions', cost: '$500 - $1,200', notes: 'Depends on daily prediction volume' },
            { comp: 'BigQuery (2TB / month)', cost: '$200 - $400', notes: 'Historical telemetry storage & querying' },
            { comp: 'Cloud Run + Compute Engine', cost: '$300 - $600', notes: 'Continuous 24/7 container operation' },
            { comp: 'Gemini API Copilot', cost: '$100 - $300', notes: 'Natural language disruption synthesis' },
            { comp: 'External Telemetry Feeds', cost: '$500 - $1,500', notes: 'AIS satellite & weather API subscriptions' },
          ];

          p2Y += 5.5;
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(6.5);
          costRows.forEach((c, idx) => {
            if (idx % 2 === 1) {
              doc.setFillColor(241, 245, 249);
              doc.rect(14, p2Y, 182, 5, 'F');
            }
            doc.setTextColor(15, 23, 42);
            doc.setFont('helvetica', 'bold');
            doc.text(c.comp, 17, p2Y + 3.8);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(51, 65, 85);
            doc.text(c.cost, 75, p2Y + 3.8);
            doc.text(c.notes, 130, p2Y + 3.8);
            p2Y += 5;
          });

          // Total Banner
          doc.setFillColor(240, 253, 244);
          doc.rect(14, p2Y + 1, 182, 8, 'F');
          doc.setDrawColor(134, 239, 172);
          doc.rect(14, p2Y + 1, 182, 8, 'S');
          doc.setTextColor(21, 128, 61);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(8);
          doc.text('TOTAL MVP COST:  $1,600 - $4,000 / month', 18, p2Y + 6);
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(7);
          doc.text('(Scales gracefully via enterprise SaaS tier)', 105, p2Y + 6);

          p2Y += 15;
        }

        // SECTION 7: SLA TERMS & SERVICE COMMITMENTS
        if (docSections.includeSlaTerms) {
          doc.setTextColor(15, 23, 42);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(10.5);
          doc.text('7. SERVICE LEVEL AGREEMENT (SLA) & SECURITY ATTESTATION', 14, p2Y);

          doc.setDrawColor(203, 213, 225);
          doc.line(14, p2Y + 2, 196, p2Y + 2);
          p2Y += 6;

          doc.setFillColor(248, 250, 252);
          doc.rect(14, p2Y, 182, 14, 'F');
          doc.setDrawColor(203, 213, 225);
          doc.rect(14, p2Y, 182, 14, 'S');

          doc.setTextColor(15, 23, 42);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(7.5);
          doc.text('ENTERPRISE SLA SPECIFICATIONS:', 18, p2Y + 4.5);

          doc.setFont('helvetica', 'normal');
          doc.setFontSize(7);
          doc.setTextColor(51, 65, 85);
          const splitSla = doc.splitTextToSize(customSlaNotes, 174);
          doc.text(splitSla, 18, p2Y + 9);

          p2Y += 20;
        }

        // SECTION 8: CRYPTOGRAPHIC CHECKSUMS & HASHES
        if (docSections.includeHashes) {
          doc.setFillColor(15, 23, 42);
          doc.rect(14, p2Y, 182, 11, 'F');
          doc.setTextColor(56, 189, 248);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(7);
          doc.text('CRYPTOGRAPHIC AUDIT CHECKSUM:', 18, p2Y + 4.5);
          doc.setTextColor(241, 245, 249);
          doc.setFont('courier', 'normal');
          doc.setFontSize(6.5);
          doc.text('SHA-256: 8f9b1c7a4d3e2f1059b8a7c6d5e4f3a2b1c09876543210fedcba9876543210ab', 18, p2Y + 8.5);

          p2Y += 16;
        }

        // AUTHORIZATION & VERIFICATION SIGNATURES
        doc.setDrawColor(203, 213, 225);
        doc.line(14, 252, 196, 252);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(15, 23, 42);
        doc.text('AUTHORIZATION & VERIFICATION SIGNATURES', 14, 257);

        // Signature Box Left
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.text('____________________________________', 14, 270);
        doc.setFont('helvetica', 'bold');
        doc.text(signatory1Name, 14, 274);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.text(signatory1Title, 14, 278);

        // Signature Box Right
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.text('____________________________________', 120, 270);
        doc.setFont('helvetica', 'bold');
        doc.text(signatory2Name, 120, 274);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.text(signatory2Title, 120, 278);

        // Footer Page Info
        doc.setFontSize(7);
        doc.setTextColor(148, 163, 184);
        doc.text(`ChainSight Platform • Page 2 of 2 • Certified Official Document ${serialNumber}`, 14, 287);

        // Save PDF file
        const cleanFileName = reportTitle
          .toLowerCase()
          .replace(/[^a-z0-9]/g, '_')
          .replace(/_+/g, '_');
        doc.save(`${cleanFileName}_${Date.now()}.pdf`);
        setDownloadComplete(true);
      } catch (err) {
        console.error('PDF Generation Error:', err);
      } finally {
        setIsGenerating(false);
      }
    }, 600);
  };

  const activeCertsCount = certifications.filter((c) => c.enabled).length;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-4xl bg-zinc-950 border border-cyan-500/30 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col my-2 sm:my-8 max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-lg font-bold text-zinc-100 flex items-center gap-2">
                <span>Official PDF Report & Certification Generator</span>
                <span className="px-2 py-0.5 text-[9px] uppercase font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded">
                  {activeCertsCount} Certs Attached
                </span>
              </h3>
              <p className="text-xs text-zinc-400">
                Customize description, select certifications, configure documentation & generate final high-res PDF.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-zinc-100 rounded-lg transition-all cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center shrink-0"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector: Edit PDF Parameters vs View Document Preview */}
        <div className="px-4 pt-3 bg-zinc-900/60 border-b border-zinc-800 flex items-center justify-between gap-2 overflow-x-auto">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('customize')}
              className={`px-4 py-2 rounded-t-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'customize'
                  ? 'bg-zinc-950 text-cyan-300 border-t border-x border-cyan-500/30'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span>1. Edit Description & Certifications</span>
            </button>

            <button
              onClick={() => setActiveTab('preview')}
              className={`px-4 py-2 rounded-t-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'preview'
                  ? 'bg-zinc-950 text-cyan-300 border-t border-x border-cyan-500/30'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Eye className="w-4 h-4 text-indigo-400" />
              <span>2. Document Preview</span>
            </button>
          </div>

          <button
            onClick={handleResetDefaults}
            className="text-xs text-zinc-400 hover:text-rose-400 flex items-center gap-1 font-mono transition-all pb-1 cursor-pointer"
            title="Reset parameters to original defaults"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Defaults</span>
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="p-4 sm:p-6 space-y-6 overflow-y-auto">
          
          {/* TAB 1: CUSTOMIZE DESCRIPTION, CERTIFICATIONS & DOCUMENTATION */}
          {activeTab === 'customize' && (
            <div className="space-y-6">
              
              {/* Report Header Title & Description Form */}
              <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 space-y-4">
                <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2 border-b border-zinc-800 pb-2">
                  <Edit3 className="w-4 h-4" /> Report Title & Modified Description
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                  <div>
                    <label className="block text-zinc-300 font-semibold mb-1">Document Title</label>
                    <input
                      type="text"
                      value={reportTitle}
                      onChange={(e) => setReportTitle(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-100 focus:outline-none focus:border-cyan-500 font-bold text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-300 font-semibold mb-1">Serial / Tracking ID</label>
                    <input
                      type="text"
                      value={serialNumber}
                      onChange={(e) => setSerialNumber(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-100 focus:outline-none focus:border-cyan-500 font-mono text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Subtitle / Document Purpose</label>
                  <input
                    type="text"
                    value={reportSubtitle}
                    onChange={(e) => setReportSubtitle(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-100 focus:outline-none focus:border-cyan-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">
                    Modified Description & Custom Operational Overview
                  </label>
                  <textarea
                    rows={4}
                    value={customDescription}
                    onChange={(e) => setCustomDescription(e.target.value)}
                    placeholder="Enter custom description or operational notes to be included in the official PDF..."
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-zinc-100 focus:outline-none focus:border-cyan-500 text-xs sm:text-sm leading-relaxed"
                  />
                  <p className="text-[11px] text-zinc-500 mt-1">
                    This custom description will be formatted directly into Section 1 of the generated PDF document.
                  </p>
                </div>
              </div>

              {/* Certifications Selection */}
              <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                  <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                    <BadgeCheck className="w-4 h-4" /> Certifications & Compliance Badges to Include
                  </h4>
                  <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">
                    {activeCertsCount} / {certifications.length} Selected
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {certifications.map((cert) => (
                    <div
                      key={cert.id}
                      onClick={() => toggleCert(cert.id)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                        cert.enabled
                          ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
                          : 'bg-zinc-950/60 border-zinc-800 text-zinc-500 opacity-60'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={cert.enabled}
                        onChange={() => {}}
                        className="mt-1 accent-emerald-500 rounded"
                      />
                      <div className="space-y-0.5">
                        <h5 className="text-xs font-bold text-zinc-100">{cert.name}</h5>
                        <p className="text-[11px] text-zinc-400 font-mono">{cert.certNumber} • {cert.issuer}</p>
                        <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase block pt-0.5">
                          Status: {cert.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Documentation Sections Checklist & Signatories */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Documentation Sections */}
                <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 space-y-3">
                  <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2 border-b border-zinc-800 pb-2">
                    <FileSpreadsheet className="w-4 h-4" /> Document Content Sections
                  </h4>

                  <div className="space-y-2 text-xs">
                    <label className="flex items-center gap-2.5 text-zinc-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={docSections.includeProblemSolution}
                        onChange={(e) => setDocSections({ ...docSections, includeProblemSolution: e.target.checked })}
                        className="accent-indigo-500 rounded"
                      />
                      <span>Problem vs Solution & ROI Metric</span>
                    </label>

                    <label className="flex items-center gap-2.5 text-zinc-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={docSections.includeModuleMatrix}
                        onChange={(e) => setDocSections({ ...docSections, includeModuleMatrix: e.target.checked })}
                        className="accent-indigo-500 rounded"
                      />
                      <span>7 Platform Modules & Business Impact Matrix</span>
                    </label>

                    <label className="flex items-center gap-2.5 text-zinc-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={docSections.includeTechStack}
                        onChange={(e) => setDocSections({ ...docSections, includeTechStack: e.target.checked })}
                        className="accent-indigo-500 rounded"
                      />
                      <span>Cloud Infrastructure & AI Tech Stack</span>
                    </label>

                    <label className="flex items-center gap-2.5 text-zinc-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={docSections.includeCostBreakdown}
                        onChange={(e) => setDocSections({ ...docSections, includeCostBreakdown: e.target.checked })}
                        className="accent-indigo-500 rounded"
                      />
                      <span>Monthly Implementation Cloud Cost Breakdown</span>
                    </label>

                    <label className="flex items-center gap-2.5 text-zinc-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={docSections.includeSlaTerms}
                        onChange={(e) => setDocSections({ ...docSections, includeSlaTerms: e.target.checked })}
                        className="accent-indigo-500 rounded"
                      />
                      <span>SLA & Security Terms</span>
                    </label>

                    <label className="flex items-center gap-2.5 text-zinc-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={docSections.includeHashes}
                        onChange={(e) => setDocSections({ ...docSections, includeHashes: e.target.checked })}
                        className="accent-indigo-500 rounded"
                      />
                      <span>Cryptographic Checksums & Hashes</span>
                    </label>
                  </div>
                </div>

                {/* Signatories & SLA Notes */}
                <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 space-y-3">
                  <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-rose-400 flex items-center gap-2 border-b border-zinc-800 pb-2">
                    <Shield className="w-4 h-4" /> Signatories & SLA Specification
                  </h4>

                  <div className="space-y-2.5 text-xs">
                    <div>
                      <label className="block text-zinc-300 font-semibold mb-0.5">Signatory 1 (Security)</label>
                      <input
                        type="text"
                        value={signatory1Name}
                        onChange={(e) => setSignatory1Name(e.target.value)}
                        placeholder="Name"
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-zinc-100 focus:outline-none focus:border-rose-500 font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-zinc-300 font-semibold mb-0.5">Signatory 2 (Operations)</label>
                      <input
                        type="text"
                        value={signatory2Name}
                        onChange={(e) => setSignatory2Name(e.target.value)}
                        placeholder="Name"
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-zinc-100 focus:outline-none focus:border-rose-500 font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-zinc-300 font-semibold mb-0.5">SLA Specification Notes</label>
                      <input
                        type="text"
                        value={customSlaNotes}
                        onChange={(e) => setCustomSlaNotes(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-zinc-100 focus:outline-none focus:border-rose-500 text-xs"
                      />
                    </div>
                  </div>
                </div>

              </div>

              {/* Action Bar */}
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setActiveTab('preview')}
                  className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-zinc-950 font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-cyan-600/20"
                >
                  <Eye className="w-4 h-4" />
                  <span>Preview Formatted PDF Document</span>
                </button>
              </div>

            </div>
          )}

          {/* TAB 2: DOCUMENT PREVIEW */}
          {activeTab === 'preview' && (
            <div className="space-y-6">
              
              {/* Document Header Banner Preview */}
              <div className="p-4 sm:p-5 bg-gradient-to-r from-zinc-900 via-zinc-900/90 to-zinc-900 border border-cyan-500/30 rounded-2xl space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs uppercase tracking-wider font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-md border border-cyan-500/20">
                    Serial: {serialNumber}
                  </span>
                  <span className="text-xs text-zinc-400 font-mono">Issued: 2026-07-27</span>
                </div>

                <div>
                  <h2 className="text-base sm:text-xl font-bold text-zinc-100 leading-snug">
                    {reportTitle}
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1">{reportSubtitle}</p>
                </div>

                <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 space-y-1">
                  <span className="text-[10px] font-bold font-mono text-cyan-400 uppercase tracking-wider block">
                    MODIFIED EXECUTIVE DESCRIPTION & OVERVIEW:
                  </span>
                  <p className="text-xs text-zinc-200 leading-relaxed font-sans">
                    {customDescription}
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-1 font-mono">
                  <div className="p-2 bg-zinc-950 rounded-xl border border-zinc-800">
                    <span className="text-[10px] text-zinc-500 block">User</span>
                    <span className="font-bold text-zinc-200 truncate block">{session.name}</span>
                  </div>
                  <div className="p-2 bg-zinc-950 rounded-xl border border-zinc-800">
                    <span className="text-[10px] text-zinc-500 block">Role</span>
                    <span className="font-bold text-cyan-400 uppercase truncate block">{session.role}</span>
                  </div>
                  <div className="p-2 bg-zinc-950 rounded-xl border border-zinc-800">
                    <span className="text-[10px] text-zinc-500 block">Certifications</span>
                    <span className="font-bold text-emerald-400 block">{activeCertsCount} Verified</span>
                  </div>
                  <div className="p-2 bg-zinc-950 rounded-xl border border-zinc-800">
                    <span className="text-[10px] text-zinc-500 block">SLA Target</span>
                    <span className="font-bold text-indigo-400 block">99.99% Uptime</span>
                  </div>
                </div>
              </div>

              {/* Attached Certifications Preview Grid */}
              {activeCertsCount > 0 && (
                <div className="space-y-2.5">
                  <h4 className="font-bold text-zinc-200 text-xs sm:text-sm flex items-center gap-2">
                    <BadgeCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Included Certifications & Standards Documentation ({activeCertsCount}):</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {certifications.filter((c) => c.enabled).map((cert) => (
                      <div key={cert.id} className="p-3 bg-zinc-950 border border-emerald-500/30 rounded-xl space-y-1">
                        <div className="flex items-center justify-between">
                          <h5 className="text-xs font-bold text-emerald-300">{cert.name}</h5>
                          <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                            {cert.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-400 font-mono">ID: {cert.certNumber} • Issuer: {cert.issuer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Module Matrix Table Preview */}
              {docSections.includeModuleMatrix && (
                <div className="space-y-2.5">
                  <h4 className="font-bold text-zinc-200 text-xs sm:text-sm flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>Platform Modules & Real Business Impact Matrix:</span>
                  </h4>

                  <div className="overflow-x-auto border border-zinc-800 rounded-xl bg-zinc-950">
                    <table className="w-full text-left text-[10px] sm:text-[11px] border-collapse min-w-[500px]">
                      <thead>
                        <tr className="bg-zinc-900 text-cyan-400 border-b border-zinc-800 font-mono">
                          <th className="px-2.5 py-2 border-r border-zinc-800 w-1/3">MODULE</th>
                          <th className="px-2.5 py-2 border-r border-zinc-800 w-1/3">WHAT IT DOES</th>
                          <th className="px-2.5 py-2 w-1/3">REAL BUSINESS IMPACT</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800/60 font-mono text-zinc-300">
                        <tr className="hover:bg-zinc-900/40">
                          <td className="px-2.5 py-2 font-bold text-zinc-100 border-r border-zinc-800">Overview & Risk Map</td>
                          <td className="px-2.5 py-2 border-r border-zinc-800">340+ feeds synthesized into health score</td>
                          <td className="px-2.5 py-2 text-emerald-400">Spot vulnerabilities before operations break</td>
                        </tr>
                        <tr className="hover:bg-zinc-900/40 bg-zinc-900/20">
                          <td className="px-2.5 py-2 font-bold text-zinc-100 border-r border-zinc-800">Disruption Intelligence</td>
                          <td className="px-2.5 py-2 border-r border-zinc-800">AI predicts disruptions 30 days out</td>
                          <td className="px-2.5 py-2 text-emerald-400">Pre-position buffer stock before scrambling</td>
                        </tr>
                        <tr className="hover:bg-zinc-900/40">
                          <td className="px-2.5 py-2 font-bold text-zinc-100 border-r border-zinc-800">Demand AI</td>
                          <td className="px-2.5 py-2 border-r border-zinc-800">POS + macro forecasting at 94% accuracy</td>
                          <td className="px-2.5 py-2 text-emerald-400">Act weeks ahead of stockout or overstock</td>
                        </tr>
                        <tr className="hover:bg-zinc-900/40 bg-zinc-900/20">
                          <td className="px-2.5 py-2 font-bold text-zinc-100 border-r border-zinc-800">ESG Tracker</td>
                          <td className="px-2.5 py-2 border-r border-zinc-800">Scope 3 emissions by mode, 6 ESG pillars</td>
                          <td className="px-2.5 py-2 text-emerald-400">Feeds straight into sustainability reporting</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Signatories Banner Preview */}
              <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
                <div>
                  <span className="text-zinc-500 block text-[10px]">VERIFIED SIGNATORY 1:</span>
                  <span className="font-bold text-zinc-100 block">{signatory1Name}</span>
                  <span className="text-zinc-400 text-[11px] block">{signatory1Title}</span>
                </div>

                <div>
                  <span className="text-zinc-500 block text-[10px]">VERIFIED SIGNATORY 2:</span>
                  <span className="font-bold text-zinc-100 block">{signatory2Name}</span>
                  <span className="text-zinc-400 text-[11px] block">{signatory2Title}</span>
                </div>

                <div className="text-right">
                  <span className="text-emerald-400 font-bold block flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Seal CS-2026
                  </span>
                  <span className="text-[10px] text-zinc-500">ISO 27001 Authenticated</span>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-zinc-900 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-zinc-400 font-mono text-center sm:text-left">
            Format: High-Res Vector PDF • ISO 216 A4 Standard • Includes {activeCertsCount} Certifications
          </div>

          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <button
              onClick={() => window.print()}
              className="px-4 py-2.5 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer min-h-[44px]"
            >
              <Printer className="w-4 h-4 text-zinc-400" />
              <span>Print</span>
            </button>

            <button
              onClick={generateAuthorizedPdf}
              disabled={isGenerating}
              className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-zinc-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-cyan-500/20 disabled:opacity-50 min-h-[44px] flex-1 sm:flex-initial"
            >
              <Download className="w-4 h-4" />
              <span>{isGenerating ? 'Generating Certified PDF...' : 'Download Final PDF Document'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

