import React from 'react';
import { SLNRIPLogo } from '../components/brand/SLNRIPLogo';
import { SierraLeoneFlag } from '../components/brand/SierraLeoneFlag';
import {
  BookOpen,
  Award,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Cpu,
  Sprout,
  HeartPulse,
  Sun,
  Pickaxe,
  Waves,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

interface HomeProps {
  onOpenRegister: () => void;
  onNavigate: (view: string) => void;
}

export const Home: React.FC<HomeProps> = ({ onOpenRegister, onNavigate }) => {
  const focusAreas = [
    {
      title: 'Artificial Intelligence & Robotics',
      desc: 'Drone crop surveillance, localized Krio LLMs, and computer vision for disease diagnosis.',
      icon: Cpu,
      color: 'text-[#0072C6]',
      bg: 'bg-blue-50',
    },
    {
      title: 'Sustainable Agriculture & Food Security',
      desc: 'Cassava yield optimization, post-harvest solar drying, and soil telemetry across Kambia and Bo.',
      icon: Sprout,
      color: 'text-[#1EB53A]',
      bg: 'bg-emerald-50',
    },
    {
      title: 'Renewable Electrification',
      desc: 'Mini-hydro along river basins and decentralized solar battery banks for rural health centers.',
      icon: Sun,
      color: 'text-amber-500',
      bg: 'bg-amber-50',
    },
    {
      title: 'Epidemic Surveillance & Healthcare',
      desc: 'Decentralized diagnostic telemetry for Lassa fever, malaria vector mapping, and maternal care.',
      icon: HeartPulse,
      color: 'text-red-500',
      bg: 'bg-red-50',
    },
    {
      title: 'Geological Engineering & Mineral Value',
      desc: 'Sustainable artisanal mining remediation, bauxite refinement, and rutile value-addition.',
      icon: Pickaxe,
      color: 'text-orange-500',
      bg: 'bg-orange-50',
    },
    {
      title: 'Marine Resources & Coastal Protection',
      desc: 'Atlantic mangrove restoration, fisheries telemetry, and coastal erosion defense in Freetown.',
      icon: Waves,
      color: 'text-cyan-600',
      bg: 'bg-cyan-50',
    },
  ];

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#F4F7FA] via-white to-[#F4F7FA] py-16 md:py-24 px-4 md:px-8 border-b border-slate-200/60">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3.5 py-1.5 border border-blue-200/80 shadow-2xs">
            <SierraLeoneFlag className="h-3.5 w-5" />
            <span className="text-[11px] md:text-xs font-bold text-[#0072C6] uppercase tracking-wider">
              Republic of Sierra Leone National Portal
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-[#10243A] tracking-tight leading-tight">
            Building Sierra Leone's Future Through{' '}
            <span className="text-[#0072C6]">Research</span> &amp;{' '}
            <span className="text-[#1EB53A]">Innovation</span>.
          </h1>

          <p className="text-sm md:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Discover funded research opportunities, compete with transformative solutions, access competitive grants in
            New Leones (NLe), and collaborate with academic institutions across Sierra Leone.
          </p>

          <div className="pt-4 flex flex-wrap justify-center items-center gap-3.5">
            <button
              onClick={onOpenRegister}
              className="rounded-xl bg-[#1EB53A] px-7 py-3.5 text-xs md:text-sm font-bold text-white shadow-md hover:bg-[#16962e] transition transform hover:-translate-y-0.5 flex items-center gap-2"
            >
              <span>Create Free Account (15s OTP)</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => onNavigate('library')}
              className="rounded-xl border-2 border-[#10243A] px-7 py-3 text-xs md:text-sm font-bold text-[#10243A] hover:bg-[#10243A] hover:text-white transition"
            >
              Explore National Research Library
            </button>
            <button
              onClick={() => onNavigate('backend')}
              className="rounded-xl bg-slate-100 hover:bg-slate-200 px-5 py-3 text-xs md:text-sm font-bold text-[#10243A] transition flex items-center gap-1.5"
            >
              <ShieldCheck className="h-4 w-4 text-[#0072C6]" />
              <span>Superadmin Gateway</span>
            </button>
          </div>
        </div>
      </section>

      {/* Impact Indicators */}
      <section className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Participating Institutions', val: '14', desc: 'Universities & technical colleges' },
            { label: 'Registered Scholars', val: '4,820+', desc: 'Students, lecturers & researchers' },
            { label: 'Committed Grants', val: 'NLe 18.5M', desc: 'Government & donor fund pools' },
            { label: 'National Research Papers', val: '1,280+', desc: 'Peer-reviewed repository' },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200/80 shadow-xs text-center space-y-1"
            >
              <p className="text-2xl md:text-4xl font-extrabold text-[#0072C6] font-mono">{stat.val}</p>
              <p className="text-xs md:text-sm font-bold text-[#10243A]">{stat.label}</p>
              <p className="text-[11px] text-slate-500">{stat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Research & Innovation Focus Areas */}
      <section className="max-w-6xl mx-auto px-4 md:px-8 space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#10243A]">
            Priority Research Focus Areas
          </h2>
          <p className="text-xs md:text-sm text-slate-600">
            Aligned with the national development priorities of the Ministry of Technical and Higher Education.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {focusAreas.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-[#0072C6]/50 shadow-xs hover:shadow-md transition space-y-3 group"
              >
                <div className={`w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center ${item.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-base text-[#10243A] group-hover:text-[#0072C6] transition">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Active National Competitions Preview */}
      <section className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="bg-[#10243A] rounded-3xl text-white p-8 md:p-12 shadow-xl border-t-8 border-[#1EB53A] flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 bg-[#1EB53A]/20 border border-[#1EB53A]/40 px-3 py-1 rounded-full text-xs font-bold text-[#1EB53A]">
              <Award className="h-3.5 w-3.5" />
              <span>Active National Competition</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold">
              2026 National Clean Electrification &amp; Agri-Tech Hackathon
            </h2>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              Grand prize pool of <strong className="text-[#1EB53A] font-mono">NLe 450,000</strong>. Submit innovative
              prototypes addressing power reliability and agricultural food security across Sierra Leone's 16 districts.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => onNavigate('competitions')}
              className="px-6 py-3.5 bg-[#0072C6] hover:bg-[#005a9e] text-white rounded-xl text-xs md:text-sm font-bold shadow-md transition"
            >
              View Competitions
            </button>
            <button
              onClick={onOpenRegister}
              className="px-6 py-3.5 bg-white text-[#10243A] hover:bg-slate-100 rounded-xl text-xs md:text-sm font-bold transition"
            >
              Register Team
            </button>
          </div>
        </div>
      </section>

      {/* Founder Spotlight: Andrew Sesay */}
      <section className="max-w-5xl mx-auto px-4 md:px-8">
        <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-200 shadow-sm border-t-8 border-[#0072C6]">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-tr from-[#1EB53A] via-[#0072C6] to-[#10243A] p-1.5 flex-shrink-0 shadow-lg">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-4xl md:text-5xl font-black text-[#10243A]">
                AS
              </div>
            </div>

            <div className="space-y-3 text-center md:text-left">
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider bg-blue-50 text-[#0072C6] px-3 py-1 rounded-full border border-blue-200">
                Founder Profile
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-[#10243A]">Andrew Sesay</h2>
              <p className="text-xs md:text-sm font-bold text-slate-500">
                Founder &amp; Proposed Software Developer of SLNRIP • Sierra Leone
              </p>
              <p className="text-xs md:text-sm text-slate-700 leading-relaxed">
                Andrew Sesay is the visionary founder and proposed software engineer behind the Sierra Leone National
                Research &amp; Innovation Portal (SLNRIP). Conceived to elevate scientific inquiry and tech innovation,
                SLNRIP aims to bridge tertiary students, academic supervisors, and national funding bodies through a secure,
                transparent digital environment.
              </p>
              <div className="p-4 bg-slate-50 rounded-2xl border-l-4 border-[#1EB53A]">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#10243A]">The National Vision</h4>
                <p className="text-xs text-slate-600 italic mt-1">
                  "Every transformative national breakthrough begins with an idea. SLNRIP is designed to provide Sierra
                  Leonean scholars with the resources, verification, and support required to translate research into real
                  societal impact."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
