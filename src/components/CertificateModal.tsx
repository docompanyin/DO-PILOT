import React, { useState, useEffect } from 'react';
import { 
  X, Download, CheckCircle2, Award, Printer, Lock, Loader2, AlertCircle, AlertTriangle
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
        courseTitle: courseTitle || config.title,
        totalModules: 14,
        verificationHash: hash,
        isLocked: true,
        isConfirmed: true
      };

      saveCertificate(newRecord, courseId);
      setCertRecord(newRecord);

      await downloadCertificatePdf(
        newRecord.studentName,
        newRecord.certificateId,
        newRecord.issueDate,
        newRecord.verificationHash,
        config.title,
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
        config.title,
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
        config.title,
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
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-[#0f1117] border border-white/10 rounded-3xl w-full max-w-lg shadow-2xl relative overflow-hidden text-paper">
        
        {/* Subtle Ambient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-20 bg-emerald-500/15 blur-2xl pointer-events-none" />

        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between relative z-10 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-jakarta font-bold text-base text-paper">
                Official Course Certificate
              </h3>
              <p className="font-mono text-xs text-slate/70">
                Python Programming
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/[0.06] hover:bg-white/15 text-slate hover:text-paper flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {(!certRecord || !isAlreadyConfirmed) ? (
            /* Confirmation Step: Ask Student to Confirm Certificate Name */
            <form onSubmit={handleConfirmAndDownload} className="space-y-4">
              <div className="space-y-2">
                <label className="block font-jakarta font-bold text-xs text-paper uppercase tracking-wider">
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
                  className="w-full px-4 py-3.5 rounded-xl bg-white/[0.05] border border-white/20 text-paper font-jakarta text-base placeholder:text-slate/40 focus:outline-none focus:border-emerald-400 focus:bg-white/[0.08] transition-all font-semibold"
                />
              </div>

              {/* Notice & Tick Box: Name is Permanent and Cannot Be Changed */}
              <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 space-y-3">
                <div>
                  <h5 className="font-jakarta text-xs font-bold text-paper">
                    Important: Permanent Certificate Name
                  </h5>
                  <p className="font-mono text-xs text-slate mt-1 leading-relaxed">
                    Please double-check your name carefully. Once confirmed, this name will be permanently embedded onto your official certificate and cannot be changed.
                  </p>
                </div>

                <label className="flex items-center gap-2.5 pt-2.5 border-t border-white/10 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isConfirmedChecked}
                    onChange={(e) => {
                      setIsConfirmedChecked(e.target.checked);
                      if (errorMsg) setErrorMsg(null);
                    }}
                    className="w-4 h-4 rounded border-white/30 bg-black/60 text-primary accent-primary cursor-pointer shrink-0"
                  />
                  <span className="font-jakarta text-xs font-semibold text-paper">
                    I confirm that this is my correct permanent name
                  </span>
                </label>
              </div>

              {/* System Issue Date (Month and Year Only) */}
              <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-between text-xs font-mono">
                <span className="text-slate">Certificate Issue Date:</span>
                <span className="text-paper font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span>{currentMonthYear}</span>
                </span>
              </div>

              {errorMsg && (
                <div className="flex items-center gap-2 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3.5 py-2.5 rounded-xl">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isProcessing || !fullNameInput.trim()}
                  className="w-full py-3.5 px-5 rounded-2xl bg-primary hover:bg-white text-ink font-jakarta font-black text-xs uppercase tracking-wider shadow-lg shadow-primary/20 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-98"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Generating Certificate...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>Confirm Name &amp; Download Certificate</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* Already Confirmed & Permanent State (No Edit Name Option) */
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white/[0.04] border border-emerald-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate/70 block">
                      Permanent Certificate Name
                    </span>
                    <h4 className="font-jakarta text-lg font-bold text-paper mt-0.5">
                      {certRecord?.studentName}
                    </h4>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Permanent</span>
                  </div>
                </div>

                <div className="pt-2.5 border-t border-white/10 flex items-center justify-between text-xs font-mono text-slate">
                  <span>Issue Date: <strong className="text-paper">{certRecord?.issueDate}</strong></span>
                </div>
              </div>

              <p className="text-xs text-slate/70 font-mono text-center">
                This certificate is permanently registered to your account and cannot be modified.
              </p>

              {errorMsg && (
                <div className="flex items-center gap-2 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3.5 py-2.5 rounded-xl">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="flex items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={handleDownloadExisting}
                  disabled={isProcessing}
                  className="flex-1 py-3 px-5 rounded-2xl bg-primary hover:bg-white text-ink font-jakarta font-black text-xs uppercase tracking-wider shadow-lg shadow-primary/20 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 active:scale-98"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Downloading PDF...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>Download Certificate (PDF)</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handlePrintAction}
                  disabled={isProcessing}
                  className="py-3 px-4 rounded-2xl bg-white/[0.08] hover:bg-white/15 border border-white/15 text-paper font-jakarta font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                  title="Print directly"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print</span>
                </button>
              </div>

              {/* =========================================================================
                  TEMPORARY TEST CONTROLS (REMOVE LATER)
                  ========================================================================= */}
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    localStorage.removeItem(config.storageKey);
                    setCertRecord(null);
                    setIsConfirmedChecked(false);
                    setFullNameInput('');
                  }}
                  className="text-[11px] font-mono text-amber-400/80 hover:text-amber-300 underline cursor-pointer"
                  title="Reset permanent lock so you can test confirming different names"
                >
                  🧪 [Tester: Reset to test another student name]
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
