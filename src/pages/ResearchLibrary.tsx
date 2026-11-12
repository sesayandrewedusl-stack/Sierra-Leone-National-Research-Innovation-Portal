import React, { useState } from 'react';
import { Search, Download, FileText, Filter, Calendar, Building, Sparkles } from 'lucide-react';

export const ResearchLibrary: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [previewPaper, setPreviewPaper] = useState<any | null>(null);

  const papers = [
    {
      id: 'paper-1',
      title: 'Solar Water Purification & Desalination for Rural Kambia Fisherfolk',
      authors: 'Dr. Joseph Koroma, Sahr Kamara',
      institution: 'Fourah Bay College (USL)',
      district: 'Kambia',
      category: 'Renewable Energy',
      year: '2026',
      downloads: 412,
      abstract: 'Investigating modular passive solar still designs utilizing local quartz sands and saline coastal water in the Great Scarcies estuary to produce WHO-standard potable water for fishing hamlets.',
    },
    {
      id: 'paper-2',
      title: 'Epidemiological Telemetry of Lassa Virus Reservoir Rodents in Kenema',
      authors: 'Mariatu Bangura, Dr. A. Sesay',
      institution: 'Eastern Technical University (ETU)',
      district: 'Kenema',
      category: 'Healthcare',
      year: '2025',
      downloads: 628,
      abstract: 'Spatial modeling of Mastomys natalensis rodent populations across forest edge communities using seasonal precipitation data to forecast viral spillover risk.',
    },
    {
      id: 'paper-3',
      title: 'Biodegradable Cassava Starch Bioplastics for Urban Freetown Packaging',
      authors: 'Sahr Lebbie, Aminata Conteh',
      institution: 'Njala University',
      district: 'Moyamba',
      category: 'Agriculture',
      year: '2026',
      downloads: 389,
      abstract: 'Formulation and tensile testing of thermoplastic starch derived from industrial cassava processing waste as an alternative to non-biodegradable polyethylene carrier bags in Western Area.',
    },
    {
      id: 'paper-4',
      title: 'Decentralized Micro-Hydroelectric Turbines on the Pampana River',
      authors: 'Fatmata Mansaray, Ing. K. Turay',
      institution: 'Ernest Bai Koroma University (EBKUST)',
      district: 'Tonkolili',
      category: 'Renewable Energy',
      year: '2025',
      downloads: 295,
      abstract: 'Hydro-kinetic evaluation of cross-flow water wheels operating on low head river flows during dry season months to support off-grid health centers in Yele.',
    },
    {
      id: 'paper-5',
      title: 'Krio-to-English Natural Language Processing for Telemedicine Triage',
      authors: 'Mohamed Kamara, Andrew Sesay',
      institution: 'Fourah Bay College (USL)',
      district: 'Western Area Urban',
      category: 'AI & Digital Systems',
      year: '2026',
      downloads: 512,
      abstract: 'Training open-source small language models with curated medical corpora in Sierra Leone Krio to enable voice-based automated symptom triage for rural community health posts.',
    },
  ];

  const categories = ['All', 'Renewable Energy', 'Agriculture', 'Healthcare', 'AI & Digital Systems'];

  const filtered = papers.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.authors.toLowerCase().includes(search.toLowerCase()) ||
      p.institution.toLowerCase().includes(search.toLowerCase()) ||
      p.district.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 md:px-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#0072C6]">
            Sierra Leone Academic Repository
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#10243A]">National Digital Research Library</h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Access verified academic papers, dissertations, and research telemetry across all 16 districts.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search titles, authors, universities..."
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs md:text-sm focus:outline-none focus:border-[#0072C6]"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
              selectedCategory === cat
                ? 'bg-[#0072C6] text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8 text-slate-500">
            <p className="font-semibold text-sm">No research papers found matching your query.</p>
          </div>
        ) : (
          filtered.map((paper) => (
            <div
              key={paper.id}
              className="bg-white rounded-2xl p-5 md:p-6 border border-slate-200 hover:border-[#0072C6]/50 shadow-xs hover:shadow-sm transition space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#0072C6] bg-blue-50 px-2.5 py-0.5 rounded-md inline-block self-start">
                  {paper.category} • {paper.year}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                  <Download className="h-3 w-3" /> {paper.downloads} downloads
                </span>
              </div>

              <h3 className="font-bold text-base text-[#10243A] leading-snug">{paper.title}</h3>
              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{paper.abstract}</p>

              <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="text-slate-500">
                  <span className="font-semibold text-slate-800">{paper.authors}</span> — {paper.institution} ({paper.district})
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPreviewPaper(paper)}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-xs transition"
                  >
                    View Abstract
                  </button>
                  <button
                    onClick={() => {
                      const blob = new Blob([`${paper.title}\nAuthors: ${paper.authors}\nInstitution: ${paper.institution}\n\nAbstract:\n${paper.abstract}`], { type: 'text/plain' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `${paper.id}_abstract.txt`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[#0072C6] text-white hover:bg-[#005a9e] font-bold text-xs transition flex items-center gap-1"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Download Paper</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Abstract Modal */}
      {previewPaper && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl p-6 shadow-2xl border-t-8 border-[#0072C6] space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase text-[#0072C6] bg-blue-50 px-2 py-0.5 rounded">
                  {previewPaper.category} • {previewPaper.year}
                </span>
                <h3 className="font-bold text-base text-[#10243A] mt-1">{previewPaper.title}</h3>
              </div>
              <button
                onClick={() => setPreviewPaper(null)}
                className="text-slate-400 hover:text-slate-700 text-2xl font-bold"
              >
                &times;
              </button>
            </div>

            <div className="text-xs text-slate-600 space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <p><strong>Authors:</strong> {previewPaper.authors}</p>
              <p><strong>Institution:</strong> {previewPaper.institution}</p>
              <p><strong>District:</strong> {previewPaper.district}</p>
              <div className="pt-2 border-t border-slate-200">
                <strong>Abstract:</strong>
                <p className="mt-1 leading-relaxed text-slate-700">{previewPaper.abstract}</p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setPreviewPaper(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
