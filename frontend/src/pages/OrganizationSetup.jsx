import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';

function OrganizationSetup() {
  const { 
    userRole, 
    departments, 
    categories, 
    employees, 
    createDepartment, 
    updateDepartment, 
    createCategory, 
    promoteEmployee, 
    updateEmployeeStatus 
  } = useContext(AppContext);

  const [activeTab, setActiveTab] = useState('departments'); // departments, categories, employees
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [entryType, setEntryType] = useState('Department'); // Department, Category, Employee
  const [editingDept, setEditingDept] = useState(null);

  // Department Form States
  const [deptName, setDeptName] = useState('');
  const [deptHead, setDeptHead] = useState('');
  const [deptParent, setDeptParent] = useState('Root Organization');
  const [deptStatus, setDeptStatus] = useState('Active');
  const [deptDesc, setDeptDesc] = useState('');

  // Category Form States
  const [newCatName, setNewCatName] = useState('');
  const [customAttrs, setCustomAttrs] = useState(['']); // array of attribute field names

  // Search filter states
  const [deptSearch, setDeptSearch] = useState('');
  const [empSearch, setEmpSearch] = useState('');
  const [empDeptFilter, setEmpDeptFilter] = useState('All Departments');

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (entryType === 'Department') {
      if (editingDept) {
        updateDepartment(editingDept.name, {
          name: deptName,
          head: deptHead || 'Unassigned',
          parent: deptParent === 'Root Organization' ? '—' : deptParent,
          status: deptStatus,
          description: deptDesc
        });
      } else {
        createDepartment({
          name: deptName,
          head: deptHead || 'Unassigned',
          parent: deptParent === 'Root Organization' ? '—' : deptParent,
          status: deptStatus,
          description: deptDesc
        });
      }
      setIsDrawerOpen(false);
      resetDeptForm();
    } else if (entryType === 'Category') {
      const attributes = customAttrs.filter(a => a.trim() !== '');
      const success = createCategory(newCatName, attributes);
      if (success) {
        setIsDrawerOpen(false);
        setNewCatName('');
        setCustomAttrs(['']);
      } else {
        alert('Category name already exists!');
      }
    }
  };

  const resetDeptForm = () => {
    setEditingDept(null);
    setDeptName('');
    setDeptHead('');
    setDeptParent('Root Organization');
    setDeptStatus('Active');
    setDeptDesc('');
  };

  const handleEditDeptClick = (dept) => {
    setEditingDept(dept);
    setEntryType('Department');
    setDeptName(dept.name);
    setDeptHead(dept.head);
    setDeptParent(dept.parent === '—' ? 'Root Organization' : dept.parent);
    setDeptStatus(dept.status);
    setDeptDesc(dept.description || '');
    setIsDrawerOpen(true);
  };

  const handleDeactivateDept = (deptName) => {
    updateDepartment(deptName, { status: 'Inactive' });
  };

  const handleActivateDept = (deptName) => {
    updateDepartment(deptName, { status: 'Active' });
  };

  const handleAddAttr = () => {
    setCustomAttrs([...customAttrs, '']);
  };

  const handleAttrChange = (index, value) => {
    const updated = [...customAttrs];
    updated[index] = value;
    setCustomAttrs(updated);
  };

  const handleRemoveAttr = (index) => {
    const updated = customAttrs.filter((_, i) => i !== index);
    setCustomAttrs(updated.length > 0 ? updated : ['']);
  };

  // Filters
  const filteredDepts = departments.filter(d => 
    d.name.toLowerCase().includes(deptSearch.toLowerCase()) || 
    d.head.toLowerCase().includes(deptSearch.toLowerCase())
  );

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(empSearch.toLowerCase()) || 
                          emp.email.toLowerCase().includes(empSearch.toLowerCase());
    const matchesDept = empDeptFilter === 'All Departments' || emp.dept === empDeptFilter;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="p-margin-page max-w-container-max mx-auto space-y-gutter pb-24 transition-colors duration-300">
      
      {/* Page Header */}
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="font-headline-md text-headline-md font-bold text-on-surface mb-1">Organization Setup</h2>
          <p className="text-on-surface-variant font-body-sm">Manage your enterprise structure, asset categories, and employee directories.</p>
        </div>
        <button 
          onClick={() => {
            resetDeptForm();
            setEntryType('Department');
            setIsDrawerOpen(true);
          }}
          className="bg-primary text-on-primary font-label-md text-label-md px-5 py-2.5 rounded-xl flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all shadow-md font-bold"
        >
          <span className="material-symbols-outlined text-xl">add</span>
          Create New
        </button>
      </div>

      {/* Tabs Navigation */}
      <div className="flex gap-8 border-b border-outline-variant/60 mb-6">
        <button 
          onClick={() => setActiveTab('departments')}
          className={`pb-4 px-2 font-label-md text-label-md font-semibold transition-all border-b-2 ${
            activeTab === 'departments' 
              ? 'text-primary border-primary' 
              : 'text-on-surface-variant hover:text-on-surface border-transparent'
          }`}
        >
          Departments
        </button>
        <button 
          onClick={() => setActiveTab('categories')}
          className={`pb-4 px-2 font-label-md text-label-md font-semibold transition-all border-b-2 ${
            activeTab === 'categories' 
              ? 'text-primary border-primary' 
              : 'text-on-surface-variant hover:text-on-surface border-transparent'
          }`}
        >
          Asset Categories
        </button>
        <button 
          onClick={() => setActiveTab('employees')}
          className={`pb-4 px-2 font-label-md text-label-md font-semibold transition-all border-b-2 ${
            activeTab === 'employees' 
              ? 'text-primary border-primary' 
              : 'text-on-surface-variant hover:text-on-surface border-transparent'
          }`}
        >
          Employee Directory
        </button>
      </div>

      {/* Tab Panels */}
      
      {/* 1. Departments Panel */}
      {activeTab === 'departments' && (
        <div className="tab-pane bg-surface-container border border-outline-variant/60 rounded-xl overflow-hidden shadow-sm animate-fade-in">
          <div className="p-4 border-b border-outline-variant/60 flex flex-wrap gap-4 items-center justify-between bg-surface-container/10">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
              <input 
                type="text" 
                value={deptSearch}
                onChange={(e) => setDeptSearch(e.target.value)}
                placeholder="Search departments..." 
                className="bg-surface-container border border-outline-variant/60 text-xs rounded-lg pl-9 pr-4 py-2 focus:ring-primary focus:border-primary outline-none transition-all w-48 sm:w-64 text-on-surface"
              />
            </div>
          </div>

          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-high border-b border-outline-variant/60">
                  <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant font-semibold">Department Name</th>
                  <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant font-semibold">Department Head</th>
                  <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant font-semibold">Parent Department</th>
                  <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant font-semibold">Status</th>
                  <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/40">
                {filteredDepts.map((dept, index) => (
                  <tr key={index} className="hover:bg-surface-bright/40 transition-colors">
                    <td className="px-6 py-4 font-body-sm text-on-surface font-semibold">{dept.name}</td>
                    <td className="px-6 py-4 font-body-sm text-on-surface-variant font-medium">{dept.head}</td>
                    <td className="px-6 py-4 font-body-sm text-on-surface-variant font-medium">{dept.parent}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        dept.status === 'Active' 
                          ? 'bg-primary/10 border border-primary/20 text-primary' 
                          : 'bg-error/10 border border-error/20 text-error'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${dept.status === 'Active' ? 'bg-primary' : 'bg-error'}`}></span> 
                        {dept.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button 
                        onClick={() => handleEditDeptClick(dept)} 
                        className="text-on-surface-variant hover:text-primary transition-colors inline-flex items-center justify-center p-1.5 hover:bg-surface-bright rounded"
                        title="Edit Department"
                      >
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </button>
                      {dept.status === 'Active' ? (
                        <button 
                          onClick={() => handleDeactivateDept(dept.name)}
                          className="text-error/80 hover:text-error transition-colors text-xs font-semibold px-2.5 py-1.5 bg-error-container/10 hover:bg-error-container/20 rounded border border-error/15"
                        >
                          Deactivate
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleActivateDept(dept.name)}
                          className="text-primary hover:text-primary-container transition-colors text-xs font-semibold px-2.5 py-1.5 bg-primary/10 hover:bg-primary/20 rounded border border-primary/15"
                        >
                          Activate
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. Asset Categories Panel */}
      {activeTab === 'categories' && (
        <div className="tab-pane bg-surface-container border border-outline-variant/60 rounded-xl overflow-hidden shadow-sm animate-fade-in">
          <div className="p-4 border-b border-outline-variant/60 flex flex-wrap gap-4 items-center justify-between bg-surface-container/10">
            <h3 className="font-headline-sm text-headline-sm font-semibold text-on-surface">Registered Asset Taxonomy</h3>
            <button 
              onClick={() => {
                setEntryType('Category');
                setIsDrawerOpen(true);
              }}
              className="bg-primary/10 border border-primary/20 text-primary px-4 py-2 rounded-lg text-xs font-bold transition-all hover:bg-primary/20"
            >
              Add Category
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {categories.map((cat, idx) => (
              <div key={idx} className="glass-card p-5 rounded-xl border border-outline-variant/50 relative overflow-hidden group hover:border-primary/50 transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">category</span>
                  </div>
                  <div>
                    <h4 className="font-label-md text-label-md font-bold text-on-surface">{cat.name}</h4>
                    <p className="text-[11px] text-on-surface-variant font-medium">Fields: {cat.attributes?.length || 0}</p>
                  </div>
                </div>
                {cat.attributes && cat.attributes.length > 0 ? (
                  <div className="space-y-1.5">
                    <p className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">Custom Fields:</p>
                    <ul className="text-xs text-on-surface-variant space-y-1 pl-2 list-disc list-inside font-semibold">
                      {cat.attributes.map((attr, aIdx) => (
                        <li key={aIdx} className="truncate">{attr}</li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p className="text-xs text-on-surface-variant italic font-semibold">No category-specific fields defined.</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Employee Directory Panel */}
      {activeTab === 'employees' && (
        <div className="tab-pane bg-surface-container border border-outline-variant/60 rounded-xl overflow-hidden shadow-sm animate-fade-in">
          <div className="p-4 border-b border-outline-variant/60 flex flex-wrap gap-4 items-center justify-between bg-surface-container/10">
            <div className="flex gap-3 items-center w-full sm:w-auto">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
                <input 
                  type="text" 
                  value={empSearch}
                  onChange={(e) => setEmpSearch(e.target.value)}
                  placeholder="Search employees..." 
                  className="bg-surface-container border border-outline-variant/60 text-xs rounded-lg pl-9 pr-4 py-2 focus:ring-primary focus:border-primary outline-none transition-all w-48 sm:w-64 text-on-surface"
                />
              </div>
              <select 
                value={empDeptFilter}
                onChange={(e) => setEmpDeptFilter(e.target.value)}
                className="bg-surface-container border border-outline-variant/60 text-xs rounded-lg px-3 py-2 text-on-surface-variant outline-none font-semibold"
              >
                <option>All Departments</option>
                {departments.map((d, i) => (
                  <option key={i} value={d.name}>{d.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-high border-b border-outline-variant/60">
                  <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant font-semibold">Employee</th>
                  <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant font-semibold">Department</th>
                  <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant font-semibold">Assigned Role</th>
                  <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant font-semibold">Status</th>
                  <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant text-right font-semibold">Change Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/40">
                {filteredEmployees.map(emp => (
                  <tr key={emp.id} className="hover:bg-surface-bright/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img className="w-10 h-10 rounded-full border border-outline-variant/30 object-cover" src={emp.avatar} alt={emp.name} />
                        <div>
                          <p className="font-body-sm text-on-surface font-bold leading-tight">{emp.name}</p>
                          <p className="text-[11px] text-on-surface-variant mt-0.5 font-medium">{emp.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-body-sm text-on-surface font-medium">{emp.dept}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold ${
                        emp.role === 'Admin' ? 'bg-primary/10 text-primary border border-primary/20' :
                        emp.role === 'Asset Manager' ? 'bg-secondary-container text-on-secondary-container' :
                        emp.role === 'Department Head' ? 'bg-tertiary-container text-on-tertiary-container' :
                        'bg-surface-container-highest text-on-surface-variant'
                      }`}>
                        {emp.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => updateEmployeeStatus(emp.id, emp.status === 'Active' ? 'Inactive' : 'Active')}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                          emp.status === 'Active' 
                            ? 'bg-primary/10 border-primary/20 text-primary' 
                            : 'bg-error/10 border-error/20 text-error'
                        }`}
                        title="Click to toggle status"
                      >
                        {emp.status}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <select
                        value={emp.role}
                        onChange={(e) => promoteEmployee(emp.id, e.target.value)}
                        className="bg-surface-bright border border-outline-variant/60 text-xs rounded-lg px-2.5 py-1.5 text-on-surface outline-none font-bold"
                      >
                        <option value="Employee">Employee</option>
                        <option value="Department Head">Department Head</option>
                        <option value="Asset Manager">Asset Manager</option>
                        <option value="Admin">Admin</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sliding Drawer Entry Form */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setIsDrawerOpen(false)}></div>
          <div className="relative w-full max-w-md bg-surface-container-low border-l border-outline-variant h-screen shadow-2xl z-10 flex flex-col animate-slide-in-right">
            
            <div className="p-6 border-b border-outline-variant/60 flex justify-between items-center bg-surface-container-high">
              <div>
                <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                  {editingDept ? 'Edit Department' : 'Add New Entry'}
                </h3>
                <p className="text-xs text-on-surface-variant font-medium">Configure organizational setup schemas.</p>
              </div>
              <button onClick={() => setIsDrawerOpen(false)} className="p-2 hover:bg-surface-bright rounded-full text-on-surface-variant hover:text-on-surface shrink-0">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="flex-1 flex flex-col h-full overflow-hidden">
              <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                
                {/* Switch type - only if not editing a department */}
                {!editingDept && (
                  <div className="space-y-2">
                    <label className="text-xs text-on-surface-variant font-bold uppercase tracking-wider block">Entry Type</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setEntryType('Department')}
                        className={`py-2 px-3 rounded-lg border text-xs font-bold text-center transition-all ${
                          entryType === 'Department'
                            ? 'bg-primary/10 border-primary text-primary'
                            : 'bg-surface border-outline-variant/60 text-on-surface-variant'
                        }`}
                      >
                        Department
                      </button>
                      <button
                        type="button"
                        onClick={() => setEntryType('Category')}
                        className={`py-2 px-3 rounded-lg border text-xs font-bold text-center transition-all ${
                          entryType === 'Category'
                            ? 'bg-primary/10 border-primary text-primary'
                            : 'bg-surface border-outline-variant/60 text-on-surface-variant'
                        }`}
                      >
                        Asset Category
                      </button>
                    </div>
                  </div>
                )}

                {entryType === 'Department' && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs text-on-surface-variant font-bold uppercase tracking-wider mb-1.5 block">Department Name</label>
                      <input 
                        type="text" 
                        value={deptName}
                        onChange={(e) => setDeptName(e.target.value)}
                        placeholder="e.g. Quality Assurance"
                        required
                        disabled={!!editingDept}
                        className="w-full bg-surface border border-outline-variant/60 rounded-xl px-4 py-2.5 text-sm focus:border-primary outline-none disabled:opacity-50"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-on-surface-variant font-bold uppercase tracking-wider mb-1.5 block">Head of Department</label>
                      <select 
                        value={deptHead}
                        onChange={(e) => setDeptHead(e.target.value)}
                        className="w-full bg-surface border border-outline-variant/60 rounded-xl px-4 py-2.5 text-sm focus:border-primary outline-none text-on-surface font-semibold"
                      >
                        <option value="">Select Employee...</option>
                        {employees.map(e => (
                          <option key={e.id} value={e.name}>{e.name} ({e.role})</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-on-surface-variant font-bold uppercase tracking-wider mb-1.5 block">Parent Entity</label>
                      <select 
                        value={deptParent}
                        onChange={(e) => setDeptParent(e.target.value)}
                        className="w-full bg-surface border border-outline-variant/60 rounded-xl px-4 py-2.5 text-sm focus:border-primary outline-none text-on-surface font-semibold"
                      >
                        <option value="Root Organization">Root Organization</option>
                        {departments.filter(d => !editingDept || d.name !== editingDept.name).map((d, idx) => (
                          <option key={idx} value={d.name}>{d.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-on-surface-variant font-bold uppercase tracking-wider mb-1.5 block">Status</label>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold">
                          <input 
                            type="radio" 
                            name="deptStatus" 
                            value="Active" 
                            checked={deptStatus === 'Active'}
                            onChange={() => setDeptStatus('Active')}
                          /> Active
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-error">
                          <input 
                            type="radio" 
                            name="deptStatus" 
                            value="Inactive" 
                            checked={deptStatus === 'Inactive'}
                            onChange={() => setDeptStatus('Inactive')}
                          /> Inactive (Deactivated)
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-on-surface-variant font-bold uppercase tracking-wider mb-1.5 block">Description</label>
                      <textarea 
                        rows="4" 
                        value={deptDesc}
                        onChange={(e) => setDeptDesc(e.target.value)}
                        placeholder="Enter department missions, targets, and operational details..."
                        className="w-full bg-surface border border-outline-variant/60 rounded-xl p-4 text-sm focus:border-primary outline-none resize-none font-semibold"
                      />
                    </div>
                  </div>
                )}

                {entryType === 'Category' && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs text-on-surface-variant font-bold uppercase tracking-wider mb-1.5 block">Category Name</label>
                      <input 
                        type="text" 
                        value={newCatName}
                        onChange={(e) => setNewCatName(e.target.value)}
                        placeholder="e.g. Server Hardware"
                        required
                        className="w-full bg-surface border border-outline-variant/60 rounded-xl px-4 py-2.5 text-sm focus:border-primary outline-none"
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <label className="text-xs text-on-surface-variant font-bold uppercase tracking-wider block">Category-Specific Attributes</label>
                        <button 
                          type="button" 
                          onClick={handleAddAttr}
                          className="text-xs text-primary hover:underline flex items-center gap-1 font-bold"
                        >
                          <span className="material-symbols-outlined text-sm font-bold">add</span> Add Field
                        </button>
                      </div>

                      {customAttrs.map((attr, index) => (
                        <div key={index} className="flex gap-2 items-center">
                          <input 
                            type="text" 
                            value={attr}
                            onChange={(e) => handleAttrChange(index, e.target.value)}
                            placeholder="e.g. Warranty Expiry (Months) or Fuel Capacity"
                            required
                            className="flex-1 bg-surface border border-outline-variant/60 rounded-xl px-4 py-2 text-xs focus:border-primary outline-none"
                          />
                          <button 
                            type="button" 
                            onClick={() => handleRemoveAttr(index)}
                            className="p-2 text-error hover:bg-error/10 rounded-full"
                          >
                            <span className="material-symbols-outlined text-sm font-bold">delete</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl flex gap-3">
                  <span className="material-symbols-outlined text-primary">info</span>
                  <div>
                    <p className="text-xs font-bold text-primary">System Directive</p>
                    <p className="text-[10px] text-on-surface-variant leading-relaxed mt-1 font-semibold">
                      Saving this entry updates global asset taxonomy profiles and routing definitions in real-time.
                    </p>
                  </div>
                </div>

              </div>

              <div className="p-6 border-t border-outline-variant/60 bg-surface-container-high flex gap-3 flex-shrink-0">
                <button 
                  type="submit" 
                  className="flex-1 py-3 bg-primary text-on-primary font-bold rounded-xl hover:brightness-110 active:scale-95 transition-all shadow-md"
                >
                  Save Changes
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

    </div>
  );
}

export default OrganizationSetup;
