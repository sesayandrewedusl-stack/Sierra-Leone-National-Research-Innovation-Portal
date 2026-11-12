import React, { useState, useEffect } from 'react';
import { Competition } from '../types';
import { Award, Calendar, Users, DollarSign, CheckCircle2, ArrowRight } from 'lucide-react';

interface CompetitionsProps {
  onOpenRegister: () => void;
  currentUser: any;
}

export const Competitions: React.FC<CompetitionsProps> = ({ onOpenRegister, currentUser }) => {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [appliedId, setAppliedId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/competitions')
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setCompetitions(d.competitions);
      })
      .catch((err) => console.warn('Failed to load competitions:', err));
  }, []);

  const handleApply = async (comp: Competition) => {
    if (!currentUser) {
      onOpenRegister();
      return;
    }

    try {
      const res = await fetch(`/api/competitions/${comp.id}/apply`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setAppliedId(comp.id);
        setCompetitions((prev) =>
          prev.map((c) => (c.id === comp.id ? data.competition : c))
        );
      }
    } catch (err) {
      alert('Application could not be recorded.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 md:px-8 space-y-8">
      <div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#1EB53A]">
          Ministry Endorsed Challenges
        </span>
        <h1 className="text-2xl md:text-3xl font-extrabold text-[#10243A]">
          National Innovation Competitions &amp; Grants
        </h1>
        <p className="text-xs md:text-sm text-slate-500 mt-1">
          Compete with fellow scholars, lecturers, and technical teams to win funding in New Leones (NLe).
        </p>
      </div>

      <div className="space-y-6">
        {competitions.map((comp) => {
          const isApplied = appliedId === comp.id;

          return (
            <div
              key={comp.id}
              className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-xs border-l-8 border-[#1EB53A] space-y-4 hover:shadow-sm transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="text-[11px] font-bold uppercase tracking-wider bg-blue-50 text-[#0072C6] px-3 py-1 rounded-full self-start">
                  {comp.category}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-semibold">Prize Pool:</span>
                  <span className="font-mono text-xl md:text-2xl font-black text-[#1EB53A]">
                    NLe {comp.prizePoolNLe.toLocaleString()}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-lg md:text-xl font-extrabold text-[#10243A]">{comp.title}</h3>
                <p className="text-xs md:text-sm text-slate-600 mt-2 leading-relaxed">{comp.description}</p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl text-xs space-y-1 border border-slate-200/80">
                <p className="font-bold text-slate-700">Eligibility &amp; Criteria:</p>
                <p className="text-slate-600">{comp.eligibility}</p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-4 text-slate-500">
                  <span className="flex items-center gap-1.5 font-semibold">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    Deadline: {new Date(comp.deadline).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1.5 font-semibold">
                    <Users className="h-4 w-4 text-[#0072C6]" />
                    {comp.applicantsCount} Teams Applied
                  </span>
                </div>

                <button
                  onClick={() => handleApply(comp)}
                  className={`px-5 py-2.5 rounded-xl font-bold transition flex items-center justify-center gap-2 shadow-xs ${
                    isApplied
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-[#0072C6] hover:bg-[#005a9e] text-white'
                  }`}
                >
                  {isApplied ? (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Application Submitted</span>
                    </>
                  ) : (
                    <>
                      <span>Apply for Grant Competition</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
