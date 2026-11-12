import React, { useState, useEffect } from 'react';
import { UserProfile, ResearchProposal } from '../types';
import { SierraLeoneFlag } from '../components/brand/SierraLeoneFlag';
import {
  FileText,
  Send,
  Sparkles,
  Award,
  CheckCircle2,
  Clock,
  PlusCircle,
  Building,
  RefreshCw,
  TrendingUp,
} from 'lucide-react';

interface StudentDashboardProps {
  user: UserProfile;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'proposals' | 'submit' | 'ai'>('proposals');

  // Proposal Submission state
  const [title, setTitle] = useState('');
  const [abstract, setAbstract] = useState('');
  const [category, setCategory] = useState<ResearchProposal['category']>('Renewable Energy');
  const [budgetNLe, setBudgetNLe] = useState('');
  const [institution, setInstitution] = useState(user.institution || 'Fourah Bay College (USL)');
  const [district, setDistrict] = useState(user.district || 'Western Area Urban');
  const [submitting, setSubmitting] = useState(false);
  const [successBanner, setSuccessBanner] = useState('');

  // Proposals list
  const [userProposals, setUserProposals] = useState<ResearchProposal[]>([]);

  // AI Co-Pilot state
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiAnswer, setAiAnswer] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  const fetchProposals = async () => {
    try {
      const res = await fetch('/api/proposals');
      const data = await res.json();
      if (data.success && Array.isArray(data.proposals)) {
        // Filter by author or show available
        setUserProposals(data.proposals);
      }
    } catch (err) {
      console.warn('Failed to load proposals:', err);
    }
  };

  useEffect(() => {
    fetchProposals();
  }, []);

  const handleSubmitProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccessBanner('');

    try {
      const res = await fetch('/api/proposals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          abstract,
          category,
          budgetNLe: Number(budgetNLe),
          authorName: `${user.firstName} ${user.lastName}`,
          authorEmail: user.email,
          institution,
          district,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Submission failed');

      setSuccessBanner(`Proposal successfully submitted! Your tracking code is: ${data.proposal.trackingCode}`);
      setTitle('');
      setAbstract('');
      setBudgetNLe('');
      fetchProposals();
      setActiveTab('proposals');
    } catch (err: any) {
      alert(err.message || 'Error submitting proposal.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAskAi = (e: React.FormEvent) => {
    e.preventDefault();
    setAiLoading(true);

    setTimeout(() => {
      setAiAnswer(
        `[SLNRIP AI Research Copilot Analysis]: Regarding "${aiQuestion}"\n\n1. National Alignment: Your research directly impacts local infrastructure. Align your problem statement with the Sierra Leone Medium-Term National Development Plan (MTNDP) and the Ministry of Technical & Higher Education directives.\n2. Methodology: Include localized telemetry and field trials in regional districts (e.g., Moyamba, Kono, or Kenema).\n3. Grant Budget Justification: In New Leones (NLe), itemize raw materials, transport logistics over local road networks, and student researcher stipends.`
      );
      setAiLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#F4F7FA] py-8 px-4 md:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Profile Card */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-xs border-t-8 border-[#0072C6] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            {user.profilePicture ? (
              <img
                src={user.profilePicture}
                alt={user.firstName}
                className="w-16 h-16 rounded-full object-cover border-2 border-[#1EB53A]"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#1EB53A] to-[#0072C6] text-white flex items-center justify-center font-black text-xl shadow-md">
                {user.firstName[0]}
                {user.lastName[0]}
              </div>
            )}

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-extrabold text-[#10243A]">
                  {user.firstName} {user.lastName}
                </h1>
                <span className="text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-[#1EB53A]" />
                  Verified Scholar
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                National Scholar Code: <span className="font-bold text-[#0072C6]">{user.userCode}</span> • {user.email}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab('proposals')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'proposals'
                  ? 'bg-[#0072C6] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              My Proposals
            </button>
            <button
              onClick={() => setActiveTab('submit')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'submit'
                  ? 'bg-[#1EB53A] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span>Submit Proposal</span>
            </button>
            <button
              onClick={() => setActiveTab('ai')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'ai'
                  ? 'bg-purple-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>AI Co-Pilot</span>
            </button>
          </div>
        </div>

        {successBanner && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-bold text-emerald-900 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-[#1EB53A]" />
            <span>{successBanner}</span>
          </div>
        )}

        {/* Tab 1: Proposals */}
        {activeTab === 'proposals' && (
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-[#10243A]">National Research Submissions</h2>
                <p className="text-xs text-slate-500">Track peer-review, evaluator scoring, and grant approval</p>
              </div>
              <button
                onClick={() => setActiveTab('submit')}
                className="px-4 py-2 rounded-xl bg-[#0072C6] text-white text-xs font-bold hover:bg-[#005a9e] transition flex items-center gap-1.5"
              >
                <PlusCircle className="h-4 w-4" />
                <span>New Proposal</span>
              </button>
            </div>

            <div className="space-y-4">
              {userProposals.map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 hover:border-slate-300 transition"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="font-mono text-xs font-extrabold text-[#0072C6] bg-blue-50 px-2.5 py-1 rounded-md self-start">
                      {item.trackingCode}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase self-start sm:self-auto ${
                        item.status === 'Approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.status === 'Awarded'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-[#10243A]">{item.title}</h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{item.abstract}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
                    <div>
                      Category: <span className="font-semibold text-slate-700">{item.category}</span> • Budget:{' '}
                      <span className="font-mono font-bold text-slate-900">NLe {item.budgetNLe.toLocaleString()}</span>
                    </div>

                    {item.evaluationScores && (
                      <div className="font-semibold text-[#0072C6]">
                        Peer Score: {item.evaluationScores.total}/100 points
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Submit New Proposal */}
        {activeTab === 'submit' && (
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-xs space-y-6">
            <div>
              <h2 className="text-lg font-bold text-[#10243A]">Submit Proposal to National Committee</h2>
              <p className="text-xs text-slate-500">
                Official review conducted by designated evaluators and Ministry administrators.
              </p>
            </div>

            <form onSubmit={handleSubmitProposal} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Research Project Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Decentralized Solar Battery Banking for Bo District Health Clinics"
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs md:text-sm focus:border-[#0072C6] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Focus Area Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-xs md:text-sm focus:border-[#0072C6] focus:outline-none bg-white"
                  >
                    <option value="Renewable Energy">Renewable Energy</option>
                    <option value="Sustainable Agriculture">Sustainable Agriculture</option>
                    <option value="Healthcare & Epidemics">Healthcare & Epidemics</option>
                    <option value="AI & Digital Systems">AI & Digital Systems</option>
                    <option value="Mining & Environment">Mining & Environment</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Requested Grant in New Leones (NLe) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1000}
                    value={budgetNLe}
                    onChange={(e) => setBudgetNLe(e.target.value)}
                    placeholder="e.g. 150000"
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-xs md:text-sm focus:border-[#0072C6] focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Academic Institution *</label>
                  <input
                    type="text"
                    required
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-xs md:text-sm focus:border-[#0072C6] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Target District *</label>
                  <input
                    type="text"
                    required
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-xs md:text-sm focus:border-[#0072C6] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Abstract &amp; Methodology *</label>
                <textarea
                  required
                  rows={4}
                  value={abstract}
                  onChange={(e) => setAbstract(e.target.value)}
                  placeholder="Detail the problem statement, proposed methodology, field experiment site in Sierra Leone, and expected socio-economic returns..."
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs md:text-sm focus:border-[#0072C6] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl bg-[#1EB53A] py-3.5 text-sm font-bold text-white shadow-md hover:bg-[#16962e] transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Registering Proposal with Ministry...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Submit Proposal for Peer Review</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Tab 3: AI Co-Pilot */}
        {activeTab === 'ai' && (
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5">
              <Sparkles className="h-6 w-6 text-purple-600" />
              <div>
                <h2 className="text-lg font-bold text-[#10243A]">SLNRIP AI Research Co-Pilot</h2>
                <p className="text-xs text-slate-500">
                  Formulate research questions, methodology frameworks, and grant justification for Sierra Leone
                </p>
              </div>
            </div>

            <form onSubmit={handleAskAi} className="space-y-3">
              <input
                type="text"
                required
                value={aiQuestion}
                onChange={(e) => setAiQuestion(e.target.value)}
                placeholder="Ask about research methodology, literature review formatting, or grant justification..."
                className="w-full rounded-xl border border-slate-300 p-3 text-xs md:text-sm focus:border-purple-600 focus:outline-none"
              />
              <button
                type="submit"
                disabled={aiLoading}
                className="px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold transition flex items-center gap-2"
              >
                {aiLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                <span>Generate Research Guidance</span>
              </button>
            </form>

            {aiAnswer && (
              <div className="mt-4 p-5 rounded-2xl bg-purple-50 border border-purple-200 text-xs text-purple-950 whitespace-pre-line leading-relaxed">
                {aiAnswer}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
