import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import { UserSession, ShipmentItem, ESGReportItem } from '../types';
import {
  Factory,
  Leaf,
  Truck,
  ShieldCheck,
  Download,
  ExternalLink,
  Send,
  CheckCircle2,
  Clock,
  FileText,
  DollarSign,
  Award,
  AlertTriangle,
  Upload,
  Plus,
  BarChart3,
  Globe,
  Package,
  Calendar,
  Layers,
  FileCheck,
  RefreshCw,
  Search,
  CheckCircle,
  FileSpreadsheet,
  X,
  CreditCard,
  Building,
  Info
} from 'lucide-react';

interface SupplierPortalProps {
  session: UserSession;
  shipments: ShipmentItem[];
  onAddEsgReport: (report: ESGReportItem) => void;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  orderDate: string;
  dueDate: string;
  componentSku: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalValue: number;
  status: 'In Production' | 'Quality Testing' | 'Packaged & Ready' | 'Shipped in Transit' | 'Delivered';
  productionProgressPct: number;
  paymentStatus: 'Paid (Net 30)' | 'Approved' | 'Invoiced' | 'Pending Fulfillment';
  acknowledged: boolean;
}

export interface SupplierInvoice {
  id: string;
  invoiceNumber: string;
  poNumber: string;
  invoiceDate: string;
  dueDate: string;
  amount: number;
  status: 'Settled' | 'Approved for Payment' | 'In Review';
  paymentTerms: string;
}

export interface FacilityCertificate {
  id: string;
  title: string;
  standard: string;
  issuer: string;
  certNumber: string;
  issuedDate: string;
  expiryDate: string;
  status: 'Verified & Active' | 'Audit Passed' | 'Renewal Pending';
  fileSize: string;
}

export interface MaterialOriginItem {
  id: string;
  materialName: string;
  subTierSupplier: string;
  countryOfOrigin: string;
  smelterVerified: boolean;
  conflictMineralStatus: '3TG Compliant' | 'Verified Recycled' | 'Full Audit Passed';
  sustainabilityRating: string;
}

