import React from 'react';
import { SierraLeoneFlag } from '../components/brand/SierraLeoneFlag';
import { SLNRIPLogo } from '../components/brand/SLNRIPLogo';
import { GraduationCap, Award, Compass, ShieldCheck, CheckCircle } from 'lucide-react';

export const About: React.FC<{ onNavigate: (view: string) => void }> = ({ onNavigate }) => {
  const institutions = [
    { name: 'Fourah Bay College (USL)', location: 'Mount Aureol, Freetown', est: '1827' },
    { name: 'Njala University', location: 'Moyamba & Bo Districts', est: '1964' },
    { name: 'University of Makeni (UNIMAK)', location: 'Makeni, Bombali District', est: '2005' },
    { name: 'Eastern Technical University (ETU)', location: 'Kenema District', est: '2021' },
    { name: 'Ernest Bai Koroma University of Science & Technology (EBKUST)', location: 'Magburaka, Tonkolili', est: '2014' },
    { name: 'Milton Margai Technical University (MMTU)', location: 'Goderich, Freetown', est: '2021' },
  ];

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 md:px-8 space-y-12">
      {/* Overview */}
      <div className="text-center space-y-3">
        <SierraLeoneFlag className="h-6 w-10 mx-auto" />
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#10243A]">
          About the National Research &amp; Innovation Portal
        </h1>
        <p className="text-sm md:text-base text-slate-600 max-w-3xl mx-auto leading-relaxed">
          The Sierra Leone National Research &amp; Innovation Portal (SLNRIP) is an initiative designed to establish an
          interconnected national ecosystem for scholarly research, grant funding, intellectual property protection, and
          technological innovation across the Republic of Sierra Leone.
        </p>
      </div>

      {/* Strategic Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0072C6] flex items-center justify-center font-bold">
            01
          </div>
          <h3 className="font-bold text-base text-[#10243A]">Unified Academic Repository</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Centralizing theses, scientific journals, dissertations, and research papers from all Sierra Leonean tertiary
            institutions with open digital access.
          </p>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#1EB53A] flex items-center justify-center font-bold">
            02
          </div>
          <h3 className="font-bold text-base text-[#10243A]">Equitable Grant Distribution</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Empowering students and lecturers with transparent grant allocations in New Leones (NLe), evaluated via
            blind peer-review rubrics.
          </p>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            03
          </div>
          <h3 className="font-bold text-base text-[#10243A]">Innovation Incubation</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Bridging academia and practical industrial applications to commercialize renewable energy, agri-tech, and
            medical innovations locally.
          </p>
        </div>
      </div>

      {/* Founder Vision Spotlight */}
      <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-200 shadow-sm border-t-8 border-[#1EB53A]">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-gradient-to-tr from-[#1EB53A] to-[#0072C6] flex items-center justify-center text-white text-3xl md:text-4xl font-extrabold flex-shrink-0 shadow-md">
            AS
          </div>
          <div className="space-y-3">
            <span className="text-[10px] uppercase font-bold tracking-wider bg-emerald-50 text-[#1EB53A] px-3 py-1 rounded-full border border-emerald-200">
              Architect &amp; Founder
            </span>
            <h2 className="text-2xl font-bold text-[#10243A]">Andrew Sesay</h2>
            <p className="text-xs md:text-sm font-bold text-slate-500">
              Founder &amp; Proposed Software Developer of SLNRIP • Sierra Leone
            </p>
            <p className="text-xs md:text-sm text-slate-700 leading-relaxed">
              Andrew Sesay conceived SLNRIP to solve the critical gap in accessible academic research telemetry, student grant
              connectivity, and transparent peer evaluation. By creating a modern, high-trust national digital infrastructure,
              he seeks to ensure that every promising Sierra Leonean invention receives validation and financial support.
            </p>
          </div>
        </div>
      </div>

      {/* Participating Higher Education Institutions */}
      <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-xs space-y-6">
        <div>
          <h3 className="text-lg font-bold text-[#10243A]">Participating Tertiary Institutions</h3>
          <p className="text-xs text-slate-500">Connected to the National Research Grid across Sierra Leone</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {institutions.map((inst, i) => (
            <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between">
              <div>
                <h4 className="font-bold text-sm text-[#10243A]">{inst.name}</h4>
                <p className="text-xs text-slate-500 mt-0.5">{inst.location}</p>
              </div>
              <span className="text-[11px] font-mono font-bold text-slate-400">Est. {inst.est}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
