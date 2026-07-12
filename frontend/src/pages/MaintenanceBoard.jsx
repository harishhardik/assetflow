import React, { useState } from 'react';

function MaintenanceBoard({ userRole }) {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLogOpen, setIsLogOpen] = useState(false);

  // Form states for new incident
  const [newTitle, setNewTitle] = useState('');
  const [newAsset, setNewAsset] = useState('Industrial Carrier HVAC');
  const [newPriority, setNewPriority] = useState('Warning');
  const [newDesc, setNewDesc] = useState('');

  // Kanban tickets state
  const [tickets, setTickets] = useState([
    {
      id: 'AF-772',
      title: 'HVAC Unit 4 Leak',
      desc: 'Main server room HVAC coolant pressure dropping rapidly. Immediate inspection required.',
      status: 'Pending',
      priority: 'Danger', // Danger, Warning, Success
      assignee: 'Unassigned',
      avatar: '',
      date: 'Oct 24, 2023',
      assetName: 'Industrial Carrier X400',
      assetLoc: 'Server Room 102 - Row A',
      report: 'Coolant pressure sensors triggered an alarm at 02:45 AM. Manual visual inspection confirms a hairline fracture in the secondary discharge pipe. Risk of localized freezing if not addressed within 48 hours. Temperature in Server Room 102 has already risen by 1.2°C.',
      logs: [
        { title: 'Ticket Created by System Monitoring', time: 'Oct 24, 02:45 AM', done: true },
        { title: 'Manual Inspection Added by security_ops', time: 'Oct 24, 03:15 AM', done: false }
      ]
    },
    {
      id: 'AF-801',
      title: 'Elevator B Inspection',
      desc: 'Routine semi-annual safety audit for the west wing elevators.',
      status: 'Pending',
      priority: 'Success',
      assignee: 'Unassigned',
      avatar: '',
      date: 'Oct 26, 2023',
      assetName: 'Kone Traction Elevator',
      assetLoc: 'West Lobby Wing',
      report: 'Standard compliance inspection mandated by local building codes. Focus on cable wear and brake system certifications.',
      logs: [{ title: 'Scheduled by Facilities Manager', time: 'Oct 23, 09:00 AM', done: true }]
    },
    {
      id: 'AF-654',
      title: 'Parking Garage Lighting',
      desc: 'Section B light sensors malfunctioning. Constant activation.',
      status: 'Approved',
      priority: 'Warning',
      assignee: 'Sarah Jenkins',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBfxGY-75s6CNUUFX--4P3I9hVAKqU5hGCYsSztA7dntyJMsxTwxnZeT1ktjlO4HfrmjcBHhH83Bev9Jk_-x818UaL19vlFTT7x8Ahjb_fzZiL-PurNcngxCO0J6ene-ejGlE9N52dZBIagpF1PJZNUkg1gEaW5iExBfDs9luvtbjvxubibiLyhPPRhuNiJkNf1iRb78TnDFzn4S-IaDu0YP9qKweQ12m1lQKgRcsTgc3sCGghW6-R4YlEn2Vn2cQlVpvfgD0_hgJ3N',
      date: 'Oct 22, 2023',
      assetName: 'Lutron Energy Grid #B',
      assetLoc: 'Sublevel P2 Garage',
      report: 'Sensors in Section B are stuck high, preventing parking lot lights from cycling down during daylight hours.',
      logs: [
        { title: 'Ticket Created', time: 'Oct 22, 06:12 AM', done: true },
        { title: 'Work Order Approved', time: 'Oct 22, 09:30 AM', done: true }
      ]
    },
    {
      id: 'AF-112',
      title: 'Main Generator Fault',
      desc: 'Backup power generator failed during self-test. Fuel pump issue.',
      status: 'Technician Assigned',
      priority: 'Danger',
      assignee: 'Marcus Thorne',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCH5kJ31fOxVJ2agX6ih5CKA8zJXINwq09aBdPUwn729CPRzw4u0oHE-Bg_lOBwtS42h06OLtIcb4phIyqE0FjiNmgk-hhqHlyybyiw6qf5f4P8U1yToD0QYKOvskvbQrdRcbO7o0s0Mo5aKsgeP0KRzi0SAs7OCYY32O3RNxjdjF266srd04XB4f8evE9i78J_6iZ-rtmm8q65zYJjmVctM2UJLU00mq9omXW8A1OFC-PPFD-LpG8_nWsFV-Iwgb2Nun3eeaDroBBK',
      date: 'Oct 21, 2023',
      assetName: 'Caterpillar 500kVA Gen',
      assetLoc: 'Utility Yard - Grid South',
      report: 'Diagnostic engine codes indicate low fuel line pressure. Technician dispatched with replacement pump seals.',
      logs: [
        { title: 'Diagnostic Alarm Registered', time: 'Oct 21, 04:00 AM', done: true },
        { title: 'Work Approved & Dispatched', time: 'Oct 21, 08:15 AM', done: true }
      ]
    },
    {
      id: 'AF-099',
      title: 'Roof Deck Sealant',
      desc: 'Weatherproofing applied. Currently curing. Final inspection at 4PM.',
      status: 'In Progress',
      priority: 'Warning',
      assignee: 'David Wu',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA0Un6Ur96OpqspaN546hFBEmCRlm9VfNm6XuhxZ4QHzlmKlJTrNeAF-GWhF7Y2XutzglL9eRMPHNTvsetqXB_txFTvm0aLz3fu3R7TSw7fJunuoCPAvviOONq3U_Rj7kVbDAKtoOSD0sfgmzp5s7CzF8Ly1FQ-bKTpCKF4xPWLljkDt4MW85msdghgTIQBZrpDQ9jRzPESUTXMAaYmSmhrpR5PL5btH4VBwivHKbg5inHUoy69xc2ezxLRfaFIahgw_6rg2Wext8iO',
      date: 'Oct 25, 2023',
      assetName: 'Roof Membranes Block B',
      assetLoc: 'Main Roof Terrace',
      report: 'Applying elastomeric liquid sealant to roof seams. Requires 12 hours dry curing before final inspection.',
      logs: [
        { title: 'Weather Window Checked', time: 'Oct 25, 07:00 AM', done: true },
        { title: 'Sealant Application Started', time: 'Oct 25, 09:30 AM', done: true }
      ]
    },
    {
      id: 'AF-541',
      title: 'Wi-Fi Router 12 Reset',
      desc: 'Router restarted. Factory diagnostic check completed successfully.',
      status: 'Resolved',
      priority: 'Success',
      assignee: 'David Wu',
      avatar: '',
      date: 'Oct 23, 2023',
      assetName: 'Ubiquiti AP-AC-PRO',
      assetLoc: 'Office Area - Floor 2',
      report: 'Signal dropping reported by HR staff. Diagnostic power cycle performed remotely. Signal levels restored.',
      logs: [
        { title: 'HR Outage Logged', time: 'Oct 23, 10:15 AM', done: true },
        { title: 'AP Reset & Verify', time: 'Oct 23, 11:00 AM', done: true }
      ]
    }
  ]);

  const handleCardClick = (ticket) => {
    setSelectedTicket(ticket);
    setIsDrawerOpen(true);
  };

  const handleAssignTechnician = () => {
    if (selectedTicket) {
      const updatedTickets = tickets.map(t => {
        if (t.id === selectedTicket.id) {
          return {
            ...t,
            status: 'Technician Assigned',
            assignee: 'David Wu',
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA0Un6Ur96OpqspaN546hFBEmCRlm9VfNm6XuhxZ4QHzlmKlJTrNeAF-GWhF7Y2XutzglL9eRMPHNTvsetqXB_txFTvm0aLz3fu3R7TSw7fJunuoCPAvviOONq3U_Rj7kVbDAKtoOSD0sfgmzp5s7CzF8Ly1FQ-bKTpCKF4xPWLljkDt4MW85msdghgTIQBZrpDQ9jRzPESUTXMAaYmSmhrpR5PL5btH4VBwivHKbg5inHUoy69xc2ezxLRfaFIahgw_6rg2Wext8iO',
            logs: [
              ...t.logs,
              { title: 'Technician David Wu Assigned', time: 'Just now', done: true }
            ]
          };
        }
        return t;
      });
      setTickets(updatedTickets);
      
      // Update selected ticket state in drawer
      const newSel = updatedTickets.find(t => t.id === selectedTicket.id);
      setSelectedTicket(newSel);
    }
  };

  const handleLogIncidentSubmit = (e) => {
    e.preventDefault();
    const newId = `AF-${Math.floor(100 + Math.random() * 900)}`;
    const newInc = {
      id: newId,
      title: newTitle,
      desc: newDesc,
      status: 'Pending',
      priority: newPriority,
      assignee: 'Unassigned',
      avatar: '',
      date: 'Oct 24, 2023',
      assetName: newAsset,
      assetLoc: 'HQ Premises',
      report: newDesc || 'Incident logged manually from operator board.',
      logs: [
        { title: 'Ticket Created manually by operator', time: 'Just now', done: true }
      ]
    };

    setTickets([...tickets, newInc]);
    setIsLogOpen(false);
    setNewTitle('');
    setNewDesc('');
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

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col overflow-hidden transition-colors duration-300">
      
      {/* Page header and controls */}
      <div className="p-gutter pb-4 bg-surface flex flex-wrap items-center justify-between gap-4 border-b border-outline-variant/30 flex-shrink-0">
        <div>
          <h2 className="font-headline-md text-headline-md font-bold text-on-surface">Maintenance Board</h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Real-time status of facility and equipment health.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex gap-4">
            <div className="bg-surface-container px-4 py-2 rounded-xl border border-outline-variant/60 shadow-sm min-w-[130px]">
              <p className="text-[10px] uppercase font-bold text-on-surface-variant">Active Tickets</p>
              <p className="text-xl font-bold text-primary mt-0.5">
                {tickets.filter(t => t.status !== 'Resolved').length}
              </p>
            </div>
            <div className="bg-surface-container px-4 py-2 rounded-xl border border-outline-variant/60 shadow-sm min-w-[130px]">
              <p className="text-[10px] uppercase font-bold text-on-surface-variant">Technicians</p>
              <p className="text-xl font-bold text-secondary mt-0.5">08</p>
            </div>
          </div>
          <button 
            onClick={() => setIsLogOpen(true)}
            className="bg-primary text-on-primary px-5 py-2.5 rounded-xl font-bold hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 shadow-lg shadow-primary/10"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            Log Incident
          </button>
        </div>
      </div>

      {/* Kanban Board Container */}
      <div className="flex-1 overflow-x-auto p-gutter custom-scrollbar bg-background/10">
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
                  <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-on-surface">more_horiz</span>
                </div>

                {/* Column tickets scroll list */}
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
                        <span className="font-code text-xs text-on-surface-variant/70 font-semibold">{ticket.id}</span>
                      </div>
                      
                      <h4 className="font-label-md text-label-md font-bold text-on-surface group-hover:text-primary transition-colors leading-tight">
                        {ticket.title}
                      </h4>
                      <p className="text-xs text-on-surface-variant mt-2 mb-4 line-clamp-2 leading-relaxed">
                        {ticket.desc}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        {ticket.assignee !== 'Unassigned' ? (
                          <div className="flex items-center gap-2">
                            {ticket.avatar ? (
                              <img className="w-6 h-6 rounded-full border border-outline-variant/30 object-cover" src={ticket.avatar} alt={ticket.assignee} />
                            ) : (
                              <div className="w-6 h-6 rounded-full bg-secondary-container text-on-secondary-container text-[10px] font-bold flex items-center justify-center">
                                {ticket.assignee.split(' ').map(n=>n[0]).join('')}
                              </div>
                            )}
                            <span className="text-[11px] text-on-surface-variant font-bold">{ticket.assignee}</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-on-surface-variant/70 font-medium">
                            <span className="material-symbols-outlined text-sm">person</span>
                            <span className="text-[11px] font-semibold">Unassigned</span>
                          </div>
                        )}
                        <span className="text-[10px] text-on-surface-variant font-semibold">{ticket.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Ticket Details Drawer */}
      {isDrawerOpen && selectedTicket && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setIsDrawerOpen(false)}></div>
          <div className="relative w-full max-w-md bg-surface-container-high border-l border-outline-variant h-screen shadow-2xl z-10 animate-slide-in-right flex flex-col">
            
            {/* Header */}
            <div className="p-6 border-b border-outline-variant/60 flex items-center justify-between bg-surface-container-high">
              <div>
                <p className="text-[10px] text-primary font-bold uppercase tracking-widest mb-1">ASSET MAINTENANCE #{selectedTicket.id}</p>
                <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface leading-tight">{selectedTicket.title}</h2>
              </div>
              <button onClick={() => setIsDrawerOpen(false)} className="p-2 hover:bg-surface-bright rounded-full text-on-surface-variant hover:text-on-surface shrink-0">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Scrollable specs */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              
              {/* Badges block */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-surface border border-outline-variant/30">
                  <p className="text-[10px] text-on-surface-variant font-bold uppercase">Status</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-tertiary animate-pulse"></span>
                    <span className="font-label-md text-label-md font-bold text-on-surface">{selectedTicket.status}</span>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-surface border border-outline-variant/30">
                  <p className="text-[10px] text-on-surface-variant font-bold uppercase">Priority</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="material-symbols-outlined text-error text-sm font-bold">priority_high</span>
                    <span className="font-label-md text-label-md font-bold text-error">{selectedTicket.priority}</span>
                  </div>
                </div>
              </div>

              {/* Asset Info Card */}
              <div className="p-4 rounded-2xl bg-surface border border-outline-variant/60 flex items-center gap-4 shadow-sm">
                <div className="w-14 h-14 rounded-lg bg-surface-container flex items-center justify-center border border-outline-variant/20 shrink-0">
                  <span className="material-symbols-outlined text-[28px] text-primary">build</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-label-md text-label-md text-on-surface font-bold truncate">{selectedTicket.assetName}</p>
                  <p className="text-xs text-on-surface-variant font-medium truncate">{selectedTicket.assetLoc}</p>
                </div>
                <span className="material-symbols-outlined text-primary">arrow_forward_ios</span>
              </div>

              {/* Situation Report */}
              <div>
                <h3 className="text-xs text-primary font-bold uppercase tracking-wider mb-2">Situation Report</h3>
                <p className="text-body-sm text-on-surface leading-relaxed font-medium bg-surface p-4 rounded-xl border border-outline-variant/30">
                  {selectedTicket.report}
                </p>
              </div>

              {/* Activity Log */}
              <div>
                <h3 className="text-xs text-primary font-bold uppercase tracking-wider mb-3">Activity Log</h3>
                <div className="space-y-4 relative before:absolute before:left-[7px] before:top-2 before:bottom-0 before:w-0.5 before:bg-outline-variant/60 pl-1">
                  {selectedTicket.logs.map((log, index) => (
                    <div key={index} className="flex gap-4 relative pl-3">
                      <div className={`w-3.5 h-3.5 rounded-full z-10 shrink-0 border border-surface shadow-sm ${
                        log.done ? 'bg-primary' : 'bg-outline-variant'
                      }`}></div>
                      <div>
                        <p className="font-label-sm text-label-sm font-bold text-on-surface">{log.title}</p>
                        <p className="text-[10px] text-on-surface-variant font-semibold mt-0.5">{log.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Footer actions */}
            <div className="p-6 border-t border-outline-variant/60 bg-surface-container-high/90 backdrop-blur-md grid grid-cols-2 gap-4">
              <button 
                onClick={() => setIsDrawerOpen(false)}
                className="py-3 border border-outline-variant rounded-xl font-bold hover:bg-surface-bright transition-all active:scale-95 text-on-surface-variant hover:text-on-surface"
              >
                Reject Ticket
              </button>
              {selectedTicket.assignee === 'Unassigned' && (
                <button 
                  onClick={handleAssignTechnician}
                  className="py-3 bg-primary text-on-primary rounded-xl font-bold hover:brightness-110 active:scale-95 transition-all shadow-md"
                >
                  Assign Myself
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Log Incident Drawer form */}
      {isLogOpen && (
        <div className="fixed inset-0 z-50 flex justify-end animate-fade-in">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsLogOpen(false)}></div>
          <div className="relative w-full max-w-md bg-surface-container-low border-l border-outline-variant h-screen shadow-2xl z-10 flex flex-col animate-slide-in-right">
            <div className="p-6 border-b border-outline-variant/60 flex justify-between items-center bg-surface-container-high">
              <div>
                <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">Log Facility Incident</h3>
                <p className="text-xs text-on-surface-variant">Report malfunction or service outage</p>
              </div>
              <button onClick={() => setIsLogOpen(false)} className="p-2 hover:bg-surface-bright rounded-full text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleLogIncidentSubmit} className="flex-1 flex flex-col h-full overflow-hidden">
              <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                <div>
                  <label className="text-xs text-on-surface-variant font-bold uppercase tracking-wider mb-1 block">Title / Incident Name</label>
                  <input 
                    type="text" 
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Projector Flickering in Conf C"
                    required
                    className="w-full bg-surface border border-outline-variant/60 rounded-xl px-4 py-2.5 text-sm focus:border-primary outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-on-surface-variant font-bold uppercase tracking-wider mb-1 block">Target Asset</label>
                  <select 
                    value={newAsset}
                    onChange={(e) => setNewAsset(e.target.value)}
                    className="w-full bg-surface border border-outline-variant/60 rounded-xl px-4 py-2.5 text-sm focus:border-primary outline-none"
                  >
                    <option>Industrial Carrier HVAC</option>
                    <option>Elevator Lift Shaft B</option>
                    <option>Optoma Projector #099</option>
                    <option>Main Power Grid Generator</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-on-surface-variant font-bold uppercase tracking-wider mb-1 block">Priority / Risk Level</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Success', 'Warning', 'Danger'].map(pri => (
                      <button
                        key={pri}
                        type="button"
                        onClick={() => setNewPriority(pri)}
                        className={`py-2.5 rounded-xl border text-xs font-bold text-center transition-all ${
                          newPriority === pri
                            ? 'bg-primary/10 border-primary text-primary'
                            : 'bg-surface border-outline-variant/60 text-on-surface-variant hover:text-on-surface'
                        }`}
                      >
                        {pri === 'Success' ? 'Low' : pri === 'Warning' ? 'Medium' : 'High / Critical'}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs text-on-surface-variant font-bold uppercase tracking-wider mb-1 block">Situation Details</label>
                  <textarea 
                    rows="5"
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    placeholder="Describe the issue, location details, error codes, and operational impact..."
                    required
                    className="w-full bg-surface border border-outline-variant/60 rounded-xl p-4 text-sm focus:border-primary outline-none resize-none"
                  />
                </div>
              </div>

              <div className="p-6 border-t border-outline-variant/60 bg-surface-container-high/90 backdrop-blur-md flex gap-3 flex-shrink-0">
                <button type="submit" className="flex-1 py-3 bg-primary text-on-primary font-bold rounded-xl hover:brightness-110 transition-all shadow-md active:scale-95">
                  Submit Ticket
                </button>
                <button type="button" onClick={() => setIsLogOpen(false)} className="px-6 py-3 border border-outline-variant rounded-xl font-bold hover:bg-surface-bright transition-all active:scale-95 text-on-surface-variant hover:text-on-surface">
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

export default MaintenanceBoard;