export const SupplierPortal: React.FC<SupplierPortalProps> = ({
  session,
  shipments: initialShipments,
  onAddEsgReport,
}) => {
  const [activePortalTab, setActivePortalTab] = useState<'orders' | 'shipments' | 'esg' | 'compliance'>('orders');
  const [shipmentsList, setShipmentsList] = useState<ShipmentItem[]>(initialShipments);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Search & Filters
  const [orderSearchTerm, setOrderSearchTerm] = useState('');
  const [certSearchTerm, setCertSearchTerm] = useState('');

  // Purchase Orders State
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([
    {
      id: 'po-01',
      poNumber: 'PO-2026-8891',
      orderDate: '2026-07-10',
      dueDate: '2026-08-15',
      componentSku: 'SKU-BAT-8820',
      description: 'High-Density Lithium-Ion Battery Modules 48V 100Ah',
      quantity: 1200,
      unitPrice: 420.0,
      totalValue: 504000,
      status: 'In Production',
      productionProgressPct: 82,
      paymentStatus: 'Approved',
      acknowledged: true,
    },
    {
      id: 'po-02',
      poNumber: 'PO-2026-9012',
      orderDate: '2026-07-15',
      dueDate: '2026-08-20',
      componentSku: 'SKU-MCU-4410',
      description: '32-bit Automotive Microcontrollers with CAN-FD',
      quantity: 5000,
      unitPrice: 38.5,
      totalValue: 192500,
      status: 'Quality Testing',
      productionProgressPct: 95,
      paymentStatus: 'Paid (Net 30)',
      acknowledged: true,
    },
    {
      id: 'po-03',
      poNumber: 'PO-2026-9150',
      orderDate: '2026-07-20',
      dueDate: '2026-08-30',
      componentSku: 'SKU-DISP-104',
      description: 'Industrial 10.4" Sunlight-Readable Touch Displays',
      quantity: 800,
      unitPrice: 210.0,
      totalValue: 168000,
      status: 'Packaged & Ready',
      productionProgressPct: 100,
      paymentStatus: 'Invoiced',
      acknowledged: true,
    },
    {
      id: 'po-04',
      poNumber: 'PO-2026-9220',
      orderDate: '2026-07-22',
      dueDate: '2026-09-05',
      componentSku: 'SKU-CAB-3301',
      description: 'Heavy-Duty Shielded Wiring Harnesses Type-A',
      quantity: 3500,
      unitPrice: 18.0,
      totalValue: 63000,
      status: 'In Production',
      productionProgressPct: 45,
      paymentStatus: 'Pending Fulfillment',
      acknowledged: false,
    },
    {
      id: 'po-05',
      poNumber: 'PO-2026-9304',
      orderDate: '2026-07-25',
      dueDate: '2026-09-12',
      componentSku: 'SKU-ALU-902',
      description: 'Precision Machined Recycled Aluminum Enclosures',
      quantity: 2000,
      unitPrice: 65.0,
      totalValue: 130000,
      status: 'In Production',
      productionProgressPct: 20,
      paymentStatus: 'Pending Fulfillment',
      acknowledged: false,
    },
  ]);

  // Invoices State
  const [invoices, setInvoices] = useState<SupplierInvoice[]>([
    {
      id: 'inv-101',
      invoiceNumber: 'INV-2026-9081',
      poNumber: 'PO-2026-9012',
      invoiceDate: '2026-07-18',
      dueDate: '2026-08-17',
      amount: 192500,
      status: 'Settled',
      paymentTerms: '2% 10 / Net 30',
    },
    {
      id: 'inv-102',
      invoiceNumber: 'INV-2026-9150',
      poNumber: 'PO-2026-9150',
      invoiceDate: '2026-07-22',
      dueDate: '2026-08-21',
      amount: 168000,
      status: 'Approved for Payment',
      paymentTerms: 'Net 30',
    },
    {
      id: 'inv-103',
      invoiceNumber: 'INV-2026-8891-A',
      poNumber: 'PO-2026-8891',
      invoiceDate: '2026-07-24',
      dueDate: '2026-08-23',
      amount: 252000,
      status: 'In Review',
      paymentTerms: '50% Deposit / 50% Delivery',
    },
  ]);

  // Certificates State
  const [certificates, setCertificates] = useState<FacilityCertificate[]>([
    {
      id: 'cert-01',
      title: 'ISO 14001:2015 Environmental Management Certificate',
      standard: 'ISO 14001',
      issuer: 'TÜV SÜD Asia Pacific',
      certNumber: 'TUV-14001-2026-88',
      issuedDate: '2024-01-15',
      expiryDate: '2026-12-31',
      status: 'Verified & Active',
      fileSize: '1.8 MB',
    },
    {
      id: 'cert-02',
      title: 'SA8000 Social Accountability & Labor Standards Audit',
      standard: 'SA8000',
      issuer: 'SGS International Services',
      certNumber: 'SA8000-GLOBAL-99',
      issuedDate: '2024-03-20',
      expiryDate: '2027-03-19',
      status: 'Verified & Active',
      fileSize: '2.4 MB',
    },
    {
      id: 'cert-03',
      title: 'ISO 9001:2015 Quality Management Systems',
      standard: 'ISO 9001',
      issuer: 'Bureau Veritas Quality',
      certNumber: 'BV-9001-QUALITY-2026',
      issuedDate: '2023-06-10',
      expiryDate: '2026-06-09',
      status: 'Renewal Pending',
      fileSize: '3.1 MB',
    },
    {
      id: 'cert-04',
      title: 'C-TPAT Tier 3 High-Security Customs Partner Certification',
      standard: 'C-TPAT / AEO',
      issuer: 'U.S. Customs and Border Protection',
      certNumber: 'CTPAT-HIGH-SEC-2026',
      issuedDate: '2025-02-01',
      expiryDate: '2028-01-31',
      status: 'Verified & Active',
      fileSize: '1.2 MB',
    },
    {
      id: 'cert-05',
      title: 'RoHS & REACH Hazardous Substance Declaration',
      standard: 'EU RoHS 3 & REACH',
      issuer: 'Eurofins Product Testing',
      certNumber: 'EU-ROHS-REACH-2026',
      issuedDate: '2025-11-12',
      expiryDate: '2026-11-11',
      status: 'Audit Passed',
      fileSize: '950 KB',
    },
  ]);

  // Material Origins / Sub-Tier Traceability
  const [materialOrigins] = useState<MaterialOriginItem[]>([
    {
      id: 'mat-01',
      materialName: 'Battery Cell Cathode (NMC 811)',
      subTierSupplier: 'Nagoya Advanced Chemicals Corp',
      countryOfOrigin: 'Japan',
      smelterVerified: true,
      conflictMineralStatus: '3TG Compliant',
      sustainabilityRating: 'AAA Green',
    },
    {
      id: 'mat-02',
      materialName: 'Automotive Grade Silicon Wafers',
      subTierSupplier: 'Taiwan Semiconductor Materials Co.',
      countryOfOrigin: 'Taiwan',
      smelterVerified: true,
      conflictMineralStatus: 'Full Audit Passed',
      sustainabilityRating: 'A+ Rated',
    },
    {
      id: 'mat-03',
      materialName: '99.8% Recycled Extruded Aluminum',
      subTierSupplier: 'Linz Eco-Alloys GmbH',
      countryOfOrigin: 'Austria',
      smelterVerified: true,
      conflictMineralStatus: 'Verified Recycled',
      sustainabilityRating: 'Zero-Carbon',
    },
    {
      id: 'mat-04',
      materialName: 'Copper Wiring Rods (High-Purity)',
      subTierSupplier: 'Atacama Refining Works',
      countryOfOrigin: 'Chile',
      smelterVerified: true,
      conflictMineralStatus: '3TG Compliant',
      sustainabilityRating: 'A Rating',
    },
  ]);

  // ESG Self-Reporting Form State
  const [period, setPeriod] = useState('Q2 2026');
  const [co2Ocean, setCo2Ocean] = useState(3400);
  const [co2Air, setCo2Air] = useState(8200);
  const [co2Road, setCo2Road] = useState(1100);
  const [co2Rail, setCo2Rail] = useState(200);
  const [laborScore, setLaborScore] = useState(95);
  const [carbonScore, setCarbonScore] = useState(88);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // New Certificate Upload Form State
  const [showCertUploadModal, setShowCertUploadModal] = useState(false);
  const [newCertTitle, setNewCertTitle] = useState('');
  const [newCertStandard, setNewCertStandard] = useState('ISO 27001');
  const [newCertIssuer, setNewCertIssuer] = useState('');
  const [newCertNumber, setNewCertNumber] = useState('');
  const [newCertExpiry, setNewCertExpiry] = useState('2027-12-31');

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleAcknowledgePo = (poId: string) => {
    setPurchaseOrders(
      purchaseOrders.map((po) => (po.id === poId ? { ...po, acknowledged: true } : po))
    );
    triggerToast('Purchase Order acknowledged and scheduled into ERP!');
  };

  const handleUpdateProgress = (poId: string, delta: number) => {
    setPurchaseOrders(
      purchaseOrders.map((po) => {
        if (po.id === poId) {
          const newPct = Math.min(100, Math.max(0, po.productionProgressPct + delta));
          let newStatus = po.status;
          if (newPct === 100) newStatus = 'Packaged & Ready';
          else if (newPct >= 90) newStatus = 'Quality Testing';
          else newStatus = 'In Production';
          return { ...po, productionProgressPct: newPct, status: newStatus };
        }
        return po;
      })
    );
    triggerToast('Production milestone progress updated successfully.');
  };

  const handleSubmitEsg = (e: React.FormEvent) => {
    e.preventDefault();

    const newReport: ESGReportItem = {
      id: `esg-${Date.now()}`,
      supplierName: session.name || 'ACME Electronics Global',
      reportingPeriod: period,
      co2Ocean,
      co2Air,
      co2Road,
      co2Rail,
      laborRightsPct: laborScore,
      carbonReportingPct: carbonScore,
      wasteReductionPct: 82,
      waterUsagePct: 92,
      submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    onAddEsgReport(newReport);
    setSubmittedSuccess(true);
    triggerToast('Scope 3 ESG audit submitted & verified by platform AI!');
    setTimeout(() => setSubmittedSuccess(false), 4000);
  };

  const handleCreateNewCert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCertTitle || !newCertIssuer) return;

    const newCert: FacilityCertificate = {
      id: `cert-${Date.now()}`,
      title: newCertTitle,
      standard: newCertStandard,
      issuer: newCertIssuer,
      certNumber: newCertNumber || `CERT-${Math.floor(Math.random() * 90000 + 10000)}`,
      issuedDate: new Date().toISOString().split('T')[0],
      expiryDate: newCertExpiry,
      status: 'Verified & Active',
      fileSize: '2.1 MB',
    };

    setCertificates([newCert, ...certificates]);
    setShowCertUploadModal(false);
    setNewCertTitle('');
    setNewCertIssuer('');
    setNewCertNumber('');
    triggerToast('New Quality & Compliance Certificate uploaded successfully!');
  };

  const openGoogleMapsTrack = (dest: string) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(dest)}`;
    window.open(url, '_blank');
  };

  // ----------------------------------------------------------------------
  // PDF GENERATION HANDLERS (jsPDF)
  // ----------------------------------------------------------------------

  // 1. Generate Purchase Order PDF
  const downloadPoPdf = (po: PurchaseOrder) => {
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      // Header Banner
      doc.setFillColor(15, 23, 42); // slate-900
      doc.rect(0, 0, 210, 36, 'F');

      doc.setTextColor(56, 189, 248); // sky-400
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('OFFICIAL PURCHASE ORDER (PO)', 14, 15);

      doc.setTextColor(241, 245, 249);
      doc.setFontSize(9);
      doc.text(`ChainSight™ Global Procurement Network • PO Number: ${po.poNumber}`, 14, 23);

      doc.setTextColor(148, 163, 184);
      doc.setFontSize(8);
      doc.text(`Issued: ${po.orderDate}  |  Delivery Due Date: ${po.dueDate}  |  Status: ${po.status.toUpperCase()}`, 14, 30);

      // Vendor & Buyer Info Box
      doc.setFillColor(248, 250, 252);
      doc.rect(14, 42, 182, 32, 'F');
      doc.setDrawColor(203, 213, 225);
      doc.rect(14, 42, 182, 32, 'S');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(15, 23, 42);
      doc.text('SUPPLIER / VENDOR DETAILS:', 18, 48);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(51, 65, 85);
      doc.text(`Company: ${session.name || 'ACME Electronics Global Ltd'}`, 18, 54);
      doc.text(`Contact Email: ${session.email}`, 18, 59);
      doc.text(`Vendor ID: SUP-2026-8842`, 18, 64);
      doc.text(`Tier Level: Tier-1 Premium Partner`, 18, 69);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(15, 23, 42);
      doc.text('BUYER / SHIP TO DETAILS:', 108, 48);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(51, 65, 85);
      doc.text('ChainSight Integrated Operations Hub', 108, 54);
      doc.text('Central Distribution Depot #4', 108, 59);
      doc.text('Rotterdam Maritime Logistics Zone', 108, 64);
      doc.text('Payment Terms: Net 30 Days', 108, 69);

      // Line Items Table
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(15, 23, 42);
      doc.text('PURCHASE ORDER LINE ITEMS & SPECIFICATIONS', 14, 82);

      doc.setDrawColor(203, 213, 225);
      doc.line(14, 84, 196, 84);

      // Table Header
      doc.setFillColor(15, 23, 42);
      doc.rect(14, 88, 182, 7, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'bold');
      doc.text('SKU CODE', 17, 92.5);
      doc.text('ITEM DESCRIPTION', 52, 92.5);
      doc.text('QTY', 125, 92.5);
      doc.text('UNIT PRICE', 145, 92.5);
      doc.text('TOTAL ($)', 172, 92.5);

      // Table Row
      doc.setFillColor(241, 245, 249);
      doc.rect(14, 95, 182, 10, 'F');
      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.text(po.componentSku, 17, 101);
      doc.setFont('helvetica', 'normal');
      doc.text(po.description, 52, 101);
      doc.text(po.quantity.toLocaleString(), 125, 101);
      doc.text(`$${po.unitPrice.toFixed(2)}`, 145, 101);
      doc.setFont('helvetica', 'bold');
      doc.text(`$${po.totalValue.toLocaleString()}`, 172, 101);

      // Summary Box
      doc.setFillColor(240, 253, 244);
      doc.rect(120, 112, 76, 20, 'F');
      doc.setDrawColor(134, 239, 172);
      doc.rect(120, 112, 76, 20, 'S');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(21, 128, 61);
      doc.text(`SUBTOTAL: $${po.totalValue.toLocaleString()}`, 124, 118);
      doc.text(`TAX / DUTIES (0% EXEMPT): $0.00`, 124, 123);
      doc.setFontSize(9.5);
      doc.text(`TOTAL VALUE: $${po.totalValue.toLocaleString()}`, 124, 129);

      // Production & Quality Terms
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(15, 23, 42);
      doc.text('QUALITY & DELIVERY COMMITMENTS', 14, 142);

      doc.setDrawColor(203, 213, 225);
      doc.line(14, 144, 196, 144);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(51, 65, 85);
      doc.text('1. All components must pass ISO 9001 quality inspections and include a Certificate of Analysis (CoA).', 14, 150);
      doc.text('2. Shipments must adhere to C-TPAT security standards and include Scope 3 carbon tracking tags.', 14, 155);
      doc.text(`3. Current Production Stage: ${po.status} (${po.productionProgressPct}% Completed).`, 14, 160);

      // Signatures Footer
      doc.setDrawColor(203, 213, 225);
      doc.line(14, 248, 196, 248);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(15, 23, 42);
      doc.text('AUTHORIZATION & ACKNOWLEDGMENT SIGNATURES', 14, 254);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.text('____________________________________', 14, 268);
      doc.setFont('helvetica', 'bold');
      doc.text('Authorized Buyer Officer', 14, 272);
      doc.setFont('helvetica', 'normal');
      doc.text('ChainSight Global Procurement', 14, 276);

      doc.text('____________________________________', 120, 268);
      doc.setFont('helvetica', 'bold');
      doc.text(session.name || 'Vendor Representative', 120, 272);
      doc.setFont('helvetica', 'normal');
      doc.text('Supplier Operations Director', 120, 276);

      doc.setFontSize(7);
      doc.setTextColor(148, 163, 184);
      doc.text(`ChainSight Platform • Document Ref: ${po.poNumber} • Page 1 of 1`, 14, 286);

      doc.save(`Purchase_Order_${po.poNumber}.pdf`);
      triggerToast(`Purchase Order PDF downloaded for ${po.poNumber}`);
    } catch (err) {
      console.error('PO PDF Download Error:', err);
    }
  };

  // 2. Generate Facility Certificate PDF
  const downloadCertPdf = (cert: FacilityCertificate) => {
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      // Header Banner
      doc.setFillColor(15, 23, 42);
      doc.rect(0, 0, 210, 36, 'F');

      doc.setTextColor(56, 189, 248);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(15);
      doc.text('VERIFIED QUALITY & COMPLIANCE CERTIFICATE', 14, 15);

      doc.setTextColor(241, 245, 249);
      doc.setFontSize(8.5);
      doc.text(`Standard: ${cert.standard}  |  Certificate ID: ${cert.certNumber}`, 14, 23);

      doc.setTextColor(148, 163, 184);
      doc.setFontSize(8);
      doc.text(`Issuing Authority: ${cert.issuer}  |  Valid Until: ${cert.expiryDate}`, 14, 30);

      // Certificate Badge Box
      doc.setFillColor(240, 253, 244);
      doc.rect(14, 42, 182, 18, 'F');
      doc.setDrawColor(134, 239, 172);
      doc.rect(14, 42, 182, 18, 'S');

      doc.setTextColor(21, 128, 61);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('OFFICIAL COMPLIANCE ATTESTATION & STATUS', 18, 49);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(51, 65, 85);
      doc.text(`Certified Facility: ${session.name || 'ACME Electronics Global'}` , 18, 55);
      doc.text(`Audit Status: ${cert.status.toUpperCase()}  •  Verified on ChainSight Network`, 108, 55);

      // Certificate Title & Standard details
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(15, 23, 42);
      doc.text(cert.title, 14, 70);

      doc.setDrawColor(203, 213, 225);
      doc.line(14, 72, 196, 72);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(51, 65, 85);

      const certDesc = `This official document certifies that the production facility operated by ${session.name || 'ACME Electronics Global'} has successfully passed all technical evaluation standards, environmental audits, labor regulations, and quality management requirements under ${cert.standard}. All manufacturing processes adhere strictly to international ISO standards and green supply chain protocols.`;
      const splitDesc = doc.splitTextToSize(certDesc, 182);
      doc.text(splitDesc, 14, 78);

      let currentY = 78 + (splitDesc.length * 4.5) + 10;

      // Metadata Grid
      doc.setFillColor(248, 250, 252);
      doc.rect(14, currentY, 182, 28, 'F');
      doc.setDrawColor(203, 213, 225);
      doc.rect(14, currentY, 182, 28, 'S');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(15, 23, 42);
      doc.text('AUDIT SPECIFICATIONS & RECORD:', 18, currentY + 6);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(51, 65, 85);
      doc.text(`Standard Standard: ${cert.standard}`, 18, currentY + 12);
      doc.text(`Issuing Registrar: ${cert.issuer}`, 18, currentY + 17);
      doc.text(`Certificate Serial: ${cert.certNumber}`, 18, currentY + 22);

      doc.text(`Date of Issue: ${cert.issuedDate}`, 108, currentY + 12);
      doc.text(`Expiration Date: ${cert.expiryDate}`, 108, currentY + 17);
      doc.text(`Verification Mode: Automated API Sync`, 108, currentY + 22);

      currentY += 36;

      // Cryptographic Checksum
      doc.setFillColor(15, 23, 42);
      doc.rect(14, currentY, 182, 12, 'F');
      doc.setTextColor(56, 189, 248);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.text('CRYPTOGRAPHIC INTEGRITY CHECKSUM:', 18, currentY + 4.5);

      doc.setTextColor(241, 245, 249);
      doc.setFont('courier', 'normal');
      doc.setFontSize(6.5);
      doc.text(`SHA-256: ${cert.id}-8f9b1c7a4d3e2f1059b8a7c6d5e4f3a2b1c09876543210`, 18, currentY + 8.5);

      // Signatures
      doc.setDrawColor(203, 213, 225);
      doc.line(14, 250, 196, 250);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(15, 23, 42);
      doc.text('REGISTRAR & AUDITOR SIGNATURES', 14, 256);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.text('____________________________________', 14, 269);
      doc.setFont('helvetica', 'bold');
      doc.text(cert.issuer, 14, 273);
      doc.setFont('helvetica', 'normal');
      doc.text('Lead Senior Certification Auditor', 14, 277);

      doc.text('____________________________________', 120, 269);
      doc.setFont('helvetica', 'bold');
      doc.text('Global Compliance Registrar', 120, 273);
      doc.setFont('helvetica', 'normal');
      doc.text('International Quality Assurance Board', 120, 276);

      doc.setFontSize(7);
      doc.setTextColor(148, 163, 184);
      doc.text(`ChainSight Certified • ${cert.title} • Page 1 of 1`, 14, 286);

      doc.save(`${cert.standard.replace(/[^a-z0-9]/gi, '_')}_Certificate.pdf`);
      triggerToast(`Compliance Certificate downloaded: ${cert.standard}`);
    } catch (err) {
      console.error('Cert PDF Download Error:', err);
    }
  };

  // Filtered POs
  const filteredOrders = purchaseOrders.filter(
    (po) =>
      po.poNumber.toLowerCase().includes(orderSearchTerm.toLowerCase()) ||
      po.description.toLowerCase().includes(orderSearchTerm.toLowerCase()) ||
      po.componentSku.toLowerCase().includes(orderSearchTerm.toLowerCase())
  );

  // Filtered Certificates
  const filteredCerts = certificates.filter(
    (c) =>
      c.title.toLowerCase().includes(certSearchTerm.toLowerCase()) ||
      c.standard.toLowerCase().includes(certSearchTerm.toLowerCase()) ||
      c.issuer.toLowerCase().includes(certSearchTerm.toLowerCase())
  );

  // Calculate Total Active PO Value
  const totalPoValue = purchaseOrders.reduce((acc, po) => acc + po.totalValue, 0);

  return (
    <div className="space-y-6">
      
      {/* Toast Notification Banner */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-zinc-950 px-4 py-3 rounded-2xl font-bold text-xs flex items-center gap-2 shadow-2xl shadow-emerald-500/30 border border-emerald-400 animate-bounce">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Module Title & Partner Info Header */}
      <div className="bg-gradient-to-r from-zinc-900 via-zinc-900/90 to-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 shadow-lg shadow-emerald-500/10">
              <Factory className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold text-zinc-100">
                  {session.name || 'ACME Electronics Global Ltd'}
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded">
                  Tier-1 Verified Partner
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Vendor ID: <span className="font-mono text-zinc-200">SUP-2026-8842</span> • SLA Compliance Score: <strong className="text-emerald-400">Grade A+ (99.4%)</strong>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                // Download complete summary PDF
                downloadPoPdf(purchaseOrders[0]);
              }}
              className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-emerald-500/20"
            >
              <Download className="w-4 h-4" />
              <span>Download Official Partner Dossier (PDF)</span>
            </button>

            <button
              onClick={() => triggerToast('Connecting to Procurement Officer Dr. Sarah K. via secure message channel...')}
              className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer border border-zinc-700"
            >
              <Send className="w-3.5 h-3.5 text-cyan-400" />
              <span>Contact Procurement Lead</span>
            </button>
          </div>
        </div>

        {/* Top Metric Cards Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs font-mono">
          <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 space-y-1">
            <span className="text-[10px] text-zinc-500 uppercase block">Active PO Volume</span>
            <span className="text-sm sm:text-base font-bold text-cyan-400">${(totalPoValue / 1000).toFixed(0)}k</span>
            <span className="text-[10px] text-zinc-400 block">{purchaseOrders.length} Orders Pending</span>
          </div>

          <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 space-y-1">
            <span className="text-[10px] text-zinc-500 uppercase block">On-Time Delivery Rate</span>
            <span className="text-sm sm:text-base font-bold text-emerald-400">98.6%</span>
            <span className="text-[10px] text-emerald-500 block">+1.2% above SLA target</span>
          </div>

          <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 space-y-1">
            <span className="text-[10px] text-zinc-500 uppercase block">Quality Defect Rate</span>
            <span className="text-sm sm:text-base font-bold text-indigo-400">14 PPM</span>
            <span className="text-[10px] text-zinc-400 block">99.98% Acceptance</span>
          </div>

          <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 space-y-1">
            <span className="text-[10px] text-zinc-500 uppercase block">Scope 3 Carbon Audit</span>
            <span className="text-sm sm:text-base font-bold text-emerald-400">Q2 2026 Submitted</span>
            <span className="text-[10px] text-zinc-400 block">ISO 14001 Verified</span>
          </div>
        </div>
      </div>

      {/* Sub-Tab Navigation Bar */}
      <div className="flex items-center gap-2 border-b border-zinc-800 overflow-x-auto pb-1">
        <button
          onClick={() => setActivePortalTab('orders')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activePortalTab === 'orders'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Purchase Orders & Invoices ({purchaseOrders.length})</span>
        </button>

        <button
          onClick={() => setActivePortalTab('shipments')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activePortalTab === 'shipments'
              ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>Active Shipments & Route Alerts ({shipmentsList.length})</span>
        </button>

        <button
          onClick={() => setActivePortalTab('esg')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activePortalTab === 'esg'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
          }`}
        >
          <Leaf className="w-4 h-4" />
          <span>Scope 3 ESG & Carbon Audit</span>
        </button>

        <button
          onClick={() => setActivePortalTab('compliance')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activePortalTab === 'compliance'
              ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Quality Certifications & Raw Material Origin ({certificates.length})</span>
        </button>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* TAB 1: PURCHASE ORDERS & INVOICES */}
      {/* ------------------------------------------------------------------ */}
      {activePortalTab === 'orders' && (
        <div className="space-y-6">
          
          {/* Active Purchase Orders Table Card */}
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800">
              <div>
                <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                  <Package className="w-5 h-5 text-emerald-400" />
                  Active Purchase Orders & Production Schedules
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Track manufacturing milestones, update progress percentages, acknowledge POs, and download official PO PDFs.
                </p>
              </div>

              {/* Search Box */}
              <div className="relative">
                <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search PO # or SKU..."
                  value={orderSearchTerm}
                  onChange={(e) => setOrderSearchTerm(e.target.value)}
                  className="bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-emerald-500 w-48 sm:w-60"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-zinc-950 text-zinc-400 border-b border-zinc-800 font-mono text-[11px]">
                    <th className="p-3">PO NUMBER</th>
                    <th className="p-3">SKU & DESCRIPTION</th>
                    <th className="p-3">DUE DATE</th>
                    <th className="p-3">QTY & VALUE</th>
                    <th className="p-3">PRODUCTION PROGRESS</th>
                    <th className="p-3">PAYMENT STATUS</th>
                    <th className="p-3 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 font-mono text-zinc-300">
                  {filteredOrders.map((po) => (
                    <tr key={po.id} className="hover:bg-zinc-900/60 transition-all">
                      <td className="p-3">
                        <div className="space-y-1">
                          <span className="font-bold text-zinc-100 block">{po.poNumber}</span>
                          {po.acknowledged ? (
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold uppercase">
                              Acknowledged
                            </span>
                          ) : (
                            <button
                              onClick={() => handleAcknowledgePo(po.id)}
                              className="text-[9px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold uppercase hover:bg-amber-500/30 transition-all cursor-pointer"
                            >
                              Acknowledge PO
                            </button>
                          )}
                        </div>
                      </td>

                      <td className="p-3 max-w-[220px]">
                        <p className="font-bold text-zinc-200">{po.componentSku}</p>
                        <p className="text-[11px] text-zinc-400 font-sans truncate">{po.description}</p>
                      </td>

                      <td className="p-3 whitespace-nowrap">
                        <span className="text-zinc-200 font-bold">{po.dueDate}</span>
                        <span className="text-[10px] text-zinc-500 block">Ordered: {po.orderDate}</span>
                      </td>

                      <td className="p-3 whitespace-nowrap">
                        <span className="text-zinc-100 font-bold">{po.quantity.toLocaleString()} units</span>
                        <span className="text-[10px] text-emerald-400 block">${po.totalValue.toLocaleString()}</span>
                      </td>

                      <td className="p-3 w-48">
                        <div className="space-y-1 font-sans">
                          <div className="flex justify-between text-[10px]">
                            <span className="text-zinc-300 font-medium">{po.status}</span>
                            <span className="font-mono text-emerald-400 font-bold">{po.productionProgressPct}%</span>
                          </div>
                          <div className="w-full bg-zinc-950 h-2 rounded-full overflow-hidden border border-zinc-800">
                            <div
                              className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full"
                              style={{ width: `${po.productionProgressPct}%` }}
                            />
                          </div>

                          {/* Incremental Progress Adjustment Buttons */}
                          <div className="flex items-center gap-1 pt-0.5">
                            <button
                              onClick={() => handleUpdateProgress(po.id, 10)}
                              className="px-1.5 py-0.5 text-[9px] bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded border border-zinc-700 transition-all cursor-pointer"
                              title="Increase milestone by +10%"
                            >
                              +10% Progress
                            </button>
                          </div>
                        </div>
                      </td>

                      <td className="p-3 whitespace-nowrap">
                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                          po.paymentStatus.includes('Paid') ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                          po.paymentStatus.includes('Approved') ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' :
                          'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}>
                          {po.paymentStatus}
                        </span>
                      </td>

                      <td className="p-3 text-right">
                        <button
                          onClick={() => downloadPoPdf(po)}
                          className="px-2.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-cyan-300 rounded-lg transition-all flex items-center gap-1 text-[11px] cursor-pointer ml-auto"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>PDF</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Invoices & Financial Settlement Summary */}
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div>
                <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-indigo-400" />
                  Supplier Invoices & Financial Remittances
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Verified invoices, settlement schedules, and Net 30 early payment discount tracking.
                </p>
              </div>

              <div className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs rounded-xl font-mono">
                Standard Terms: Net 30 Days (2% 10 Discount Eligible)
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {invoices.map((inv) => (
                <div key={inv.id} className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl space-y-3 text-xs">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono font-bold text-zinc-100 block">{inv.invoiceNumber}</span>
                      <span className="text-[10px] text-zinc-400 block font-mono">Ref PO: {inv.poNumber}</span>
                    </div>

                    <span className={`px-2 py-0.5 text-[9px] font-mono font-bold uppercase rounded ${
                      inv.status === 'Settled' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      inv.status === 'Approved for Payment' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
                      'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {inv.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs font-mono pt-1">
                    <span className="text-zinc-400">Total Amount:</span>
                    <span className="text-sm font-bold text-emerald-400">${inv.amount.toLocaleString()}</span>
                  </div>

                  <div className="text-[11px] text-zinc-400 space-y-1 pt-2 border-t border-zinc-900">
                    <p>Invoice Date: {inv.invoiceDate}</p>
                    <p>Due Date: <strong className="text-zinc-200">{inv.dueDate}</strong></p>
                    <p>Terms: {inv.paymentTerms}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* TAB 2: ACTIVE SHIPMENTS & LOGISTICS */}
      {/* ------------------------------------------------------------------ */}
      {activePortalTab === 'shipments' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Outbound Active Shipments List */}
            <div className="lg:col-span-7 bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-base font-bold text-zinc-100 pb-3 border-b border-zinc-800 flex items-center gap-2">
                <Truck className="w-5 h-5 text-cyan-400" />
                Outbound Active Shipments & Transit Status ({shipmentsList.length})
              </h3>

              <div className="space-y-3">
                {shipmentsList.map((s) => (
                  <div
                    key={s.id}
                    className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-zinc-100 text-sm">{s.id}</span>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                            s.status === 'delivered'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : s.status === 'delayed'
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                          }`}
                        >
                          {s.status}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-300">
                        Destination: <strong className="text-zinc-100">{s.dest}</strong>
                      </p>
                      <p className="text-[11px] text-zinc-400 font-mono">
                        Mode: {s.mode} • Projected ETA: {s.eta}
                      </p>
                    </div>

                    <button
                      onClick={() => openGoogleMapsTrack(s.dest)}
                      className="px-3 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-cyan-300 rounded-xl transition-all flex items-center gap-1.5 text-xs cursor-pointer"
                    >
                      <span>Track Map</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Logistics Route Alerts & Geopolitical Warnings */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" /> Active Shipping Lane Disruption Alerts
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="p-3.5 bg-amber-950/20 border border-amber-500/30 rounded-xl space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-300">Red Sea Maritime Rerouting Advisory</span>
                      <span className="text-[9px] font-mono bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded">High Severity</span>
                    </div>
                    <p className="text-[11px] text-zinc-300 leading-snug">
                      Vessels bypassing Suez Canal via Cape of Good Hope add +10-14 transit days. Carrier surcharges applied.
                    </p>
                  </div>

                  <div className="p-3.5 bg-cyan-950/20 border border-cyan-500/30 rounded-xl space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-cyan-300">Port of Hamburg Dockworkers Strike</span>
                      <span className="text-[9px] font-mono bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded">Medium</span>
                    </div>
                    <p className="text-[11px] text-zinc-300 leading-snug">
                      48-hour labor strike called for July 29. Feeder vessel congestion expected.
                    </p>
                  </div>
                </div>
              </div>

              {/* Carrier Modal Share Breakdown */}
              <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-emerald-400" /> Outbound Carrier Modal Distribution
                </h3>

                <div className="space-y-2 text-xs font-mono">
                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-zinc-400">Ocean Freight (TEU Containers)</span>
                      <span className="text-emerald-400 font-bold">52%</span>
                    </div>
                    <div className="w-full bg-zinc-950 h-2 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-400" style={{ width: '52%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-zinc-400">Road Express Logistics</span>
                      <span className="text-cyan-400 font-bold">28%</span>
                    </div>
                    <div className="w-full bg-zinc-950 h-2 rounded-full overflow-hidden">
                      <div className="h-full bg-cyan-400" style={{ width: '28%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-zinc-400">Air Express Cargo (Critical)</span>
                      <span className="text-indigo-400 font-bold">15%</span>
                    </div>
                    <div className="w-full bg-zinc-950 h-2 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-400" style={{ width: '15%' }} />
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* TAB 3: SCOPE 3 ESG & CARBON AUDIT */}
      {/* ------------------------------------------------------------------ */}
      {activePortalTab === 'esg' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* ESG Form */}
          <div className="lg:col-span-7 bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 space-y-4">
            <div className="pb-3 border-b border-zinc-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-emerald-400" />
                  Submit Scope 3 ESG & Carbon Emissions Audit
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Self-report transport greenhouse gas emissions, labor welfare standards, and water usage.
                </p>
              </div>

              <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold rounded-xl">
                ISO 14064 Compliant
              </span>
            </div>

            {submittedSuccess && (
              <div className="p-3.5 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>ESG Audit report submitted successfully & verified by ChainSight platform!</span>
              </div>
            )}

            <form onSubmit={handleSubmitEsg} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-400 font-medium mb-1">Reporting Period</label>
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-100 focus:outline-none focus:border-emerald-500 font-medium"
                >
                  <option value="Q2 2026">Q2 2026 (Current Period)</option>
                  <option value="Q1 2026">Q1 2026</option>
                  <option value="Q4 2025">Q4 2025</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 font-medium mb-1">Ocean Shipping CO2 (tCO2e)</label>
                  <input
                    type="number"
                    value={co2Ocean}
                    onChange={(e) => setCo2Ocean(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-100 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 font-medium mb-1">Air Cargo CO2 (tCO2e)</label>
                  <input
                    type="number"
                    value={co2Air}
                    onChange={(e) => setCo2Air(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-100 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 font-medium mb-1">Road Transport CO2 (tCO2e)</label>
                  <input
                    type="number"
                    value={co2Road}
                    onChange={(e) => setCo2Road(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-100 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 font-medium mb-1">Rail Logistics CO2 (tCO2e)</label>
                  <input
                    type="number"
                    value={co2Rail}
                    onChange={(e) => setCo2Rail(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-100 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 font-medium mb-1">Labor Rights Score (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={laborScore}
                    onChange={(e) => setLaborScore(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-100 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 font-medium mb-1">Carbon Standard Compliance (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={carbonScore}
                    onChange={(e) => setCarbonScore(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-zinc-100 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer mt-2"
              >
                <Send className="w-4 h-4" />
                <span>Submit Scope 3 ESG Audit</span>
              </button>
            </form>
          </div>

          {/* Past Submissions & Science-Based Targets */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300 pb-2 border-b border-zinc-800 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-400" /> Historical ESG Submissions
              </h3>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 bg-zinc-950 border border-zinc-800 rounded-xl space-y-2">
                  <div className="flex items-center justify-between font-mono">
                    <span className="font-bold text-zinc-100">Period: Q1 2026</span>
                    <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold">
                      Verified
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400">Total Scope 3: 12,900 tCO2e • Labor Welfare: 94%</p>
                  <p className="text-[10px] text-zinc-500 font-mono">Submitted: 2026-04-12 10:15</p>
                </div>

                <div className="p-3.5 bg-zinc-950 border border-zinc-800 rounded-xl space-y-2">
                  <div className="flex items-center justify-between font-mono">
                    <span className="font-bold text-zinc-100">Period: Q4 2025</span>
                    <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold">
                      Verified
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400">Total Scope 3: 14,200 tCO2e • Labor Welfare: 92%</p>
                  <p className="text-[10px] text-zinc-500 font-mono">Submitted: 2026-01-10 14:22</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* TAB 4: CERTIFICATIONS & MATERIAL ORIGIN */}
      {/* ------------------------------------------------------------------ */}
      {activePortalTab === 'compliance' && (
        <div className="space-y-6">
          
          {/* Facility & Audit Certifications Table */}
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800">
              <div>
                <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                  <Award className="w-5 h-5 text-indigo-400" />
                  Facility Audit & ISO Compliance Certificates ({certificates.length})
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Verified quality management, environmental standards, and customs security certificates with PDF downloads.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Filter certificates..."
                  value={certSearchTerm}
                  onChange={(e) => setCertSearchTerm(e.target.value)}
                  className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-indigo-500 w-40 sm:w-48"
                />

                <button
                  onClick={() => setShowCertUploadModal(true)}
                  className="px-3 py-1.5 bg-indigo-500 hover:bg-indigo-400 text-zinc-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-indigo-500/20"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Certificate</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCerts.map((cert) => (
                <div key={cert.id} className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl space-y-3 text-xs">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="px-2 py-0.5 text-[9px] font-mono font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded uppercase">
                        {cert.standard}
                      </span>
                      <h4 className="font-bold text-zinc-100 mt-1.5">{cert.title}</h4>
                      <p className="text-[11px] text-zinc-400 font-mono mt-0.5">Issuer: {cert.issuer}</p>
                    </div>

                    <span className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase shrink-0 ${
                      cert.status.includes('Verified') ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      cert.status.includes('Passed') ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' :
                      'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {cert.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-zinc-400 font-mono pt-2 border-t border-zinc-900">
                    <span>ID: {cert.certNumber}</span>
                    <span>Expires: <strong className="text-zinc-200">{cert.expiryDate}</strong></span>
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-[10px] text-zinc-500 font-mono">File Size: {cert.fileSize}</span>
                    <button
                      onClick={() => downloadCertPdf(cert)}
                      className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-cyan-300 rounded-lg transition-all flex items-center gap-1.5 text-xs cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Certificate PDF</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sub-Tier Raw Material Origin & Conflict Minerals Traceability */}
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 space-y-4">
            <div className="pb-3 border-b border-zinc-800">
              <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                <Globe className="w-5 h-5 text-emerald-400" />
                Tier-2 Sub-Tier Material Origin & Conflict Minerals (3TG) Declaration
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Smelter verification, raw material country of origin, and ESG sustainability ratings.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-zinc-950 text-zinc-400 border-b border-zinc-800 font-mono text-[11px]">
                    <th className="p-3">RAW MATERIAL / COMPONENT</th>
                    <th className="p-3">SUB-TIER SUPPLIER</th>
                    <th className="p-3">COUNTRY OF ORIGIN</th>
                    <th className="p-3">3TG CONFLICT MINERAL STATUS</th>
                    <th className="p-3 text-right">SUSTAINABILITY RATING</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 font-mono text-zinc-300">
                  {materialOrigins.map((m) => (
                    <tr key={m.id} className="hover:bg-zinc-900/60 transition-all">
                      <td className="p-3 font-bold text-zinc-100">{m.materialName}</td>
                      <td className="p-3 text-zinc-300">{m.subTierSupplier}</td>
                      <td className="p-3 text-zinc-200">{m.countryOfOrigin}</td>
                      <td className="p-3">
                        <span className="text-[10px] px-2 py-0.5 rounded font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {m.conflictMineralStatus}
                        </span>
                      </td>
                      <td className="p-3 text-right font-bold text-cyan-400">{m.sustainabilityRating}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* CERTIFICATE UPLOAD MODAL */}
      {/* ------------------------------------------------------------------ */}
      {showCertUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-zinc-950 border border-indigo-500/30 rounded-2xl overflow-hidden shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                <Upload className="w-5 h-5 text-indigo-400" /> Upload Quality & Compliance Certificate
              </h3>
              <button
                onClick={() => setShowCertUploadModal(false)}
                className="p-1 text-zinc-400 hover:text-zinc-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewCert} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-400 font-medium mb-1">Certificate Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., ISO 27001 Information Security Management Certificate"
                  value={newCertTitle}
                  onChange={(e) => setNewCertTitle(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-zinc-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 font-medium mb-1">Standard</label>
                  <select
                    value={newCertStandard}
                    onChange={(e) => setNewCertStandard(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-zinc-100 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="ISO 14001">ISO 14001</option>
                    <option value="ISO 9001">ISO 9001</option>
                    <option value="ISO 27001">ISO 27001</option>
                    <option value="SA8000">SA8000</option>
                    <option value="C-TPAT / AEO">C-TPAT / AEO</option>
                    <option value="RoHS & REACH">RoHS & REACH</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-400 font-medium mb-1">Issuing Authority / Registrar</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., TÜV SÜD Asia"
                    value={newCertIssuer}
                    onChange={(e) => setNewCertIssuer(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-zinc-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 font-medium mb-1">Certificate Number</label>
                  <input
                    type="text"
                    placeholder="e.g., TUV-27001-2026-99"
                    value={newCertNumber}
                    onChange={(e) => setNewCertNumber(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-zinc-100 focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 font-medium mb-1">Expiration Date</label>
                  <input
                    type="date"
                    value={newCertExpiry}
                    onChange={(e) => setNewCertExpiry(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-zinc-100 focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCertUploadModal(false)}
                  className="px-4 py-2 bg-zinc-900 text-zinc-400 hover:text-zinc-200 rounded-xl font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-500 hover:bg-indigo-400 text-zinc-950 font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-500/20 cursor-pointer"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Upload & Verify</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
