import { jsPDF } from 'jspdf';
import { PDFDocument, rgb, StandardFonts, PDFName } from 'pdf-lib';

export interface CertificateRecord {
  certificateId: string;
  studentName: string;
  issueDate: string;
  issueTimestamp: number;
  courseTitle: string;
  totalModules: number;
  verificationHash: string;
  isLocked: boolean;
  isConfirmed?: boolean;
}

export interface CourseCertConfig {
  courseId: string;
  title: string;
  subtitle: string;
  competencies: string;
  prefix: string;
  storageKey: string;
}

export const COURSE_CERT_CONFIGS: Record<string, CourseCertConfig> = {
  'python-core': {
    courseId: 'python-core',
    title: 'Complete Python Course',
    subtitle: '14 Comprehensive Modules • Core & Advanced Standards • Software Architecture',
    competencies: 'ALGORITHMIC LOGIC   •   DATA STRUCTURES   •   OOP ARCHITECTURE   •   PYGAME ENGINE',
    prefix: 'DOP-PY',
    storageKey: 'dopilot_python_certificate_record'
  },
  'java-core': {
    courseId: 'java-core',
    title: 'Complete Java Course',
    subtitle: '14 Comprehensive Modules • Core & Advanced Standards • Software Architecture',
    competencies: 'OBJECT-ORIENTED DESIGN   •   COLLECTIONS   •   STREAMS & LAMBDAS   •   DATA STRUCTURES',
    prefix: 'DOP-JAVA',
    storageKey: 'dopilot_java_certificate_record'
  },
  'complete-java-programming': {
    courseId: 'complete-java-programming',
    title: 'Complete Java Course',
    subtitle: '14 Comprehensive Modules • Core & Advanced Standards • Software Architecture',
    competencies: 'OBJECT-ORIENTED DESIGN   •   COLLECTIONS   •   STREAMS & LAMBDAS   •   DATA STRUCTURES',
    prefix: 'DOP-JAVA',
    storageKey: 'dopilot_java_certificate_record'
  },
  'fullstack-open': {
    courseId: 'fullstack-open',
    title: 'Full Stack Open Course',
    subtitle: '14 Comprehensive Modules • Modern Web Standards • Production Architecture',
    competencies: 'REACT 18   •   NODE.JS & EXPRESS   •   TYPESCRIPT   •   GRAPHQL & DOCKER',
    prefix: 'DOP-FS',
    storageKey: 'dopilot_fullstack_certificate_record'
  },
  'cyber-security': {
    courseId: 'cyber-security',
    title: 'Cyber Security Course',
    subtitle: '14 Comprehensive Modules • STL & BSDM Curriculum • CISSP Governance',
    competencies: 'NETWORK DEFENSE   •   ETHICAL HACKING   •   MALWARE ANALYSIS   •   CISSP GOVERNANCE',
    prefix: 'DOP-CYBER',
    storageKey: 'dopilot_cyber_certificate_record'
  },
  'cyber-security-core': {
    courseId: 'cyber-security',
    title: 'Cyber Security Course',
    subtitle: '14 Comprehensive Modules • STL & BSDM Curriculum • CISSP Governance',
    competencies: 'NETWORK DEFENSE   •   ETHICAL HACKING   •   MALWARE ANALYSIS   •   CISSP GOVERNANCE',
    prefix: 'DOP-CYBER',
    storageKey: 'dopilot_cyber_certificate_record'
  }
};

/**
 * Retrieve saved certificate record from localStorage for a specific course
 */
