import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import { UserSession, LiveDataFeed, AuditLogItem } from '../types';
import {
  Shield,
  Users,
  Radio,
  Clock,
  Activity,
  Wifi,
  UserPlus,
  Trash2,
  CheckCircle2,
  Paperclip,
  FileText,
  UploadCloud,
  Download,
  Eye,
  Search,
  Filter,
  FileCode,
  FileCheck,
  AlertCircle,
  X,
  FileSpreadsheet,
  Lock,
  Sparkles,
  ExternalLink,
  Plus
} from 'lucide-react';

export interface AdminAttachment {
  id: string;
  filename: string;
  category: 'SLA & Contracts' | 'Compliance & Audit' | 'Security Certificates' | 'System Configs' | 'Vendor Onboarding';
  fileSize: string;
  uploadedBy: string;
  uploadedAt: string;
  status: 'Verified' | 'Pending Review' | 'Archived';
  description: string;
  downloadsCount: number;
  hash: string;
  contentPreview?: string;
}

interface AdminConsoleProps {
  session: UserSession;
  dataFeeds: LiveDataFeed[];
  auditLogs: AuditLogItem[];
}

export const AdminConsole: React.FC<AdminConsoleProps> = ({ session, dataFeeds, auditLogs }) => {
  const [activeAdminSubTab, setActiveAdminSubTab] = useState<'attachments' | 'users' | 'audit'>('attachments');

  // User Accounts State
  const [usersList, setUsersList] = useState([
    { id: 'u1', name: 'Alex M.', email: 'lead@chainsight.io', role: 'procurement', title: 'Procurement Lead', status: 'Active' },
    { id: 'u2', name: 'Sarah K.', email: 'admin@chainsight.io', role: 'admin', title: 'Platform Administrator', status: 'Active' },
    { id: 'u3', name: 'Ravi D.', email: 'partner@acme.io', role: 'supplier', title: 'Partner: ACME Electronics', status: 'Active' },
  ]);

  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState<'procurement' | 'admin' | 'supplier'>('procurement');

  // Attachments State
  const [attachments, setAttachments] = useState<AdminAttachment[]>([
    {
      id: 'att-101',
      filename: 'ChainSight_Global_SLA_2026_v4.2.pdf',
      category: 'SLA & Contracts',
      fileSize: '3.4 MB',
      uploadedBy: 'Sarah K. (Admin)',
      uploadedAt: '2026-07-26 14:30',
      status: 'Verified',
      description: 'Master enterprise service level agreement specifying 99.99% uptime guarantee and 18ms latency SLA.',
      downloadsCount: 42,
      hash: 'sha256: 8f9b1c7a4d3e2f1059b8a7c6d5e4f3a2b1c09876543210fedcba9876543210ab',
      contentPreview: `CHAINSIGHT ENTERPRISE SLA (SERVICE LEVEL AGREEMENT) v4.2
Issue Date: July 2026
Target Uptime: 99.99%
Telemetry Latency Cap: 25ms max
Data Encryption: AES-256 at rest, TLS 1.3 in transit
Incident Escalation Response: Under 15 minutes for Critical Priority Disruptions.`
    },
    {
      id: 'att-102',
      filename: 'SOC2_Type_II_Compliance_Certificate.pdf',
      category: 'Compliance & Audit',
      fileSize: '1.8 MB',
      uploadedBy: 'Security Board',
      uploadedAt: '2026-07-22 09:15',
      status: 'Verified',
      description: 'Independent auditor certificate verifying SOC2 Type II compliance across cloud infrastructure and AI pipelines.',
      downloadsCount: 128,
      hash: 'sha256: 3a2b1c09876543210fedcba9876543210ab8f9b1c7a4d3e2f1059b8a7c6d5e4f',
      contentPreview: `AICPA SOC2 TYPE II CERTIFICATE OF AUDIT COMPLIANCE
Audit Firm: Deloitte Security Assurance LLC
Assessment Window: Jan 2026 - June 2026
Result: PASS - Unqualified Clean Opinion.
Controls Assessed: Security, Availability, Processing Integrity, Confidentiality, Privacy.`
    },
    {
      id: 'att-103',
      filename: 'ISO_27001_Information_Security_Seal.pdf',
      category: 'Security Certificates',
      fileSize: '2.1 MB',
      uploadedBy: 'Sarah K. (Admin)',
      uploadedAt: '2026-07-20 11:45',
      status: 'Verified',
      description: 'Official ISO/IEC 27001 certification for supply chain information security management systems.',
      downloadsCount: 95,
      hash: 'sha256: d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5',
      contentPreview: `ISO/IEC 27001:2022 CERTIFICATION
Certified Entity: ChainSight Enterprise Telemetry Ltd
Scope: Smart Supply Chain Telemetry, POS Data Ingestion, Vertex AI Prediction Pipeline.`
    },
    {
      id: 'att-104',
      filename: 'Vertex_AI_Model_Endpoints_Config.json',
      category: 'System Configs',
      fileSize: '124 KB',
      uploadedBy: 'Tech Lead',
      uploadedAt: '2026-07-25 18:20',
      status: 'Verified',
      description: 'System configuration schema for Vertex AI prediction models, AutoML ensembles, and POS stream hooks.',
      downloadsCount: 31,
      hash: 'sha256: e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2',
      contentPreview: `{
  "apiVersion": "v2.4",
  "aiEngine": "Vertex AI Ensemble",
  "models": [
    { "name": "DisruptionPredictor", "confidenceThreshold": 0.85 },
    { "name": "POSDemandForecaster", "lookaheadDays": 30 }
  ]
}`
    },
    {
      id: 'att-105',
      filename: 'Tier1_Supplier_Master_Agreement_ACME.pdf',
      category: 'Vendor Onboarding',
      fileSize: '4.6 MB',
      uploadedBy: 'Alex M.',
      uploadedAt: '2026-07-27 08:10',
      status: 'Pending Review',
      description: 'Master supply agreement and ethical sourcing declaration submitted by ACME Electronics.',
      downloadsCount: 12,
      hash: 'sha256: f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1',
      contentPreview: `TIER-1 SUPPLIER MASTER AGREEMENT
Supplier: ACME Electronics Corp
Dual-Sourcing Priority: Microprocessor & Circuit Component Assembly
Labor Rights Compliance: Verified 100% Non-Child Labor Declaration.`
    },
    {
      id: 'att-106',
      filename: 'Scope3_ESG_Reporting_Standard_2026.pdf',
      category: 'Compliance & Audit',
      fileSize: '5.2 MB',
      uploadedBy: 'ESG Auditor',
      uploadedAt: '2026-07-18 16:00',
      status: 'Verified',
      description: 'Global Scope 3 greenhouse gas calculation standards and maritime carbon indexing methodology.',
      downloadsCount: 67,
      hash: 'sha256: 7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b',
      contentPreview: `GLOBAL SCOPE 3 CARBON REPORTING STANDARD
Calculations based on IMO 2026 Maritime Carbon Intensity Indicator (CII).
Modes Covered: Ocean Freight, Air Cargo, Heavy Duty Road Transport, Rail Express.`
    },
  ]);

  // Attachment Filters & Form
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  // New Attachment Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<AdminAttachment['category']>('SLA & Contracts');
  const [newDescription, setNewDescription] = useState('');
  const [newFileName, setNewFileName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccessToast, setUploadSuccessToast] = useState(false);

  // Preview Modal State
  const [previewAttachment, setPreviewAttachment] = useState<AdminAttachment | null>(null);

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail || !newName) return;

    setUsersList([
      ...usersList,
      {
        id: `u-${Date.now()}`,
        name: newName,
        email: newEmail,
        role: newRole,
        title: newRole.toUpperCase() + ' User',
        status: 'Active',
      },
    ]);

    setNewEmail('');
    setNewName('');
  };

  const handleDeleteUser = (id: string) => {
    setUsersList(usersList.filter((u) => u.id !== id));
  };

  const handleUploadAttachment = (e: React.FormEvent) => {
    e.preventDefault();
    const finalFilename = newFileName.trim() || (newTitle.trim() ? `${newTitle.trim().replace(/\s+/g, '_')}.pdf` : 'Attachment_Doc.pdf');
    if (!finalFilename) return;

    setIsUploading(true);

    setTimeout(() => {
      const newAtt: AdminAttachment = {
        id: `att-${Date.now()}`,
        filename: finalFilename.endsWith('.pdf') || finalFilename.endsWith('.json') || finalFilename.endsWith('.pem') || finalFilename.endsWith('.xlsx') ? finalFilename : `${finalFilename}.pdf`,
        category: newCategory,
        fileSize: `${(Math.random() * 3 + 0.8).toFixed(1)} MB`,
        uploadedBy: `${session.name} (Admin)`,
        uploadedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
        status: 'Verified',
        description: newDescription || 'Additional admin portal attachment uploaded for governance and verification.',
        downloadsCount: 0,
        hash: `sha256: ${Math.random().toString(36).substring(2)}${Math.random().toString(36).substring(2)}${Math.random().toString(36).substring(2)}`,
        contentPreview: `OFFICIAL ADMIN PORTAL ATTACHMENT
Document: ${finalFilename}
Category: ${newCategory}
Uploaded By: ${session.name}
Description: ${newDescription || 'Additional governance attachment.'}
Security Status: Verified & Encrypted with SHA-256.`
      };

      setAttachments([newAtt, ...attachments]);
      setNewTitle('');
      setNewFileName('');
      setNewDescription('');
      setIsUploading(false);
      setUploadSuccessToast(true);

      setTimeout(() => setUploadSuccessToast(false), 4000);
    }, 800);
  };

  const handleToggleStatus = (id: string) => {
    setAttachments(attachments.map((att) => {
      if (att.id === id) {
        const nextStatus = att.status === 'Verified' ? 'Pending Review' : 'Verified';
        return { ...att, status: nextStatus };
      }
      return att;
    }));
  };

  const handleDeleteAttachment = (id: string) => {
    setAttachments(attachments.filter((att) => att.id !== id));
  };

  const handleDownloadAttachment = (att: AdminAttachment) => {
    if (att.filename.toLowerCase().endsWith('.pdf')) {
      // Generate a clean, official, valid binary PDF using jsPDF
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      // Dark slate banner header
      doc.setFillColor(15, 23, 42); // slate-900
      doc.rect(0, 0, 210, 36, 'F');

      // Header title & clean filename
      doc.setTextColor(56, 189, 248); // sky-400
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      const cleanTitle = att.filename.replace(/\.pdf$/i, '').replace(/_/g, ' ');
      doc.text(cleanTitle.toUpperCase(), 14, 15);

      doc.setTextColor(241, 245, 249);
      doc.setFontSize(8.5);
      doc.text('ChainSight™ Official Enterprise Compliance & Certification Document', 14, 23);

      doc.setTextColor(148, 163, 184);
      doc.setFontSize(8);
      doc.text(`Document Serial ID: ${att.id}  |  Category: ${att.category}  |  Issued: ${att.uploadedAt}`, 14, 30);

      // Verification Badge Container
      doc.setLineWidth(0.4);
      doc.setDrawColor(16, 185, 129); // emerald-500
      doc.setFillColor(240, 253, 244);
      doc.roundedRect(14, 40, 182, 16, 3, 3, 'FD');

      doc.setTextColor(21, 128, 61);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.text('OFFICIAL VERIFIED CERTIFICATE & ATTESTATION', 18, 46);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(51, 65, 85);
      doc.text(`Attested By: ${att.uploadedBy}  •  Status: ${att.status.toUpperCase()}  •  Security Hash Verified`, 18, 51);

      // Document Metadata Box
      doc.setFillColor(248, 250, 252);
      doc.rect(14, 61, 182, 30, 'F');
      doc.setDrawColor(203, 213, 225);
      doc.rect(14, 61, 182, 30, 'S');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(15, 23, 42);
      doc.text('ATTESTATION & SPECIFICATION METADATA:', 18, 67);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(51, 65, 85);
      doc.text(`File Name: ${att.filename}`, 18, 73);
      doc.text(`File Size: ${att.fileSize}`, 18, 78);
      doc.text(`Category: ${att.category}`, 18, 83);

      doc.text(`Uploaded By: ${att.uploadedBy}`, 108, 73);
      doc.text(`Verification Status: ${att.status}`, 108, 78);
      doc.text(`Total Downloads: ${att.downloadsCount + 1}`, 108, 83);

      // Description & Certification Statement Section
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(15, 23, 42);
      doc.text('OFFICIAL COMPLIANCE STATEMENT', 14, 98);

      doc.setDrawColor(203, 213, 225);
      doc.line(14, 100, 196, 100);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(51, 65, 85);

      const certStatement = att.description || 'This document certifies that the system has successfully completed all security audits, SLA requirements, and operational compliance evaluations in accordance with international standards.';
      const splitDesc = doc.splitTextToSize(certStatement, 182);
      doc.text(splitDesc, 14, 106);

      let nextY = 106 + (splitDesc.length * 4.5) + 6;

      // Content Preview Section if exists
      if (att.contentPreview) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9.5);
        doc.setTextColor(15, 23, 42);
        doc.text('AUDIT RECORD & ATTACHMENT DETAILS', 14, nextY);

        doc.setDrawColor(203, 213, 225);
        doc.line(14, nextY + 2, 196, nextY + 2);
        nextY += 7;

        doc.setFillColor(241, 245, 249);
        const splitPreview = doc.splitTextToSize(att.contentPreview, 174);
        const previewHeight = Math.max(18, splitPreview.length * 4 + 6);

        doc.rect(14, nextY, 182, previewHeight, 'F');
        doc.setDrawColor(203, 213, 225);
        doc.rect(14, nextY, 182, previewHeight, 'S');

        doc.setFont('courier', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(30, 41, 59);
        doc.text(splitPreview, 18, nextY + 5);

        nextY += previewHeight + 10;
      }

      // Cryptographic Hash Section
      doc.setFillColor(15, 23, 42);
      doc.rect(14, nextY, 182, 12, 'F');
      doc.setTextColor(56, 189, 248);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.text('CRYPTOGRAPHIC INTEGRITY CHECKSUM (SHA-256):', 18, nextY + 4.5);

      doc.setTextColor(241, 245, 249);
      doc.setFont('courier', 'normal');
      doc.setFontSize(6.5);
      doc.text(att.hash || 'sha256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', 18, nextY + 8.5);

      // Signatures Block
      doc.setDrawColor(203, 213, 225);
      doc.line(14, 250, 196, 250);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(15, 23, 42);
      doc.text('AUTHORIZATION & ATTESTATION SIGNATURES', 14, 256);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.text('____________________________________', 14, 269);
      doc.setFont('helvetica', 'bold');
      doc.text('Dr. Sarah K.', 14, 273);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.text('Chief Information Security Officer', 14, 277);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.text('____________________________________', 120, 269);
      doc.setFont('helvetica', 'bold');
      doc.text('Alex M.', 120, 273);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.text('VP of Global Supply Chain Operations', 120, 277);

      // Footer
      doc.setFontSize(7);
      doc.setTextColor(148, 163, 184);
      doc.text(`ChainSight Platform • Certified Official Document • ${att.filename}`, 14, 287);

      // Save PDF file
      doc.save(att.filename);
    } else {
      // Non-PDF files (e.g. JSON, PEM, XLSX)
      const element = document.createElement('a');
      const fileContent = att.contentPreview || `Document: ${att.filename}\nCategory: ${att.category}\nUploaded By: ${att.uploadedBy}\nUploaded At: ${att.uploadedAt}\nChecksum: ${att.hash}\nDescription: ${att.description}`;
      const mimeType = att.filename.endsWith('.json') ? 'application/json' : 'text/plain';
      const file = new Blob([fileContent], { type: mimeType });
      element.href = URL.createObjectURL(file);
      element.download = att.filename;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }

    // Increment downloads count
    setAttachments(attachments.map((a) => a.id === att.id ? { ...a, downloadsCount: a.downloadsCount + 1 } : a));
  };

  // Filter attachments
  const filteredAttachments = attachments.filter((att) => {
    const matchesCategory = selectedCategory === 'All' || att.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || att.status === selectedStatus;
    const matchesSearch = att.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          att.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          att.uploadedBy.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesStatus && matchesSearch;
  });

  const verifiedCount = attachments.filter((a) => a.status === 'Verified').length;
  const pendingCount = attachments.filter((a) => a.status === 'Pending Review').length;

  return (
    <div className="space-y-6">
      {/* Module Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-100 flex items-center gap-2">
            <Shield className="w-6 h-6 sm:w-7 sm:h-7 text-rose-400" />
            Admin Portal & Governance Console
          </h2>
          <p className="text-xs sm:text-sm text-zinc-300 mt-1">
            System control, admin attachments & document repository, user RBAC provisioning, and platform audit trail.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/30 px-3.5 py-2 rounded-xl">
          <Activity className="w-4 h-4 text-rose-400 animate-pulse" />
          <span className="text-xs sm:text-sm font-bold text-rose-300">Admin Session: {session.name}</span>
        </div>
      </div>

      {/* Admin Sub-navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveAdminSubTab('attachments')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeAdminSubTab === 'attachments'
              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-lg shadow-rose-500/10'
              : 'text-zinc-400 hover:text-zinc-200 bg-zinc-900/60'
          }`}
        >
          <Paperclip className="w-4 h-4 text-rose-400" />
          <span>Additional Attachments & Documents ({attachments.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminSubTab('users')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeAdminSubTab === 'users'
              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-lg shadow-rose-500/10'
              : 'text-zinc-400 hover:text-zinc-200 bg-zinc-900/60'
          }`}
        >
          <Users className="w-4 h-4 text-cyan-400" />
          <span>User Accounts & RBAC ({usersList.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminSubTab('audit')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeAdminSubTab === 'audit'
              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-lg shadow-rose-500/10'
              : 'text-zinc-400 hover:text-zinc-200 bg-zinc-900/60'
          }`}
        >
          <Clock className="w-4 h-4 text-emerald-400" />
          <span>Audit Logs ({auditLogs.length})</span>
        </button>
      </div>

      {/* Admin Key Performance Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Admin Portal Attachments</span>
            <Paperclip className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-zinc-100">{attachments.length} Files</div>
          <span className="text-xs text-emerald-400 block font-mono font-semibold">{verifiedCount} Verified • {pendingCount} Pending</span>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Active Platform Users</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-zinc-100">{usersList.length} Accounts</div>
          <span className="text-xs text-cyan-400 block font-mono font-semibold">RBAC Active & Synced</span>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Telemetry Feeds Up</span>
            <Wifi className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-zinc-100">340+ Streams</div>
          <span className="text-xs text-emerald-400 block font-mono font-semibold">100% Ingestion Uptime</span>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Security Rating</span>
            <Lock className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-indigo-300">ISO/SOC2 A+</div>
          <span className="text-xs text-indigo-400 block font-mono font-semibold">256-bit Encryption</span>
        </div>
      </div>

      {/* SUB-TAB 1: ADDITIONAL ATTACHMENTS & DOCUMENT REPOSITORY */}
      {activeAdminSubTab === 'attachments' && (
        <div className="space-y-6">
          {/* Upload Success Toast */}
          {uploadSuccessToast && (
            <div className="p-4 bg-emerald-950/80 border border-emerald-500/50 rounded-2xl flex items-center justify-between gap-3 text-emerald-200 text-xs sm:text-sm shadow-xl animate-fade-in">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span><strong>Attachment Successfully Added:</strong> New administrative document has been processed, encrypted, and attached to the repository.</span>
              </div>
              <button onClick={() => setUploadSuccessToast(false)} className="text-emerald-400 hover:text-emerald-200">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Main Grid: Upload Attachment Form (Left) & Attachments List (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Upload Attachment Panel */}
            <div className="lg:col-span-4 bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 sm:p-6 space-y-4">
              <div className="pb-3 border-b border-zinc-800 flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-100 flex items-center gap-2">
                  <UploadCloud className="w-4 h-4 text-rose-400" /> Attach New File
                </h3>
                <span className="text-xs font-mono text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                  Admin Level
                </span>
              </div>

              <form onSubmit={handleUploadAttachment} className="space-y-3.5 text-xs sm:text-sm">
                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Document Title / Filename</label>
                  <input
                    type="text"
                    required
                    value={newFileName}
                    onChange={(e) => setNewFileName(e.target.value)}
                    placeholder="e.g. Audit_Compliance_Report_Q3.pdf"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-100 focus:outline-none focus:border-rose-500 font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Attachment Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-100 focus:outline-none focus:border-rose-500 font-medium text-xs"
                  >
                    <option value="SLA & Contracts">SLA & Contracts</option>
                    <option value="Compliance & Audit">Compliance & Audit</option>
                    <option value="Security Certificates">Security Certificates</option>
                    <option value="System Configs">System Configs</option>
                    <option value="Vendor Onboarding">Vendor Onboarding</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-300 font-semibold mb-1">Short Description / Purpose</label>
                  <textarea
                    rows={3}
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="Provide context or instructions regarding this administrative attachment..."
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-100 focus:outline-none focus:border-rose-500 text-xs"
                  />
                </div>

                {/* Simulated File Selector Drop Zone */}
                <div className="border-2 border-dashed border-zinc-800 hover:border-rose-500/50 bg-zinc-950/60 p-4 rounded-xl text-center space-y-1 transition-all cursor-pointer">
                  <Paperclip className="w-6 h-6 text-zinc-500 mx-auto" />
                  <p className="text-xs text-zinc-300 font-medium">Click or Drag & Drop Attachment Here</p>
                  <p className="text-[10px] text-zinc-500">Supports PDF, JSON, PEM, XLSX up to 50MB</p>
                </div>

                <button
                  type="submit"
                  disabled={isUploading}
                  className="w-full py-3 bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-rose-600/20 disabled:opacity-50 mt-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isUploading ? 'Processing Attachment...' : 'Add Attachment to Portal'}</span>
                </button>
              </form>
            </div>

            {/* Attachments List Container */}
            <div className="lg:col-span-8 bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 sm:p-6 space-y-4">
              
              {/* Top Controls: Search Bar & Filters */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search attachments by filename or keyword..."
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-rose-500 font-mono"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 rounded-xl px-3 py-2 focus:outline-none focus:border-rose-500 font-medium"
                  >
                    <option value="All">All Categories</option>
                    <option value="SLA & Contracts">SLA & Contracts</option>
                    <option value="Compliance & Audit">Compliance & Audit</option>
                    <option value="Security Certificates">Security Certificates</option>
                    <option value="System Configs">System Configs</option>
                    <option value="Vendor Onboarding">Vendor Onboarding</option>
                  </select>

                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 rounded-xl px-3 py-2 focus:outline-none focus:border-rose-500 font-medium"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Verified">Verified Only</option>
                    <option value="Pending Review">Pending Review</option>
                  </select>
                </div>
              </div>

              {/* Category Quick Filter Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {['All', 'SLA & Contracts', 'Compliance & Audit', 'Security Certificates', 'System Configs', 'Vendor Onboarding'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold'
                        : 'bg-zinc-950 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Attachment Cards Grid */}
              <div className="space-y-3">
                {filteredAttachments.length === 0 ? (
                  <div className="p-8 text-center bg-zinc-950 border border-zinc-800 rounded-xl space-y-2">
                    <AlertCircle className="w-8 h-8 text-zinc-500 mx-auto" />
                    <p className="text-sm text-zinc-300 font-bold">No attachments found matching your query</p>
                    <p className="text-xs text-zinc-500">Try adjusting your category filter or search keywords.</p>
                  </div>
                ) : (
                  filteredAttachments.map((att) => (
                    <div
                      key={att.id}
                      className="p-4 bg-zinc-950 border border-zinc-800 hover:border-zinc-700 rounded-xl transition-all space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0 mt-0.5">
                            {att.filename.endsWith('.json') ? (
                              <FileCode className="w-5 h-5 text-indigo-400" />
                            ) : att.filename.endsWith('.pem') ? (
                              <Lock className="w-5 h-5 text-amber-400" />
                            ) : (
                              <FileText className="w-5 h-5 text-rose-400" />
                            )}
                          </div>

                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <h4 className="text-sm font-bold text-zinc-100 font-mono truncate max-w-xs sm:max-w-md">
                                {att.filename}
                              </h4>
                              <span
                                onClick={() => handleToggleStatus(att.id)}
                                title="Click to toggle verification status"
                                className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded cursor-pointer transition-all ${
                                  att.status === 'Verified'
                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                }`}
                              >
                                {att.status}
                              </span>
                              <span className="text-[10px] font-mono bg-zinc-900 text-zinc-400 px-2 py-0.5 rounded border border-zinc-800">
                                {att.category}
                              </span>
                            </div>

                            <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
                              {att.description}
                            </p>

                            <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-zinc-400 mt-2">
                              <span>Size: <strong className="text-zinc-200">{att.fileSize}</strong></span>
                              <span>•</span>
                              <span>By: <strong className="text-cyan-400">{att.uploadedBy}</strong></span>
                              <span>•</span>
                              <span>Date: {att.uploadedAt}</span>
                              <span>•</span>
                              <span>Downloads: <strong className="text-emerald-400">{att.downloadsCount}</strong></span>
                            </div>
                          </div>
                        </div>

                        {/* File Actions */}
                        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                          <button
                            onClick={() => setPreviewAttachment(att)}
                            className="p-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-cyan-400 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
                            title="Preview Attachment Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Preview</span>
                          </button>

                          <button
                            onClick={() => handleDownloadAttachment(att)}
                            className="p-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-emerald-400 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
                            title="Download File"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Download</span>
                          </button>

                          <button
                            onClick={() => handleDeleteAttachment(att.id)}
                            className="p-2 bg-zinc-900 hover:bg-rose-500/20 border border-zinc-800 hover:border-rose-500/40 text-zinc-500 hover:text-rose-400 rounded-lg transition-all cursor-pointer"
                            title="Delete Attachment"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

            </div>

          </div>
        </div>
      )}

      {/* SUB-TAB 2: USER ACCOUNTS & RBAC */}
      {activeAdminSubTab === 'users' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* User Accounts Table */}
          <div className="lg:col-span-8 bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-200 pb-2 border-b border-zinc-800">
              Platform Workspace Accounts ({usersList.length})
            </h3>

            <div className="space-y-3">
              {usersList.map((u) => (
                <div
                  key={u.id}
                  className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl flex items-center justify-between gap-4 text-xs sm:text-sm"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-zinc-100 text-base">{u.name}</h4>
                      <span className={`text-xs font-mono font-bold uppercase px-2.5 py-0.5 rounded ${
                        u.role === 'admin' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : u.role === 'procurement' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}>
                        {u.role}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-300 font-mono">{u.email} • {u.title}</p>
                  </div>

                  <button
                    onClick={() => handleDeleteUser(u.id)}
                    className="p-2.5 text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all cursor-pointer"
                    title="Remove User"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Add User Panel */}
          <div className="lg:col-span-4 bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-200 pb-2 border-b border-zinc-800 flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-rose-400" /> Provision Account
            </h3>

            <form onSubmit={handleAddUser} className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Priyan S."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-100 focus:outline-none focus:border-rose-500 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="user@chainsight.io"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-100 focus:outline-none focus:border-rose-500 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-semibold mb-1">Assigned Role</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as any)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-100 focus:outline-none focus:border-rose-500 font-medium text-xs"
                >
                  <option value="procurement">Procurement Lead</option>
                  <option value="supplier">Supplier Partner</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-rose-600/20 mt-2"
              >
                <span>Add Account</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: SYSTEM AUDIT TRAIL STREAM */}
      {activeAdminSubTab === 'audit' && (
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-200 flex items-center gap-2 pb-2 border-b border-zinc-800">
            <Clock className="w-4.5 h-4.5 text-cyan-400" /> Platform Security & Telemetry Audit Trail
          </h3>

          <div className="space-y-2">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-3 bg-zinc-950 border border-zinc-800/80 rounded-xl flex items-center justify-between text-xs sm:text-sm font-mono">
                <div className="flex items-center gap-3">
                  <span className="text-zinc-500 text-xs">{log.time}</span>
                  <span className="text-cyan-400 font-bold">{log.action}:</span>
                  <span className="text-zinc-200">{log.detail}</span>
                </div>
                <span className="text-zinc-400 text-xs font-semibold">{log.user}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Attachment Preview Modal */}
      {previewAttachment && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-zinc-950 border border-rose-500/30 rounded-2xl overflow-hidden shadow-2xl space-y-4 p-6">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2.5">
                <Paperclip className="w-5 h-5 text-rose-400" />
                <div>
                  <h3 className="text-base font-bold text-zinc-100 font-mono">{previewAttachment.filename}</h3>
                  <span className="text-xs text-zinc-400">{previewAttachment.category} • {previewAttachment.fileSize}</span>
                </div>
              </div>
              <button
                onClick={() => setPreviewAttachment(null)}
                className="p-1.5 text-zinc-400 hover:text-zinc-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm font-mono">
              <div className="p-3 bg-zinc-900 rounded-xl space-y-1">
                <span className="text-zinc-400 text-xs block">Cryptographic Hash Checksum:</span>
                <span className="text-cyan-300 text-xs break-all block">{previewAttachment.hash}</span>
              </div>

              <div className="p-3 bg-zinc-900 rounded-xl space-y-1">
                <span className="text-zinc-400 text-xs block">Description & Purpose:</span>
                <p className="text-zinc-200 text-xs leading-relaxed font-sans">{previewAttachment.description}</p>
              </div>

              {previewAttachment.contentPreview && (
                <div className="p-3 bg-zinc-900/90 border border-zinc-800 rounded-xl space-y-1">
                  <span className="text-zinc-400 text-xs block">File Content Preview:</span>
                  <pre className="text-xs text-emerald-300 font-mono whitespace-pre-wrap overflow-x-auto p-2 bg-zinc-950 rounded-lg">
                    {previewAttachment.contentPreview}
                  </pre>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-zinc-800">
              <span className="text-xs text-zinc-400 font-mono">Uploaded by {previewAttachment.uploadedBy} on {previewAttachment.uploadedAt}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    handleDownloadAttachment(previewAttachment);
                    setPreviewAttachment(null);
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  <span>Download File</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
