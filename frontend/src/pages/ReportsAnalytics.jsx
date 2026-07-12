import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';

function ReportsAnalytics() {
  const { assets, bookings, tickets, departments, categories } = useContext(AppContext);
  const [reportFilter, setReportFilter] = useState('All');

  // --- Calculations ---
  const totalAssets = assets.length || 1;
  const allocatedCount = assets.filter(a => a.status === 'Allocated').length;
  const availableCount = assets.filter(a => a.status === 'Available').length;
  const maintenanceCount = assets.filter(a => a.status === 'Under Maintenance').length;
  const lostCount = assets.filter(a => a.status === 'Lost').length;
  const retiredCount = assets.filter(a => a.status === 'Retired' || a.status === 'Disposed').length;

  const allocatedPercent = Math.round((allocatedCount / totalAssets) * 100);
  const availablePercent = Math.round((availableCount / totalAssets) * 100);
  const maintenancePercent = Math.round((maintenanceCount / totalAssets) * 100);
  const lostPercent = Math.round((lostCount / totalAssets) * 100);
  const retiredPercent = Math.round((retiredCount / totalAssets) * 100);

  // Department wise allocations
  const deptAllocations = departments.map(d => {
    // Count assets where location/holder department equals d.name
    const count = assets.filter(a => a.location === d.name || (a.status === 'Allocated' && a.location === d.name)).length;
    return { name: d.name, count };
  });

  // Maintenance tickets by category
  const categoryMaintenance = categories.map(cat => {
    const ticketCount = tickets.filter(t => {
      const assetObj = assets.find(a => a.name === t.assetName);
      return assetObj && assetObj.category === cat.name;
    }).length;
    return { name: cat.name, count: ticketCount };
  });

  // Assets due for maintenance or nearing retirement
  const criticalAssets = assets.filter(a => {
    // Nearing retirement or needs check
    return a.condition === 'Poor' || a.condition === 'Fair' || a.status === 'Under Maintenance';
  });

  // Resource Booking Heatmap (Monday-Friday, 9:00 - 17:00)
  const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const timeslots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];

  // Simulated heatmap load (higher color density for peak times e.g. 10:00, 11:00, 14:00)
  const getHeatmapColor = (day, time) => {
    const hour = parseInt(time.split(':')[0], 10);
    let intensity = 0; // 0: low, 1: mid, 2: peak, 3: dense
    if (day === 'Wed' || day === 'Tue' || day === 'Thu') {
      if (hour === 10 || hour === 11 || hour === 14) {
        intensity = 3;
      } else if (hour === 9 || hour === 13 || hour === 15) {
        intensity = 2;
      } else {
        intensity = 1;
      }
    } else {
      if (hour === 10 || hour === 14) {
        intensity = 2;
      } else if (hour === 11 || hour === 15) {
        intensity = 1;
      } else {
        intensity = 0;
      }
    }

    switch (intensity) {
      case 3: return 'bg-primary border-primary/30 text-on-primary'; // Dense
      case 2: return 'bg-primary/60 border-primary/20 text-white'; // Peak
      case 1: return 'bg-primary/30 border-primary/10 text-on-surface-variant'; // Mid
      case 0:
      default:
        return 'bg-surface-container border-outline-variant/30 text-on-surface-variant/40'; // Low
    }
  };

  const handleExportReport = () => {
    const reportText = `AssetFlow Enterprise Audit & Utilization Report
Date Generated: ${new Date().toLocaleString()}
--------------------------------------------------
Total Fleet Inventory: ${totalAssets}
- Available Assets: ${availableCount} (${availablePercent}%)
- Allocated Assets: ${allocatedCount} (${allocatedPercent}%)
- Under Maintenance: ${maintenanceCount} (${maintenancePercent}%)
- Lost Assets: ${lostCount} (${lostPercent}%)
- Retired/Disposed Assets: ${retiredCount} (${retiredPercent}%)

Department-Wise Allocation:
${deptAllocations.map(d => `* ${d.name}: ${d.count} assets`).join('\n')}

Category Maintenance Incidents:
${categoryMaintenance.map(c => `* ${c.name}: ${c.count} tickets`).join('\n')}

Critical Assets (Poor/Fair Condition or Under Maintenance):
${criticalAssets.map(a => `* [${a.tag}] ${a.name} - Condition: ${a.condition} - Status: ${a.status}`).join('\n')}
--------------------------------------------------
End of Report`;

    const element = document.createElement("a");
    const file = new Blob([reportText], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "AssetFlow_Utilization_Report.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="p-margin-page max-w-container-max mx-auto space-y-element-gap md:space-y-gutter pb-24 transition-colors duration-300 font-semibold">
      
      {/* Page Header */}
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="font-headline-md text-headline-md font-bold text-on-surface mb-1">Reports & Analytics</h2>
          <p className="text-on-surface-variant font-body-sm">Deep telemetry regarding fleet lifecycle, maintenance frequencies, and facility booking rates.</p>
        </div>
        <button 
          onClick={handleExportReport}
          className="bg-primary text-on-primary font-label-md text-label-md px-5 py-2.5 rounded-xl flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all shadow-md font-bold"
        >
          <span className="material-symbols-outlined text-xl font-bold">download</span>
          Export Report
        </button>
      </div>

      {/* Bento Grid Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        
        {/* Card 1: Asset Utilization Trends (Horizontal bars) */}
        <div className="lg:col-span-6 glass-card p-6 rounded-xl border border-outline-variant/60 flex flex-col justify-between">
          <div>
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-4">Utilization Trends</h3>
            <p className="text-xs text-on-surface-variant mb-6">Visual breakdown of global physical asset allocations.</p>
          </div>
          
          <div className="space-y-5">
            {/* Allocated */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span>Allocated</span>
                <span>{allocatedCount} ({allocatedPercent}%)</span>
              </div>
              <div className="w-full bg-surface-container rounded-full h-3 overflow-hidden border border-outline-variant/10">
                <div className="bg-primary h-full rounded-full transition-all duration-500" style={{ width: `${allocatedPercent}%` }}></div>
              </div>
            </div>

            {/* Available */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span>Available</span>
                <span>{availableCount} ({availablePercent}%)</span>
              </div>
              <div className="w-full bg-surface-container rounded-full h-3 overflow-hidden border border-outline-variant/10">
                <div className="bg-secondary h-full rounded-full transition-all duration-500" style={{ width: `${availablePercent}%` }}></div>
              </div>
            </div>

            {/* Under Maintenance */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span>Under Maintenance</span>
                <span>{maintenanceCount} ({maintenancePercent}%)</span>
              </div>
              <div className="w-full bg-surface-container rounded-full h-3 overflow-hidden border border-outline-variant/10">
                <div className="bg-tertiary h-full rounded-full transition-all duration-500" style={{ width: `${maintenancePercent}%` }}></div>
              </div>
            </div>

            {/* Lost / Missing */}
            <div>
              <div className="flex justify-between text-xs mb-1.5 text-error">
                <span>Lost / Flagged Missing</span>
                <span>{lostCount} ({lostPercent}%)</span>
              </div>
              <div className="w-full bg-surface-container rounded-full h-3 overflow-hidden border border-outline-variant/10">
                <div className="bg-error h-full rounded-full transition-all duration-500" style={{ width: `${lostPercent}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Category Maintenance Frequency (Vertical bars) */}
        <div className="lg:col-span-6 glass-card p-6 rounded-xl border border-outline-variant/60">
          <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-2">Maintenance by Category</h3>
          <p className="text-xs text-on-surface-variant mb-6">Historical ticket logging count filtered by taxonomy classification.</p>
          
          <div className="h-56 flex items-end justify-between gap-4 px-4 border-b border-outline-variant/40">
            {categoryMaintenance.map((c, i) => {
              const maxVal = Math.max(...categoryMaintenance.map(x => x.count)) || 1;
              const barHeight = `${Math.max((c.count / maxVal) * 80, 10)}%`;
              return (
                <div key={i} className="flex-1 flex flex-col items-center justify-end h-full group relative">
                  <span className="absolute -top-6 text-[10px] text-primary font-bold opacity-0 group-hover:opacity-100 transition-opacity">{c.count} Tickets</span>
                  <div 
                    style={{ height: barHeight }}
                    className="w-full max-w-[40px] bg-primary/20 hover:bg-primary/45 rounded-t-lg transition-all"
                  ></div>
                  <span className="text-[10px] text-on-surface-variant mt-2 text-center truncate w-full">{c.name}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Card 3: Department-wise allocations & Critical Assets */}
        <div className="lg:col-span-7 glass-card p-6 rounded-xl border border-outline-variant/60 space-y-6">
          <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">Department Allocation & Critical Alerts</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Dept Summary Table */}
            <div>
              <p className="text-[10px] uppercase tracking-wider text-on-surface-variant font-bold mb-3">Department Summary</p>
              <div className="bg-surface-container rounded-xl overflow-hidden border border-outline-variant/40">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-surface-container-high border-b border-outline-variant/60">
                      <th className="px-4 py-2 font-bold text-on-surface-variant">Department</th>
                      <th className="px-4 py-2 font-bold text-on-surface-variant text-right">Holdings</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/20 font-semibold">
                    {deptAllocations.map((d, i) => (
                      <tr key={i}>
                        <td className="px-4 py-2.5 text-on-surface">{d.name}</td>
                        <td className="px-4 py-2.5 text-right font-bold text-primary">{d.count} assets</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Critical items */}
            <div>
              <p className="text-[10px] uppercase tracking-wider text-on-surface-variant font-bold mb-3">Nearing Retirement / Needs Inspect</p>
              <div className="space-y-2.5 max-h-40 overflow-y-auto custom-scrollbar">
                {criticalAssets.map((a, i) => (
                  <div key={i} className="flex justify-between items-center bg-surface-container border border-outline-variant/40 rounded-xl p-3 text-xs">
                    <div>
                      <p className="font-bold text-on-surface">{a.name}</p>
                      <p className="text-[10px] text-on-surface-variant">Tag: {a.tag} • Cond: {a.condition}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold border uppercase ${
                      a.status === 'Under Maintenance' ? 'bg-tertiary-container/20 border-tertiary text-tertiary' : 'bg-error/10 border-error/20 text-error'
                    }`}>
                      {a.status}
                    </span>
                  </div>
                ))}
                {criticalAssets.length === 0 && (
                  <p className="text-xs text-on-surface-variant italic py-4 text-center">No critical condition alerts reported.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Card 4: Resource Booking Heatmap */}
        <div className="lg:col-span-5 glass-card p-6 rounded-xl border border-outline-variant/60">
          <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-2">Facility Usage Heatmap</h3>
          <p className="text-xs text-on-surface-variant mb-6">Peak reservation occupancy density mapped across operational shifts.</p>
          
          <div className="grid grid-cols-6 gap-2 text-center text-[10px] font-bold text-on-surface-variant">
            <div>Hour</div>
            {weekdays.map(d => <div key={d}>{d}</div>)}

            {timeslots.map(time => (
              <React.Fragment key={time}>
                <div className="flex items-center justify-center font-bold">{time}</div>
                {weekdays.map(day => (
                  <div 
                    key={day + time}
                    className={`h-7 rounded border flex items-center justify-center font-bold text-[9px] ${getHeatmapColor(day, time)}`}
                    title={`Reservation density for ${day} at ${time}`}
                  >
                    {day === 'Wed' && time === '10:00' ? '92%' : day === 'Tue' && time === '14:00' ? '85%' : ''}
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>

          <div className="flex justify-between items-center mt-6 text-[9px] text-on-surface-variant border-t border-outline-variant/30 pt-3">
            <span className="font-semibold">Low (Available)</span>
            <div className="flex gap-1.5 items-center">
              <span className="w-2.5 h-2.5 bg-surface-container border border-outline-variant/30 rounded"></span>
              <span className="w-2.5 h-2.5 bg-primary/30 rounded"></span>
              <span className="w-2.5 h-2.5 bg-primary/60 rounded"></span>
              <span className="w-2.5 h-2.5 bg-primary rounded"></span>
            </div>
            <span className="font-semibold">Dense (Peak)</span>
          </div>
        </div>

      </div>

    </div>
  );
}

export default ReportsAnalytics;
