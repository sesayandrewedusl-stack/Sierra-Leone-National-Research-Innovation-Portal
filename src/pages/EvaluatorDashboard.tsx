import React, { useState, useEffect } from 'react';
import { ResearchProposal } from '../types';
import { SierraLeoneFlag } from '../components/brand/SierraLeoneFlag';
import { Award, ShieldAlert, CheckCircle2, Sliders, FileText, ArrowRight } from 'lucide-react';

export const EvaluatorDashboard: React.FC = () => {
  const [proposals, setProposals] = useState<ResearchProposal[]>([]);
  const [selectedProposal, setSelectedProposal] = useState<ResearchProposal | null>(null);

  // 5 Criteria (0 to 20 each)
  const [scores, setScores] = useState({
    originality: 16,
    innovation: 17,
    feasibility: 15,
    relevance: 18,
    impact: 17,
  });
  const [notes, setNotes] = useState('');
  const [submittedStatus, setSubmittedStatus] = useState<string | null>(null);

  const loadProposals = async () => {
    try {
      const res = await fetch('/api/proposals');
      const data = await res.json();
      if (data.success) {
        setProposals(data.proposals);
        if (data.proposals.length > 0 && !selectedProposal) {
          setSelectedProposal(data.proposals[0]);
        }
      }
    } catch (err) {
      console.warn('Failed to load proposals:', err);
    }
  };

  useEffect(() => {
    loadProposals();
  }, []);

  const totalScore =
    scores.originality +
    scores.innovation +
    scores.feasibility +
    scores.relevance +
    scores.impact;

  const handleScoreSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProposal) return;

    try {
      const res = await fetch(`/api/proposals/${selectedProposal.id}/evaluate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originality: scores.originality,
          innovation: scores.innovation,
          feasibility: scores.feasibility,
          relevance: scores.relevance,
          impact: scores.impact,
          notes,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSubmittedStatus(`Evaluation successfully recorded: ${totalScore}/100 points.`);
        setProposals((prev) =>
          prev.map((p) => (p.id === selectedProposal.id ? data.proposal : p))
        );
      }
    } catch (err) {
      alert('Failed to submit evaluation.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 md:px-8 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <SierraLeoneFlag className="h-4 w-6" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#0072C6]">
              Designated Academic Evaluator Portal
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#10243A] mt-1">
            Anonymous Peer-Review &amp; Scoring Matrix
          </h1>
          <p className="text-xs md:text-sm text-slate-500">
            Blind evaluation rubric ensuring equitable grant awards across all 16 districts.
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 px-3.5 py-1.5 rounded-xl text-xs font-bold text-[#0072C6] self-start md:self-auto flex items-center gap-2">
          <ShieldAlert className="h-4 w-4" />
          <span>Double-Blind Review: Applicant Names Masked</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Proposals Selector */}
        <div className="space-y-3">
          <h3 className="font-bold text-sm text-[#10243A]">Select Proposal for Evaluation</h3>
          <div className="space-y-2.5">
            {proposals.map((p) => {
              const isSelected = selectedProposal?.id === p.id;

              return (
                <button
                  key={p.id}
                  onClick={() => {
                    setSelectedProposal(p);
                    setSubmittedStatus(null);
                  }}
                  className={`w-full text-left p-4 rounded-2xl border transition ${
                    isSelected
                      ? 'bg-blue-50/70 border-[#0072C6] shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-mono font-bold text-[#0072C6]">{p.trackingCode}</span>
                    <span className="text-[10px] uppercase font-bold text-slate-400">
                      {p.category}
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-slate-900 line-clamp-2">{p.title}</h4>
                  <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between">
                    <span>Region: {p.district}</span>
                    <span className="font-bold text-[#1EB53A]">NLe {p.budgetNLe.toLocaleString()}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Evaluation Rubric */}
        <div className="lg:col-span-2 space-y-6">
          {selectedProposal ? (
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-xs border-t-8 border-[#0072C6] space-y-6">
              {/* Proposal Abstract */}
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#0072C6]">
                    Application: {selectedProposal.trackingCode}
                  </span>
                  <span className="text-xs font-bold text-slate-400">
                    Institution: <span className="text-slate-800">{selectedProposal.institution}</span>
                  </span>
                </div>
                <h2 className="text-lg font-bold text-[#10243A] mt-1">{selectedProposal.title}</h2>
                <div className="mt-3 p-4 bg-slate-50 rounded-xl text-xs text-slate-700 leading-relaxed border border-slate-200/80">
                  <strong>Abstract &amp; Problem Statement:</strong>
                  <p className="mt-1">{selectedProposal.abstract}</p>
                </div>
              </div>

              {submittedStatus ? (
                <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
                  <CheckCircle2 className="h-8 w-8 text-[#1EB53A] mx-auto" />
                  <h3 className="font-bold text-sm text-emerald-900">{submittedStatus}</h3>
                  <p className="text-xs text-emerald-700">
                    Your assessment has been officially submitted to the National Ministry Ledger.
                  </p>
                  <button
                    onClick={() => setSubmittedStatus(null)}
                    className="mt-2 px-4 py-1.5 bg-[#0072C6] text-white rounded-lg text-xs font-bold"
                  >
                    Adjust Scores
                  </button>
                </div>
              ) : (
                <form onSubmit={handleScoreSubmit} className="space-y-4">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">
                    National Judging Matrix (20 Points Each • Max 100 Points)
                  </h4>

                  {[
                    { key: 'originality', label: '1. Originality & Academic Novelty (20%)' },
                    { key: 'innovation', label: '2. Technological & Scientific Innovation (20%)' },
                    { key: 'feasibility', label: '3. Technical Feasibility & Methodology (20%)' },
                    { key: 'relevance', label: '4. Sierra Leone National Relevance (20%)' },
                    { key: 'impact', label: '5. Socio-Economic Impact & Job Creation (20%)' },
                  ].map(({ key, label }) => (
                    <div
                      key={key}
                      className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <span className="text-xs font-bold text-[#10243A]">{label}</span>
                      <div className="flex items-center gap-3">
                        <input
                          type="range"
                          min="0"
                          max="20"
                          value={(scores as any)[key]}
                          onChange={(e) =>
                            setScores({ ...scores, [key]: Number(e.target.value) })
                          }
                          className="w-36 accent-[#0072C6]"
                        />
                        <span className="font-mono font-extrabold text-sm text-[#0072C6] w-8 text-right">
                          {(scores as any)[key]}
                        </span>
                      </div>
                    </div>
                  ))}

                  {/* Total Calculated Score */}
                  <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                        Composite Weighted Score
                      </span>
                      <span className="text-xs text-slate-600">Calculated across 5 national rubrics</span>
                    </div>
                    <span className="font-mono text-3xl font-black text-[#0072C6]">
                      {totalScore} <span className="text-base text-slate-400 font-normal">/ 100</span>
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Evaluator Confidential Notes &amp; Recommendations
                    </label>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Comment on regional feasibility, data collection methodology, or budget justification..."
                      className="w-full rounded-xl border border-slate-300 p-2 text-xs focus:outline-none focus:border-[#0072C6]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-xl bg-[#0072C6] py-3 text-sm font-bold text-white shadow-md hover:bg-[#005a9e] transition"
                  >
                    Submit Confidential Score ({totalScore}/100)
                  </button>
                </form>
              )}
            </div>
          ) : (
            <div className="p-12 bg-white rounded-3xl border border-slate-200 text-center text-slate-400">
              Select a proposal to begin anonymous scoring.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
