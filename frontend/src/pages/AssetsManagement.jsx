import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';

function AssetsManagement() {
  const { 
    userRole, 
    assets, 
    categories, 
    departments, 
    registerAsset, 
    updateAsset, 
    tickets 
  } = useContext(AppContext);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [selectedLoc, setSelectedLoc] = useState('Global Locations');
  
  // Drawer states
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerTab, setDrawerTab] = useState('Overview'); // Overview, Timeline, Maintenance

  // Asset Creation Modal states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newAssetName, setNewAssetName] = useState('');
  const [newAssetCategory, setNewAssetCategory] = useState('');
  const [newAssetLocation, setNewAssetLocation] = useState('San Francisco');
  const [newAssetSerial, setNewAssetSerial] = useState('');
  const [newAssetCost, setNewAssetCost] = useState('');
  const [newAssetDate, setNewAssetDate] = useState(new Date().toISOString().split('T')[0]);
  const [newAssetCondition, setNewAssetCondition] = useState('New');
  const [newAssetPhoto, setNewAssetPhoto] = useState('');
  const [newAssetShared, setNewAssetShared] = useState(false);
  const [newAssetCategoryFields, setNewAssetCategoryFields] = useState({});

  // QR Simulator States
  const [isQrScanning, setIsQrScanning] = useState(false);
  const [qrResultMsg, setQrResultMsg] = useState('');

  const handleRowClick = (asset) => {
    setSelectedAsset(asset);
    setIsDrawerOpen(true);
    setDrawerTab('Overview');
  };

  const handleCategorySelectChange = (catName) => {
    setNewAssetCategory(catName);
    // Initialize custom field values for selected category
    const cat = categories.find(c => c.name === catName);
    const initialFields = {};
    if (cat && cat.attributes) {
      cat.attributes.forEach(attr => {
        initialFields[attr] = '';
      });
    }
    setNewAssetCategoryFields(initialFields);
  };

  const handleCategoryFieldChange = (field, value) => {
    setNewAssetCategoryFields(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    const photoUrl = newAssetPhoto.trim() || 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=300&h=200&q=80';
    
    registerAsset({
      name: newAssetName,
      category: newAssetCategory || categories[0]?.name || 'Electronics',
      serialNumber: newAssetSerial || `SN-${Math.floor(100000 + Math.random() * 900000)}`,
      acquisitionDate: newAssetDate,
      acquisitionCost: parseFloat(newAssetCost) || 0.0,
      condition: newAssetCondition,
      location: newAssetLocation,
      photo: photoUrl,
      shared: newAssetShared,
      categoryFields: newAssetCategoryFields
    });

    setIsCreateOpen(false);
    resetRegisterForm();
  };

  const resetRegisterForm = () => {
    setNewAssetName('');
    setNewAssetCategory('');
    setNewAssetLocation('San Francisco');
    setNewAssetSerial('');
    setNewAssetCost('');
    setNewAssetDate(new Date().toISOString().split('T')[0]);
    setNewAssetCondition('New');
    setNewAssetPhoto('');
    setNewAssetShared(false);
    setNewAssetCategoryFields({});
  };

  // QR scanner simulator
  const startQrScan = () => {
    setIsQrScanning(true);
    setQrResultMsg('Scanning QR codes on hardware tag label...');
    setTimeout(() => {
      // Find a random asset or match first
      if (assets.length > 0) {
        const randomAsset = assets[Math.floor(Math.random() * assets.length)];
        setQrResultMsg(`QR Match Found! Tag: ${randomAsset.tag} (${randomAsset.name})`);
        setTimeout(() => {
          setIsQrScanning(false);
          setSearchQuery(randomAsset.tag);
        }, 1500);
      } else {
        setQrResultMsg('No assets registered to scan.');
        setTimeout(() => setIsQrScanning(false), 1500);
      }
    }, 2000);
  };

  // Filter Logic
  const filteredAssets = assets.filter(asset => {
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = asset.name.toLowerCase().includes(query) || 
                          asset.tag.toLowerCase().includes(query) || 
                          asset.serialNumber.toLowerCase().includes(query);
                          
    const matchesCategory = selectedCategory === 'All Categories' || asset.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All Status' || asset.status === selectedStatus;
    const matchesLoc = selectedLoc === 'Global Locations' || asset.location.includes(selectedLoc);

    return matchesSearch && matchesCategory && matchesStatus && matchesLoc;
  });

  const isAdminOrManager = userRole === 'Admin' || userRole === 'Asset Manager';

  // Get active asset categories from context
  const uniqueCategories = categories.map(c => c.name);

  // Get unique locations
  const locationsList = ['San Francisco', 'London Hub', 'Remote', 'HQ - Floor 4'];

  return (
    <div className="p-8 pb-24 transition-colors duration-300">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h2 className="font-headline-md text-headline-md font-bold text-on-surface mb-1">Asset Directory</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Manage and track {filteredAssets.length} enterprise assets across global operations.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              const csvContent = "data:text/csv;charset=utf-8," 
                + ["Tag,Name,Category,Serial,Status,Condition,Location,Cost"].join(",") + "\n"
                + assets.map(a => `"${a.tag}","${a.name}","${a.category}","${a.serialNumber}","${a.status}","${a.condition}","${a.location}",${a.acquisitionCost}`).join("\n");
              const encodedUri = encodeURI(csvContent);
              const link = document.createElement("a");
              link.setAttribute("href", encodedUri);
              link.setAttribute("download", "AssetFlow_Inventory.csv");
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-surface-container-low border border-outline-variant/60 rounded-lg text-label-md font-label-md hover:bg-surface-bright transition-all font-semibold active:scale-95 shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">file_download</span>
            Export CSV
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
        <button 
          onClick={startQrScan}
          className="flex items-center justify-center gap-2 bg-surface-container-highest px-4 py-2.5 rounded-lg border border-outline-variant/60 hover:bg-surface-bright transition-all active:scale-95 text-sm font-semibold shrink-0"
        >
          <span className="material-symbols-outlined text-[20px]">qr_code_scanner</span>
          QR Tag Simulator
        </button>
        {isAdminOrManager && (
          <button 
            onClick={() => {
              resetRegisterForm();
              if (categories.length > 0) {
                handleCategorySelectChange(categories[0].name);
              }
              setIsCreateOpen(true);
            }}
            className="bg-primary hover:brightness-110 text-on-primary px-6 py-2.5 rounded-lg font-label-md text-label-md font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/10 transition-all active:scale-95 shrink-0"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            Register Asset
          </button>
        )}
      </div>

      {/* Filters Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 bg-surface-container/30 p-4 rounded-xl border border-outline-variant/40">
        <div className="flex flex-col gap-1.5">
          <label className="font-label-sm text-label-sm text-on-surface-variant px-1 font-semibold">Category</label>
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-surface-container border border-outline-variant/60 rounded-lg px-3 py-2 text-body-sm focus:border-primary outline-none font-semibold text-on-surface"
          >
            <option>All Categories</option>
            {uniqueCategories.map((c, i) => (
              <option key={i} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="font-label-sm text-label-sm text-on-surface-variant px-1 font-semibold">Status</label>
          <select 
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-surface-container border border-outline-variant/60 rounded-lg px-3 py-2 text-body-sm focus:border-primary outline-none font-semibold text-on-surface"
          >
            <option>All Status</option>
            <option value="Available">Available</option>
            <option value="Allocated">Allocated</option>
            <option value="Reserved">Reserved</option>
            <option value="Under Maintenance">Under Maintenance</option>
            <option value="Lost">Lost</option>
            <option value="Retired">Retired</option>
            <option value="Disposed">Disposed</option>
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="font-label-sm text-label-sm text-on-surface-variant px-1 font-semibold">Location</label>
          <select 
            value={selectedLoc}
            onChange={(e) => setSelectedLoc(e.target.value)}
            className="bg-surface-container border border-outline-variant/60 rounded-lg px-3 py-2 text-body-sm focus:border-primary outline-none font-semibold text-on-surface"
          >
            <option>Global Locations</option>
            {locationsList.map((loc, i) => (
              <option key={i} value={loc}>{loc}</option>
            ))}
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
                <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-semibold">Bookable</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/40 font-semibold">
              {filteredAssets.length > 0 ? (
                filteredAssets.map((asset) => (
                  <tr 
                    key={asset.id} 
                    onClick={() => handleRowClick(asset)}
                    className="hover:bg-surface-bright/40 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4 font-code text-primary font-bold text-sm tracking-wide">{asset.tag}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-surface-container-highest flex items-center justify-center border border-outline-variant/30 text-on-surface-variant">
                          <span className="material-symbols-outlined text-[18px]">
                            {asset.category === 'Networking' ? 'router' : asset.category === 'Furniture' ? 'chair' : 'laptop_mac'}
                          </span>
                        </div>
                        <span className="font-body-sm font-bold text-on-surface">{asset.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-body-sm text-on-surface-variant">{asset.category}</td>
                    <td className="px-6 py-4">
                      {asset.assignedTo ? (
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-secondary-container text-on-secondary-container text-[10px] font-bold flex items-center justify-center">
                            {asset.assignedTo.split(' ').map(n=>n[0]).join('')}
                          </div>
                          <span className="text-body-sm text-on-surface font-medium">{asset.assignedTo}</span>
                        </div>
                      ) : (
                        <span className="text-body-sm text-on-surface-variant/60 italic font-medium">Unassigned (In Storage)</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-[11px] font-bold rounded-full uppercase tracking-wider border ${
                        asset.status === 'Available' ? 'bg-primary/10 border-primary/20 text-primary' :
                        asset.status === 'Allocated' ? 'bg-secondary-container/20 border-secondary-container/20 text-secondary' :
                        asset.status === 'Under Maintenance' ? 'bg-tertiary-container/20 border-tertiary-container/20 text-tertiary' :
                        'bg-error/15 border-error/30 text-error'
                      }`}>
                        {asset.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${
                          asset.condition === 'Excellent' || asset.condition === 'New' ? 'bg-primary' :
                          asset.condition === 'Good' ? 'bg-secondary' : 'bg-tertiary'
                        }`}></span>
                        <span className="text-body-sm text-on-surface font-medium">{asset.condition}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-body-sm text-on-surface-variant font-medium">{asset.location}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] border font-bold uppercase tracking-wider ${
                        asset.shared ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-outline-variant/20 border-outline-variant text-on-surface-variant'
                      }`}>
                        {asset.shared ? 'Shared' : 'Private'}
                      </span>
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
      </div>

      {/* Asset Detail Drawer Overlay */}
      {isDrawerOpen && selectedAsset && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div onClick={() => setIsDrawerOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"></div>
          <div className="relative w-full max-w-xl bg-surface-container-high border-l border-outline-variant h-screen shadow-2xl flex flex-col z-10 animate-slide-in-right">
            
            <div className="flex items-center justify-between p-6 border-b border-outline-variant/60 bg-surface-container-high">
              <div className="flex items-center gap-4">
                <button onClick={() => setIsDrawerOpen(false)} className="p-2 hover:bg-surface-bright rounded-full text-on-surface-variant hover:text-on-surface">
                  <span className="material-symbols-outlined">close</span>
                </button>
                <div>
                  <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">Asset Details</h3>
                  <p className="text-label-sm text-primary font-code uppercase tracking-wider font-semibold">{selectedAsset.tag}</p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
              
              {/* Asset Hero Image */}
              <div className="relative w-full h-48 rounded-xl overflow-hidden shadow-md">
                <img className="w-full h-full object-cover" src={selectedAsset.photo} alt={selectedAsset.name} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex items-end p-4">
                  <div>
                    <h4 className="text-white font-bold text-headline-sm leading-tight">{selectedAsset.name}</h4>
                    <p className="text-primary text-label-md font-semibold mt-1">
                      {selectedAsset.assignedTo ? `Currently held by ${selectedAsset.assignedTo}` : 'In Storage (Available)'}
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
                      drawerTab === t ? 'text-primary border-primary' : 'text-on-surface-variant hover:text-on-surface border-transparent'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {/* Tab Panels */}
              {drawerTab === 'Overview' && (
                <div className="space-y-6 animate-fade-in font-semibold">
                  <div className="grid grid-cols-2 gap-6 bg-surface-container rounded-xl p-6 border border-outline-variant/30">
                    <div>
                      <p className="text-[10px] text-on-surface-variant uppercase tracking-wider mb-1">Serial Number</p>
                      <p className="font-code text-on-surface font-bold">{selectedAsset.serialNumber}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-on-surface-variant uppercase tracking-wider mb-1">Category</p>
                      <p className="text-on-surface">{selectedAsset.category}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-on-surface-variant uppercase tracking-wider mb-1">Acquisition Date</p>
                      <p className="text-on-surface">{selectedAsset.acquisitionDate}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-on-surface-variant uppercase tracking-wider mb-1">Acquisition Value</p>
                      <p className="text-on-surface font-bold text-primary">${selectedAsset.acquisitionCost?.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-on-surface-variant uppercase tracking-wider mb-1">Physical Condition</p>
                      <p className="text-on-surface">{selectedAsset.condition}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-on-surface-variant uppercase tracking-wider mb-1">Current Location</p>
                      <p className="text-on-surface">{selectedAsset.location}</p>
                    </div>
                  </div>

                  {/* Category specific attributes */}
                  {selectedAsset.categoryFields && Object.keys(selectedAsset.categoryFields).length > 0 && (
                    <div className="bg-surface-container/60 border border-outline-variant/30 rounded-xl p-6 space-y-4">
                      <h4 className="text-xs uppercase font-bold tracking-wider text-on-surface-variant border-b border-outline-variant/40 pb-2">Category-Specific Attributes</h4>
                      <div className="grid grid-cols-2 gap-4">
                        {Object.entries(selectedAsset.categoryFields).map(([key, val]) => (
                          <div key={key}>
                            <p className="text-[10px] text-on-surface-variant uppercase mb-0.5">{key}</p>
                            <p className="text-xs text-on-surface font-bold">{val || '—'}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {drawerTab === 'Timeline' && (
                <div className="space-y-6 animate-fade-in pl-4 relative before:content-[''] before:absolute before:left-6 before:top-2 before:bottom-2 before:w-[1px] before:bg-outline-variant/40 font-semibold">
                  {selectedAsset.history?.map((hist, idx) => (
                    <div key={idx} className="relative pl-8">
                      <div className="absolute left-1.5 top-1.5 w-3 h-3 rounded-full bg-primary ring-4 ring-surface-container-high"></div>
                      <p className="text-xs font-bold text-on-surface">{hist.action}</p>
                      <p className="text-[11px] text-on-surface-variant mt-0.5">{hist.notes}</p>
                      <div className="flex gap-4 mt-2 text-[10px] text-primary/75">
                        <span>User: {hist.user}</span>
                        <span>Date: {hist.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {drawerTab === 'Maintenance' && (
                <div className="space-y-4 animate-fade-in font-semibold">
                  {tickets.filter(t => t.assetName === selectedAsset.name).length === 0 ? (
                    <p className="text-xs text-on-surface-variant italic p-4 text-center">No maintenance incidents reported for this asset.</p>
                  ) : (
                    tickets.filter(t => t.assetName === selectedAsset.name).map((ticket, index) => (
                      <div key={index} className="bg-surface-container border border-outline-variant/50 p-4 rounded-xl space-y-2">
                        <div className="flex justify-between items-center">
                          <p className="text-xs font-bold text-on-surface">{ticket.title}</p>
                          <span className={`text-[9px] uppercase px-2 py-0.5 rounded font-bold border ${
                            ticket.status === 'Resolved' ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-tertiary-container/10 border-tertiary-container text-tertiary'
                          }`}>{ticket.status}</span>
                        </div>
                        <p className="text-[11px] text-on-surface-variant">{ticket.desc}</p>
                        <p className="text-[10px] text-primary/80">Reported: {ticket.date} • Assignee: {ticket.assignee}</p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* QR Scanning Simulator Modal */}
      {isQrScanning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm"></div>
          <div className="bg-surface-container-high border border-outline-variant rounded-2xl w-full max-w-[360px] p-8 text-center relative z-10 animate-fade-in">
            <div className="w-48 h-48 border-2 border-primary/60 rounded-xl mx-auto mb-6 flex items-center justify-center relative overflow-hidden bg-surface-container-lowest">
              <span className="material-symbols-outlined text-6xl text-primary animate-pulse">qr_code</span>
              {/* Scanline animation */}
              <div className="absolute left-0 right-0 h-0.5 bg-primary/80 animate-scanline"></div>
            </div>
            <h4 className="font-bold text-on-surface mb-2">Simulating QR Scanner</h4>
            <p className="text-xs text-on-surface-variant font-semibold animate-pulse">{qrResultMsg}</p>
          </div>
        </div>
      )}

      {/* Asset Creation Modal Drawer */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div onClick={() => setIsCreateOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"></div>
          <div className="relative w-full max-w-md bg-surface-container-low border-l border-outline-variant h-screen shadow-2xl z-10 flex flex-col animate-slide-in-right">
            
            <div className="p-6 border-b border-outline-variant/60 flex justify-between items-center bg-surface-container-high">
              <div>
                <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">Register Asset</h3>
                <p className="text-xs text-on-surface-variant font-medium">Add new hardware inventory tag definitions.</p>
              </div>
              <button onClick={() => setIsCreateOpen(false)} className="p-2 hover:bg-surface-bright rounded-full text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleRegisterSubmit} className="flex-1 flex flex-col h-full overflow-hidden">
              <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar font-semibold">
                
                {/* Asset Name */}
                <div>
                  <label className="text-xs text-on-surface-variant font-bold uppercase tracking-wider mb-1.5 block">Asset Name</label>
                  <input 
                    type="text" 
                    value={newAssetName}
                    onChange={(e) => setNewAssetName(e.target.value)}
                    placeholder="e.g. Dell XPS Workstation 8960"
                    required
                    className="w-full bg-surface border border-outline-variant/60 rounded-xl px-4 py-2.5 text-sm focus:border-primary outline-none"
                  />
                </div>

                {/* Category Selection */}
                <div>
                  <label className="text-xs text-on-surface-variant font-bold uppercase tracking-wider mb-1.5 block">Category</label>
                  <select 
                    value={newAssetCategory}
                    onChange={(e) => handleCategorySelectChange(e.target.value)}
                    required
                    className="w-full bg-surface border border-outline-variant/60 rounded-xl px-4 py-2.5 text-sm focus:border-primary outline-none text-on-surface font-semibold"
                  >
                    <option value="">Select Category...</option>
                    {categories.map((c, i) => (
                      <option key={i} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                {/* Serial Number */}
                <div>
                  <label className="text-xs text-on-surface-variant font-bold uppercase tracking-wider mb-1.5 block">Serial Number</label>
                  <input 
                    type="text" 
                    value={newAssetSerial}
                    onChange={(e) => setNewAssetSerial(e.target.value)}
                    placeholder="e.g. SN-9012-AX77"
                    required
                    className="w-full bg-surface border border-outline-variant/60 rounded-xl px-4 py-2.5 text-sm focus:border-primary outline-none font-code font-bold"
                  />
                </div>

                {/* Acquisition Date & Cost */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-on-surface-variant font-bold uppercase tracking-wider mb-1.5 block">Acquisition Date</label>
                    <input 
                      type="date" 
                      value={newAssetDate}
                      onChange={(e) => setNewAssetDate(e.target.value)}
                      required
                      className="w-full bg-surface border border-outline-variant/60 rounded-xl px-4 py-2.5 text-sm focus:border-primary outline-none text-on-surface"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-on-surface-variant font-bold uppercase tracking-wider mb-1.5 block">Acquisition Cost ($)</label>
                    <input 
                      type="number" 
                      step="0.01"
                      value={newAssetCost}
                      onChange={(e) => setNewAssetCost(e.target.value)}
                      placeholder="e.g. 1499.00"
                      required
                      className="w-full bg-surface border border-outline-variant/60 rounded-xl px-4 py-2.5 text-sm focus:border-primary outline-none"
                    />
                  </div>
                </div>

                {/* Condition & Location */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-on-surface-variant font-bold uppercase tracking-wider mb-1.5 block">Initial Condition</label>
                    <select 
                      value={newAssetCondition}
                      onChange={(e) => setNewAssetCondition(e.target.value)}
                      className="w-full bg-surface border border-outline-variant/60 rounded-xl px-4 py-2.5 text-sm focus:border-primary outline-none text-on-surface"
                    >
                      <option value="New">New</option>
                      <option value="Excellent">Excellent</option>
                      <option value="Good">Good</option>
                      <option value="Fair">Fair</option>
                      <option value="Poor">Poor</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-on-surface-variant font-bold uppercase tracking-wider mb-1.5 block">Location</label>
                    <select 
                      value={newAssetLocation}
                      onChange={(e) => setNewAssetLocation(e.target.value)}
                      className="w-full bg-surface border border-outline-variant/60 rounded-xl px-4 py-2.5 text-sm focus:border-primary outline-none text-on-surface"
                    >
                      {locationsList.map((loc, i) => (
                        <option key={i} value={loc}>{loc}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Photo / Document URL */}
                <div>
                  <label className="text-xs text-on-surface-variant font-bold uppercase tracking-wider mb-1.5 block">Photo URL (Optional)</label>
                  <input 
                    type="url" 
                    value={newAssetPhoto}
                    onChange={(e) => setNewAssetPhoto(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-surface border border-outline-variant/60 rounded-xl px-4 py-2.5 text-sm focus:border-primary outline-none text-xs"
                  />
                </div>

                {/* Bookable Flag */}
                <div className="flex items-center gap-3 bg-surface-container p-4 rounded-xl border border-outline-variant/40">
                  <input 
                    type="checkbox" 
                    id="sharedBookable"
                    checked={newAssetShared}
                    onChange={(e) => setNewAssetShared(e.target.checked)}
                    className="w-5 h-5 cursor-pointer accent-primary"
                  />
                  <div>
                    <label htmlFor="sharedBookable" className="text-xs font-bold text-on-surface cursor-pointer select-none">Mark as Shared / Bookable</label>
                    <p className="text-[10px] text-on-surface-variant font-medium">Shared assets can be booked by employees via the Resource Booking calendar.</p>
                  </div>
                </div>

                {/* Dynamic Category fields */}
                {newAssetCategory && Object.keys(newAssetCategoryFields).length > 0 && (
                  <div className="p-4 bg-surface-container/60 border border-outline-variant/40 rounded-xl space-y-4">
                    <h4 className="text-xs uppercase font-bold tracking-wider text-primary border-b border-primary/20 pb-2">Category-Specific Fields</h4>
                    {Object.keys(newAssetCategoryFields).map((field, idx) => (
                      <div key={idx}>
                        <label className="text-[10px] text-on-surface-variant font-bold block mb-1">{field}</label>
                        <input 
                          type="text" 
                          value={newAssetCategoryFields[field]}
                          onChange={(e) => handleCategoryFieldChange(field, e.target.value)}
                          placeholder={`Enter ${field.toLowerCase()}...`}
                          required
                          className="w-full bg-surface border border-outline-variant/60 rounded-lg px-3 py-2 text-xs focus:border-primary outline-none text-on-surface"
                        />
                      </div>
                    ))}
                  </div>
                )}

              </div>

              <div className="p-6 border-t border-outline-variant/60 bg-surface-container-high flex gap-3 flex-shrink-0">
                <button 
                  type="submit" 
                  className="flex-1 py-3 bg-primary text-on-primary font-bold rounded-xl hover:brightness-110 active:scale-95 transition-all shadow-md"
                >
                  Register Asset
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

export default AssetsManagement;
