import React, { useState, useEffect } from 'react';
import { 
  X, Download, CheckCircle2, Award, Printer, Lock, Loader2, AlertCircle, AlertTriangle, Clock
} from 'lucide-react';
import { 
  CertificateRecord, 
  getSavedCertificate, 
  saveCertificate, 
  generateCertificateId, 
  generateVerificationHash, 
  downloadCertificatePdf,
  printCertificate,
  COURSE_CERT_CONFIGS
} from '../utils/certificateGenerator';
import { useUserAuth } from '../context/UserAuthContext';

export const getCleanCourseName = (courseId?: string, explicitTitle?: string): string => {
  const combined = `${courseId || ''} ${explicitTitle || ''}`.toLowerCase();
  if (combined.includes('cyber')) return 'Cyber Security Course';
  if (combined.includes('fullstack') || combined.includes('full-stack')) return 'Full Stack Open Course';
  if (combined.includes('java')) return 'Complete Java Course';
  if (combined.includes('python')) return 'Complete Python Course';
  
  if (explicitTitle && !explicitTitle.toLowerCase().includes('architecture') && !explicitTitle.toLowerCase().includes('defensive') && !explicitTitle.toLowerCase().includes('mooc')) {
    return explicitTitle;
  }
  return 'Complete Python Course';
};

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  earnedPoints?: number;
  courseId?: string;
  courseTitle?: string;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  courseId = 'python-core',
  courseTitle,
}) => {
  const { user } = useUserAuth();
  const config = COURSE_CERT_CONFIGS[courseId] || COURSE_CERT_CONFIGS['python-core'];
  const [certRecord, setCertRecord] = useState<CertificateRecord | null>(() => getSavedCertificate(courseId));
  const actualCourseName = getCleanCourseName(courseId, certRecord?.courseTitle || courseTitle || config.title);
  const [fullNameInput, setFullNameInput] = useState('');
  const [isConfirmedChecked, setIsConfirmedChecked] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Month and Year format for issuance e.g. "October 2026"
  const currentMonthYear = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  useEffect(() => {
    if (isOpen) {
      setIsConfirmedChecked(false);
      const saved = getSavedCertificate(courseId);
      if (saved && (saved.isConfirmed || saved.isLocked)) {
        setCertRecord(saved);
        setFullNameInput(saved.studentName);
      } else {
        setCertRecord(saved || null);
        setFullNameInput('');
      }
    }
  }, [isOpen, courseId]);

  if (!isOpen) return null;

  const isAlreadyConfirmed = Boolean(certRecord && (certRecord.isConfirmed || certRecord.isLocked));

  const handleConfirmAndDownload = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const targetName = (fullNameInput || certRecord?.studentName || '').trim();
    if (!targetName || targetName.length < 2) {
      setErrorMsg('Name must be at least 2 characters.');
      return;
    }
    if (targetName.length > 45) {
      setErrorMsg('Name must not exceed 45 characters.');
      return;
    }

    if (!isConfirmedChecked) {
      setErrorMsg('Please tick the confirmation box to proceed.');
      return;
    }

    setErrorMsg(null);
    setIsProcessing(true);

    try {
      const now = new Date();
      const monthYear = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      const certId = certRecord?.certificateId || generateCertificateId(config.prefix);
      const hash = generateVerificationHash(targetName, certId);

      const newRecord: CertificateRecord = {
        certificateId: certId,
        studentName: targetName,
        issueDate: certRecord?.issueDate || monthYear,
        issueTimestamp: certRecord?.issueTimestamp || now.getTime(),
        courseTitle: actualCourseName,
        totalModules: 14,
        verificationHash: hash,
        isLocked: true,
        isConfirmed: true
      };

      saveCertificate(newRecord, courseId);
      setCertRecord(newRecord);
      try {
        window.dispatchEvent(new Event('dopilot_certificate_claimed'));
      } catch {}

      await downloadCertificatePdf(
        newRecord.studentName,
        newRecord.certificateId,
        newRecord.issueDate,
        newRecord.verificationHash,
        actualCourseName,
        config.subtitle,
        config.competencies,
        courseId
      );
    } catch (err) {
      console.error('Error generating PDF:', err);
      setErrorMsg('Could not download PDF. Please try again or use the Print button.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadExisting = async () => {
    if (!certRecord) return;
    setErrorMsg(null);
    setIsProcessing(true);

    try {
      await downloadCertificatePdf(
        certRecord.studentName,
        certRecord.certificateId,
        certRecord.issueDate,
        certRecord.verificationHash,
        actualCourseName,
        config.subtitle,
        config.competencies,
        courseId
      );
    } catch (err) {
      console.error('Error downloading existing PDF:', err);
      setErrorMsg('Could not download PDF. Please try the Print option.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePrintAction = async () => {
    const targetName = (certRecord?.studentName || fullNameInput).trim();
    if (!targetName || targetName.length < 2) {
      setErrorMsg('Please enter and confirm your full legal name before printing.');
      return;
    }

    setErrorMsg(null);
    try {
      const issueDateStr = certRecord?.issueDate || currentMonthYear;
      const certId = certRecord?.certificateId || generateCertificateId(config.prefix);
      const hash = certRecord?.verificationHash || generateVerificationHash(targetName, certId);

      await printCertificate(
        targetName,
        certId,
        issueDateStr,
        hash,
        actualCourseName,
        config.subtitle,
        config.competencies,
        courseId
      );
    } catch (err) {
      console.error('Error printing certificate:', err);
      setErrorMsg('Could not open print window.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-[#0f1117] border border-white/15 rounded-3xl w-full max-w-lg shadow-2xl relative overflow-hidden text-paper">
        
        {/* Subtle Ambient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-24 bg-amber-500/15 blur-2xl pointer-events-none" />

        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between relative z-10 bg-white/[0.03]">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 shadow-lg shadow-amber-500/10">
              <Award className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="font-jakarta font-extrabold text-base sm:text-lg text-white tracking-tight">
                {isAlreadyConfirmed ? 'Official Course Certificate' : 'Confirm Certificate Recipient Name'}
              </h3>
              <p className="font-sans text-xs sm:text-sm font-semibold text-amber-300 mt-0.5">
                {actualCourseName}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/[0.06] hover:bg-white/15 text-gray-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-7 space-y-5">
          {(!certRecord || !isAlreadyConfirmed) ? (
            /* Confirmation Step: Ask Student to Confirm Certificate Name */
            <form onSubmit={handleConfirmAndDownload} className="space-y-4">
              <div className="space-y-2">
                <label className="block font-jakarta font-bold text-xs sm:text-sm text-gray-200 uppercase tracking-wider">
                  Confirm Certificate Recipient Name *
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  minLength={2}
                  maxLength={45}
                  value={fullNameInput}
                  onChange={(e) => {
                    setFullNameInput(e.target.value);
                    if (errorMsg) setErrorMsg(null);
                  }}
                  placeholder="Enter your full legal name"
                  className="w-full px-4 py-3.5 rounded-xl bg-white/[0.07] border border-white/25 text-white font-jakarta text-base placeholder:text-gray-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 focus:bg-white/[0.1] transition-all font-semibold"
                />
              </div>

              {/* Notice & Tick Box: High Contrast, Crystal Clear Readability */}
              <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2.5">
                <div>
                  <h5 className="font-jakarta text-xs sm:text-sm font-extrabold text-amber-300 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Important: Permanent Certificate Name</span>
                  </h5>
                  <p className="font-sans text-xs sm:text-sm text-gray-200 mt-1.5 leading-relaxed font-normal">
                    Please double-check your name carefully. Once confirmed, this name will be permanently embedded onto your official certificate and cannot be changed.
                  </p>
                </div>

                <label className="flex items-center gap-3 pt-3 border-t border-amber-500/20 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isConfirmedChecked}
                    onChange={(e) => {
                      setIsConfirmedChecked(e.target.checked);
                      if (errorMsg) setErrorMsg(null);
                    }}
                    className="w-4 h-4 rounded border-amber-400/40 bg-black/80 text-amber-400 accent-amber-400 cursor-pointer shrink-0"
                  />
                  <span className="font-jakarta text-xs sm:text-sm font-semibold text-white">
                    I confirm that this is my correct permanent name
                  </span>
                </label>
              </div>

              {/* System Issue Date (Month and Year Only) - Crisp & Clearly Visible */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-white/[0.06] border border-white/15 flex items-center justify-between text-xs sm:text-sm font-sans">
                <span className="text-gray-200 font-semibold flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Certificate Issue Date:</span>
                </span>
                <span className="text-white font-mono font-bold flex items-center gap-2 bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 rounded-lg">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-emerald-300">{currentMonthYear}</span>
                </span>
              </div>

              {errorMsg && (
                <div className="flex items-center gap-2 text-xs text-rose-300 bg-rose-500/15 border border-rose-500/30 px-3.5 py-2.5 rounded-xl font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isProcessing || !fullNameInput.trim()}
                  className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:opacity-95 text-black font-jakarta font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-amber-500/25 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-98"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-black" />
                      <span>Generating Certificate...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 text-black" />
                      <span>Confirm Name &amp; Download Certificate</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* Already Confirmed & Permanent State (Clean, Professional, Perfectly Aligned) */
            <div className="space-y-4">
              <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-white/[0.08] via-white/[0.03] to-amber-500/[0.04] border border-amber-500/30 space-y-4 shadow-xl relative overflow-hidden">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>Permanent Certificate Name</span>
                    </span>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Permanent</span>
                    </div>
                  </div>
                  <h4 className="font-jakarta text-2xl sm:text-3xl font-black text-white tracking-tight break-words pt-0.5">
                    {certRecord?.studentName}
                  </h4>
                </div>

                <div className="space-y-2.5 pt-3 border-t border-white/10">
                  <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-xs sm:text-sm font-sans">
                    <span className="text-gray-300 font-medium flex items-center gap-2 shrink-0">
                      <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Issue Date:</span>
                    </span>
                    <span className="text-emerald-300 font-mono font-bold tracking-wide">
                      {certRecord?.issueDate || currentMonthYear}
                    </span>
                  </div>

                  {certRecord?.certificateId && (
                    <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-xs sm:text-sm font-sans">
                      <span className="text-gray-300 font-medium flex items-center gap-2 shrink-0">
                        <Award className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>Cert ID:</span>
                      </span>
                      <span className="text-amber-300 font-mono font-bold tracking-wider select-all">
                        {certRecord.certificateId}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-emerald-500/[0.08] border border-emerald-500/25 text-xs sm:text-sm text-gray-200">
                <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="leading-snug">This certificate is permanently registered to your account and cannot be modified.</span>
              </div>

              {errorMsg && (
                <div className="flex items-center gap-2 text-xs text-rose-300 bg-rose-500/15 border border-rose-500/30 px-3.5 py-2.5 rounded-xl font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="flex items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={handleDownloadExisting}
                  disabled={isProcessing}
                  className="flex-1 py-3.5 px-5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:brightness-105 text-black font-jakarta font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-amber-500/25 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 active:scale-98"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-black" />
                      <span>Downloading PDF...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 text-black" />
                      <span>Download Certificate (PDF)</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handlePrintAction}
                  disabled={isProcessing}
                  className="py-3.5 px-4 rounded-2xl bg-white/[0.08] hover:bg-white/15 border border-white/15 text-white font-jakarta font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                  title="Print directly"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print</span>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default CertificateModal;
