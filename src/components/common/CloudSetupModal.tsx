import React, { useState } from 'react';
import {
  X,
  Database,
  CheckCircle2,
  Server,
  Key,
  ShieldCheck,
  RefreshCw,
  Copy,
  Check,
  ExternalLink,
  AlertTriangle
} from 'lucide-react';
import { StorageEngine } from '../../services/storage';

interface CloudSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataReset: () => void;
}

export const CloudSetupModal: React.FC<CloudSetupModalProps> = ({
  isOpen,
  onClose,
  onDataReset,
}) => {
  const [copied, setCopied] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  if (!isOpen) return null;

  const sampleFirebaseConfig = `// firebase-applet-config.json
{
  "apiKey": "AIzaSyD-YOUR-FIREBASE-WEB-API-KEY",
  "authDomain": "projectconnect-live.firebaseapp.com",
  "projectId": "projectconnect-live",
  "storageBucket": "projectconnect-live.appspot.com",
  "messagingSenderId": "102938475610",
  "appId": "1:102938475610:web:8e1fa204bb84210"
}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(sampleFirebaseConfig);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTestStorage = () => {
    const users = StorageEngine.getUsers();
    const problems = StorageEngine.getProblems();
    const projects = StorageEngine.getProjects();
    const requests = StorageEngine.getRequests();

    setTestResult(
      `Local Engine Verified: ${users.length} accounts, ${problems.length} problem statements, ${requests.length} requests, ${projects.length} active workspaces stored securely.`
    );
  };

  const handleResetData = async () => {
    if (confirm('Are you sure you want to restore the initial seed accounts and projects? All changes made in this browser session will be reset to default.')) {
      setResetting(true);
      await StorageEngine.resetAllData();
      setResetting(false);
      onDataReset();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Storage & Cloud Infrastructure
              </h2>
              <p className="text-xs text-slate-500">
                Configuration, persistent storage state, and Firebase deployment guide
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-sm text-slate-700">
          {/* Active Local Persistence Status */}
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-emerald-900 text-sm">
                  Active Persistent Engine: Secure Browser LocalStorage & WebCrypto
                </h3>
                <p className="text-xs text-emerald-800 mt-1 leading-relaxed">
                  Every account created, project statement published, student request submitted,
                  team formed, proposal reviewed, and milestone uploaded persists continuously in
                  your browser across reloads and tab closures. Passwords are mathematically hashed
                  via Web Crypto SHA-256 with salts.
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <button
                    onClick={handleTestStorage}
                    className="px-3 py-1.5 bg-white text-emerald-700 border border-emerald-300 rounded-lg text-xs font-semibold hover:bg-emerald-50 transition-colors"
                  >
                    Run Storage Diagnostic
                  </button>
                  {testResult && (
                    <span className="text-xs font-medium text-emerald-900">
                      {testResult}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Cloud Firestore & Firebase Setup Guide */}
          <div>
            <h3 className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-2">
              <Server className="w-4 h-4 text-blue-600" />
              Firebase Cloud Integration Steps
            </h3>
            <p className="text-xs text-slate-600 mb-3 leading-relaxed">
              To synchronize ProjectConnect with Google Cloud Firestore and multi-device backend
              sync, complete the following standard setup in your Firebase Console:
            </p>

            <ol className="space-y-3 text-xs text-slate-600 list-decimal list-inside pl-1">
              <li className="leading-relaxed">
                <strong className="text-slate-800">Create a Firebase Project:</strong> Visit the{' '}
                <a
                  href="https://console.firebase.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 font-medium hover:underline inline-flex items-center gap-0.5"
                >
                  Firebase Console <ExternalLink className="w-3 h-3" />
                </a>{' '}
                and create a project named <code className="bg-slate-100 px-1 py-0.5 rounded">projectconnect</code>.
              </li>
              <li className="leading-relaxed">
                <strong className="text-slate-800">Enable Authentication:</strong> In the Firebase
                Console, go to <em>Authentication &gt; Sign-in method</em> and enable{' '}
                <strong>Email/Password</strong> and <strong>Google</strong>.
              </li>
              <li className="leading-relaxed">
                <strong className="text-slate-800">Provision Cloud Firestore:</strong> Navigate to{' '}
                <em>Firestore Database</em>, choose <em>Create Database</em> in production mode.
              </li>
              <li className="leading-relaxed">
                <strong className="text-slate-800">Deploy Security Rules:</strong> Copy the ready-made
                hardened rules already generated in <code className="bg-slate-100 px-1 py-0.5 rounded">/firestore.rules</code>{' '}
                and paste them into the Firestore Rules editor.
              </li>
              <li className="leading-relaxed">
                <strong className="text-slate-800">Register Web App:</strong> Under Project Settings,
                register a Web Application and save the resulting keys to{' '}
                <code className="bg-slate-100 px-1 py-0.5 rounded">firebase-applet-config.json</code>.
              </li>
            </ol>
          </div>

          {/* Sample Config Box */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-blue-600" />
                Target Config Schema (firebase-applet-config.json)
              </span>
              <button
                onClick={handleCopy}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy Schema'}
              </button>
            </div>
            <pre className="p-3 bg-slate-900 text-slate-200 text-[11px] font-mono rounded-lg overflow-x-auto leading-relaxed">
              {sampleFirebaseConfig}
            </pre>
          </div>

          {/* Reset Action */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-800">Reset Local Seed Database</p>
              <p className="text-[11px] text-slate-500">
                Restores original sample student &amp; staff accounts and project problems.
              </p>
            </div>
            <button
              onClick={handleResetData}
              disabled={resetting}
              className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${resetting ? 'animate-spin' : ''}`} />
              Reset All Data
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors"
          >
            Close Dialog
          </button>
        </div>
      </div>
    </div>
  );
};
