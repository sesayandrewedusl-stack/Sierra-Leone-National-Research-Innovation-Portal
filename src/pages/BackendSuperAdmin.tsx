import React, { useState, useEffect } from 'react';
import { SLNRIPLogo } from '../components/brand/SLNRIPLogo';
import { SierraLeoneFlag } from '../components/brand/SierraLeoneFlag';
import { ResearchProposal, UserProfile, Competition } from '../types';
import {
  ShieldCheck,
  Lock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Award,
  Users,
  FileText,
  DollarSign,
  TrendingUp,
  RefreshCw,
  LogOut,
  Sliders,
  ExternalLink,
  Search,
} from 'lucide-react';

interface BackendSuperAdminProps {
  isSuperadmin: boolean;
  onSuperadminLogin: (token: string) => void;
  onSuperadminLogout: () => void;
}

export const BackendSuperAdmin: React.FC<BackendSuperAdminProps> = ({
  isSuperadmin,
  onSuperadminLogin,
  onSuperadminLogout,
}) => {
  // Login form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Dashboard data
  const [activeTab, setActiveTab] = useState<'proposals' | 'users' | 'competitions' | 'audit'>('proposals');
  const [proposals, setProposals] = useState<ResearchProposal[]>([]);
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProposal, setSelectedProposal] = useState<ResearchProposal | null>(null);
  const [actionNotes, setActionNotes] = useState('');

  const loadData = async () => {
    try {
      const [pRes, cRes] = await Promise.all([
        fetch('/api/proposals'),
        fetch('/api/competitions'),
      ]);
      const pData = await pRes.json();
      const cData = await cRes.json();
      if (pData.success) setProposals(pData.proposals);
      if (cData.success) setCompetitions(cData.competitions);
    } catch (err) {
      console.warn('Failed to fetch backend data:', err);
    }
  };

  useEffect(() => {
    if (isSuperadmin) {
      loadData();
    }
  }, [isSuperadmin]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const res = await fetch('/api/backend/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Access Denied: Unrecognized administrator credentials.');
      }

      onSuperadminLogin(data.token);
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProposalStatus = async (id: string, newStatus: ResearchProposal['status']) => {
    try {
      const res = await fetch(`/api/proposals/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, notes: actionNotes }),
      });
      const data = await res.json();
      if (data.success) {
        setProposals((prev) => prev.map((p) => (p.id === id ? data.proposal : p)));
        setSelectedProposal(null);
        setActionNotes('');
      }
    } catch (err) {
      alert('Failed to update status.');
    }
  };

  // If not authenticated, show exclusive Ministry Superadmin Login Gateway
  if (!isSuperadmin) {
    return (
      <div className="min-h-[85vh] bg-[#10243A] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border-t-8 border-[#1EB53A] animate-in fade-in zoom-in-95 duration-200">
          <div className="p-8 text-center">
            <SLNRIPLogo className="h-16 mx-auto mb-4 justify-center" showText={false} />

            <div className="inline-flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-full text-xs font-bold text-[#10243A] mb-3">
              <SierraLeoneFlag className="h-3 w-5" />
              <span>Restricted Ministry Superadmin Gateway</span>
            </div>

            <h1 className="text-xl font-extrabold text-[#10243A]">National Backend Portal</h1>
            <p className="text-xs text-slate-500 mt-1">
              Protected Infrastructure for Founder &amp; Ministry Administration Only
            </p>

            {errorMessage && (
              <div className="mt-4 p-3 rounded-xl bg-red-50 text-red-700 border border-red-200 text-xs font-semibold flex items-center gap-2 text-left">
                <AlertTriangle className="h-4 w-4 text-red-600 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="mt-6 space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Superadmin Username
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter administrator username"
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs md:text-sm focus:border-[#0072C6] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Administrative Key / Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter secure master password"
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs md:text-sm focus:border-[#0072C6] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-[#0072C6] py-3 text-sm font-bold text-white shadow-lg hover:bg-[#005a9e] transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Validating Master Credentials...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-4 w-4" />
                    <span>Authenticate &amp; Enter Backend</span>
                  </>
                )}
              </button>

              <div className="pt-2 text-center">
                <p className="text-[11px] text-slate-400">
                  Authorized access strictly verified against backend registry.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated Superadmin Command Center
  const totalFunding = proposals.reduce((acc, p) => acc + (p.budgetNLe || 0), 0);
  const approvedProposals = proposals.filter((p) => p.status === 'Approved' || p.status === 'Awarded');
  const pendingReview = proposals.filter((p) => p.status === 'Submitted' || p.status === 'Under Review');

  const filteredProposals = proposals.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.trackingCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.authorName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F4F7FA]">
      {/* Top Banner */}
      <div className="bg-[#10243A] text-white px-4 md:px-8 py-5 border-b-4 border-[#1EB53A]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#1EB53A] to-[#0072C6] flex items-center justify-center font-bold text-lg">
              AS
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg md:text-xl font-extrabold tracking-tight">
                  National Research &amp; Innovation Backend
                </h1>
                <span className="bg-[#1EB53A] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                  Founder Superadmin
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Logged in as: <span className="font-mono text-emerald-400 font-bold">sesayandrewedusl</span> • Republic of Sierra Leone
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadData}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-semibold flex items-center gap-1.5 text-slate-200 hover:text-white transition"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Refresh</span>
            </button>
            <button
              onClick={onSuperadminLogout}
              className="px-3 py-2 bg-red-600/80 hover:bg-red-600 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Disconnect Backend</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
        {/* Statistics Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs border-l-4 border-[#0072C6]">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Proposals</p>
            <h3 className="text-3xl font-extrabold text-[#10243A] mt-1">{proposals.length}</h3>
            <span className="text-xs text-[#0072C6] font-semibold">Across all Sierra Leone districts</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs border-l-4 border-amber-500">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Pending Review</p>
            <h3 className="text-3xl font-extrabold text-amber-600 mt-1">{pendingReview.length}</h3>
            <span className="text-xs text-slate-500">Requires superadmin decision</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs border-l-4 border-[#1EB53A]">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Approved Grants</p>
            <h3 className="text-3xl font-extrabold text-[#1EB53A] mt-1">{approvedProposals.length}</h3>
            <span className="text-xs text-emerald-700 font-semibold">Ready for disbursement</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs border-l-4 border-purple-600">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Requested Funding</p>
            <h3 className="text-3xl font-extrabold text-[#10243A] mt-1">
              NLe {(totalFunding / 1000).toFixed(1)}k
            </h3>
            <span className="text-xs text-slate-500">In New Leones (NLe)</span>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('proposals')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  activeTab === 'proposals'
                    ? 'bg-[#0072C6] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <FileText className="h-4 w-4" />
                <span>Research Proposals ({proposals.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('competitions')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  activeTab === 'competitions'
                    ? 'bg-[#0072C6] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Award className="h-4 w-4" />
                <span>National Competitions ({competitions.length})</span>
              </button>
            </div>

            {activeTab === 'proposals' && (
              <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search code, title, author..."
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-[#0072C6]"
                />
              </div>
            )}
          </div>

          {/* Proposals Tab */}
          {activeTab === 'proposals' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs md:text-sm text-slate-600">
                <thead className="bg-slate-50 text-[11px] uppercase font-bold text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-4">Tracking Code</th>
                    <th className="py-3.5 px-4">Research Title</th>
                    <th className="py-3.5 px-4">Author &amp; Institution</th>
                    <th className="py-3.5 px-4">Budget (NLe)</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Score</th>
                    <th className="py-3.5 px-4 text-right">Superadmin Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProposals.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/60 transition">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#0072C6]">{p.trackingCode}</td>
                      <td className="py-3.5 px-4 font-semibold text-slate-900 max-w-xs truncate">
                        {p.title}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800">{p.authorName}</div>
                        <div className="text-[11px] text-slate-400">{p.institution} • {p.district}</div>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        NLe {p.budgetNLe.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                            p.status === 'Approved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : p.status === 'Awarded'
                              ? 'bg-purple-100 text-purple-800'
                              : p.status === 'Revision Requested'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        {p.evaluationScores ? (
                          <span className="font-mono font-bold text-xs text-[#0072C6]">
                            {p.evaluationScores.total}/100
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">Unscored</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-1.5">
                        <button
                          onClick={() => setSelectedProposal(p)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold transition"
                        >
                          Review &amp; Act
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Competitions Tab */}
          {activeTab === 'competitions' && (
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-[#10243A]">National Research Competitions</h3>
                <span className="text-xs text-slate-500">Government &amp; Partner Endorsed</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {competitions.map((c) => (
                  <div key={c.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-blue-100 text-[#0072C6]">
                      {c.category}
                    </span>
                    <h4 className="font-bold text-sm text-[#10243A]">{c.title}</h4>
                    <p className="text-xs text-slate-600 line-clamp-2">{c.description}</p>
                    <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                      <span className="font-bold text-[#1EB53A]">NLe {c.prizePoolNLe.toLocaleString()}</span>
                      <span className="text-slate-500 font-semibold">{c.applicantsCount} Teams</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal: Review & Decide on Proposal */}
        {selectedProposal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
            <div className="w-full max-w-xl bg-white rounded-2xl p-6 shadow-2xl border-t-8 border-[#0072C6] space-y-4 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <span className="font-mono text-xs font-bold text-[#0072C6]">
                    {selectedProposal.trackingCode}
                  </span>
                  <h3 className="font-bold text-base text-[#10243A]">{selectedProposal.title}</h3>
                </div>
                <button
                  onClick={() => setSelectedProposal(null)}
                  className="text-slate-400 hover:text-slate-700 text-2xl font-bold"
                >
                  &times;
                </button>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl text-xs space-y-2">
                <p><strong>Author:</strong> {selectedProposal.authorName} ({selectedProposal.authorEmail})</p>
                <p><strong>Institution:</strong> {selectedProposal.institution} • {selectedProposal.district}</p>
                <p><strong>Requested Funding:</strong> NLe {selectedProposal.budgetNLe.toLocaleString()}</p>
                <p><strong>Current Status:</strong> <span className="font-bold uppercase text-[#0072C6]">{selectedProposal.status}</span></p>
                <div className="pt-2 border-t border-slate-200">
                  <strong>Abstract:</strong>
                  <p className="text-slate-600 mt-1 leading-relaxed">{selectedProposal.abstract}</p>
                </div>
                {selectedProposal.evaluationScores && (
                  <div className="pt-2 border-t border-slate-200">
                    <strong>Blind Evaluator Score:</strong> {selectedProposal.evaluationScores.total}/100 points
                    {selectedProposal.evaluationScores.evaluatorNotes && (
                      <p className="text-slate-500 italic mt-0.5">"{selectedProposal.evaluationScores.evaluatorNotes}"</p>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Ministry Superadmin Notes / Directives
                </label>
                <textarea
                  rows={2}
                  value={actionNotes}
                  onChange={(e) => setActionNotes(e.target.value)}
                  placeholder="Provide approval criteria or revision guidelines..."
                  className="w-full rounded-xl border border-slate-300 p-2 text-xs focus:outline-none focus:border-[#0072C6]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => handleUpdateProposalStatus(selectedProposal.id, 'Revision Requested')}
                  className="px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-xl text-xs font-bold transition"
                >
                  Request Revision
                </button>
                <button
                  onClick={() => handleUpdateProposalStatus(selectedProposal.id, 'Approved')}
                  className="px-4 py-2 bg-[#1EB53A] text-white hover:bg-[#16962e] rounded-xl text-xs font-bold transition shadow-xs"
                >
                  Approve Grant
                </button>
                <button
                  onClick={() => handleUpdateProposalStatus(selectedProposal.id, 'Awarded')}
                  className="px-4 py-2 bg-purple-700 text-white hover:bg-purple-800 rounded-xl text-xs font-bold transition shadow-xs"
                >
                  Award National Funding
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
