import React, { useState } from 'react';

function AllocationTransfer({ userRole }) {
  // Modal & Drawer visibility states
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isConflictOpen, setIsConflictOpen] = useState(false);
  const [isReturnOpen, setIsReturnOpen] = useState(false);
  
  // Active tracking states
  const [selectedAssetForReturn, setSelectedAssetForReturn] = useState(null);
  const [conditionAssessment, setConditionAssessment] = useState('Good');

  // Available Assets Mock State
  const [availableAssets, setAvailableAssets] = useState([
    {
      id: 1,
      name: 'Precision T7800 Workstation',
      tag: 'IT-HW-001',
      serial: 'SN: 4492-3321-AX',
      category: 'Graphics',
      status: 'Ready',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDNINNudG-NFbPlNeUDyCO2BZovgEtRV6o-9xyMMu1icxAdyn_hz-6HliOQWP-pFDhLv-MsJrl8ft0FxZrmjUAMjIKzrNi9ghmkTIiXrWkrQsh6nFsIlMFHzf-psUrhmvjSgZKJH4CQsonO3IpvxyCL4F2LOrY2gDCYYP3vFtvWJLUQgucwFBiod8O7x97qb-pJxK61vdxrLFglf-cMgPmKboMbK-GFlwYm58nN6xM8KaIBfmy6snlAiFQGvCU2uzPM0uE2YhT0DcsU'
    },
    {
      id: 2,
      name: 'UltraSharp 49" Curved Monitor',
      tag: 'IT-HW-042',
      serial: 'SN: 8812-7729-BD',
      category: 'Display',
      status: 'Certified',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB6dTqkfNg67v98knj6n6AJX0FunGGmN_zbiRfJEPXBWAa0y60G3-2RRps3yINyCLzeoa1fHPNa5LqE22LuoLNm1dV3suVS6ZUQg-p22e8o5yAgoP6ab7igXlZTMLysqPJsyB4ABdq5ZP_rehCeF19YNYf_uuYNZB6ZbT5_STntrs3095xVJ5QjDDUSJaNCsmGwiFxPdT4ZjZQUxZaqhKudw-bUXd_p6ZH99AjukWdMaBnDtv6I3ZlAM8FOL4rlxdTk_QAdbOeQp3bn'
    },
    {
      id: 3,
      name: 'Lumix GH6 Studio Kit',
      tag: 'MEDIA-009',
      serial: 'SN: CAM-9092-LL',
      category: 'Media',
      status: 'In Storage',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCn0oCBaQkflyRhnjk80SoZqVmdeMksoycbuDqdMzpTckhW580BmbaYqDhE06jgYxSXLAYg9RS5Z1bPode_N8TZut1EybrYwNOFearcnWFmCwYv0X7KJsGU9LZlCAvMZm5b9SEyqrLPMuhPhO4Oxtkp2cWDMaHAucv9vmc_8uvTa44zrxx-e3GOePcR7OxHIV4flzN6O2Xvno3N9K_GhYM7HgtKVc7lmGVxgSNjdByszMwWiZBTovmaxXheQCPNTE8NFI2al8TdXqIe'
    }
  ]);

  // Assigned Assets Mock State
  const [assignedAssets, setAssignedAssets] = useState([
    {
      id: 101,
      assignee: 'Marcus Thorne',
      dept: 'Design Ops • Studio A',
      holding: 'iPad Pro 12.9" (SN-102)',
      date: 'Jan 12',
      overdue: false
    },
    {
      id: 102,
      assignee: 'Sarah Jenkins',
      dept: 'Engineering • Remote',
      holding: 'MacBook Pro M2 (SN-882)',
      date: 'Feb 02',
      overdue: false
    },
    {
      id: 103,
      assignee: 'Alex Rivera',
      dept: 'Marketing • HQ',
      holding: 'OVERDUE: Sony Alpha (SN-392)',
      date: '3 Days Over',
      overdue: true
    }
  ]);

  // Pending Requests State
  const [pendingRequests, setPendingRequests] = useState([
    {
      id: 201,
      requester: 'Ethan Lopez',
      dept: 'DevOps Team',
      initials: 'EL',
      asset: 'ThinkPad P1 Gen 5',
      type: 'PENDING',
      targetDept: 'Infrastructure',
      returnDate: 'Nov 22, 2024'
    },
    {
      id: 202,
      requester: 'Maya Wong',
      dept: 'Creative Dept',
      initials: 'MW',
      asset: 'Wacom Cintiq Pro 27',
      type: 'INTERNAL',
      targetDept: 'Design Ops',
      returnDate: 'Indefinite'
    },
    {
      id: 203,
      requester: 'Tom Kripke',
      dept: 'Logistics',
      initials: 'TK',
      asset: 'Industrial Scanner V3',
      type: 'CONFLICT',
      targetDept: 'Maintenance Due Nov 10',
      returnDate: 'Dec 15, 2024'
    }
  ]);

  const handleReturnClick = (assignedAsset) => {
    setSelectedAssetForReturn(assignedAsset);
    setIsReturnOpen(true);
  };

  const handleConfirmReturn = () => {
    if (selectedAssetForReturn) {
      // Remove from assigned list
      setAssignedAssets(assignedAssets.filter(item => item.id !== selectedAssetForReturn.id));
      setIsReturnOpen(false);
      setSelectedAssetForReturn(null);
    }
  };

  const handleResolveConflict = (requestId) => {
    setIsConflictOpen(true);
  };

  const handleApproveRequest = (id) => {
    // Approve requests state change
    setPendingRequests(pendingRequests.filter(req => req.id !== id));
  };

  return (
    <div className="p-8 pb-24 transition-colors duration-300">
      
      {/* Top action header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="font-headline-md text-headline-md font-bold text-on-surface">Allocations & Transfers</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">Assign and approve physical and hardware resources across organizational nodes.</p>
        </div>
        <button 
          onClick={() => setIsDrawerOpen(true)}
          className="flex items-center gap-2 bg-primary text-on-primary px-4 py-2.5 rounded-lg font-label-md text-label-md font-bold hover:brightness-110 transition-all shadow-md active:scale-95 shrink-0"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          New Transfer
        </button>
      </div>

      {/* Summary Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-surface-container p-padding-card rounded-xl border border-outline-variant/60 shadow-sm">
          <p className="text-on-surface-variant font-label-md text-label-md font-semibold">Active Transfers</p>
          <h3 className="font-display-lg text-headline-md font-bold mt-2">124</h3>
          <div className="flex items-center gap-1 text-primary text-xs mt-1.5 font-semibold">
            <span className="material-symbols-outlined text-sm">trending_up</span> 12% from last week
          </div>
        </div>

        <div className="bg-surface-container p-padding-card rounded-xl border border-outline-variant/60 shadow-sm">
          <p className="text-on-surface-variant font-label-md text-label-md font-semibold">Pending Requests</p>
          <h3 className="font-display-lg text-headline-md font-bold mt-2 text-tertiary">{pendingRequests.length}</h3>
          <div className="flex items-center gap-1 text-tertiary text-xs mt-1.5 font-semibold">
            <span className="material-symbols-outlined text-sm">priority_high</span> critical conflicts
          </div>
        </div>

        <div className="bg-surface-container p-padding-card rounded-xl border border-outline-variant/60 shadow-sm">
          <p className="text-on-surface-variant font-label-md text-label-md font-semibold">Assets in Transit</p>
          <h3 className="font-display-lg text-headline-md font-bold mt-2">42</h3>
          <div className="flex items-center gap-1 text-secondary text-xs mt-1.5 font-semibold">
            <span className="material-symbols-outlined text-sm">local_shipping</span> 8 arriving today
          </div>
        </div>

        <div className="bg-surface-container p-padding-card rounded-xl border border-outline-variant/60 shadow-sm">
          <p className="text-on-surface-variant font-label-md text-label-md font-semibold">Asset Utilization</p>
          <h3 className="font-display-lg text-headline-md font-bold mt-2">94.2%</h3>
          <div className="h-1.5 w-full bg-outline-variant/30 rounded-full mt-3 overflow-hidden border border-outline-variant/10">
            <div className="h-full bg-primary" style={{ width: '94.2%' }}></div>
          </div>
        </div>
      </div>

      {/* Main Board Grid: Available vs Assigned */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter mb-8">
        
        {/* Available Assets Column */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-headline-sm text-headline-sm flex items-center gap-2 font-bold">
              <span className="material-symbols-outlined text-primary">inventory</span> Available Assets
            </h2>
            <span className="bg-surface-container-highest px-3 py-1 rounded-full text-label-sm text-on-surface font-semibold text-xs border border-outline-variant/30">
              {availableAssets.length} Available
            </span>
          </div>

          <div className="space-y-3 max-h-[480px] overflow-y-auto pr-2 custom-scrollbar">
            {availableAssets.map(asset => (
              <div 
                key={asset.id} 
                className="bg-surface-container p-4 rounded-xl border border-outline-variant/60 flex items-center justify-between hover:border-primary/50 transition-all duration-200 cursor-pointer group hover:translate-y-[-2px]"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-lg overflow-hidden bg-surface-container-lowest border border-outline-variant/20 flex-shrink-0">
                    <img className="w-full h-full object-cover" src={asset.image} alt={asset.name} />
                  </div>
                  <div>
                    <h4 className="font-label-md text-label-md text-on-surface font-bold">{asset.name}</h4>
                    <p className="text-xs text-on-surface-variant mt-0.5">{asset.serial} | {asset.tag}</p>
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
          </div>
        </section>

        {/* Assigned Assets Column */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-headline-sm text-headline-sm flex items-center gap-2 font-bold">
              <span className="material-symbols-outlined text-secondary">assignment_ind</span> Assigned Assets
            </h2>
            <span className="bg-surface-container-highest px-3 py-1 rounded-full text-label-sm text-on-surface font-semibold text-xs border border-outline-variant/30">
              {assignedAssets.length} Active
            </span>
          </div>

          <div className="space-y-3 max-h-[480px] overflow-y-auto pr-2 custom-scrollbar">
            {assignedAssets.map(item => (
              <div 
                key={item.id}
                className={`bg-surface-container p-4 rounded-xl border flex items-center justify-between transition-all ${
                  item.overdue 
                    ? 'border-tertiary/40 bg-tertiary/5' 
                    : 'border-outline-variant/60 hover:border-secondary/40'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border ${
                    item.overdue 
                      ? 'bg-tertiary/20 text-tertiary border-tertiary/10' 
                      : 'bg-secondary-container/20 text-secondary border-secondary/10'
                  }`}>
                    <span className="material-symbols-outlined">{item.overdue ? 'warning' : 'person'}</span>
                  </div>
                  <div>
                    <h4 className="font-label-md text-label-md text-on-surface font-bold">{item.assignee}</h4>
                    <p className="text-xs text-on-surface-variant mt-0.5">{item.dept}</p>
                    <p className={`text-[11px] mt-1 font-bold ${item.overdue ? 'text-tertiary' : 'text-primary'}`}>
                      {item.holding}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <button 
                    onClick={() => handleReturnClick(item)}
                    className={`text-xs px-3 py-1.5 rounded-lg font-bold border transition-colors ${
                      item.overdue 
                        ? 'bg-tertiary text-on-tertiary border-transparent hover:brightness-110' 
                        : 'bg-surface-container hover:bg-surface-container-highest border-outline-variant/60 text-on-surface'
                    }`}
                  >
                    {item.overdue ? 'Notify' : 'Return'}
                  </button>
                  <p className="text-[10px] text-on-surface-variant font-semibold mt-1">Since {item.date}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>

      {/* Pending Transfer Requests Grid Section */}
      <section className="pt-8 border-t border-outline-variant/40">
        <h2 className="font-headline-sm text-headline-sm flex items-center gap-2 font-bold mb-6">
          <span className="material-symbols-outlined text-primary">swap_horiz</span> Pending Transfer Requests
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {pendingRequests.map(req => (
            <div 
              key={req.id} 
              className="bg-surface-container p-padding-card rounded-xl border border-outline-variant/60 hover:shadow-md transition-all relative overflow-hidden group"
            >
              {/* Highlight bar side */}
              <div className={`absolute top-0 left-0 w-1 h-full ${
                req.type === 'PENDING' 
                  ? 'bg-primary' 
                  : req.type === 'INTERNAL' 
                  ? 'bg-secondary' 
                  : 'bg-tertiary'
              }`}></div>
              
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center font-bold text-sm border border-outline-variant/40">
                    {req.initials}
                  </div>
                  <div>
                    <h4 className="font-label-md text-label-md font-bold text-on-surface">{req.requester}</h4>
                    <p className="text-xs text-on-surface-variant">{req.dept}</p>
                  </div>
                </div>
                
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                  req.type === 'PENDING' 
                    ? 'bg-primary/10 border-primary/20 text-primary' 
                    : req.type === 'INTERNAL' 
                    ? 'bg-secondary/10 border-secondary/20 text-secondary' 
                    : 'bg-tertiary/10 border-tertiary/20 text-tertiary'
                }`}>
                  {req.type}
                </span>
              </div>

              <div className="bg-surface-container-low p-3 rounded-lg mb-4 space-y-2 border border-outline-variant/20">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-on-surface-variant">Asset:</span>
                  <span className="text-on-surface">{req.asset}</span>
                </div>
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-on-surface-variant">Department:</span>
                  <span className={`text-on-surface ${req.type === 'CONFLICT' ? 'text-tertiary font-bold' : ''}`}>{req.targetDept}</span>
                </div>
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-on-surface-variant">Expected Return:</span>
                  <span className="text-on-surface">{req.returnDate}</span>
                </div>
              </div>

              <div className="flex gap-2">
                {req.type === 'CONFLICT' ? (
                  <button 
                    onClick={() => handleResolveConflict(req.id)}
                    className="flex-1 py-2 rounded-lg bg-tertiary text-on-tertiary text-xs font-bold hover:brightness-110 transition-all active:scale-[0.98]"
                  >
                    Resolve Conflict
                  </button>
                ) : (
                  <>
                    <button 
                      onClick={() => handleApproveRequest(req.id)}
                      className="flex-1 py-2 rounded-lg bg-primary text-on-primary text-xs font-bold hover:brightness-110 transition-all active:scale-[0.98]"
                    >
                      Approve
                    </button>
                    <button 
                      onClick={() => handleApproveRequest(req.id)}
                      className="flex-1 py-2 rounded-lg border border-outline-variant/60 hover:bg-surface-container-highest text-xs font-bold text-on-surface-variant hover:text-on-surface transition-all active:scale-[0.98]"
                    >
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* New Transfer Request Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setIsDrawerOpen(false)}></div>
          <div className="relative w-full max-w-md bg-surface-container-high border-l border-outline-variant h-screen shadow-2xl z-10 animate-slide-in-right flex flex-col">
            <div className="p-6 border-b border-outline-variant/60 flex items-center justify-between">
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">New Transfer Request</h3>
              <button onClick={() => setIsDrawerOpen(false)} className="p-2 hover:bg-surface-bright rounded-full text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              <div className="space-y-2">
                <label className="font-label-md text-label-md block font-semibold text-on-surface-variant">Select Asset</label>
                <select className="w-full bg-surface border border-outline-variant/60 rounded-xl p-3 text-sm focus:border-primary outline-none">
                  <option>Precision T7800 Workstation (SN-4492)</option>
                  <option>UltraSharp 49" Monitor (SN-8812)</option>
                  <option>MacBook Pro 16" (SN-0021)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="font-label-md text-label-md block font-semibold text-on-surface-variant">Assignee</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
                  <input type="text" placeholder="Search employee..." className="w-full bg-surface border border-outline-variant/60 rounded-xl p-3 pl-10 text-sm focus:border-primary outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="font-label-md text-label-md block font-semibold text-on-surface-variant">From Date</label>
                  <input type="date" className="w-full bg-surface border border-outline-variant/60 rounded-xl p-3 text-sm focus:border-primary outline-none text-on-surface" />
                </div>
                <div className="space-y-2">
                  <label className="font-label-md text-label-md block font-semibold text-on-surface-variant">To Date</label>
                  <input type="date" className="w-full bg-surface border border-outline-variant/60 rounded-xl p-3 text-sm focus:border-primary outline-none text-on-surface" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="font-label-md text-label-md block font-semibold text-on-surface-variant">Notes</label>
                <textarea rows="4" placeholder="Reason for allocation request..." className="w-full bg-surface border border-outline-variant/60 rounded-xl p-3 text-sm focus:border-primary outline-none resize-none" />
              </div>

              <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl flex gap-3">
                <span className="material-symbols-outlined text-primary">info</span>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  This asset is currently in high demand. Allocations exceeding 30 days might trigger automated conflict alerts.
                </p>
              </div>
            </div>

            <div className="p-6 border-t border-outline-variant/60 bg-surface-container-high/90 backdrop-blur-md flex gap-3">
              <button 
                onClick={() => setIsDrawerOpen(false)}
                className="flex-1 py-3 bg-primary text-on-primary font-bold rounded-xl hover:brightness-110 transition-all shadow-md active:scale-95"
              >
                Submit Request
              </button>
              <button 
                onClick={() => setIsDrawerOpen(false)}
                className="px-6 py-3 border border-outline-variant rounded-xl font-bold hover:bg-surface-bright transition-all active:scale-95 text-on-surface-variant hover:text-on-surface"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Conflict Warning Modal */}
      {isConflictOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/75 backdrop-blur-md animate-fade-in" onClick={() => setIsConflictOpen(false)}></div>
          <div className="bg-surface-container-high w-full max-w-md rounded-2xl border border-tertiary/40 p-6 z-10 shadow-2xl relative animate-fade-in text-center">
            <div className="w-16 h-16 bg-tertiary/10 border border-tertiary/20 rounded-full flex items-center justify-center text-tertiary mb-4 mx-auto shadow-md">
              <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
            </div>
            <h3 className="font-headline-sm text-headline-md font-bold mb-2 text-on-surface">Allocation Conflict</h3>
            <p className="text-on-surface-variant text-body-sm mb-6 leading-relaxed">
              This asset is already reserved by the <strong>Cloud Ops Team</strong> for a critical migration scheduled during these dates.
            </p>
            
            <div className="bg-surface p-4 rounded-xl border border-outline-variant/30 text-left mb-6 space-y-3">
              <div>
                <div className="flex items-center gap-1.5 text-tertiary text-xs font-bold uppercase tracking-wider mb-1">
                  <span className="material-symbols-outlined text-sm">schedule</span> Conflict Period
                </div>
                <p className="text-sm font-medium">Nov 12 - Nov 18, 2024</p>
              </div>
              <div className="h-px bg-outline-variant/30"></div>
              <div>
                <div className="flex items-center gap-1.5 text-primary text-xs font-bold uppercase tracking-wider mb-1">
                  <span className="material-symbols-outlined text-sm">recommend</span> Alternative Suggested
                </div>
                <p className="text-sm font-medium">Precision T7900 (ID: IT-HW-099)</p>
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              <button 
                onClick={() => setIsConflictOpen(false)}
                className="w-full py-3 bg-tertiary text-on-tertiary rounded-xl font-bold hover:brightness-110 active:scale-95 transition-all shadow-md"
              >
                Override & Assign Anyway
              </button>
              <button 
                onClick={() => {
                  // Switch logic
                  setIsConflictOpen(false);
                }}
                className="w-full py-3 bg-primary text-on-primary rounded-xl font-bold hover:brightness-110 active:scale-95 transition-all shadow-md"
              >
                Switch to Alternative
              </button>
              <button 
                onClick={() => setIsConflictOpen(false)}
                className="w-full py-3 border border-outline-variant rounded-xl font-bold hover:bg-surface-bright transition-all text-on-surface-variant hover:text-on-surface active:scale-95"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Return Confirmation Modal */}
      {isReturnOpen && selectedAssetForReturn && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/75 backdrop-blur-md animate-fade-in" onClick={() => setIsReturnOpen(false)}></div>
          <div className="bg-surface-container-high w-full max-w-md rounded-2xl border border-outline-variant/60 p-6 z-10 shadow-2xl relative animate-fade-in">
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-5">Confirm Asset Return</h3>
            
            <div className="space-y-5 mb-6">
              <div className="space-y-2">
                <label className="text-xs text-on-surface-variant font-bold uppercase tracking-wider block">Condition Assessment</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Good', 'Damaged', 'Needs Repair'].map(cond => (
                    <button
                      key={cond}
                      type="button"
                      onClick={() => setConditionAssessment(cond)}
                      className={`py-2 px-3 rounded-lg border text-xs font-bold text-center transition-all ${
                        conditionAssessment === cond
                          ? 'bg-primary/10 border-primary text-primary'
                          : 'bg-surface border-outline-variant/60 text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      {cond}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-on-surface-variant font-bold uppercase tracking-wider block">Storage Location</label>
                <select className="w-full bg-surface border border-outline-variant/60 rounded-xl p-3 text-sm focus:border-primary outline-none">
                  <option>Main Warehouse - Rack A1</option>
                  <option>IT Lab 4 - Bench 2</option>
                  <option>Remote Return Pending</option>
                </select>
              </div>

              <div className="flex items-center gap-3 p-4 bg-surface rounded-xl border border-outline-variant/30">
                <input type="checkbox" id="wipe-data" className="w-5 h-5 rounded border-outline-variant bg-surface text-primary focus:ring-primary outline-none" />
                <label htmlFor="wipe-data" className="text-sm font-medium text-on-surface cursor-pointer select-none">
                  Confidential employee data has been securely wiped
                </label>
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={handleConfirmReturn}
                className="flex-1 py-3 bg-primary text-on-primary font-bold rounded-xl hover:brightness-110 active:scale-95 transition-all shadow-md"
              >
                Confirm Return
              </button>
              <button 
                onClick={() => setIsReturnOpen(false)}
                className="flex-1 py-3 border border-outline-variant rounded-xl font-bold hover:bg-surface-bright active:scale-95 transition-all text-on-surface-variant hover:text-on-surface"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default AllocationTransfer;
