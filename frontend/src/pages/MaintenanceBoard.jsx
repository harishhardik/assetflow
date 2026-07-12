import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';

function MaintenanceBoard() {
  const { 
    userRole, 
    tickets, 
    assets, 
    employees, 
    raiseMaintenance, 
    updateTicketStatus 
  } = useContext(AppContext);

  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLogOpen, setIsLogOpen] = useState(false);

  // Form states for new incident
  const [newTitle, setNewTitle] = useState('');
  const [newAssetId, setNewAssetId] = useState('');
  const [newPriority, setNewPriority] = useState('Warning');
  const [newDesc, setNewDesc] = useState('');
  const [newPhoto, setNewPhoto] = useState('');

  // Assign Technician selector state
  const [selectedTech, setSelectedTech] = useState('');

  const handleCardClick = (ticket) => {
    setSelectedTicket(ticket);
    setSelectedTech('');
    setIsDrawerOpen(true);
  };

  const handleLogIncidentSubmit = (e) => {
    e.preventDefault();
    if (!newAssetId || !newDesc) return;
    
    const assetId = parseInt(newAssetId, 10);
    raiseMaintenance(assetId, newDesc, newPriority, newPhoto);
    setIsLogOpen(false);
    resetLogForm();
  };

  const resetLogForm = () => {
    setNewTitle('');
    setNewAssetId('');
    setNewPriority('Warning');
    setNewDesc('');
    setNewPhoto('');
  };

  const handleApproveReject = (status) => {
    if (selectedTicket) {
      updateTicketStatus(selectedTicket.id, status);
      // Sync drawer ticket details
      const freshTicket = tickets.find(t => t.id === selectedTicket.id);
      setSelectedTicket(prev => ({
        ...prev,
        status: status,
        logs: [
          ...prev.logs,
          { title: `Status set to ${status}`, time: new Date().toLocaleTimeString(), done: true }
        ]
      }));
    }
  };

  const handleAssignTechSubmit = (e) => {
    e.preventDefault();
    if (selectedTicket && selectedTech) {
      updateTicketStatus(selectedTicket.id, 'Technician Assigned', selectedTech);
      setSelectedTicket(prev => ({
        ...prev,
        status: 'Technician Assigned',
        assignee: selectedTech,
        logs: [
          ...prev.logs,
          { title: `Assigned to Technician ${selectedTech}`, time: new Date().toLocaleTimeString(), done: true }
        ]
      }));
      setSelectedTech('');
    }
  };

  const handleProgressTransition = (nextStatus) => {
    if (selectedTicket) {
      updateTicketStatus(selectedTicket.id, nextStatus);
      setSelectedTicket(prev => ({
        ...prev,
        status: nextStatus,
        logs: [
          ...prev.logs,
          { title: `Incident progress set to ${nextStatus}`, time: new Date().toLocaleTimeString(), done: true }
        ]
      }));
    }
  };

  const columns = ['Pending', 'Approved', 'Technician Assigned', 'In Progress', 'Resolved'];

  const getPriorityBadgeColor = (p) => {
    switch (p) {
      case 'Danger':
        return 'bg-error/10 border-error/20 text-error';
      case 'Warning':
        return 'bg-tertiary-container/10 border-tertiary-container/20 text-tertiary';
      case 'Success':
      default:
        return 'bg-primary/10 border-primary/20 text-primary';
    }
  };

  const isAdminOrManager = userRole === 'Admin' || userRole === 'Asset Manager';

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col overflow-hidden transition-colors duration-300">
      
      {/* Page header and controls */}
      <div className="p-gutter pb-4 bg-surface flex flex-wrap items-center justify-between gap-4 border-b border-outline-variant/30 flex-shrink-0 font-semibold">
        <div>
          <h2 className="font-headline-md text-headline-md font-bold text-on-surface">Maintenance Board</h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Real-time status of facility and hardware equipment health.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex gap-4">
            <div className="bg-surface-container px-4 py-2 rounded-xl border border-outline-variant/60 shadow-sm min-w-[130px]">
              <p className="text-[10px] uppercase font-bold text-on-surface-variant">Active Incidents</p>
              <p className="text-xl font-bold text-primary mt-0.5">
                {tickets.filter(t => t.status !== 'Resolved').length}
              </p>
            </div>
            <div className="bg-surface-container px-4 py-2 rounded-xl border border-outline-variant/60 shadow-sm min-w-[130px]">
              <p className="text-[10px] uppercase font-bold text-on-surface-variant">Technicians Available</p>
              <p className="text-xl font-bold text-secondary mt-0.5">
                {employees.filter(e => e.role === 'Asset Manager' || e.role === 'Admin').length || 2}
              </p>
            </div>
          </div>
          <button 
            onClick={() => {
              resetLogForm();
              if (assets.length > 0) {
                setNewAssetId(assets[0].id.toString());
              }
              setIsLogOpen(true);
            }}
            className="bg-primary text-on-primary px-5 py-2.5 rounded-xl font-bold hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 shadow-lg shadow-primary/10"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            Log Incident
          </button>
        </div>
      </div>

      {/* Kanban Board Container */}
      <div className="flex-1 overflow-x-auto p-gutter custom-scrollbar bg-background/10 font-semibold">
        <div className="flex gap-gutter h-full pb-4 items-stretch min-w-max">
          {columns.map(col => {
            const colTickets = tickets.filter(t => t.status === col);
            return (
              <div key={col} className="w-[320px] flex flex-col gap-4 shrink-0 h-full">
                {/* Column header */}
                <div className="flex justify-between items-center px-2 flex-shrink-0">
                  <h3 className="font-label-md text-label-md text-on-surface font-bold flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${
                      col === 'Pending' ? 'bg-tertiary' : col === 'Approved' ? 'bg-secondary' : col === 'Resolved' ? 'bg-primary' : 'bg-primary-container'
                    }`}></span>
                    {col} <span className="text-on-surface-variant font-medium ml-1">({colTickets.length})</span>
                  </h3>
                </div>

                {/* Column tickets list */}
                <div className="flex-1 overflow-y-auto space-y-4 pr-1 custom-scrollbar pb-8">
                  {colTickets.map(ticket => (
                    <div 
                      key={ticket.id} 
                      onClick={() => handleCardClick(ticket)}
                      className={`glass-card p-padding-card rounded-xl shadow-sm cursor-pointer hover:border-primary/50 transition-all duration-200 group active:scale-[0.99] border-l-4 ${
                        col === 'In Progress' ? 'border-l-secondary' : 'border-l-transparent'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${
                          getPriorityBadgeColor(ticket.priority)
                        }`}>
                          {ticket.priority}
                        </span>
                        <span className="text-[10px] text-on-surface-variant font-code font-bold">{ticket.id}</span>
                      </div>
                      <h4 className="font-label-md text-label-md font-bold text-on-surface leading-snug group-hover:text-primary transition-colors">{ticket.title}</h4>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-1.5 line-clamp-2 leading-relaxed">{ticket.desc}</p>
                      
                      <div className="flex justify-between items-center mt-4 pt-3 border-t border-outline-variant/30 text-[10px] text-on-surface-variant font-semibold">
                        <span className="truncate max-w-[120px]">{ticket.assetName}</span>
                        <span>Assignee: {ticket.assignee || 'None'}</span>
                      </div>
                    </div>
                  ))}
                  {colTickets.length === 0 && (
                    <div className="p-8 text-center text-on-surface-variant/40 border border-dashed border-outline-variant/40 rounded-xl bg-surface-container/20 italic">
                      No incidents
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Incident Detail Drawer */}
      {isDrawerOpen && selectedTicket && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div onClick={() => setIsDrawerOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"></div>
          <div className="relative w-full max-w-lg bg-surface-container-high border-l border-outline-variant h-screen shadow-2xl z-10 flex flex-col animate-slide-in-right">
            
            <div className="p-6 border-b border-outline-variant/60 flex justify-between items-center bg-surface-container-high">
              <div>
                <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">{selectedTicket.title}</h3>
                <p className="text-xs text-primary font-code uppercase tracking-wider font-semibold">{selectedTicket.id}</p>
              </div>
              <button onClick={() => setIsDrawerOpen(false)} className="p-2 hover:bg-surface-bright rounded-full text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar font-semibold">
              {/* Incident report info */}
              <div className="bg-surface-container rounded-xl p-5 space-y-3 border border-outline-variant/30">
                <div className="flex justify-between text-xs">
                  <span className="text-on-surface-variant">Asset AssetName:</span>
                  <span className="text-on-surface font-bold">{selectedTicket.assetName}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-on-surface-variant">Location:</span>
                  <span className="text-on-surface font-bold">{selectedTicket.assetLoc}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-on-surface-variant">Priority:</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase ${getPriorityBadgeColor(selectedTicket.priority)}`}>
                    {selectedTicket.priority}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-on-surface-variant">Reported Date:</span>
                  <span className="text-on-surface">{selectedTicket.date}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-on-surface-variant">Assigned Tech:</span>
                  <span className="text-on-surface font-bold text-secondary">{selectedTicket.assignee || 'Unassigned'}</span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h4 className="text-xs uppercase tracking-wider font-bold text-on-surface-variant">Report Details</h4>
                <p className="text-sm leading-relaxed text-on-surface">{selectedTicket.report}</p>
              </div>

              {/* Incident logs/timeline */}
              <div className="space-y-4">
                <h4 className="text-xs uppercase tracking-wider font-bold text-on-surface-variant">Incident Timeline</h4>
                <div className="space-y-4 pl-4 relative before:content-[''] before:absolute before:left-6 before:top-2 before:bottom-2 before:w-[1px] before:bg-outline-variant/40">
                  {selectedTicket.logs?.map((log, idx) => (
                    <div key={idx} className="relative pl-8">
                      <div className="absolute left-1.5 top-1.5 w-3 h-3 rounded-full bg-primary ring-4 ring-surface-container-high"></div>
                      <p className="text-xs font-bold text-on-surface">{log.title}</p>
                      <p className="text-[10px] text-on-surface-variant mt-0.5">{log.time}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Administrative transition controls */}
              {isAdminOrManager && (
                <div className="border-t border-outline-variant/40 pt-6 space-y-4">
                  <h4 className="text-xs uppercase tracking-wider font-bold text-on-surface-variant">Workflow Status Transitions</h4>
                  
                  {selectedTicket.status === 'Pending' && (
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleApproveReject('Approved')}
                        className="flex-1 py-2.5 bg-primary text-on-primary rounded-xl text-xs font-bold hover:brightness-110 active:scale-95 transition-all shadow-md"
                      >
                        Approve Request
                      </button>
                      <button 
                        onClick={() => handleApproveReject('Rejected')}
                        className="px-4 py-2.5 border border-error/20 hover:bg-error/5 text-error rounded-xl text-xs font-bold transition-all active:scale-95"
                      >
                        Reject
                      </button>
                    </div>
                  )}

                  {selectedTicket.status === 'Approved' && (
                    <form onSubmit={handleAssignTechSubmit} className="space-y-3">
                      <div>
                        <label className="text-[10px] text-on-surface-variant uppercase tracking-wider font-bold block mb-1">Assign Dispatch Technician</label>
                        <select
                          value={selectedTech}
                          onChange={(e) => setSelectedTech(e.target.value)}
                          required
                          className="w-full bg-surface border border-outline-variant/60 rounded-xl px-4 py-2 text-xs focus:border-primary outline-none text-on-surface"
                        >
                          <option value="">Select Technician...</option>
                          {employees.filter(e => e.role === 'Asset Manager' || e.role === 'Admin').map(e => (
                            <option key={e.id} value={e.name}>{e.name} ({e.role})</option>
                          ))}
                        </select>
                      </div>
                      <button 
                        type="submit" 
                        className="w-full py-2.5 bg-secondary text-on-secondary rounded-xl text-xs font-bold hover:brightness-110 active:scale-95 transition-all shadow-md"
                      >
                        Dispatch Technician
                      </button>
                    </form>
                  )}

                  {selectedTicket.status === 'Technician Assigned' && (
                    <button 
                      onClick={() => handleProgressTransition('In Progress')}
                      className="w-full py-2.5 bg-primary text-on-primary rounded-xl text-xs font-bold hover:brightness-110 active:scale-95 transition-all shadow-md"
                    >
                      Start Maintenance Work
                    </button>
                  )}

                  {selectedTicket.status === 'In Progress' && (
                    <button 
                      onClick={() => handleProgressTransition('Resolved')}
                      className="w-full py-2.5 bg-primary text-on-primary rounded-xl text-xs font-bold hover:brightness-110 active:scale-95 transition-all shadow-md"
                    >
                      Resolve Incident (Restores Asset to Available)
                    </button>
                  )}

                  {selectedTicket.status === 'Resolved' && (
                    <div className="p-3 bg-primary/10 border border-primary/20 text-primary rounded-xl text-xs font-bold flex gap-2 items-center">
                      <span className="material-symbols-outlined text-sm font-bold">check_circle</span>
                      <span>Maintenance Incident has been completed and verified resolved.</span>
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* Log Incident Modal */}
      {isLogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsLogOpen(false)}></div>
          <form 
            onSubmit={handleLogIncidentSubmit}
            className="bg-surface-container-high w-full max-w-md rounded-2xl border border-outline-variant/60 p-6 z-10 shadow-2xl relative animate-fade-in"
          >
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-4">Log Maintenance Incident</h3>
            <div className="space-y-4 mb-6 font-semibold">
              <div>
                <label className="text-xs text-on-surface-variant font-bold uppercase tracking-wider mb-1 block">Select Asset</label>
                <select 
                  value={newAssetId}
                  onChange={(e) => setNewAssetId(e.target.value)}
                  required
                  className="w-full bg-surface border border-outline-variant/60 rounded-xl px-4 py-2.5 text-sm focus:border-primary outline-none text-on-surface"
                >
                  <option value="">Select hardware asset...</option>
                  {assets.map(a => (
                    <option key={a.id} value={a.id}>{a.name} ({a.tag}) — {a.status}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-on-surface-variant font-bold uppercase tracking-wider mb-1 block">Issue Priority</label>
                <select 
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value)}
                  className="w-full bg-surface border border-outline-variant/60 rounded-xl px-4 py-2.5 text-sm focus:border-primary outline-none text-on-surface"
                >
                  <option value="Danger">Danger (Critical / Safety Halt)</option>
                  <option value="Warning">Warning (Standard Issue)</option>
                  <option value="Success">Routine (Safety Inspection)</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-on-surface-variant font-bold uppercase tracking-wider mb-1 block">Describe Malfunction</label>
                <textarea 
                  rows="4" 
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Details of leak, power fluctuations, display flickering, etc..." 
                  className="w-full bg-surface border border-outline-variant/60 rounded-xl p-4 text-sm focus:border-primary outline-none resize-none"
                  required 
                />
              </div>

              <div>
                <label className="text-xs text-on-surface-variant font-bold uppercase tracking-wider mb-1 block">Photo attachment URL (Optional)</label>
                <input 
                  type="url" 
                  value={newPhoto}
                  onChange={(e) => setNewPhoto(e.target.value)}
                  placeholder="https://images.unsplash.com/..." 
                  className="w-full bg-surface border border-outline-variant/60 rounded-xl px-4 py-2.5 text-sm focus:border-primary outline-none text-xs" 
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" className="flex-1 py-3 bg-primary text-on-primary font-bold rounded-xl hover:brightness-110 transition-all shadow-md active:scale-95">
                Log Incident
              </button>
              <button type="button" onClick={() => setIsLogOpen(false)} className="flex-1 py-3 border border-outline-variant rounded-xl font-bold hover:bg-surface-bright transition-all text-on-surface-variant hover:text-on-surface">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}

export default MaintenanceBoard;
