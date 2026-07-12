import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';

function AllocationTransfer() {
  const {
    userRole,
    assets,
    employees,
    departments,
    transfers,
    allocateAsset,
    returnAsset,
    requestTransfer,
    approveTransfer,
    rejectTransfer
  } = useContext(AppContext);

  // Modal & Drawer visibility states
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isReturnOpen, setIsReturnOpen] = useState(false);
  
  // Return Modal states
  const [selectedAssetForReturn, setSelectedAssetForReturn] = useState(null);
  const [conditionAssessment, setConditionAssessment] = useState('Good');
  const [returnNotes, setReturnNotes] = useState('');

  // Allocation Drawer Form States
  const [selectedAssetId, setSelectedAssetId] = useState('');
  const [targetEmployeeName, setTargetEmployeeName] = useState('');
  const [expectedReturnDate, setExpectedReturnDate] = useState('');
  const [allocationNotes, setAllocationNotes] = useState('');

  // Conflict state detection
  const [isConflict, setIsConflict] = useState(false);
  const [conflictHolder, setConflictHolder] = useState('');

  // Filter lists
  const availableAssetsList = assets.filter(a => a.status === 'Available');
  const assignedAssetsList = assets.filter(a => a.assignedTo !== null);
  const pendingRequests = transfers.filter(t => t.status === 'Pending');

  const todayStr = new Date().toISOString().split('T')[0];

  const handleAssetSelect = (assetIdStr) => {
    setSelectedAssetId(assetIdStr);
    const assetId = parseInt(assetIdStr, 10);
    const asset = assets.find(a => a.id === assetId);
    if (asset && asset.assignedTo) {
      setIsConflict(true);
      setConflictHolder(asset.assignedTo);
    } else {
      setIsConflict(false);
      setConflictHolder('');
    }
  };

  const handleAllocateSubmit = (e) => {
    e.preventDefault();
    if (!selectedAssetId || !targetEmployeeName) return;

    const assetId = parseInt(selectedAssetId, 10);
    const asset = assets.find(a => a.id === assetId);

    if (isConflict) {
      // Create transfer request
      const employee = employees.find(emp => emp.name === targetEmployeeName);
      const targetDept = employee ? employee.dept : 'HQ Operations';
      requestTransfer(asset.tag, targetDept);
      setIsDrawerOpen(false);
      resetAllocationForm();
    } else {
      // Allocate directly
      const result = allocateAsset(assetId, targetEmployeeName, expectedReturnDate || null);
      if (result.success) {
        setIsDrawerOpen(false);
        resetAllocationForm();
      } else {
        alert(result.message);
      }
    }
  };

  const resetAllocationForm = () => {
    setSelectedAssetId('');
    setTargetEmployeeName('');
    setExpectedReturnDate('');
    setAllocationNotes('');
    setIsConflict(false);
    setConflictHolder('');
  };

  const handleReturnClick = (asset) => {
    setSelectedAssetForReturn(asset);
    setConditionAssessment(asset.condition || 'Good');
    setReturnNotes('');
    setIsReturnOpen(true);
  };

  const handleConfirmReturn = (e) => {
    e.preventDefault();
    if (selectedAssetForReturn) {
      returnAsset(selectedAssetForReturn.id, returnNotes, conditionAssessment);
      setIsReturnOpen(false);
      setSelectedAssetForReturn(null);
    }
  };

  return (
    <div className="p-8 pb-24 transition-colors duration-300">
      
      {/* Top action header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="font-headline-md text-headline-md font-bold text-on-surface">Allocations & Transfers</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">Assign and approve physical and hardware resources across organizational units.</p>
        </div>
        <button 
          onClick={() => {
            resetAllocationForm();
            if (assets.length > 0) {
              handleAssetSelect(assets[0].id.toString());
            }
            setIsDrawerOpen(true);
          }}
          className="flex items-center gap-2 bg-primary text-on-primary px-4 py-2.5 rounded-lg font-label-md text-label-md font-bold hover:brightness-110 transition-all shadow-md active:scale-95 shrink-0"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          New Allocation
        </button>
      </div>

      {/* Summary Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-surface-container p-padding-card rounded-xl border border-outline-variant/60 shadow-sm font-semibold">
          <p className="text-on-surface-variant font-label-md text-label-md">Pending Transfer Requests</p>
          <h3 className="font-display-lg text-headline-md font-bold mt-2 text-tertiary">{pendingRequests.length}</h3>
          <div className="flex items-center gap-1 text-tertiary text-xs mt-1.5 font-semibold">
            <span className="material-symbols-outlined text-sm">priority_high</span> requires attention
          </div>
        </div>

        <div className="bg-surface-container p-padding-card rounded-xl border border-outline-variant/60 shadow-sm font-semibold">
          <p className="text-on-surface-variant font-label-md text-label-md">Total Active Allocations</p>
          <h3 className="font-display-lg text-headline-md font-bold mt-2 text-primary">{assignedAssetsList.length}</h3>
          <div className="flex items-center gap-1 text-primary text-xs mt-1.5 font-semibold">
            <span className="material-symbols-outlined text-sm">assignment_ind</span> assets allocated
          </div>
        </div>

        <div className="bg-surface-container p-padding-card rounded-xl border border-outline-variant/60 shadow-sm font-semibold">
          <p className="text-on-surface-variant font-label-md text-label-md">Overdue Items</p>
          <h3 className="font-display-lg text-headline-md font-bold mt-2 text-error">
            {assets.filter(a => a.status === 'Allocated' && a.expectedReturnDate && a.expectedReturnDate < todayStr).length}
          </h3>
          <div className="flex items-center gap-1 text-error text-xs mt-1.5 font-semibold">
            <span className="material-symbols-outlined text-sm">gpp_maybe</span> past expected return
          </div>
        </div>
      </div>

      {/* Main Board Grid: Available vs Assigned */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter mb-8">
        
        {/* Available Assets Column */}
        <section className="space-y-4 font-semibold">
          <div className="flex items-center justify-between">
            <h2 className="font-headline-sm text-headline-sm flex items-center gap-2 font-bold">
              <span className="material-symbols-outlined text-primary">inventory</span> Available Assets
            </h2>
            <span className="bg-surface-container-highest px-3 py-1 rounded-full text-label-sm text-on-surface font-semibold text-xs border border-outline-variant/30">
              {availableAssetsList.length} Available
            </span>
          </div>

          <div className="space-y-3 max-h-[480px] overflow-y-auto pr-2 custom-scrollbar">
            {availableAssetsList.map(asset => (
              <div 
                key={asset.id} 
                className="bg-surface-container p-4 rounded-xl border border-outline-variant/60 flex items-center justify-between hover:border-primary/50 transition-all duration-200 cursor-pointer group hover:translate-y-[-2px]"
                onClick={() => {
                  resetAllocationForm();
                  handleAssetSelect(asset.id.toString());
                  setIsDrawerOpen(true);
                }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-lg overflow-hidden bg-surface-container-lowest border border-outline-variant/20 flex-shrink-0">
                    <img className="w-full h-full object-cover" src={asset.photo} alt={asset.name} />
                  </div>
                  <div>
                    <h4 className="font-label-md text-label-md text-on-surface font-bold">{asset.name}</h4>
                    <p className="text-xs text-on-surface-variant mt-0.5">{asset.serialNumber} | {asset.tag}</p>
                    <div className="flex gap-2 mt-2">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 font-bold">{asset.category}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-surface-container-highest text-on-surface-variant border border-outline-variant font-semibold">{asset.status}</span>
                    </div>
                  </div>
                </div>
                <button className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors">
                  <span className="material-symbols-outlined text-[24px]">add_circle</span>
                </button>
              </div>
            ))}
            {availableAssetsList.length === 0 && (
              <p className="text-xs text-on-surface-variant italic py-6 text-center">No available assets to allocate.</p>
            )}
          </div>
        </section>

        {/* Assigned Assets Column */}
        <section className="space-y-4 font-semibold">
          <div className="flex items-center justify-between">
            <h2 className="font-headline-sm text-headline-sm flex items-center gap-2 font-bold">
              <span className="material-symbols-outlined text-secondary">assignment_ind</span> Active Allocations
            </h2>
            <span className="bg-surface-container-highest px-3 py-1 rounded-full text-label-sm text-on-surface font-semibold text-xs border border-outline-variant/30">
              {assignedAssetsList.length} Active
            </span>
          </div>

          <div className="space-y-3 max-h-[480px] overflow-y-auto pr-2 custom-scrollbar">
            {assignedAssetsList.map(item => {
              const isOverdue = item.expectedReturnDate && item.expectedReturnDate < todayStr;
              return (
                <div 
                  key={item.id}
                  className={`bg-surface-container p-4 rounded-xl border flex items-center justify-between transition-all ${
                    isOverdue 
                      ? 'border-error/40 bg-error/5 animate-pulse' 
                      : 'border-outline-variant/60 hover:border-secondary/40'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border ${
                      isOverdue 
                        ? 'bg-error-container/20 text-error border-error/10' 
                        : 'bg-secondary-container/20 text-secondary border-secondary/10'
                    }`}>
                      <span className="material-symbols-outlined">{isOverdue ? 'warning' : 'person'}</span>
                    </div>
                    <div>
                      <h4 className="font-label-md text-label-md text-on-surface font-bold">{item.assignedTo}</h4>
                      <p className="text-xs text-on-surface-variant mt-0.5">{item.location}</p>
                      <p className={`text-[11px] mt-1 font-bold ${isOverdue ? 'text-error' : 'text-primary'}`}>
                        {item.name} ({item.tag})
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <button 
                      onClick={() => handleReturnClick(item)}
                      className={`text-xs px-3 py-1.5 rounded-lg font-bold border transition-colors ${
                        isOverdue 
                          ? 'bg-error text-on-error border-transparent hover:brightness-110' 
                          : 'bg-surface-container hover:bg-surface-container-highest border-outline-variant/60 text-on-surface'
                      }`}
                    >
                      Return
                    </button>
                    {item.expectedReturnDate && (
                      <p className={`text-[10px] mt-1 font-bold ${isOverdue ? 'text-error' : 'text-on-surface-variant'}`}>
                        Due: {item.expectedReturnDate}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
            {assignedAssetsList.length === 0 && (
              <p className="text-xs text-on-surface-variant italic py-6 text-center">No assigned assets currently.</p>
            )}
          </div>
        </section>

      </div>

      {/* Pending Transfer Requests Grid Section */}
      <section className="pt-8 border-t border-outline-variant/40 font-semibold">
        <h2 className="font-headline-sm text-headline-sm flex items-center gap-2 font-bold mb-6">
          <span className="material-symbols-outlined text-primary">swap_horiz</span> Pending Transfer Requests
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {pendingRequests.map(req => (
            <div 
              key={req.id} 
              className="bg-surface-container p-padding-card rounded-xl border border-outline-variant/60 hover:shadow-md transition-all relative overflow-hidden group"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
              
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center font-bold text-sm border border-outline-variant/40">
                    {req.requester.split(' ').map(n=>n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="font-label-md text-label-md font-bold text-on-surface">{req.requester}</h4>
                    <p className="text-xs text-on-surface-variant">Request raised: {req.date}</p>
                  </div>
                </div>
                
                <span className="px-2 py-0.5 rounded text-[10px] font-bold border bg-primary/10 border-primary/20 text-primary">
                  {req.status}
                </span>
              </div>

              <div className="bg-surface-container-low p-3 rounded-lg mb-4 space-y-2 border border-outline-variant/20">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-on-surface-variant">Asset Name:</span>
                  <span className="text-on-surface">{req.assetName} ({req.assetTag})</span>
                </div>
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-on-surface-variant">Current Holder:</span>
                  <span className="text-on-surface">{req.currentHolder}</span>
                </div>
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-on-surface-variant">Target Department:</span>
                  <span className="text-on-surface">{req.targetDept}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => approveTransfer(req.id)}
                  className="flex-1 py-2 rounded-lg bg-primary text-on-primary text-xs font-bold hover:brightness-110 transition-all active:scale-[0.98]"
                >
                  Approve
                </button>
                <button 
                  onClick={() => rejectTransfer(req.id)}
                  className="flex-1 py-2 rounded-lg border border-outline-variant/60 hover:bg-surface-container-highest text-xs font-bold text-on-surface-variant hover:text-on-surface transition-all active:scale-[0.98]"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
          {pendingRequests.length === 0 && (
            <div className="col-span-full p-8 text-center text-on-surface-variant italic">
              No pending asset transfer requests.
            </div>
          )}
        </div>
      </section>

      {/* New Allocation / Transfer Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setIsDrawerOpen(false)}></div>
          <div className="relative w-full max-w-md bg-surface-container-high border-l border-outline-variant h-screen shadow-2xl z-10 animate-slide-in-right flex flex-col">
            <div className="p-6 border-b border-outline-variant/60 flex items-center justify-between">
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">New Asset Allocation</h3>
              <button onClick={() => setIsDrawerOpen(false)} className="p-2 hover:bg-surface-bright rounded-full text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleAllocateSubmit} className="flex-1 flex flex-col h-full overflow-hidden">
              <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar font-semibold">
                
                {/* Asset Selection */}
                <div className="space-y-2">
                  <label className="font-label-md text-label-md block font-semibold text-on-surface-variant">Select Asset</label>
                  <select 
                    value={selectedAssetId}
                    onChange={(e) => handleAssetSelect(e.target.value)}
                    required
                    className="w-full bg-surface border border-outline-variant/60 rounded-xl p-3 text-sm focus:border-primary outline-none text-on-surface"
                  >
                    <option value="">Choose an Asset...</option>
                    {assets.map(a => (
                      <option key={a.id} value={a.id}>
                        {a.name} ({a.tag}) — {a.status} {a.assignedTo ? `[Held by ${a.assignedTo}]` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Conflict Alert & Actions */}
                {isConflict && (
                  <div className="p-4 bg-tertiary-container/10 border border-tertiary/20 rounded-xl flex gap-3 animate-fade-in">
                    <span className="material-symbols-outlined text-tertiary shrink-0">warning</span>
                    <div>
                      <p className="text-xs font-bold text-tertiary">Allocation Conflict Detected</p>
                      <p className="text-[11px] text-on-surface-variant mt-1 leading-relaxed">
                        This asset is currently held by <strong>{conflictHolder}</strong>. Direct allocation is blocked. 
                        Submitting will trigger a <strong>Department Transfer Request</strong> instead.
                      </p>
                    </div>
                  </div>
                )}

                {/* Target Employee */}
                <div className="space-y-2">
                  <label className="font-label-md text-label-md block font-semibold text-on-surface-variant">Assignee Employee</label>
                  <select
                    value={targetEmployeeName}
                    onChange={(e) => setTargetEmployeeName(e.target.value)}
                    required
                    className="w-full bg-surface border border-outline-variant/60 rounded-xl p-3 text-sm focus:border-primary outline-none text-on-surface"
                  >
                    <option value="">Select Employee...</option>
                    {employees.map(e => (
                      <option key={e.id} value={e.name}>{e.name} ({e.dept} • {e.role})</option>
                    ))}
                  </select>
                </div>

                {/* Expected Return Date (Only if no conflict) */}
                {!isConflict && (
                  <div className="space-y-2 animate-fade-in">
                    <label className="font-label-md text-label-md block font-semibold text-on-surface-variant">Expected Return Date (Optional)</label>
                    <input 
                      type="date" 
                      value={expectedReturnDate}
                      onChange={(e) => setExpectedReturnDate(e.target.value)}
                      min={todayStr}
                      className="w-full bg-surface border border-outline-variant/60 rounded-xl p-3 text-sm focus:border-primary outline-none text-on-surface" 
                    />
                  </div>
                )}

                {/* Notes */}
                <div className="space-y-2">
                  <label className="font-label-md text-label-md block font-semibold text-on-surface-variant">Allocation/Transfer Notes</label>
                  <textarea 
                    rows="3" 
                    value={allocationNotes}
                    onChange={(e) => setAllocationNotes(e.target.value)}
                    placeholder="Enter context details for audit purposes..." 
                    className="w-full bg-surface border border-outline-variant/60 rounded-xl p-3 text-sm focus:border-primary outline-none resize-none" 
                  />
                </div>

              </div>

              <div className="p-6 border-t border-outline-variant/60 bg-surface-container-high/90 backdrop-blur-md flex gap-3">
                <button 
                  type="submit"
                  className={`flex-1 py-3 font-bold rounded-xl hover:brightness-110 transition-all shadow-md active:scale-95 ${
                    isConflict ? 'bg-tertiary text-on-tertiary' : 'bg-primary text-on-primary'
                  }`}
                >
                  {isConflict ? 'Request Transfer' : 'Confirm Allocation'}
                </button>
                <button 
                  type="button" 
                  onClick={() => setIsDrawerOpen(false)}
                  className="px-6 py-3 border border-outline-variant rounded-xl font-bold hover:bg-surface-bright transition-all active:scale-95 text-on-surface-variant hover:text-on-surface"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Return Asset Assessment Modal */}
      {isReturnOpen && selectedAssetForReturn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setIsReturnOpen(false)}></div>
          <div className="bg-surface-container-high w-full max-w-md rounded-2xl border border-outline-variant p-6 z-10 shadow-2xl relative animate-fade-in">
            <h3 className="font-headline-sm text-headline-sm font-bold mb-2 text-on-surface">Return Check-in: {selectedAssetForReturn.name}</h3>
            <p className="text-on-surface-variant text-xs mb-4 font-semibold">Inspect and log condition of returning asset: {selectedAssetForReturn.tag}</p>
            
            <form onSubmit={handleConfirmReturn} className="space-y-4 font-semibold">
              <div>
                <label className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider block mb-1.5">Condition Assessment</label>
                <select 
                  value={conditionAssessment}
                  onChange={(e) => setConditionAssessment(e.target.value)}
                  className="w-full bg-surface border border-outline-variant/60 rounded-xl p-3 text-sm focus:border-primary outline-none text-on-surface font-semibold"
                >
                  <option value="New">New</option>
                  <option value="Excellent">Excellent</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                  <option value="Poor">Poor (Flags Repair)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider block mb-1.5">Check-in Notes / Observations</label>
                <textarea 
                  rows="3" 
                  value={returnNotes}
                  onChange={(e) => setReturnNotes(e.target.value)}
                  placeholder="Record screen scratches, wear, or diagnostic flags..."
                  className="w-full bg-surface border border-outline-variant/60 rounded-xl p-3 text-sm focus:border-primary outline-none resize-none text-on-surface"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 py-3 bg-primary text-on-primary rounded-xl text-xs font-bold hover:brightness-110 transition-all">
                  Complete Return
                </button>
                <button type="button" onClick={() => setIsReturnOpen(false)} className="px-4 py-3 border border-outline-variant rounded-xl text-xs font-bold hover:bg-surface-bright text-on-surface-variant transition-all">
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

export default AllocationTransfer;
