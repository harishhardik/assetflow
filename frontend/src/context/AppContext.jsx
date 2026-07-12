import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

// Helper to generate next asset tag (e.g. AF-0005)
const generateAssetTag = (assetsList) => {
  const tags = assetsList.map(a => {
    const match = a.tag.match(/AF-(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  });
  const maxNum = tags.length > 0 ? Math.max(...tags) : 0;
  const nextNum = maxNum + 1;
  return `AF-${String(nextNum).padStart(4, '0')}`;
};

export const AppContextProvider = ({ children }) => {
  // Load initial state or localStorage
  const getInitialState = (key, defaultValue) => {
    const saved = localStorage.getItem(key);
    try {
      return saved ? JSON.parse(saved) : defaultValue;
    } catch (e) {
      return defaultValue;
    }
  };

  // --- 1. USER SESSION ---
  const [currentUser, setCurrentUser] = useState(() => getInitialState('af_current_user', null));
  const [userRole, setUserRole] = useState(() => getInitialState('af_user_role', 'Admin'));

  // --- 2. EMPLOYEES ---
  const [employees, setEmployees] = useState(() => getInitialState('af_employees', [
    { id: 1, name: 'David Wright', email: 'david.w@company.com', dept: 'Engineering', role: 'Employee', status: 'Active', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCXpDJHxVZDFmXK86yUBTQnHH7ef46fG7yYOABaHYoNKkbrIieJTJGwoaXpU6Ff2qCKMXXWNeL3QGdVD_2TpGumU2tdA-WJl78ws6xi4g0S_tKU3x8HKkpJqu7ZyTT0liCSRSevPTkZitvJRMpVpdJ_wR0pydOaL02yx4DkaBOYQ8M5FiXE6u2xjNLllrHKndNOAJ3b86GwmXuAMCiuhwTFl1API9adnAeUkmHXVwjaQq9nX10g9N_9ZNJt3j3El98v6Dhas55HcKfd' },
    { id: 2, name: 'Sarah Jenkins', email: 'sarah.j@company.com', dept: 'Marketing', role: 'Employee', status: 'Active', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAfkIXqfM6bSOzVjktgAq4YdM2ExSouiWHXcDxmMqdBoGp5HFs1JiWNmUB5hf9uXpeB3rZYFNMiGRBJcWVC8CjmZmQSXIl5iN3kDjGjMxtHaJzc6K221bqT5qQy4vUXpXzk3NRMme43_FxJYn3wmjoXvBU_D4EFodx4styPjxuFVjlImtH_sQJYVIO7SzaK0Yf2tz0LycZBTG59_QniZv1w4zFBTE5Z3PVE94fHksg_4Vk3PhEF7MYsau5n11r5Y_i-OjlQXyGFqdgV' },
    { id: 3, name: 'Marcus Thorne', email: 'marcus.t@company.com', dept: 'Design Ops', role: 'Department Head', status: 'Active', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCH5kJ31fOxVJ2agX6ih5CKA8zJXINwq09aBdPUwn729CPRzw4u0oHE-Bg_lOBwtS42h06OLtIcb4phIyqE0FjiNmgk-hhqHlyybyiw6qf5f4P8U1yToD0QYKOvskvbQrdRcbO7o0s0Mo5aKsgeP0KRzi0SAs7OCYY32O3RNxjdjF266srd04XB4f8evE9i78J_6iZ-rtmm8q65zYJjmVctM2UJLU00mq9omXW8A1OFC-PPFD-LpG8_nWsFV-Iwgb2Nun3eeaDroBBK' },
    { id: 4, name: 'Jane Doe', email: 'jane.d@company.com', dept: 'Engineering', role: 'Asset Manager', status: 'Active', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80' },
    { id: 5, name: 'Alex Chen', email: 'admin@assetflow.com', dept: 'HQ Operations', role: 'Admin', status: 'Active', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAyYd0o6JZKPuU2SXgB5qW6sfNqUrx2e63Aj40-s9btmia7JuP1cvguzbbevdi-boIjifAQkw69rUIBTuRmxVBJb6_Z0FzWrrQpaOmYfmBRovu8R5y46ILNrlPmQfQUMSIrBLheTA31Wv9RE05QWSGsy3-f1-GXrerIUW387VnWK_sHhldVjf_FnC-i021KwpY8gmWAmv7jH2T8b0t3Dv9OeDPKYFRpUS_eUn9W3hgzYBOeBa0W5icpUk7wKPuLzlGqCK2Lkb7lFPC8' },
    { id: 6, name: 'Priya Patel', email: 'priya.p@company.com', dept: 'Engineering', role: 'Employee', status: 'Active', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150&q=80' },
    { id: 7, name: 'Raj Sharma', email: 'raj.s@company.com', dept: 'Marketing', role: 'Employee', status: 'Active', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80' }
  ]));

  // --- 3. DEPARTMENTS ---
  const [departments, setDepartments] = useState(() => getInitialState('af_departments', [
    { name: 'Engineering', head: 'David Wright', parent: '—', status: 'Active' },
    { name: 'Product Design', head: 'Marcus Thorne', parent: 'Engineering', status: 'Active' },
    { name: 'Marketing', head: 'Sarah Jenkins', parent: '—', status: 'Active' },
    { name: 'Design Ops', head: 'Marcus Thorne', parent: 'Product Design', status: 'Active' }
  ]));

  // --- 4. CATEGORIES ---
  const [categories, setCategories] = useState(() => getInitialState('af_categories', [
    { name: 'Electronics', attributes: ['Warranty Period (months)', 'Manufacturer'] },
    { name: 'Furniture', attributes: ['Material', 'Dimensions'] },
    { name: 'Vehicles', attributes: ['License Plate', 'Fuel Type', 'Next Service Date'] },
    { name: 'Networking', attributes: ['IP Range', 'Ports Count'] },
    { name: 'Office Equipment', attributes: ['Ink Code', 'Voltage'] }
  ]));

  // --- 5. ASSETS ---
  const [assets, setAssets] = useState(() => getInitialState('af_assets', [
    {
      id: 1,
      tag: 'AF-0001',
      name: 'MacBook Pro M3 Max',
      category: 'Electronics',
      serialNumber: 'C02FX1234567',
      acquisitionDate: '2024-01-12',
      acquisitionCost: 4299.00,
      condition: 'Excellent',
      location: 'San Francisco',
      photo: 'https://lh3.googleusercontent.com/aida-public/AB6AXu8zmtVPVnUvm1HAUUrW_muh3wkYv2eaaOr5tCutkFptfLiesStUrSkaIUFl1z7fhmYrZokQcfFd6XM3pMINdGOyED1fXx1JrRa82M7TyB7Kg7rORcUf62I6BSd0RzwTS33_Kozzg0EdTr5Fe8M5ej-m7VeUiTJcuB2HZ-yFWTfljErsKePU7Op9CgF3-S2AWXc6_OvWTtoWMULcgb8vwj5eexWYJlaTbS42qWg6-zg5Fo4-8wEWwcWMosRJcdh1Xpw39qVN8AHllqr',
      shared: true,
      status: 'Allocated',
      assignedTo: 'Priya Patel',
      expectedReturnDate: '2026-07-20',
      categoryFields: { 'Warranty Period (months)': '36', 'Manufacturer': 'Apple' },
      history: [
        { date: '2024-01-12', action: 'Acquisition', user: 'Jane Doe', notes: 'Asset entered inventory.' },
        { date: '2024-01-15', action: 'Allocation', user: 'Jane Doe', assignee: 'Priya Patel', notes: 'Assigned for active project tasks.' }
      ]
    },
    {
      id: 2,
      tag: 'AF-0002',
      name: 'Cisco Catalyst 9300',
      category: 'Networking',
      serialNumber: 'SN-CS9300-8812',
      acquisitionDate: '2024-03-02',
      acquisitionCost: 2850.00,
      condition: 'New',
      location: 'London Hub',
      photo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDNINNudG-NFbPlNeUDyCO2BZovgEtRV6o-9xyMMu1icxAdyn_hz-6HliOQWP-pFDhLv-MsJrl8ft0FxZrmjUAMjIKzrNi9ghmkTIiXrWkrQsh6nFsIlMFHzf-psUrhmvjSgZKJH4CQsonO3IpvxyCL4F2LOrY2gDCYYP3vFtvWJLUQgucwFBiod8O7x97qb-pJxK61vdxrLFglf-cMgPmKboMbK-GFlwYm58nN6xM8KaIBfmy6snlAiFQGvCU2uzPM0uE2YhT0DcsU',
      shared: false,
      status: 'Available',
      assignedTo: null,
      expectedReturnDate: null,
      categoryFields: { 'IP Range': '10.0.4.1/24', 'Ports Count': '48' },
      history: [{ date: '2024-03-02', action: 'Acquisition', user: 'Jane Doe', notes: 'Setup in Hub Rack.' }]
    },
    {
      id: 3,
      tag: 'AF-0003',
      name: 'HP LaserJet Enterprise',
      category: 'Office Equipment',
      serialNumber: 'HP-LJE-441290',
      acquisitionDate: '2023-06-15',
      acquisitionCost: 950.00,
      condition: 'Fair',
      location: 'HQ - Floor 4',
      photo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAZe3Gn-xoezTA8gB96I02-3KfaU7mqvt0zAx-dZgjRvccZg_QN-N9j2POwo8rI00BARnJu7Z_NNhQORtIZN2tOBWKrXm3rb-6wvGmjIeIUnOZzxRUcxmXaByrMLK2DsZx-JGG7sG0qkR7nXvxeQyAjwkX3wf1tHynK-z3PWSGPsSC6kT-JpLy9pwO7g0Xz3kWZL3Zh6DbNJr01L1iRTkwbKbXQ8MULnnt6w_lYgtD0m6FvscFAfCGsQ-7xiWk__kzRrXjChSf7Ot2M',
      shared: true,
      status: 'Available',
      assignedTo: null,
      expectedReturnDate: null,
      categoryFields: { 'Ink Code': 'HP 87A Black', 'Voltage': '110V' },
      history: [{ date: '2023-06-15', action: 'Acquisition', user: 'Jane Doe', notes: 'Placed in main elevator landing corridor.' }]
    },
    {
      id: 4,
      tag: 'AF-0004',
      name: 'Dell UltraSharp 32"',
      category: 'Electronics',
      serialNumber: 'DELL-US32-9012',
      acquisitionDate: '2024-02-10',
      acquisitionCost: 1199.00,
      condition: 'Good',
      location: 'Remote',
      photo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB6dTqkfNg67v98knj6n6AJX0FunGGmN_zbiRfJEPXBWAa0y60G3-2RRps3yINyCLzeoa1fHPNa5LqE22LuoLNm1dV3suVS6ZUQg-p22e8o5yAgoP6ab7igXlZTMLysqPJsyB4ABdq5ZP_rehCeF19YNYf_uuYNZB6ZbT5_STntrs3095xVJ5QjDDUSJaNCsmGwiFxPdT4ZjZQUxZaqhKudw-bUXd_p6ZH99AjukWdMaBnDtv6I3ZlAM8FOL4rlxdTk_QAdbOeQp3bn',
      shared: true,
      status: 'Allocated',
      assignedTo: 'Sarah Jenkins',
      expectedReturnDate: '2026-07-01',
      categoryFields: { 'Warranty Period (months)': '24', 'Manufacturer': 'Dell' },
      history: [{ date: '2024-02-10', action: 'Acquisition', user: 'Jane Doe', notes: 'Shipped to employee home.' }]
    }
  ]));

  // --- 6. TRANSFERS ---
  const [transfers, setTransfers] = useState(() => getInitialState('af_transfers', [
    { id: 1, assetTag: 'AF-0001', assetName: 'MacBook Pro M3 Max', requester: 'Raj Sharma', currentHolder: 'Priya Patel', targetDept: 'Marketing', status: 'Pending', date: '2026-07-10' }
  ]));

  // --- 7. FACILITY & RESOURCE BOOKINGS ---
  const [bookings, setBookings] = useState(() => getInitialState('af_bookings', [
    { id: 1, resourceId: 'Conference Room A', type: 'Venues', user: 'David Wright', date: '2026-07-12', startTime: '09:00', endTime: '10:00', status: 'Upcoming' },
    { id: 2, resourceId: 'Spectrometer Pro', type: 'Equipment', user: 'Sarah Jenkins', date: '2026-07-12', startTime: '13:00', endTime: '14:30', status: 'Ongoing' }
  ]));

  // --- 8. MAINTENANCE TICKETS ---
  const [tickets, setTickets] = useState(() => getInitialState('af_tickets', [
    {
      id: 'AF-772',
      title: 'HVAC Unit 4 Leak',
      desc: 'Main server room HVAC coolant pressure dropping rapidly. Immediate inspection required.',
      status: 'Pending',
      priority: 'Danger',
      assignee: 'Unassigned',
      date: '2026-07-12',
      assetName: 'Cisco Catalyst 9300',
      assetLoc: 'Server Room 102 - Row A',
      report: 'Coolant pressure sensors triggered alarm. Manual visual inspection confirms a hairline fracture.',
      logs: [{ title: 'Ticket Created by System Monitoring', time: '12:00 PM', done: true }]
    }
  ]));

  // --- 9. AUDIT CYCLES ---
  const [audits, setAudits] = useState(() => getInitialState('af_audits', [
    {
      id: 1,
      title: 'Q3 Hardware Audit',
      scopeType: 'Location',
      scopeValue: 'San Francisco',
      startDate: '2026-07-01',
      endDate: '2026-07-15',
      auditors: ['David Wright', 'Sarah Jenkins'],
      status: 'Active',
      assessments: {
        'AF-0001': { marked: 'Verified', notes: 'Held by Priya Patel in great shape.' },
        'AF-0004': { marked: 'Damaged', notes: 'Minor scratch on the base casing.' }
      }
    }
  ]));

  // --- 10. NOTIFICATIONS & ACTIVITY LOGS ---
  const [notifications, setNotifications] = useState(() => getInitialState('af_notifications', [
    { id: 1, text: 'HP LaserJet Enterprise maintenance reported.', time: '1 hour ago', unread: true, type: 'warning' },
    { id: 2, text: 'MacBook Pro M3 Max is overdue for return!', time: '2 hours ago', unread: true, type: 'danger' }
  ]));

  const [activityLogs, setActivityLogs] = useState(() => getInitialState('af_activity_logs', [
    { id: 1, user: 'Jane Doe', action: 'Registered MacBook Pro M3 Max', timestamp: '2026-07-12 11:00 AM' },
    { id: 2, user: 'Admin', action: 'Promoted David Wright to Department Head', timestamp: '2026-07-12 11:30 AM' }
  ]));

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('af_current_user', JSON.stringify(currentUser));
    localStorage.setItem('af_user_role', JSON.stringify(userRole));
    localStorage.setItem('af_employees', JSON.stringify(employees));
    localStorage.setItem('af_departments', JSON.stringify(departments));
    localStorage.setItem('af_categories', JSON.stringify(categories));
    localStorage.setItem('af_assets', JSON.stringify(assets));
    localStorage.setItem('af_transfers', JSON.stringify(transfers));
    localStorage.setItem('af_bookings', JSON.stringify(bookings));
    localStorage.setItem('af_tickets', JSON.stringify(tickets));
    localStorage.setItem('af_audits', JSON.stringify(audits));
    localStorage.setItem('af_notifications', JSON.stringify(notifications));
    localStorage.setItem('af_activity_logs', JSON.stringify(activityLogs));
  }, [currentUser, userRole, employees, departments, categories, assets, transfers, bookings, tickets, audits, notifications, activityLogs]);

  const logAction = (actionStr, specificUser = null) => {
    const userDisplay = specificUser || (currentUser ? currentUser.name : 'System');
    const newLog = {
      id: Date.now() + Math.random(),
      user: userDisplay,
      action: actionStr,
      timestamp: new Date().toLocaleString()
    };
    setActivityLogs(prev => [newLog, ...prev]);
  };

  const addNotification = (text, type = 'info') => {
    const newNotif = {
      id: Date.now() + Math.random(),
      text,
      time: 'Just now',
      unread: true,
      type
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // --- ACTIONS ---

  const handleSignUp = (name, email, password) => {
    const existing = employees.find(e => e.email === email);
    if (existing) return { success: false, message: 'Email already exists!' };

    const newEmp = {
      id: Date.now(),
      name,
      email,
      role: 'Employee',
      dept: 'Unassigned',
      status: 'Active',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`
    };
    setEmployees(prev => [...prev, newEmp]);
    logAction(`Signed up new employee account for ${name}`, name);
    addNotification(`New account created for ${name}`, 'info');
    return { success: true };
  };

  const handleLogin = (email, password) => {
    const emp = employees.find(e => e.email.toLowerCase() === email.toLowerCase());
    if (emp) {
      setCurrentUser(emp);
      setUserRole(emp.role);
      logAction(`Logged in successfully`, emp.name);
      return { success: true, role: emp.role };
    }
    return { success: false, message: 'Invalid credentials. Simulated system only checks matching email.' };
  };

  const handleLogout = () => {
    if (currentUser) {
      logAction(`Logged out`);
    }
    setCurrentUser(null);
    setUserRole('Employee');
  };

  const promoteEmployee = (id, newRole) => {
    setEmployees(prev => prev.map(e => {
      if (e.id === id) {
        logAction(`Promoted ${e.name} to ${newRole}`);
        addNotification(`${e.name} promoted to ${newRole}`, 'info');
        return { ...e, role: newRole };
      }
      return e;
    }));
  };

  const updateEmployeeStatus = (id, status) => {
    setEmployees(prev => prev.map(e => {
      if (e.id === id) {
        logAction(`Changed ${e.name} status to ${status}`);
        return { ...e, status };
      }
      return e;
    }));
  };

  const createDepartment = (dept) => {
    setDepartments(prev => [...prev, dept]);
    logAction(`Created department ${dept.name}`);
  };

  const updateDepartment = (name, updatedFields) => {
    setDepartments(prev => prev.map(d => {
      if (d.name === name) {
        logAction(`Updated department ${name}`);
        return { ...d, ...updatedFields };
      }
      return d;
    }));
  };

  const createCategory = (catName, attributes = []) => {
    if (categories.find(c => c.name.toLowerCase() === catName.toLowerCase())) return false;
    setCategories(prev => [...prev, { name: catName, attributes }]);
    logAction(`Created asset category ${catName}`);
    return true;
  };

  const registerAsset = (assetData) => {
    const nextTag = generateAssetTag(assets);
    const newAsset = {
      ...assetData,
      id: Date.now(),
      tag: nextTag,
      status: 'Available',
      history: [
        { date: new Date().toISOString().split('T')[0], action: 'Registration', user: currentUser?.name || 'Admin', notes: 'Asset registered in system.' }
      ]
    };
    setAssets(prev => [newAsset, ...prev]);
    logAction(`Registered asset ${assetData.name} (${nextTag})`);
    addNotification(`Registered asset ${assetData.name} (${nextTag})`, 'info');
  };

  const updateAsset = (id, updatedFields) => {
    setAssets(prev => prev.map(a => {
      if (a.id === id) {
        return { ...a, ...updatedFields };
      }
      return a;
    }));
  };

  const allocateAsset = (assetId, assigneeName, expectedReturnDate = null) => {
    const asset = assets.find(a => a.id === assetId);
    if (!asset) return { success: false, message: 'Asset not found.' };

    if (asset.status !== 'Available' && asset.status !== 'Reserved') {
      const holder = asset.assignedTo || 'another employee';
      return { 
        success: false, 
        message: `Asset ${asset.name} is currently taken.`, 
        conflict: true, 
        currentHolder: holder 
      };
    }

    setAssets(prev => prev.map(a => {
      if (a.id === assetId) {
        const historyEntry = {
          date: new Date().toISOString().split('T')[0],
          action: 'Allocation',
          user: currentUser?.name || 'Asset Manager',
          assignee: assigneeName,
          notes: `Allocated to ${assigneeName}. Expected return: ${expectedReturnDate || 'Indefinite'}`
        };
        return {
          ...a,
          status: 'Allocated',
          assignedTo: assigneeName,
          expectedReturnDate,
          history: [...a.history, historyEntry]
        };
      }
      return a;
    }));

    logAction(`Allocated asset ${asset.name} (${asset.tag}) to ${assigneeName}`);
    addNotification(`Asset ${asset.tag} assigned to ${assigneeName}`, 'info');
    return { success: true };
  };

  const returnAsset = (assetId, returnNotes, condition = 'Good') => {
    const asset = assets.find(a => a.id === assetId);
    if (!asset) return;

    setAssets(prev => prev.map(a => {
      if (a.id === assetId) {
        const historyEntry = {
          date: new Date().toISOString().split('T')[0],
          action: 'Return Check-in',
          user: currentUser?.name || 'Asset Manager',
          notes: `Returned in ${condition} condition. Notes: ${returnNotes}`
        };
        return {
          ...a,
          status: 'Available',
          assignedTo: null,
          expectedReturnDate: null,
          condition,
          history: [...a.history, historyEntry]
        };
      }
      return a;
    }));

    logAction(`Returned asset ${asset.name} (${asset.tag}). Condition: ${condition}`);
    addNotification(`Asset ${asset.tag} checked in. Status: Available`, 'info');
  };

  const requestTransfer = (assetTag, targetDept) => {
    const asset = assets.find(a => a.tag === assetTag);
    if (!asset) return;

    const newTransfer = {
      id: Date.now(),
      assetTag,
      assetName: asset.name,
      requester: currentUser?.name || 'Raj Sharma',
      currentHolder: asset.assignedTo || 'Unknown',
      targetDept,
      status: 'Pending',
      date: new Date().toISOString().split('T')[0]
    };

    setTransfers(prev => [newTransfer, ...prev]);
    logAction(`Requested transfer of asset ${asset.name} (${assetTag}) to department ${targetDept}`);
    addNotification(`Transfer request raised for ${assetTag}`, 'warning');
  };

  const approveTransfer = (transferId) => {
    const transfer = transfers.find(t => t.id === transferId);
    if (!transfer) return;

    setAssets(prev => prev.map(a => {
      if (a.tag === transfer.assetTag) {
        const historyEntry = {
          date: new Date().toISOString().split('T')[0],
          action: 'Transfer Approved',
          user: currentUser?.name || 'Asset Manager',
          assignee: transfer.requester,
          notes: `Transferred from ${transfer.currentHolder} to ${transfer.requester} (${transfer.targetDept})`
        };
        return {
          ...a,
          status: 'Allocated',
          assignedTo: transfer.requester,
          expectedReturnDate: null,
          location: transfer.targetDept,
          history: [...a.history, historyEntry]
        };
      }
      return a;
    }));

    setTransfers(prev => prev.map(t => {
      if (t.id === transferId) return { ...t, status: 'Approved' };
      return t;
    }));

    logAction(`Approved transfer of asset ${transfer.assetName} to ${transfer.requester}`);
    addNotification(`Transfer approved: ${transfer.assetTag} assigned to ${transfer.requester}`, 'success');
  };

  const rejectTransfer = (transferId) => {
    setTransfers(prev => prev.map(t => {
      if (t.id === transferId) return { ...t, status: 'Rejected' };
      return t;
    }));
    logAction(`Rejected transfer request ${transferId}`);
  };

  const bookResource = (resourceId, type, date, startTime, endTime) => {
    const hasOverlap = bookings.some(b => {
      if (b.resourceId !== resourceId || b.date !== date || b.status === 'Cancelled') return false;
      const start = parseFloat(startTime.replace(':', '.'));
      const end = parseFloat(endTime.replace(':', '.'));
      const bStart = parseFloat(b.startTime.replace(':', '.'));
      const bEnd = parseFloat(b.endTime.replace(':', '.'));
      return (start < bEnd && end > bStart);
    });

    if (hasOverlap) {
      return { success: false, message: `Conflict: This resource is already booked during the selected time window.` };
    }

    const newBooking = {
      id: Date.now(),
      resourceId,
      type,
      user: currentUser?.name || 'David Wright',
      date,
      startTime,
      endTime,
      status: 'Upcoming'
    };

    setBookings(prev => [newBooking, ...prev]);
    logAction(`Booked resource ${resourceId} for ${date} (${startTime}-${endTime})`);
    addNotification(`Resource ${resourceId} booked successfully`, 'success');
    return { success: true };
  };

  const cancelBooking = (bookingId) => {
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        logAction(`Cancelled booking for ${b.resourceId}`);
        addNotification(`Booking for ${b.resourceId} cancelled`, 'warning');
        return { ...b, status: 'Cancelled' };
      }
      return b;
    }));
  };

  const raiseMaintenance = (assetId, issue, priority, photo = null) => {
    const asset = assets.find(a => a.id === assetId);
    if (!asset) return;

    const newTicket = {
      id: `AF-${Math.floor(100 + Math.random() * 900)}`,
      title: `${asset.name} Issue`,
      desc: issue,
      status: 'Pending',
      priority,
      assignee: 'Unassigned',
      date: new Date().toISOString().split('T')[0],
      assetName: asset.name,
      assetLoc: asset.location,
      report: issue,
      photo,
      logs: [{ title: 'Maintenance request logged by employee.', time: new Date().toLocaleTimeString(), done: true }]
    };

    setTickets(prev => [newTicket, ...prev]);
    logAction(`Logged maintenance request for ${asset.name}`);
    addNotification(`New maintenance request logged for ${asset.tag}`, 'warning');
  };

  const updateTicketStatus = (ticketId, nextStatus, techName = null) => {
    const ticket = tickets.find(t => t.id === ticketId);
    if (!ticket) return;

    const targetAsset = assets.find(a => a.name === ticket.assetName);
    if (targetAsset) {
      if (nextStatus === 'Approved') {
        setAssets(prev => prev.map(a => {
          if (a.id === targetAsset.id) {
            return {
              ...a,
              status: 'Under Maintenance',
              history: [...a.history, { date: new Date().toISOString().split('T')[0], action: 'Status Update', user: 'System', notes: 'Status changed to Under Maintenance on ticket approval.' }]
            };
          }
          return a;
        }));
        addNotification(`Asset ${targetAsset.tag} is now Under Maintenance`, 'warning');
      } else if (nextStatus === 'Resolved') {
        setAssets(prev => prev.map(a => {
          if (a.id === targetAsset.id) {
            return {
              ...a,
              status: 'Available',
              history: [...a.history, { date: new Date().toISOString().split('T')[0], action: 'Maintenance Resolved', user: 'System', notes: 'Asset maintenance completed, status set to Available.' }]
            };
          }
          return a;
        }));
        addNotification(`Asset ${targetAsset.tag} is restored to Available`, 'success');
      }
    }

    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        const logEntry = {
          title: `Status set to ${nextStatus}` + (techName ? ` (Assigned to ${techName})` : ''),
          time: new Date().toLocaleTimeString(),
          done: true
        };
        return {
          ...t,
          status: nextStatus,
          assignee: techName || t.assignee,
          logs: [...t.logs, logEntry]
        };
      }
      return t;
    }));

    logAction(`Maintenance ticket ${ticketId} status updated to ${nextStatus}`);
  };

  const createAuditCycle = (title, scopeType, scopeValue, startDate, endDate, auditorsList) => {
    const newCycle = {
      id: Date.now(),
      title,
      scopeType,
      scopeValue,
      startDate,
      endDate,
      auditors: auditorsList,
      status: 'Active',
      assessments: {}
    };

    setAudits(prev => [newCycle, ...prev]);
    logAction(`Created new audit cycle: ${title}`);
    addNotification(`New audit cycle created: ${title}`, 'info');
  };

  const markAuditAsset = (auditId, assetTag, mark, notes = '') => {
    setAudits(prev => prev.map(a => {
      if (a.id === auditId) {
        return {
          ...a,
          assessments: {
            ...a.assessments,
            [assetTag]: { marked: mark, notes }
          }
        };
      }
      return a;
    }));
    logAction(`Auditor verified ${assetTag} as ${mark}`);
  };

  const closeAuditCycle = (auditId) => {
    const cycle = audits.find(a => a.id === auditId);
    if (!cycle) return;

    Object.keys(cycle.assessments).forEach(tag => {
      const assessment = cycle.assessments[tag];
      if (assessment.marked === 'Missing') {
        setAssets(prev => prev.map(asset => {
          if (asset.tag === tag) {
            return {
              ...asset,
              status: 'Lost',
              history: [...asset.history, { date: new Date().toISOString().split('T')[0], action: 'Audit Cycle Resolution', user: 'Audit System', notes: 'Status set to Lost following audit cycle confirmation.' }]
            };
          }
          return asset;
        }));
        addNotification(`Asset ${tag} confirmed missing in audit. Status set to Lost`, 'danger');
      } else if (assessment.marked === 'Damaged') {
        setAssets(prev => prev.map(asset => {
          if (asset.tag === tag) {
            return {
              ...asset,
              condition: 'Poor',
              history: [...asset.history, { date: new Date().toISOString().split('T')[0], action: 'Audit Cycle Resolution', user: 'Audit System', notes: 'Asset condition marked Damaged.' }]
            };
          }
          return asset;
        }));
      }
    });

    setAudits(prev => prev.map(a => {
      if (a.id === auditId) {
        return { ...a, status: 'Closed' };
      }
      return a;
    }));

    logAction(`Closed audit cycle: ${cycle.title}. Confirmed changes saved.`);
    addNotification(`Audit cycle ${cycle.title} has been closed`, 'success');
  };

  const clearNotifications = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      userRole,
      employees,
      departments,
      categories,
      assets,
      transfers,
      bookings,
      tickets,
      audits,
      notifications,
      activityLogs,
      logAction,
      addNotification,
      handleSignUp,
      handleLogin,
      handleLogout,
      promoteEmployee,
      updateEmployeeStatus,
      createDepartment,
      updateDepartment,
      createCategory,
      registerAsset,
      updateAsset,
      allocateAsset,
      returnAsset,
      requestTransfer,
      approveTransfer,
      rejectTransfer,
      bookResource,
      cancelBooking,
      raiseMaintenance,
      updateTicketStatus,
      createAuditCycle,
      markAuditAsset,
      closeAuditCycle,
      clearNotifications
    }}>
      {children}
    </AppContext.Provider>
  );
};
