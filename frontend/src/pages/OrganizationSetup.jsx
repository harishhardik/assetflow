import React, { useState } from 'react';

function OrganizationSetup({ userRole }) {
  const [activeTab, setActiveTab] = useState('departments'); // departments, categories, employees
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [entryType, setEntryType] = useState('Department'); // Department, Category, Employee

  // Department Form States
  const [deptName, setDeptName] = useState('');
  const [deptHead, setDeptHead] = useState('Select Employee...');
  const [deptParent, setDeptParent] = useState('Root Organization');
  const [deptDesc, setDeptDesc] = useState('');

  // Mock Departments Data
  const [departments, setDepartments] = useState([
    { name: 'Engineering', head: 'Marcus Aurelius', parent: '—', status: 'Active' },
    { name: 'Product Design', head: 'Elena Vance', parent: 'Engineering', status: 'Active' }
  ]);

  // Mock Employees Directory Data
  const [employees, setEmployees] = useState([
    {
      id: 1,
      name: 'David Wright',
      email: 'david.w@assetflow.com',
      dept: 'Engineering',
      role: 'Senior Lead',
      status: 'Active',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCXpDJHxVZDFmXK86yUBTQnHH7ef46fG7yYOABaHYoNKkbrIieJTJGwoaXpU6Ff2qCKMXXWNeL3QGdVD_2TpGumU2tdA-WJl78ws6xi4g0S_tKU3x8HKkpJqu7ZyTT0liCSRSevPTkZitvJRMpVpdJ_wR0pydOaL02yx4DkaBOYQ8M5FiXE6u2xjNLllrHKndNOAJ3b86GwmXuAMCiuhwTFl1API9adnAeUkmHXVwjaQq9nX10g9N_9ZNJt3j3El98v6Dhas55HcKfd'
    },
    {
      id: 2,
      name: 'Sarah Jenkins',
      email: 'sarah.j@assetflow.com',
      dept: 'Marketing',
      role: 'Content Strategist',
      status: 'On Leave',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAfkIXqfM6bSOzVjktgAq4YdM2ExSouiWHXcDxmMqdBoGp5HFs1JiWNmUB5hf9uXpeB3rZYFNMiGRBJcWVC8CjmZmQSXIl5iN3kDjGjMxtHaJzc6K221bqT5qQy4vUXpXzk3NRMme43_FxJYn3wmjoXvBU_D4EFodx4styPjxuFVjlImtH_sQJYVIO7SzaK0Yf2tz0LycZBTG59_QniZv1w4zFBTE5Z3PVE94fHksg_4Vk3PhEF7MYsau5n11r5Y_i-OjlQXyGFqdgV'
    }
  ]);

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (entryType === 'Department') {
      const newDept = {
        name: deptName,
        head: deptHead === 'Select Employee...' ? 'Alex Chen' : deptHead,
        parent: deptParent === 'Root Organization' ? '—' : deptParent,
        status: 'Active'
      };
      setDepartments([...departments, newDept]);
      setIsDrawerOpen(false);
      setDeptName('');
      setDeptDesc('');
    }
  };

  const handlePromoteRole = (empId) => {
    setEmployees(employees.map(emp => {
      if (emp.id === empId) {
        return {
          ...emp,
          role: emp.role === 'Senior Lead' ? 'Principal Engineer' : 'Lead Strategist'
        };
      }
      return emp;
    }));
  };

  return (
    <div className="p-margin-page max-w-container-max mx-auto space-y-gutter pb-24 transition-colors duration-300">
      
      {/* Page Header */}
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="font-headline-md text-headline-md font-bold text-on-surface mb-1">Organization Setup</h2>
          <p className="text-on-surface-variant font-body-sm">Manage your enterprise structure, categories, and personnel data.</p>
        </div>
        <button 
          onClick={() => {
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
            <div className="flex gap-3 items-center w-full sm:w-auto">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
                <input 
                  type="text" 
                  placeholder="Search departments..." 
                  className="bg-surface-container border border-outline-variant/60 text-xs rounded-lg pl-9 pr-4 py-2 focus:ring-primary focus:border-primary outline-none transition-all w-48 sm:w-64 text-on-surface"
                />
              </div>
              <button className="flex items-center gap-2 px-3 py-2 border border-outline-variant/60 rounded-lg text-xs font-semibold hover:bg-surface-bright transition-colors text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined text-sm">filter_list</span>
                Filters
              </button>
            </div>
          </div>

          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-high border-b border-outline-variant/60">
                  <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant font-semibold">Department Name</th>
                  <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant font-semibold">Head</th>
                  <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant font-semibold">Parent</th>
                  <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant font-semibold">Status</th>
                  <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/40">
                {departments.map((dept, index) => (
                  <tr key={index} className="hover:bg-surface-bright/40 transition-colors">
                    <td className="px-6 py-4 font-body-sm text-on-surface font-semibold">{dept.name}</td>
                    <td className="px-6 py-4 font-body-sm text-on-surface-variant font-medium">{dept.head}</td>
                    <td className="px-6 py-4 font-body-sm text-on-surface-variant font-medium">{dept.parent}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 border border-primary/20 text-primary">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary"></span> {dept.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-on-surface-variant hover:text-primary transition-colors"><span className="material-symbols-outlined">edit</span></button>
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
        <div className="tab-pane bg-surface-container border border-outline-variant/60 rounded-xl overflow-hidden animate-fade-in">
          <div className="p-20 text-center flex flex-col items-center justify-center">
            <span className="material-symbols-outlined text-6xl text-outline-variant mb-4">category</span>
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">Manage Asset Taxonomy</h3>
            <p className="text-on-surface-variant max-w-sm mx-auto mt-2 text-sm leading-relaxed font-medium">
              Define the classification hierarchy systems for hardware, computing nodes, and corporate structures.
            </p>
            <button className="mt-6 border border-primary text-primary px-6 py-2.5 rounded-lg hover:bg-primary/5 transition-all font-bold">
              Configure Categories
            </button>
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
                  placeholder="Search employees..." 
                  className="bg-surface-container border border-outline-variant/60 text-xs rounded-lg pl-9 pr-4 py-2 focus:ring-primary focus:border-primary outline-none transition-all w-48 sm:w-64 text-on-surface"
                />
              </div>
              <select className="bg-surface-container border border-outline-variant/60 text-xs rounded-lg px-3 py-2 text-on-surface-variant outline-none font-semibold">
                <option>All Departments</option>
                <option>Engineering</option>
                <option>Marketing</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-high border-b border-outline-variant/60">
                  <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant font-semibold">Employee</th>
                  <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant font-semibold">Department</th>
                  <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant font-semibold">Role</th>
                  <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant font-semibold">Status</th>
                  <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/40">
                {employees.map(emp => (
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
                    <td className="px-6 py-4 font-body-sm text-on-surface-variant font-bold">{emp.role}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        emp.status === 'Active' 
                          ? 'bg-primary/10 border border-primary/20 text-primary' 
                          : 'bg-secondary-container/10 border border-secondary-container/20 text-secondary'
                      }`}>
                        {emp.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handlePromoteRole(emp.id)}
                        className="bg-surface-bright hover:bg-primary hover:text-on-primary border border-primary/20 text-primary px-3 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95"
                      >
                        Promote Role
                      </button>
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
                <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">Add New Entry</h3>
                <p className="text-xs text-on-surface-variant font-medium">Configure organizational entity details.</p>
              </div>
              <button onClick={() => setIsDrawerOpen(false)} className="p-2 hover:bg-surface-bright rounded-full text-on-surface-variant hover:text-on-surface shrink-0">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="flex-1 flex flex-col h-full overflow-hidden">
              <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                
                {/* Switch type */}
                <div className="space-y-2">
                  <label className="text-xs text-on-surface-variant font-bold uppercase tracking-wider block">Entry Type</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Department', 'Category', 'Employee'].map(type => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setEntryType(type)}
                        className={`py-2 px-3 rounded-lg border text-xs font-bold text-center transition-all ${
                          entryType === type
                            ? 'bg-primary/10 border-primary text-primary'
                            : 'bg-surface border-outline-variant/60 text-on-surface-variant hover:text-on-surface'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

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
                        className="w-full bg-surface border border-outline-variant/60 rounded-xl px-4 py-2.5 text-sm focus:border-primary outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-on-surface-variant font-bold uppercase tracking-wider mb-1.5 block">Head of Department</label>
                      <select 
                        value={deptHead}
                        onChange={(e) => setDeptHead(e.target.value)}
                        className="w-full bg-surface border border-outline-variant/60 rounded-xl px-4 py-2.5 text-sm focus:border-primary outline-none text-on-surface"
                      >
                        <option>Select Employee...</option>
                        <option>Marcus Aurelius</option>
                        <option>Elena Vance</option>
                        <option>David Wright</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-on-surface-variant font-bold uppercase tracking-wider mb-1.5 block">Parent Entity</label>
                      <select 
                        value={deptParent}
                        onChange={(e) => setDeptParent(e.target.value)}
                        className="w-full bg-surface border border-outline-variant/60 rounded-xl px-4 py-2.5 text-sm focus:border-primary outline-none text-on-surface"
                      >
                        <option>Root Organization</option>
                        <option>Engineering</option>
                        <option>Product Design</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-on-surface-variant font-bold uppercase tracking-wider mb-1.5 block">Description</label>
                      <textarea 
                        rows="4" 
                        value={deptDesc}
                        onChange={(e) => setDeptDesc(e.target.value)}
                        placeholder="Enter department missions, targets, and operational details..."
                        className="w-full bg-surface border border-outline-variant/60 rounded-xl p-4 text-sm focus:border-primary outline-none resize-none"
                      />
                    </div>
                  </div>
                )}

                {entryType !== 'Department' && (
                  <div className="p-8 text-center text-on-surface-variant font-medium italic border border-dashed border-outline-variant/40 rounded-xl bg-surface/30">
                    Configuration panel for {entryType} is pre-configured. Switch back to Department to preview creation.
                  </div>
                )}

                <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl flex gap-3">
                  <span className="material-symbols-outlined text-primary">info</span>
                  <div>
                    <p className="text-xs font-bold text-primary">System Note</p>
                    <p className="text-[10px] text-on-surface-variant leading-relaxed mt-1 font-semibold">
                      Newly created departments will inherit the parent entity's fiscal tracking policies and audit intervals by default.
                    </p>
                  </div>
                </div>

              </div>

              <div className="p-6 border-t border-outline-variant/60 bg-surface-container-high flex gap-3 flex-shrink-0">
                <button 
                  type="submit" 
                  disabled={entryType !== 'Department'}
                  className="flex-1 py-3 bg-primary text-on-primary font-bold rounded-xl hover:brightness-110 active:scale-95 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
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
