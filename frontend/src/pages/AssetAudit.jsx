import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';

function AssetAudit() {
  const {
    userRole,
    employees,
    departments,
    assets,
    audits,
    createAuditCycle,
    markAuditAsset,
    closeAuditCycle
  } = useContext(AppContext);

  const [activeTab, setActiveTab] = useState('active'); // active, history
  const [selectedAuditId, setSelectedAuditId] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [scopeType, setScopeType] = useState('Location'); // Location, Department
  const [scopeValue, setScopeValue] = useState('San Francisco');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState('');
  const [selectedAuditors, setSelectedAuditors] = useState([]);

  // Auditor Checklist notes state
  const [auditNotes, setAuditNotes] = useState({});

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!title || selectedAuditors.length === 0) {
      alert('Please fill out all fields and assign at least one auditor.');
      return;
    }
    createAuditCycle(title, scopeType, scopeValue, startDate, endDate, selectedAuditors);
    setIsCreateOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setScopeType('Location');
    setScopeValue('San Francisco');
    setStartDate(new Date().toISOString().split('T')[0]);
    setEndDate('');
    setSelectedAuditors([]);
  };

  const handleAuditorCheckbox = (name) => {
    if (selectedAuditors.includes(name)) {
      setSelectedAuditors(selectedAuditors.filter(a => a !== name));
    } else {
      setSelectedAuditors([...selectedAuditors, name]);
    }
  };

  // Get active selected audit cycle details
  const activeCycle = audits.find(a => a.id === selectedAuditId);

  // Filter assets based on active cycle scope
  const getScopeAssets = (cycle) => {
    if (!cycle) return [];
    if (cycle.scopeType === 'Location') {
      return assets.filter(a => a.location === cycle.scopeValue);
    } else {
      // Filter by department (matching holder's department or asset location)
      return assets.filter(a => a.location === cycle.scopeValue || (a.assignedTo && employees.find(e => e.name === a.assignedTo)?.dept === cycle.scopeValue));
    }
  };

  const scopeAssets = getScopeAssets(activeCycle);

  // Generate discrepancy reports: count of missing / damaged items
  const getDiscrepancies = (cycle) => {
    if (!cycle) return { missing: [], damaged: [] };
    const missing = [];
    const damaged = [];
    Object.keys(cycle.assessments).forEach(tag => {
      const item = cycle.assessments[tag];
      const assetObj = assets.find(a => a.tag === tag);
      if (item.marked === 'Missing') {
        missing.push({ tag, name: assetObj?.name || 'Unknown', notes: item.notes });
      } else if (item.marked === 'Damaged') {
        damaged.push({ tag, name: assetObj?.name || 'Unknown', notes: item.notes });
      }
    });
    return { missing, damaged };
  };

  const discrepancies = getDiscrepancies(activeCycle);

  const activeCyclesList = audits.filter(a => a.status === 'Active');
  const completedCyclesList = audits.filter(a => a.status === 'Closed');

  const isAdminOrManager = userRole === 'Admin' || userRole === 'Asset Manager';

  return (
    <div className="p-margin-page max-w-container-max mx-auto space-y-gutter pb-24 transition-colors duration-300 font-semibold">
      
      {/* Page Header */}
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="font-headline-md text-headline-md font-bold text-on-surface mb-1">Asset Audit Center</h2>
          <p className="text-on-surface-variant font-body-sm">Run structured verification cycles and generate discrepancy compliance reports.</p>
        </div>
        {isAdminOrManager && (
          <button 
            onClick={() => setIsCreateOpen(true)}
            className="bg-primary text-on-primary font-label-md text-label-md px-5 py-2.5 rounded-xl flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all shadow-md font-bold"
          >
            <span className="material-symbols-outlined text-xl font-bold">playlist_add</span>
            Create Audit Cycle
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-8 border-b border-outline-variant/60 mb-6">
        <button 
          onClick={() => { setActiveTab('active'); setSelectedAuditId(null); }}
          className={`pb-4 px-2 font-label-md text-label-md font-semibold border-b-2 transition-all ${
            activeTab === 'active' ? 'text-primary border-primary' : 'text-on-surface-variant hover:text-on-surface border-transparent'
          }`}
        >
          Active Cycles ({activeCyclesList.length})
        </button>
        <button 
          onClick={() => { setActiveTab('history'); setSelectedAuditId(null); }}
          className={`pb-4 px-2 font-label-md text-label-md font-semibold border-b-2 transition-all ${
            activeTab === 'history' ? 'text-primary border-primary' : 'text-on-surface-variant hover:text-on-surface border-transparent'
          }`}
        >
          Audit History ({completedCyclesList.length})
        </button>
      </div>

      {/* Grid Layout: Cycles vs Audit Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        
        {/* Left Column: Cycles list */}
        <div className="lg:col-span-4 space-y-4">
          <h3 className="text-xs uppercase tracking-wider text-on-surface-variant font-bold">Select Audit Cycle</h3>
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1 custom-scrollbar">
            
            {activeTab === 'active' ? (
              activeCyclesList.map(cycle => (
                <div 
                  key={cycle.id}
                  onClick={() => setSelectedAuditId(cycle.id)}
                  className={`p-5 rounded-xl border cursor-pointer transition-all ${
                    selectedAuditId === cycle.id 
                      ? 'bg-primary/10 border-primary shadow-sm' 
                      : 'bg-surface-container border-outline-variant/60 hover:border-outline'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className="bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold px-2 py-0.5 rounded uppercase">Active</span>
                    <span className="text-[10px] text-on-surface-variant">{cycle.startDate} to {cycle.endDate || 'Ongoing'}</span>
                  </div>
                  <h4 className="font-bold text-on-surface leading-tight">{cycle.title}</h4>
                  <p className="text-xs text-on-surface-variant mt-2">Scope: {cycle.scopeType} • <strong>{cycle.scopeValue}</strong></p>
                  <p className="text-[10px] text-primary mt-3">Auditors: {cycle.auditors.join(', ')}</p>
                </div>
              ))
            ) : (
              completedCyclesList.map(cycle => (
                <div 
                  key={cycle.id}
                  onClick={() => setSelectedAuditId(cycle.id)}
                  className={`p-5 rounded-xl border cursor-pointer transition-all ${
                    selectedAuditId === cycle.id 
                      ? 'bg-primary/10 border-primary shadow-sm' 
                      : 'bg-surface-container border-outline-variant/60 hover:border-outline'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className="bg-outline-variant/20 border border-outline-variant text-on-surface-variant text-[10px] font-bold px-2 py-0.5 rounded uppercase">Closed</span>
                    <span className="text-[10px] text-on-surface-variant">{cycle.startDate} to {cycle.endDate || 'Closed'}</span>
                  </div>
                  <h4 className="font-bold text-on-surface leading-tight">{cycle.title}</h4>
                  <p className="text-xs text-on-surface-variant mt-2">Scope: {cycle.scopeType} • <strong>{cycle.scopeValue}</strong></p>
                </div>
              ))
            )}

            {((activeTab === 'active' && activeCyclesList.length === 0) || (activeTab === 'history' && completedCyclesList.length === 0)) && (
              <p className="text-xs text-on-surface-variant italic py-8 text-center bg-surface-container rounded-xl border border-outline-variant/40">No cycles found in this tab.</p>
            )}
          </div>
        </div>

        {/* Right Column: Audit Checklist Workspace */}
        <div className="lg:col-span-8 space-y-gutter">
          {activeCycle ? (
            <div className="glass-card rounded-xl overflow-hidden border border-outline-variant/60 p-6 space-y-6 animate-fade-in">
              <div className="border-b border-outline-variant/60 pb-4 flex justify-between items-center">
                <div>
                  <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">{activeCycle.title} Workspace</h3>
                  <p className="text-xs text-on-surface-variant mt-1">Scope: {activeCycle.scopeType} (<strong>{activeCycle.scopeValue}</strong>) • Assets: {scopeAssets.length}</p>
                </div>
                {activeCycle.status === 'Active' && isAdminOrManager && (
                  <button 
                    onClick={() => {
                      if (confirm('Closing this audit cycle will lock all reports and update confirmations. Confirmed missing items will revert to Lost. Proceed?')) {
                        closeAuditCycle(activeCycle.id);
                        setSelectedAuditId(null);
                      }
                    }}
                    className="bg-primary hover:brightness-110 text-on-primary px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-md active:scale-95"
                  >
                    Lock & Close Cycle
                  </button>
                )}
              </div>

              {/* Discrepancy Summary Widget */}
              {(discrepancies.missing.length > 0 || discrepancies.damaged.length > 0) && (
                <div className="bg-error/5 border border-error/20 p-5 rounded-xl space-y-3">
                  <div className="flex items-center gap-2 text-error">
                    <span className="material-symbols-outlined text-sm font-bold">gpp_maybe</span>
                    <h4 className="text-xs uppercase font-bold tracking-wider">Discrepancy Report Preview</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-surface-container-high/65 p-3 rounded-lg border border-outline-variant/35 text-xs text-error">
                      <p className="font-bold">Missing Assets ({discrepancies.missing.length})</p>
                      <ul className="list-disc list-inside mt-2 space-y-1 font-semibold">
                        {discrepancies.missing.map((m, i) => (
                          <li key={i}>{m.tag}: {m.name}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-surface-container-high/65 p-3 rounded-lg border border-outline-variant/35 text-xs text-tertiary">
                      <p className="font-bold text-tertiary">Damaged Assets ({discrepancies.damaged.length})</p>
                      <ul className="list-disc list-inside mt-2 space-y-1 font-semibold">
                        {discrepancies.damaged.map((m, i) => (
                          <li key={i}>{m.tag}: {m.name}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Auditor Checklist Table */}
              <div className="space-y-4">
                <h4 className="text-xs uppercase tracking-wider font-bold text-on-surface-variant">Asset Checklist</h4>
                <div className="bg-surface-container rounded-xl border border-outline-variant/40 overflow-hidden shadow-sm">
                  <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-surface-container-high border-b border-outline-variant/60">
                          <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase">Asset</th>
                          <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase">Tag/Serial</th>
                          <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase">Verification Status</th>
                          <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase">Notes / Observations</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-outline-variant/40">
                        {scopeAssets.map(asset => {
                          const assessment = activeCycle.assessments[asset.tag] || { marked: '', notes: '' };
                          const isClosed = activeCycle.status === 'Closed';
                          return (
                            <tr key={asset.tag} className="hover:bg-surface-bright/40 transition-colors">
                              <td className="px-6 py-4 font-bold text-on-surface text-xs">{asset.name}</td>
                              <td className="px-6 py-4 text-xs text-on-surface-variant font-code">{asset.tag} • {asset.serialNumber}</td>
                              <td className="px-6 py-4">
                                <div className="flex gap-2">
                                  {['Verified', 'Missing', 'Damaged'].map(status => (
                                    <button
                                      key={status}
                                      disabled={isClosed}
                                      onClick={() => markAuditAsset(activeCycle.id, asset.tag, status, auditNotes[asset.tag] || '')}
                                      className={`px-2.5 py-1.5 rounded-lg border text-[10px] font-bold text-center transition-all ${
                                        assessment.marked === status
                                          ? status === 'Verified' ? 'bg-primary/10 border-primary text-primary' :
                                            status === 'Missing' ? 'bg-error/15 border-error text-error' :
                                            'bg-tertiary-container/20 border-tertiary text-tertiary'
                                          : 'bg-surface border-outline-variant/60 text-on-surface-variant hover:text-on-surface disabled:opacity-50 disabled:cursor-not-allowed'
                                      }`}
                                    >
                                      {status}
                                    </button>
                                  ))}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <input
                                  type="text"
                                  disabled={isClosed}
                                  value={auditNotes[asset.tag] !== undefined ? auditNotes[asset.tag] : assessment.notes}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setAuditNotes(prev => ({ ...prev, [asset.tag]: val }));
                                    if (assessment.marked) {
                                      markAuditAsset(activeCycle.id, asset.tag, assessment.marked, val);
                                    }
                                  }}
                                  placeholder="Record observation..."
                                  className="w-full bg-surface border border-outline-variant/60 rounded px-2.5 py-1 text-xs focus:border-primary outline-none disabled:bg-surface-container-highest/20 disabled:cursor-not-allowed text-on-surface"
                                />
                              </td>
                            </tr>
                          );
                        })}
                        {scopeAssets.length === 0 && (
                          <tr>
                            <td colSpan="4" className="px-6 py-8 text-center text-on-surface-variant italic">No assets within cycle scope.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

            </div>
          ) : (
            <div className="glass-card rounded-xl p-20 text-center flex flex-col items-center justify-center border border-outline-variant/60">
              <span className="material-symbols-outlined text-6xl text-outline-variant mb-4">fact_check</span>
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">No Cycle Selected</h3>
              <p className="text-on-surface-variant max-w-sm mx-auto mt-2 text-sm leading-relaxed font-semibold">
                Please select an active audit cycle from the sidebar to inspect items, or create a new cycle.
              </p>
            </div>
          )}
        </div>

      </div>

      {/* Create Cycle Drawer Overlay */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div onClick={() => setIsCreateOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"></div>
          <div className="relative w-full max-w-md bg-surface-container-low border-l border-outline-variant h-screen shadow-2xl z-10 flex flex-col animate-slide-in-right">
            
            <div className="p-6 border-b border-outline-variant/60 flex justify-between items-center bg-surface-container-high">
              <div>
                <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">Create Audit Cycle</h3>
                <p className="text-xs text-on-surface-variant font-medium">Define scope and details of physical audit cycles.</p>
              </div>
              <button onClick={() => setIsCreateOpen(false)} className="p-2 hover:bg-surface-bright rounded-full text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="flex-1 flex flex-col h-full overflow-hidden font-semibold">
              <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                
                {/* Title */}
                <div>
                  <label className="text-xs text-on-surface-variant font-bold uppercase tracking-wider mb-1.5 block">Audit Title</label>
                  <input 
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Q3 Electronics Hub Audit"
                    required
                    className="w-full bg-surface border border-outline-variant/60 rounded-xl px-4 py-2.5 text-sm focus:border-primary outline-none"
                  />
                </div>

                {/* Scope Type */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-on-surface-variant font-bold uppercase tracking-wider mb-1.5 block">Scope Type</label>
                    <select
                      value={scopeType}
                      onChange={(e) => {
                        setScopeType(e.target.value);
                        setScopeValue(e.target.value === 'Location' ? 'San Francisco' : 'Engineering');
                      }}
                      className="w-full bg-surface border border-outline-variant/60 rounded-xl px-4 py-2.5 text-sm focus:border-primary outline-none text-on-surface"
                    >
                      <option value="Location">Location</option>
                      <option value="Department">Department</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-on-surface-variant font-bold uppercase tracking-wider mb-1.5 block">Scope Value</label>
                    {scopeType === 'Location' ? (
                      <select
                        value={scopeValue}
                        onChange={(e) => setScopeValue(e.target.value)}
                        className="w-full bg-surface border border-outline-variant/60 rounded-xl px-4 py-2.5 text-sm focus:border-primary outline-none text-on-surface"
                      >
                        <option value="San Francisco">San Francisco</option>
                        <option value="London Hub">London Hub</option>
                        <option value="Remote">Remote</option>
                        <option value="HQ - Floor 4">HQ - Floor 4</option>
                      </select>
                    ) : (
                      <select
                        value={scopeValue}
                        onChange={(e) => setScopeValue(e.target.value)}
                        className="w-full bg-surface border border-outline-variant/60 rounded-xl px-4 py-2.5 text-sm focus:border-primary outline-none text-on-surface"
                      >
                        {departments.map((d, i) => (
                          <option key={i} value={d.name}>{d.name}</option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-on-surface-variant font-bold uppercase tracking-wider mb-1.5 block">Start Date</label>
                    <input 
                      type="date" 
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      required
                      className="w-full bg-surface border border-outline-variant/60 rounded-xl px-4 py-2.5 text-sm focus:border-primary outline-none text-on-surface"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-on-surface-variant font-bold uppercase tracking-wider mb-1.5 block">Expected End Date</label>
                    <input 
                      type="date" 
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full bg-surface border border-outline-variant/60 rounded-xl px-4 py-2.5 text-sm focus:border-primary outline-none text-on-surface"
                    />
                  </div>
                </div>

                {/* Auditor Assignments */}
                <div className="space-y-2">
                  <label className="text-xs text-on-surface-variant font-bold uppercase tracking-wider block">Assign Auditors</label>
                  <p className="text-[10px] text-on-surface-variant">Select one or more employees responsible for verifying assets.</p>
                  
                  <div className="border border-outline-variant/60 rounded-xl max-h-48 overflow-y-auto custom-scrollbar p-3 space-y-2.5 bg-surface">
                    {employees.map(e => (
                      <label key={e.id} className="flex items-center gap-3 cursor-pointer text-xs font-semibold hover:bg-surface-bright/50 p-1.5 rounded">
                        <input 
                          type="checkbox"
                          checked={selectedAuditors.includes(e.name)}
                          onChange={() => handleAuditorCheckbox(e.name)}
                          className="w-4.5 h-4.5 rounded accent-primary cursor-pointer"
                        />
                        <span>{e.name} ({e.dept} • {e.role})</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl flex gap-3">
                  <span className="material-symbols-outlined text-primary">info</span>
                  <p className="text-[10px] text-on-surface-variant leading-relaxed">
                    Once created, assigned auditors will be alerted. Discrepancy reports compile in real-time as auditors mark checklist details.
                  </p>
                </div>

              </div>

              <div className="p-6 border-t border-outline-variant/60 bg-surface-container-high flex gap-3 flex-shrink-0">
                <button 
                  type="submit" 
                  className="flex-1 py-3 bg-primary text-on-primary font-bold rounded-xl hover:brightness-110 active:scale-95 transition-all shadow-md"
                >
                  Create Cycle
                </button>
                <button 
                  type="button" 
                  onClick={() => setIsCreateOpen(false)}
                  className="px-6 py-3 border border-outline-variant rounded-xl font-bold hover:bg-surface-bright transition-all active:scale-95 text-on-surface-variant hover:text-on-surface"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default AssetAudit;
