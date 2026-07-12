import React, { useState } from 'react';

function AssetsManagement({ userRole }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedDept, setSelectedDept] = useState('All Departments');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [selectedLoc, setSelectedLoc] = useState('Global Locations');
  
  // Drawer states
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerTab, setDrawerTab] = useState('Overview'); // Overview, Timeline, Maintenance

  // Asset Creation Modal states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newAssetName, setNewAssetName] = useState('');
  const [newAssetCategory, setNewAssetCategory] = useState('Computing');
  const [newAssetLocation, setNewAssetLocation] = useState('San Francisco');
  const [newAssetSerial, setNewAssetSerial] = useState('');

  // Initial Mock Assets Data
  const [assets, setAssets] = useState([
    {
      tag: 'AF-2024-001',
      name: 'MacBook Pro M3 Max',
      icon: 'laptop_mac',
      category: 'Computing',
      assignedTo: 'James Chen',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCjtp_b0IA6kAlZRQJRsx7PfPw2RG9bakudJ8FremNWZdpp77e4sFd7UMIRPUPdri2WoRwAQR77I7rMGSLaalbJEppRxo5GW969OSkTqLxUgq7_W1_UAZJHUuIbNsHJRH-6M1nB8Ym77bHKlMHlqsjZkm_Rjbm_c-c-Ks-z4mlnzTivH5qmpQKBU2AKcpzxe82Mbq6HTU74FzAcS42Q8ObQTmEfIDZ0YCr0gfkSUuTJcShGGPTp9yy7kqOniLXowM9u4s384T-R1ZvM',
      dept: 'Engineering',
      status: 'Active',
      condition: 'Excellent',
      location: 'San Francisco',
      lifecycle: 85,
      serial: 'C02FX1234567',
      purchaseDate: 'Jan 12, 2024',
      warrantyEnds: 'Jan 12, 2027',
      value: '$4,299.00',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB8zmtVPVnUvm1HAUUrW_muh3wkYv2eaaOr5tCutkFptfLiesStUrSkaIUFl1z7fhmYrZokQcfFd6XM3pMINdGOyED1fXx1JrRa82M7TyB7Kg7rORcUf62I6BSd0RzwTS33_Kozzg0EdTr5Fe8M5ej-m7VeUiTJcuB2HZ-yFWTfljErsKePU7Op9CgF3-S2AWXc6_OvWTtoWMULcgb8vwj5eexWYJlaTbS42qWg6-zg5Fo4-8wEWwcWMosRJcdh1Xpw39qVN8AHllqr'
    },
    {
      tag: 'AF-2024-118',
      name: 'Cisco Catalyst 9300',
      icon: 'router',
      category: 'Networking',
      assignedTo: '',
      avatar: '',
      dept: 'Engineering',
      status: 'In Storage',
      condition: 'New',
      location: 'London Hub',
      lifecycle: 100,
      serial: 'SN-CS9300-8812',
      purchaseDate: 'Mar 02, 2024',
      warrantyEnds: 'Mar 02, 2029',
      value: '$2,850.00',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDNINNudG-NFbPlNeUDyCO2BZovgEtRV6o-9xyMMu1icxAdyn_hz-6HliOQWP-pFDhLv-MsJrl8ft0FxZrmjUAMjIKzrNi9ghmkTIiXrWkrQsh6nFsIlMFHzf-psUrhmvjSgZKJH4CQsonO3IpvxyCL4F2LOrY2gDCYYP3vFtvWJLUQgucwFBiod8O7x97qb-pJxK61vdxrLFglf-cMgPmKboMbK-GFlwYm58nN6xM8KaIBfmy6snlAiFQGvCU2uzPM0uE2YhT0DcsU'
    },
    {
      tag: 'AF-2023-942',
      name: 'HP LaserJet Enterprise',
      icon: 'print',
      category: 'Office Equipment',
      assignedTo: 'HR Department',
      avatar: '',
      dept: 'HR & Admin',
      status: 'Repairing',
      condition: 'Fair',
      location: 'HQ - Floor 4',
      lifecycle: 35,
      serial: 'HP-LJE-441290',
      purchaseDate: 'Jun 15, 2023',
      warrantyEnds: 'Jun 15, 2026',
      value: '$950.00',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAZe3Gn-xoezTA8gB96I02-3KfaU7mqvt0zAx-dZgjRvccZg_QN-N9j2POwo8rI00BARnJu7Z_NNhQORtIZN2tOBWKrXm3rb-6wvGmjIeIUnOZzxRUcxmXaByrMLK2DsZx-JGG7sG0qkR7nXvxeQyAjwkX3wf1tHynK-z3PWSGPsSC6kT-JpLy9pwO7g0Xz3kWZL3Zh6DbNJr01L1iRTkwbKbXQ8MULnnt6w_lYgtD0m6FvscFAfCGsQ-7xiWk__kzRrXjChSf7Ot2M'
    },
    {
      tag: 'AF-2024-055',
      name: 'Dell UltraSharp 32"',
      icon: 'desktop_windows',
      category: 'Computing',
      assignedTo: 'Sarah Miller',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDHXHg1o3w6zRk505vBu5Sq1-AFX_Gs7tgTufRdi1bkFPvxbevvMJ9Wwfr4QdERAE822KGxlQU2_TK9tx8YyFcymB12biRix21YIVj9kpS5P1ao3DOCfWdK2AMFHtLsT-eD1xhYvqI9GQdYDgrrA92qFanJBf6LVhjGzOt2yXrFdSo2y9eDD3rXSr1nXyZUJtimyyJfjZpuH-R7hs_L9w3Dhdao3nwr-Y2WtrAyGeBj--ynhpUyhyk_YoLrRrAbCa_Sf6t163jurB69',
      dept: 'Design',
      status: 'Active',
      condition: 'Good',
      location: 'Remote',
      lifecycle: 70,
      serial: 'DELL-US32-9012',
      purchaseDate: 'Feb 10, 2024',
      warrantyEnds: 'Feb 10, 2027',
      value: '$1,199.00',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB6dTqkfNg67v98knj6n6AJX0FunGGmN_zbiRfJEPXBWAa0y60G3-2RRps3yINyCLzeoa1fHPNa5LqE22LuoLNm1dV3suVS6ZUQg-p22e8o5yAgoP6ab7igXlZTMLysqPJsyB4ABdq5ZP_rehCeF19YNYf_uuYNZB6ZbT5_STntrs3095xVJ5QjDDUSJaNCsmGwiFxPdT4ZjZQUxZaqhKudw-bUXd_p6ZH99AjukWdMaBnDtv6I3ZlAM8FOL4rlxdTk_QAdbOeQp3bn'
    }
  ]);

  const handleRowClick = (asset) => {
    setSelectedAsset(asset);
    setIsDrawerOpen(true);
  };

  const handleRegisterAsset = (e) => {
    e.preventDefault();
    const newTag = `AF-2026-${Math.floor(100 + Math.random() * 900)}`;
    const newAsset = {
      tag: newTag,
      name: newAssetName,
      icon: newAssetCategory === 'Networking' ? 'router' : newAssetCategory === 'Furniture' ? 'chair' : 'laptop_mac',
      category: newAssetCategory,
      assignedTo: '',
      avatar: '',
      dept: 'Engineering',
      status: 'In Storage',
      condition: 'New',
      location: newAssetLocation,
      lifecycle: 100,
      serial: newAssetSerial || `SN-${Math.floor(100000 + Math.random() * 900000)}`,
      purchaseDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' }),
      warrantyEnds: 'Jul 12, 2029',
      value: '$1,500.00',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDNINNudG-NFbPlNeUDyCO2BZovgEtRV6o-9xyMMu1icxAdyn_hz-6HliOQWP-pFDhLv-MsJrl8ft0FxZrmjUAMjIKzrNi9ghmkTIiXrWkrQsh6nFsIlMFHzf-psUrhmvjSgZKJH4CQsonO3IpvxyCL4F2LOrY2gDCYYP3vFtvWJLUQgucwFBiod8O7x97qb-pJxK61vdxrLFglf-cMgPmKboMbK-GFlwYm58nN6xM8KaIBfmy6snlAiFQGvCU2uzPM0uE2YhT0DcsU'
    };

    setAssets([newAsset, ...assets]);
    setIsCreateOpen(false);
    setNewAssetName('');
    setNewAssetSerial('');
  };

  // Filter Logic
  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          asset.tag.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          asset.serial.toLowerCase().includes(searchQuery.toLowerCase());
                          
    const matchesCategory = selectedCategory === 'All Categories' || asset.category === selectedCategory;
    const matchesDept = selectedDept === 'All Departments' || asset.dept === selectedDept;
    const matchesStatus = selectedStatus === 'All Status' || asset.status === selectedStatus;
    const matchesLoc = selectedLoc === 'Global Locations' || asset.location.includes(selectedLoc) || (selectedLoc === 'Remote' && asset.location === 'Remote');

    return matchesSearch && matchesCategory && matchesDept && matchesStatus && matchesLoc;
  });

  const isAdminOrManager = userRole === 'Admin' || userRole === 'Asset Manager';

  return (
    <div className="p-8 pb-24 transition-colors duration-300">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h2 className="font-headline-md text-headline-md font-bold text-on-surface mb-1">Asset Inventory</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Manage and track {filteredAssets.length} enterprise assets across global networks.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="bg-surface-container-low p-1 rounded-lg border border-outline-variant/60 flex">
            <button className="p-2 bg-surface-container-highest text-primary rounded-md shadow-sm">
              <span className="material-symbols-outlined">grid_view</span>
            </button>
            <button className="p-2 text-on-surface-variant hover:text-on-surface rounded-md">
              <span className="material-symbols-outlined">list</span>
            </button>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-surface-container-low border border-outline-variant/60 rounded-lg text-label-md font-label-md hover:bg-surface-bright transition-all font-semibold active:scale-95 shadow-sm">
            <span className="material-symbols-outlined text-[18px]">file_download</span>
            Export
          </button>
        </div>
      </div>

      {/* Search & Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 group">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">
            search
          </span>
          <input 
            type="text" 
            placeholder="Search catalog by Tag, Name, or Serial..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface-container border border-outline-variant/60 rounded-lg pl-10 pr-4 py-2.5 text-body-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all duration-200"
          />
        </div>
        <button className="flex items-center justify-center gap-2 bg-surface-container-highest px-4 py-2.5 rounded-lg border border-outline-variant/60 hover:bg-surface-bright transition-all active:scale-95 text-sm font-semibold shrink-0">
          <span className="material-symbols-outlined text-[20px]">qr_code_scanner</span>
          QR Search
        </button>
        {isAdminOrManager && (
          <button 
            onClick={() => setIsCreateOpen(true)}
            className="bg-primary hover:brightness-110 text-on-primary px-6 py-2.5 rounded-lg font-label-md text-label-md font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/10 transition-all active:scale-95 shrink-0"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            Register Asset
          </button>
        )}
      </div>

      {/* Filters Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 bg-surface-container/30 p-4 rounded-xl border border-outline-variant/40">
        <div className="flex flex-col gap-1.5">
          <label className="font-label-sm text-label-sm text-on-surface-variant px-1 font-semibold">Category</label>
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-surface-container border border-outline-variant/60 rounded-lg px-3 py-2 text-body-sm focus:border-primary outline-none"
          >
            <option>All Categories</option>
            <option>Computing</option>
            <option>Furniture</option>
            <option>Networking</option>
            <option>Office Equipment</option>
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="font-label-sm text-label-sm text-on-surface-variant px-1 font-semibold">Department</label>
          <select 
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="bg-surface-container border border-outline-variant/60 rounded-lg px-3 py-2 text-body-sm focus:border-primary outline-none"
          >
            <option>All Departments</option>
            <option>Engineering</option>
            <option>HR & Admin</option>
            <option>Design</option>
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="font-label-sm text-label-sm text-on-surface-variant px-1 font-semibold">Status</label>
          <select 
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-surface-container border border-outline-variant/60 rounded-lg px-3 py-2 text-body-sm focus:border-primary outline-none"
          >
            <option>All Status</option>
            <option>Active</option>
            <option>In Storage</option>
            <option>Repairing</option>
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="font-label-sm text-label-sm text-on-surface-variant px-1 font-semibold">Location</label>
          <select 
            value={selectedLoc}
            onChange={(e) => setSelectedLoc(e.target.value)}
            className="bg-surface-container border border-outline-variant/60 rounded-lg px-3 py-2 text-body-sm focus:border-primary outline-none"
          >
            <option>Global Locations</option>
            <option>San Francisco</option>
            <option>London Hub</option>
            <option>Remote</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-surface-container rounded-xl border border-outline-variant/60 overflow-hidden shadow-md">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-high border-b border-outline-variant/60">
                <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-semibold">Asset Tag</th>
                <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-semibold">Asset Name</th>
                <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-semibold">Category</th>
                <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-semibold">Assigned To</th>
                <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-semibold">Status</th>
                <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-semibold">Condition</th>
                <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-semibold">Location</th>
                <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-semibold">Lifecycle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/40">
              {filteredAssets.length > 0 ? (
                filteredAssets.map((asset) => (
                  <tr 
                    key={asset.tag} 
                    onClick={() => handleRowClick(asset)}
                    className="hover:bg-surface-bright/40 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4 font-code text-primary font-bold text-sm tracking-wide">{asset.tag}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-surface-container-highest flex items-center justify-center border border-outline-variant/30 text-on-surface-variant">
                          <span className="material-symbols-outlined text-[18px]">{asset.icon}</span>
                        </div>
                        <span className="font-body-sm font-bold text-on-surface">{asset.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-body-sm text-on-surface-variant">{asset.category}</td>
                    <td className="px-6 py-4">
                      {asset.assignedTo ? (
                        <div className="flex items-center gap-2">
                          {asset.avatar ? (
                            <img className="w-6 h-6 rounded-full object-cover border border-outline-variant/40" src={asset.avatar} alt={asset.assignedTo} />
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-secondary-container text-on-secondary-container text-[10px] font-bold flex items-center justify-center">
                              {asset.assignedTo.split(' ').map(n=>n[0]).join('')}
                            </div>
                          )}
                          <span className="text-body-sm text-on-surface font-medium">{asset.assignedTo}</span>
                        </div>
                      ) : (
                        <span className="text-body-sm text-on-surface-variant/60 italic font-medium">Unassigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-[11px] font-bold rounded-full uppercase tracking-wider border ${
                        asset.status === 'Active' 
                          ? 'bg-primary/10 border-primary/20 text-primary' 
                          : asset.status === 'In Storage' 
                          ? 'bg-secondary-container/10 border-secondary-container/20 text-secondary' 
                          : 'bg-tertiary-container/10 border-tertiary-container/20 text-tertiary'
                      }`}>
                        {asset.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${
                          asset.condition === 'Excellent' || asset.condition === 'New' 
                            ? 'bg-primary' 
                            : asset.condition === 'Good' 
                            ? 'bg-secondary' 
                            : 'bg-tertiary'
                        }`}></span>
                        <span className="text-body-sm text-on-surface font-medium">{asset.condition}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-body-sm text-on-surface-variant font-medium">{asset.location}</td>
                    <td className="px-6 py-4">
                      <div className="w-full bg-surface-container-highest/60 h-1.5 rounded-full overflow-hidden max-w-[80px] border border-outline-variant/10">
                        <div 
                          className={`h-full rounded-full ${asset.lifecycle > 50 ? 'bg-primary' : 'bg-tertiary'}`} 
                          style={{ width: `${asset.lifecycle}%` }}
                        ></div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-on-surface-variant/60 font-semibold italic">
                    No assets found matching the filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 bg-surface-container border-t border-outline-variant/60 flex items-center justify-between">
          <p className="text-label-sm text-on-surface-variant font-medium">
            Showing <span className="font-bold text-on-surface">1 - {filteredAssets.length}</span> of {filteredAssets.length} items
          </p>
          <div className="flex gap-2">
            <button className="p-2 border border-outline-variant/60 rounded-lg hover:bg-surface-bright text-on-surface-variant disabled:opacity-30 disabled:cursor-not-allowed" disabled>
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button className="py-1 px-3 border border-primary/30 bg-primary/10 text-primary rounded-lg text-xs font-bold shadow-sm">
              1
            </button>
            <button className="p-2 border border-outline-variant/60 rounded-lg hover:bg-surface-bright text-on-surface-variant">
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* Asset Detail Drawer Overlay */}
      {isDrawerOpen && selectedAsset && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div 
            onClick={() => setIsDrawerOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
          ></div>
          
          {/* Sliding Panel */}
          <div className="relative w-full max-w-xl bg-surface-container-high border-l border-outline-variant h-screen shadow-2xl flex flex-col z-10 animate-slide-in-right">
            
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-outline-variant/60">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-2 hover:bg-surface-bright rounded-full text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
                <div>
                  <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">Asset Details</h3>
                  <p className="text-label-sm text-primary font-code uppercase tracking-wider font-semibold">{selectedAsset.tag}</p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button className="p-2 hover:bg-surface-bright rounded-lg text-on-surface-variant hover:text-on-surface"><span className="material-symbols-outlined">edit</span></button>
                <button className="p-2 hover:bg-surface-bright rounded-lg text-on-surface-variant hover:text-on-surface"><span className="material-symbols-outlined">more_vert</span></button>
              </div>
            </div>

            {/* Scrollable details */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
              
              {/* Asset Hero Image / Tag banner */}
              <div className="relative w-full h-48 rounded-xl overflow-hidden shadow-md">
                <img className="w-full h-full object-cover" src={selectedAsset.image} alt={selectedAsset.name} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end p-4">
                  <div>
                    <h4 className="text-white font-bold text-headline-sm leading-tight">{selectedAsset.name}</h4>
                    <p className="text-primary text-label-md font-medium mt-1">
                      {selectedAsset.assignedTo ? `Assigned to ${selectedAsset.assignedTo}` : 'Unassigned (In Storage)'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Tab Navigation */}
              <div className="flex border-b border-outline-variant/60">
                {['Overview', 'Timeline', 'Maintenance'].map((t) => (
                  <button 
                    key={t}
                    onClick={() => setDrawerTab(t)}
                    className={`px-5 py-2.5 font-label-md text-label-md border-b-2 font-semibold transition-all ${
                      drawerTab === t 
                        ? 'text-primary border-primary' 
                        : 'text-on-surface-variant hover:text-on-surface border-transparent'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {/* Tab Panels */}
              {drawerTab === 'Overview' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="grid grid-cols-2 gap-6 bg-surface-container rounded-xl p-6 border border-outline-variant/30">
                    <div>
                      <p className="text-xs text-on-surface-variant uppercase tracking-wider mb-1 font-semibold">Serial Number</p>
                      <p className="font-code text-on-surface font-bold">{selectedAsset.serial}</p>
                    </div>
                    <div>
                      <p className="text-xs text-on-surface-variant uppercase tracking-wider mb-1 font-semibold">Purchase Date</p>
                      <p className="font-body-md text-on-surface font-semibold">{selectedAsset.purchaseDate}</p>
                    </div>
                    <div>
                      <p className="text-xs text-on-surface-variant uppercase tracking-wider mb-1 font-semibold">Warranty Ends</p>
                      <p className="font-body-md text-on-surface font-semibold">{selectedAsset.warrantyEnds}</p>
                    </div>
                    <div>
                      <p className="text-xs text-on-surface-variant uppercase tracking-wider mb-1 font-semibold">Value (USD)</p>
                      <p className="font-body-md text-on-surface font-semibold">{selectedAsset.value}</p>
                    </div>
                  </div>

                  <div className="p-4 bg-surface-container rounded-xl border border-outline-variant/30">
                    <h5 className="font-label-md text-label-md font-bold text-on-surface mb-2">Category Taxonomy</h5>
                    <div className="flex flex-wrap gap-2">
                      <span className="text-[11px] px-2.5 py-1 rounded bg-primary/10 text-primary border border-primary/20 font-bold">{selectedAsset.category}</span>
                      <span className="text-[11px] px-2.5 py-1 rounded bg-secondary-container/10 text-secondary border border-secondary/20 font-bold">Location: {selectedAsset.location}</span>
                    </div>
                  </div>
                </div>
              )}

              {drawerTab === 'Timeline' && (
                <div className="space-y-4 animate-fade-in relative before:absolute before:left-[11px] before:top-2 before:bottom-0 before:w-0.5 before:bg-outline-variant/60 pl-2">
                  <div className="flex gap-4 relative pl-4">
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center z-10 shrink-0 border border-surface shadow-sm">
                      <span className="material-symbols-outlined text-[14px] text-on-primary font-bold">check</span>
                    </div>
                    <div>
                      <p className="font-label-md text-label-md font-bold text-on-surface">Physical Audit Completed</p>
                      <p className="text-xs text-on-surface-variant">Audit by Sarah Miller • 2 days ago</p>
                    </div>
                  </div>

                  <div className="flex gap-4 relative pl-4">
                    <div className="w-6 h-6 rounded-full bg-surface border-2 border-outline-variant/60 flex items-center justify-center z-10 shrink-0 shadow-sm"></div>
                    <div>
                      <p className="font-label-md text-label-md font-bold text-on-surface">Software Update Pushed</p>
                      <p className="text-xs text-on-surface-variant">macOS Sonoma 14.4 • Mar 15, 2024</p>
                    </div>
                  </div>

                  <div className="flex gap-4 relative pl-4">
                    <div className="w-6 h-6 rounded-full bg-surface border-2 border-outline-variant/60 flex items-center justify-center z-10 shrink-0 shadow-sm"></div>
                    <div>
                      <p className="font-label-md text-label-md font-bold text-on-surface">Asset Allocated</p>
                      <p className="text-xs text-on-surface-variant">Allocation Request #882 • Jan 15, 2024</p>
                    </div>
                  </div>
                </div>
              )}

              {drawerTab === 'Maintenance' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="p-4 bg-surface-container rounded-xl border border-outline-variant/30 flex items-start gap-4">
                    <div className="p-2.5 bg-error/10 border border-error/20 rounded-xl text-error">
                      <span className="material-symbols-outlined">build</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <p className="font-label-md text-label-md font-bold text-on-surface">Hardware Diagnostic Check</p>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 font-bold uppercase">Completed</span>
                      </div>
                      <p className="text-xs text-on-surface-variant mt-1">Preventative battery diagnostic check. Passed diagnostic scans.</p>
                      <p className="text-[10px] text-on-surface-variant/60 mt-3 font-semibold uppercase">Feb 20, 2024 • External Provider</p>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Footer */}
            <div className="p-6 border-t border-outline-variant bg-surface-container-high/90 backdrop-blur-md flex gap-3">
              {isAdminOrManager && (
                <button className="flex-1 py-3 bg-primary text-on-primary font-bold rounded-xl hover:brightness-110 active:scale-95 transition-all shadow-md">
                  Allocate Asset
                </button>
              )}
              <button className="flex-1 py-3 border border-outline-variant hover:border-primary rounded-xl font-bold hover:bg-surface-bright transition-all active:scale-95">
                Print QR Tag
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Asset Creation Drawer Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsCreateOpen(false)}></div>
          <form 
            onSubmit={handleRegisterAsset}
            className="bg-surface-container-high w-full max-w-md rounded-2xl border border-outline-variant/60 p-6 z-10 shadow-2xl relative animate-fade-in"
          >
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-4">Register New Asset</h3>
            <div className="space-y-4 mb-6">
              <div>
                <label className="text-xs text-on-surface-variant font-bold uppercase tracking-wider mb-1 block">Asset Name</label>
                <input 
                  type="text" 
                  value={newAssetName}
                  onChange={(e) => setNewAssetName(e.target.value)}
                  placeholder="e.g. ThinkPad P1 Gen 5"
                  required
                  className="w-full bg-surface border border-outline-variant/60 rounded-xl px-4 py-2.5 text-sm focus:border-primary outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-on-surface-variant font-bold uppercase tracking-wider mb-1 block">Category</label>
                <select 
                  value={newAssetCategory}
                  onChange={(e) => setNewAssetCategory(e.target.value)}
                  className="w-full bg-surface border border-outline-variant/60 rounded-xl px-4 py-2.5 text-sm focus:border-primary outline-none"
                >
                  <option>Computing</option>
                  <option>Furniture</option>
                  <option>Networking</option>
                  <option>Office Equipment</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-on-surface-variant font-bold uppercase tracking-wider mb-1 block">Location</label>
                <select 
                  value={newAssetLocation}
                  onChange={(e) => setNewAssetLocation(e.target.value)}
                  className="w-full bg-surface border border-outline-variant/60 rounded-xl px-4 py-2.5 text-sm focus:border-primary outline-none"
                >
                  <option>San Francisco</option>
                  <option>London Hub</option>
                  <option>Remote</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-on-surface-variant font-bold uppercase tracking-wider mb-1 block">Serial Number</label>
                <input 
                  type="text" 
                  value={newAssetSerial}
                  onChange={(e) => setNewAssetSerial(e.target.value)}
                  placeholder="e.g. SN-8829-1029"
                  className="w-full bg-surface border border-outline-variant/60 rounded-xl px-4 py-2.5 text-sm focus:border-primary outline-none"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button 
                type="submit" 
                className="flex-1 py-3 bg-primary text-on-primary font-bold rounded-xl hover:brightness-110 transition-all shadow-md active:scale-95"
              >
                Register
              </button>
              <button 
                type="button" 
                onClick={() => setIsCreateOpen(false)}
                className="flex-1 py-3 border border-outline-variant rounded-xl font-bold hover:bg-surface-bright transition-all active:scale-95"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}

export default AssetsManagement;