export function getSavedCertificate(courseId: string = 'python-core'): CertificateRecord | null {
  try {
    const config = COURSE_CERT_CONFIGS[courseId] || COURSE_CERT_CONFIGS['python-core'];
    const raw = localStorage.getItem(config.storageKey);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.certificateId && parsed.studentName) {
      return parsed as CertificateRecord;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Persist certificate record to localStorage for a specific course
 */
export function saveCertificate(record: CertificateRecord, courseId: string = 'python-core'): void {
  try {
    const config = COURSE_CERT_CONFIGS[courseId] || COURSE_CERT_CONFIGS['python-core'];
    localStorage.setItem(config.storageKey, JSON.stringify(record));
  } catch (err) {
    console.error('Failed to save certificate record:', err);
  }
}

/**
 * Generate a unique verification credential ID e.g. DOP-PY-2026-87412 or DOP-JAVA-2026-87412
 */
export function generateCertificateId(coursePrefix: string = 'DOP-PY'): string {
  const year = new Date().getFullYear();
  const randomPart = Math.floor(10000 + Math.random() * 90000);
  return `${coursePrefix}-${year}-${randomPart}`;
}

/**
 * Generate an authentic verification hash
 */
export function generateVerificationHash(studentName: string, certId: string): string {
  let hash = 0;
  const str = `${studentName}_${certId}_jayadevnair_dopilot_mastery`;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).toUpperCase().padStart(8, '0');
  return `0x${hex}A7F2${certId.slice(-4)}`;
}

/**
 * Check if the Python Core course has been completed
 */
export function isPythonCourseComplete(): boolean {
  return isCourseComplete('python-core');
}

/**
 * Check completion status for any course (python-core, java-core, fullstack-open)
 */
export function isCourseComplete(courseId: string): boolean {
  try {
    if (courseId === 'python-core') {
      if (localStorage.getItem('dopilot_part14_completed') === 'true') {
        return true;
      }
      let completedCount = 0;
      for (let i = 1; i <= 14; i++) {
        const isComp = (i === 1)
          ? (localStorage.getItem('dopilot_part1_completed') === 'true' || localStorage.getItem('dopilot_completed') === 'true')
          : (localStorage.getItem(`dopilot_part${i}_completed`) === 'true');
        if (isComp) completedCount++;
      }
      return completedCount >= 14;
    }

    if (courseId === 'java-core' || courseId === 'complete-java-programming') {
      if (localStorage.getItem('dopilot_java_part14_completed') === 'true') {
        return true;
      }
      let completedCount = 0;
      for (let i = 1; i <= 14; i++) {
        if (localStorage.getItem(`dopilot_java_part${i}_completed`) === 'true') {
          completedCount++;
        }
      }
      return completedCount >= 14;
    }

    if (courseId === 'fullstack-open') {
      if (localStorage.getItem('dopilot_fullstack_part13_completed') === 'true') {
        return true;
      }
      let completedCount = 0;
      for (let i = 0; i <= 13; i++) {
        if (localStorage.getItem(`dopilot_fullstack_part${i}_completed`) === 'true') {
          completedCount++;
        }
      }
      return completedCount >= 14;
    }

    if (courseId === 'cyber-security' || courseId === 'cyber-security-core') {
      if (localStorage.getItem('dopilot_cyber_part14_completed') === 'true') {
        return true;
      }
      let completedCount = 0;
      for (let i = 1; i <= 14; i++) {
        if (localStorage.getItem(`dopilot_cyber_part${i}_completed`) === 'true') {
          completedCount++;
        }
      }
      return completedCount >= 14;
    }

    return false;
  } catch {
    return false;
  }
}

/**
 * Generate a pure vector, 16:9 Landscape PDF of the certificate
 * Guaranteed 100% reliable: Zero external network CORS delays, razor-sharp text
 */
export function generateCertificateVectorPdf(
  studentName: string,
  certificateId: string,
  issueDate: string,
  verificationHash: string,
  courseTitle: string = 'Complete Python Course',
  courseSubtitle: string = '14 Comprehensive Modules • Core & Advanced Standards • Software Architecture',
  competencies: string = 'ALGORITHMIC LOGIC   •   DATA STRUCTURES   •   OOP ARCHITECTURE   •   PYGAME ENGINE'
): jsPDF {
  // Exact 16:9 Landscape Dimensions: 297mm width x 167.0625mm height
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: [297, 167.0625],
    compress: true
  });

  const pageWidth = 297;
  const pageHeight = 167.0625;

  // Pure White Background
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Outer Deep Navy Border Frame
  doc.setDrawColor(15, 23, 42);
  doc.setLineWidth(0.8);
  doc.rect(8, 8, pageWidth - 16, pageHeight - 16);

  // Inner Gold Border Frame
  doc.setDrawColor(200, 155, 45);
  doc.setLineWidth(0.35);
  doc.rect(10.5, 10.5, pageWidth - 21, pageHeight - 21);

  // Corner Accents
  const cornerLen = 6;
  doc.setLineWidth(0.6);
  // Top-Left
  doc.line(13, 13, 13 + cornerLen, 13);
  doc.line(13, 13, 13, 13 + cornerLen);
  // Top-Right
  doc.line(pageWidth - 13 - cornerLen, 13, pageWidth - 13, 13);
  doc.line(pageWidth - 13, 13, pageWidth - 13, 13 + cornerLen);
  // Bottom-Left
  doc.line(13, pageHeight - 13, 13 + cornerLen, pageHeight - 13);
  doc.line(13, pageHeight - 13 - cornerLen, 13, pageHeight - 13);
  // Bottom-Right
  doc.line(pageWidth - 13 - cornerLen, pageHeight - 13, pageWidth - 13, pageHeight - 13);
  doc.line(pageWidth - 13, pageHeight - 13 - cornerLen, pageWidth - 13, pageHeight - 13);

  // Header: Institution Branding
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(15, 23, 42);
  doc.text('DO PILOT', pageWidth / 2, 22, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(184, 134, 11);
  doc.text('INSTITUTE OF ADVANCED COMPUTING & SYSTEMS', pageWidth / 2, 26.5, { align: 'center' });

  // Header Accent Line
  doc.setDrawColor(200, 155, 45);
  doc.setLineWidth(0.3);
  doc.line(pageWidth / 2 - 35, 29, pageWidth / 2 + 35, 29);

  // Credential Category
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('OFFICIAL CREDENTIAL OF ACHIEVEMENT', pageWidth / 2, 36, { align: 'center' });

  // Main Certificate Title
  doc.setFont('times', 'bold');
  doc.setFontSize(24);
  doc.setTextColor(15, 23, 42);
  doc.text('CERTIFICATE OF COMPLETION', pageWidth / 2, 46, { align: 'center' });

  // Recipient Presentation Text
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('THIS IS PROUDLY PRESENTED TO', pageWidth / 2, 57, { align: 'center' });

  // Student Full Name
  doc.setFont('times', 'bold');
  doc.setFontSize(26);
  doc.setTextColor(10, 15, 30);
  doc.text(studentName, pageWidth / 2, 69, { align: 'center' });

  // Elegant Underline
  doc.setDrawColor(15, 23, 42);
  doc.setLineWidth(0.4);
  doc.line(pageWidth / 2 - 50, 72, pageWidth / 2 + 50, 72);

  // Achievement Description
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  doc.text('for successfully completing the comprehensive professional engineering curriculum and demonstrating mastery in', pageWidth / 2, 80, { align: 'center' });

  // Course Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(15, 23, 42);
  doc.text(courseTitle, pageWidth / 2, 87.5, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(courseSubtitle, pageWidth / 2, 93, { align: 'center' });

  // Curriculum Competencies Pill
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.2);
  doc.roundedRect(pageWidth / 2 - 75, 98, 150, 9, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(71, 85, 105);
  doc.text(competencies, pageWidth / 2, 103.5, { align: 'center' });

  // Divider above footer
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.line(18, 116, pageWidth - 18, 116);

  // Left Column: Founder & CEO Jayadev Nair Signature
  const sigCenterX = 55;
  doc.setFont('times', 'italic');
  doc.setFontSize(19);
  doc.setTextColor(15, 23, 42);
  doc.text('Jayadev Nair', sigCenterX, 130, { align: 'center' });

  // Signature Flourish Underline
  doc.setDrawColor(15, 23, 42);
  doc.setLineWidth(0.3);
  doc.line(sigCenterX - 22, 133, sigCenterX + 22, 133);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text('Jayadev Nair', sigCenterX, 138, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text('Founder & CEO, DO PILOT', sigCenterX, 142, { align: 'center' });

  // Center: Official Gold Seal
  const sealCenterX = pageWidth / 2;
  doc.setDrawColor(200, 155, 45);
  doc.setFillColor(255, 255, 255);
  doc.setLineWidth(0.7);
  doc.circle(sealCenterX, 133, 11, 'FD');
  doc.setLineWidth(0.25);
  doc.circle(sealCenterX, 133, 9.5, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(5);
  doc.setTextColor(184, 134, 11);
  doc.text('★ DO PILOT ★', sealCenterX, 130.5, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6);
  doc.setTextColor(15, 23, 42);
  doc.text('VERIFIED', sealCenterX, 134.5, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(4.5);
  doc.setTextColor(100, 116, 139);
  doc.text('CREDENTIAL', sealCenterX, 138, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(5.5);
  doc.setTextColor(184, 134, 11);
  doc.text('OFFICIAL ACADEMIC SEAL', sealCenterX, 147, { align: 'center' });

  // Right Column: Verification Metadata
  const metaRightX = pageWidth - 25;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('CREDENTIAL ID:', metaRightX - 35, 127);
  doc.setTextColor(15, 23, 42);
  doc.text(certificateId, metaRightX, 127, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('ISSUED ON:', metaRightX - 35, 132.5);
  doc.setTextColor(15, 23, 42);
  doc.text(issueDate, metaRightX, 132.5, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('SECURITY HASH:', metaRightX - 35, 138);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(verificationHash.slice(0, 14), metaRightX, 138, { align: 'right' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(184, 134, 11);
  doc.text('STATUS: VERIFIED ACADEMIC', metaRightX, 143.5, { align: 'right' });

  // Bottom Disclaimer
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6);
  doc.setTextColor(148, 163, 184);
  doc.text('Verified official credential issued under the academic authority of DO PILOT Institute of Advanced Computing.', pageWidth / 2, 154, { align: 'center' });

  return doc;
}

/**
 * Template file candidates for each course.
 * Uses the course-specific PDF templates located in public/certificates and public/
 */
const TEMPLATE_URLS_BY_COURSE: Record<string, string[]> = {
  'python-core': [
    '/certificates/python-certificate-template.pdf',
    './certificates/python-certificate-template.pdf',
    '/PYTHON CERTIFICATE.pdf',
    './PYTHON CERTIFICATE.pdf'
  ],
  'java-core': [
    '/certificates/java-certificate-template.pdf',
    './certificates/java-certificate-template.pdf',
    '/JAVA CERTIFICATE.pdf',
    './JAVA CERTIFICATE.pdf'
  ],
  'complete-java-programming': [
    '/certificates/java-certificate-template.pdf',
    './certificates/java-certificate-template.pdf',
    '/JAVA CERTIFICATE.pdf',
    './JAVA CERTIFICATE.pdf'
  ],
  'fullstack-open': [
    '/certificates/fullstack-certificate-template.pdf',
    './certificates/fullstack-certificate-template.pdf',
    '/Full Stack Certificate.pdf',
    './Full Stack Certificate.pdf'
  ],
  'cyber-security': [
    '/certificates/cyber-certificate-template.pdf',
    './certificates/cyber-certificate-template.pdf',
    '/CYBER SEC CERTITICATE.pdf',
    './CYBER SEC CERTITICATE.pdf'
  ],
  'cyber-security-core': [
    '/certificates/cyber-certificate-template.pdf',
    './certificates/cyber-certificate-template.pdf',
    '/CYBER SEC CERTITICATE.pdf',
    './CYBER SEC CERTITICATE.pdf'
  ]
};

/**
 * Exact coordinates and XObject identifiers for the dotted line image placeholders
 * across all course certificate templates.
 * Dimensions: Height ~15.75 pt, Width ~657-688 pt, centered around y = 339-342 pt.
 * Background behind this region across all certificates is solid black #000000 rgb(0,0,0).
 */
const DOTTED_LINE_CONFIGS: Record<string, { x: number; y: number; width: number; height: number; xObj: string }> = {
  'python-core': { x: 282.75, y: 331.875, width: 687.75, height: 15.75, xObj: 'X32' },
  'java-core': { x: 283.5, y: 332.79, width: 672.0, height: 15.75, xObj: 'X29' },
  'complete-java-programming': { x: 283.5, y: 332.79, width: 672.0, height: 15.75, xObj: 'X29' },
  'fullstack-open': { x: 283.5, y: 334.38, width: 687.0, height: 15.75, xObj: 'X34' },
  'cyber-security': { x: 298.5, y: 333.82, width: 657.0, height: 15.75, xObj: 'X27' },
  'cyber-security-core': { x: 298.5, y: 333.82, width: 657.0, height: 15.75, xObj: 'X27' }
};

/**
 * Exact coordinates for placing the Month & Year issuance date beside the "Issue Date :" label.
 * Configured independently per course to match each template's distinct label position,
 * typography baseline, and natural spacing:
 * - Python: x = 886, y = 135.5, size = 15 (original reference preserved)
 * - Java: x = 910, y = 142.8, size = 15
 * - Full Stack: x = 908, y = 157.5, size = 15
 * - Cyber Security: x = 907, y = 147.6, size = 15
 */
const ISSUE_DATE_CONFIGS: Record<string, { x: number; y: number; size: number }> = {
  'python-core': { x: 886, y: 135.5, size: 15 },
  'java-core': { x: 910, y: 142.8, size: 15 },
  'complete-java-programming': { x: 910, y: 142.8, size: 15 },
  'fullstack-open': { x: 908, y: 157.5, size: 15 },
  'cyber-security': { x: 907, y: 147.6, size: 15 },
  'cyber-security-core': { x: 907, y: 147.6, size: 15 }
};

/**
 * Loads the course certificate template PDF, removes any unwanted dotted line
 * underneath the student's name, embeds the confirmed name centered cleanly at baseline y = 344,
 * and places the issuance Month & Year beside the "Issue Date :" label.
 * Preserves 100% of the original PDF graphics, background, logos, signatures, and design elements.
 */
export async function generateCertificatePdfFromTemplate(
  studentName: string,
  issueDateMonthYear?: string,
  courseId: string = 'python-core'
): Promise<Uint8Array> {
  let templateBuffer: ArrayBuffer | null = null;
  const possibleUrls = TEMPLATE_URLS_BY_COURSE[courseId] || TEMPLATE_URLS_BY_COURSE['python-core'];

  for (const url of possibleUrls) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        templateBuffer = await res.arrayBuffer();
        break;
      }
    } catch {
      // try next path
    }
  }

  if (!templateBuffer) {
    throw new Error(`Could not load certificate template PDF for course: ${courseId}`);
  }

  const pdfDoc = await PDFDocument.load(templateBuffer);
  const page = pdfDoc.getPages()[0];
  const { width } = page.getSize();
  const lineCfg = DOTTED_LINE_CONFIGS[courseId] || DOTTED_LINE_CONFIGS['python-core'];

  // 1. Remove the unwanted dotted line:
  // Zero out the opacity mask (SMask) of the dotted line image in the PDF resource dictionary
  try {
    const resources: any = page.node.Resources();
    const xobjects: any = resources?.lookup ? resources.lookup(PDFName.of('XObject')) : null;
    const xobj: any = (xobjects && lineCfg.xObj && typeof xobjects.lookup === 'function')
      ? xobjects.lookup(PDFName.of(lineCfg.xObj))
      : null;
    if (xobj && typeof xobj.dict?.lookup === 'function') {
      const smaskRef = xobj.dict.lookup(PDFName.of('SMask'));
      const smaskStream: any = smaskRef ? (pdfDoc.context as any).lookup(smaskRef) : null;
      if (smaskStream && typeof smaskStream.dict?.lookup === 'function') {
        const w = smaskStream.dict.lookup(PDFName.of('Width'))?.asNumber?.() || 900;
        const h = smaskStream.dict.lookup(PDFName.of('Height'))?.asNumber?.() || 21;
        const transparentBytes = new Uint8Array(w * h);
        const newSmaskStream = pdfDoc.context.flateStream(transparentBytes, {
          Type: 'XObject',
          Subtype: 'Image',
          Width: w,
          Height: h,
          BitsPerComponent: 8,
          ColorSpace: 'DeviceGray'
        });
        xobj.dict.set(PDFName.of('SMask'), pdfDoc.context.register(newSmaskStream));
      }
    }
  } catch {
    // Gracefully proceed to background-matched overlay
  }

  // 2. Exact background overlay: The certificate background is solid black #000000 rgb(0,0,0)
  // Perfectly matches the certificate background tone with zero visible patch or marks.
  page.drawRectangle({
    x: lineCfg.x - 2,
    y: lineCfg.y - 1,
    width: lineCfg.width + 4,
    height: lineCfg.height + 2,
    color: rgb(0, 0, 0),
  });

  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // 3. Student Name: Centered horizontally at baseline y = 344 (matching Python reference)
  const trimmedName = studentName.trim();
  let nameSize = 36;
  const maxAllowedWidth = 620;
  let textWidth = fontBold.widthOfTextAtSize(trimmedName, nameSize);
  if (textWidth > maxAllowedWidth) {
    nameSize = Math.max(18, Math.floor((maxAllowedWidth / textWidth) * nameSize));
    textWidth = fontBold.widthOfTextAtSize(trimmedName, nameSize);
  }
  const nameX = (width - textWidth) / 2;
  const nameY = 344;

  page.drawText(trimmedName, {
    x: nameX,
    y: nameY,
    size: nameSize,
    font: fontBold,
    color: rgb(1, 1, 1), // Crisp white matching original certificate typography
  });

  // 4. Issue Date: Only Month and Year beside "Issue Date :" label
  // Positioned independently per certificate template so baseline and spacing align perfectly
  const dateCfg = ISSUE_DATE_CONFIGS[courseId] || ISSUE_DATE_CONFIGS['python-core'];
  const formattedDate = issueDateMonthYear || new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  page.drawText(formattedDate, {
    x: dateCfg.x,
    y: dateCfg.y,
    size: dateCfg.size,
    font: fontRegular,
    color: rgb(0.95, 0.95, 0.95), // Off-white matching certificate subtitle tone
  });

  return await pdfDoc.save();
}

/**
 * Download certificate PDF.
 * Uses the original certificate PDF template with confirmed student name & issue month/year overlaid.
 */
export async function downloadCertificatePdf(
  studentName: string,
  certificateId: string,
  issueDate?: string,
  verificationHash?: string,
  courseTitle?: string,
  courseSubtitle?: string,
  competencies?: string,
  courseId: string = 'python-core'
): Promise<void> {
  const dateObj = issueDate ? new Date(issueDate) : new Date();
  const monthYearStr = !isNaN(dateObj.getTime())
    ? dateObj.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const config = COURSE_CERT_CONFIGS[courseId] || COURSE_CERT_CONFIGS['python-core'];

  try {
    const pdfBytes = await generateCertificatePdfFromTemplate(studentName, monthYearStr, courseId);
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const blobUrl = URL.createObjectURL(blob);
    const cleanName = studentName.trim().replace(/[^a-zA-Z0-9_-]/g, '_') || 'Student';
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = `DO_PILOT_${config.prefix}_Certificate_${cleanName}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(blobUrl), 2000);
  } catch (err) {
    console.warn('Template PDF loading failed, falling back to vector PDF:', err);
    const dateStr = issueDate || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const hashStr = verificationHash || generateVerificationHash(studentName, certificateId);
    const doc = generateCertificateVectorPdf(
      studentName,
      certificateId,
      dateStr,
      hashStr,
      courseTitle || config.title,
      courseSubtitle || config.subtitle,
      competencies || config.competencies
    );
    const cleanName = studentName.trim().replace(/[^a-zA-Z0-9_-]/g, '_') || 'Student';
    doc.save(`DO_PILOT_Certificate_${cleanName}_${certificateId}.pdf`);
  }
}

/**
 * Print the certificate cleanly via a hidden printable iframe or window
 */
export async function printCertificate(
  studentName: string,
  certificateId: string,
  issueDate?: string,
  verificationHash?: string,
  courseTitle?: string,
  courseSubtitle?: string,
  competencies?: string,
  courseId: string = 'python-core'
): Promise<void> {
  const dateObj = issueDate ? new Date(issueDate) : new Date();
  const monthYearStr = !isNaN(dateObj.getTime())
    ? dateObj.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const config = COURSE_CERT_CONFIGS[courseId] || COURSE_CERT_CONFIGS['python-core'];

  let blobUrl: string;
  try {
    const pdfBytes = await generateCertificatePdfFromTemplate(studentName, monthYearStr, courseId);
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    blobUrl = URL.createObjectURL(blob);
  } catch {
    const dateStr = issueDate || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const hashStr = verificationHash || generateVerificationHash(studentName, certificateId);
    const doc = generateCertificateVectorPdf(
      studentName,
      certificateId,
      dateStr,
      hashStr,
      courseTitle || config.title,
      courseSubtitle || config.subtitle,
      competencies || config.competencies
    );
    const blob = doc.output('blob');
    blobUrl = URL.createObjectURL(blob);
  }

  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  iframe.src = blobUrl;

  document.body.appendChild(iframe);
  iframe.onload = () => {
    try {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    } catch {
      window.open(blobUrl, '_blank');
    }
    setTimeout(() => {
      if (document.body.contains(iframe)) {
        document.body.removeChild(iframe);
      }
      URL.revokeObjectURL(blobUrl);
    }, 60000);
  };
}
