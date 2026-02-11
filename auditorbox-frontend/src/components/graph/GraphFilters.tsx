import React from 'react';

type FilterState = {
  phase: string;
  type: string;
  hubsOnly: boolean;
  search: string;
};

type Props = {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
};

export const GraphFilters: React.FC<Props> = ({ filters, onChange }) => {
  const activeFiltersCount = [
    filters.phase !== 'All',
    filters.type !== 'All',
    filters.hubsOnly,
    filters.search.trim() !== '',
  ].filter(Boolean).length;

  const handlePhaseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...filters, phase: e.target.value });
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...filters, type: e.target.value });
  };

  const handleHubsOnlyToggle = () => {
    onChange({ ...filters, hubsOnly: !filters.hubsOnly });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...filters, search: e.target.value });
  };

  const handleReset = () => {
    onChange({
      phase: 'All',
      type: 'All',
      hubsOnly: false,
      search: '',
    });
  };

  return (
    <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-2.5 border border-slate-800 flex flex-wrap items-center gap-3">
      {/* Search Input */}
      <div className="relative flex-1 min-w-[240px]">
        <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-lg">search</span>
        <input
          type="text"
          value={filters.search}
          onChange={handleSearchChange}
          placeholder="Search graph nodes..."
          className="w-full bg-slate-900 border border-slate-700 text-white text-sm rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 placeholder-slate-500 transition-all"
        />
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {/* Phase Dropdown */}
        <div className="relative">
          <select
            value={filters.phase}
            onChange={handlePhaseChange}
            className="appearance-none bg-slate-900 border border-slate-700 text-slate-300 text-xs rounded-lg pl-3 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer min-w-[140px] transition-all"
          >
            <option value="All">All Areas</option>
            <option value="general">General</option>
            <option value="substantive_testing">Substantive Testing</option>
            <option value="risk_assessment">Risk Assessment</option>
            <option value="planning">Planning</option>
            <option value="controls_testing">Controls Testing</option>
            <option value="completion">Completion</option>
            <option value="reporting">Reporting</option>
          </select>
          <span className="material-icons absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none text-base">expand_more</span>
        </div>

        {/* Type Dropdown */}
        <div className="relative">
          <select
            value={filters.type}
            onChange={handleTypeChange}
            className="appearance-none bg-slate-900 border border-slate-700 text-slate-300 text-xs rounded-lg pl-3 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer min-w-[140px] transition-all"
          >
            <option value="All">All Types</option>
            <option value="worksheet">Worksheet</option>
            <option value="procedure">Procedure</option>
            <option value="leadsheet">Leadsheet</option>
            <option value="checklist">Checklist</option>
            <option value="report">Report</option>
            <option value="letter">Letter</option>
          </select>
          <span className="material-icons absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none text-base">expand_more</span>
        </div>

        {/* Hubs Only Toggle */}
        <button
          onClick={handleHubsOnlyToggle}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all border ${filters.hubsOnly
            ? 'bg-primary/20 text-primary border-primary/50 shadow-[0_0_15px_rgba(60,131,246,0.1)]'
            : 'bg-slate-900 text-slate-400 border-slate-700 hover:border-slate-500'
            }`}
        >
          <span className="material-icons text-base">hub</span>
          <span>HUBS ONLY</span>
        </button>

        {/* Active Filter Count & Reset */}
        {activeFiltersCount > 0 && (
          <div className="flex items-center gap-2 ml-1">
            <span className="bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center shadow-lg shadow-primary/20">
              {activeFiltersCount}
            </span>
            <button
              onClick={handleReset}
              className="flex items-center justify-center p-1.5 text-slate-500 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
              title="Reset filters"
            >
              <span className="material-icons text-lg">restart_alt</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
