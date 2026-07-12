import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

const API_BASE = 'http://localhost:8080';

export const AppContextProvider = ({ children }) => {
  // Session states
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('af_current_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [userRole, setUserRole] = useState(() => {
    const saved = localStorage.getItem('af_user_role');
    return saved ? JSON.parse(saved) : 'Employee';
  });
  const [token, setToken] = useState(() => {
    return localStorage.getItem('af_token') || '';
  });

  // Entity lists mapped to UI structures
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [assets, setAssets] = useState([]);
  const [transfers, setTransfers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [audits, setAudits] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);

  // Utility helper for fetching API data
  const apiFetch = async (endpoint, options = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `API Error: ${response.status}`);
    }
    if (response.status === 204) return null;
    return response.json();
  };

  // --- MAPPER FUNCTIONS (Backend DTO -> Frontend UI Models) ---

  const mapRole = (backendRole) => {
    if (!backendRole) return 'Employee';
    switch (backendRole.toUpperCase()) {
      case 'ADMIN': return 'Admin';
      case 'ASSET_MANAGER': return 'Asset Manager';
      case 'DEPARTMENT_HEAD': return 'Department Head';
      case 'EMPLOYEE':
      default:
        return 'Employee';
    }
  };

  const mapEmployee = (u) => ({
    id: u.id,
    name: u.fullName,
    email: u.email,
    dept: u.department ? u.department.name : 'Unassigned',
    role: mapRole(u.role),
    status: u.active ? 'Active' : 'Deactivated',
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(u.fullName)}&background=random`
  });

  const mapDepartment = (d) => ({
    id: d.id,
    name: d.name,
    description: d.description || '',
    parent: d.parentDepartmentName || '—',
    head: d.departmentHeadName || '—',
    status: d.status || 'Active'
  });

  const mapCategory = (c) => {
    // Preserve dynamic custom attributes locally since backend doesn't support them in basic fields
    const localAttrs = JSON.parse(localStorage.getItem(`af_cat_attrs_${c.name}`)) || [];
    const defaultAttrs = c.name === 'Laptops' || c.name === 'Electronics' 
      ? ['Warranty Period (months)', 'Manufacturer'] 
      : c.name === 'Networking' 
      ? ['IP Range', 'Ports Count']
      : ['Manufacturer', 'Voltage'];

    return {
      id: c.id,
      name: c.name,
      description: c.description || '',
      attributes: localAttrs.length > 0 ? localAttrs : defaultAttrs
    };
  };

  const mapAsset = (a) => {
    const localPhoto = localStorage.getItem(`af_asset_photo_${a.id}`) || '';
    const defaultPhoto = a.sharedBookable 
      ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuAZe3Gn-xoezTA8gB96I02-3KfaU7mqvt0zAx-dZgjRvccZg_QN-N9j2POwo8rI00BARnJu7Z_NNhQORtIZN2tOBWKrXm3rb-6wvGmjIeIUnOZzxRUcxmXaByrMLK2DsZx-JGG7sG0qkR7nXvxeQyAjwkX3wf1tHynK-z3PWSGPsSC6kT-JpLy9pwO7g0Xz3kWZL3Zh6DbNJr01L1iRTkwbKbXQ8MULnnt6w_lYgtD0m6FvscFAfCGsQ-7xiWk__kzRrXjChSf7Ot2M'
      : 'https://lh3.googleusercontent.com/aida-public/AB6AXu8zmtVPVnUvm1HAUUrW_muh3wkYv2eaaOr5tCutkFptfLiesStUrSkaIUFl1z7fhmYrZokQcfFd6XM3pMINdGOyED1fXx1JrRa82M7TyB7Kg7rORcUf62I6BSd0RzwTS33_Kozzg0EdTr5Fe8M5ej-m7VeUiTJcuB2HZ-yFWTfljErsKePU7Op9CgF3-S2AWXc6_OvWTtoWMULcgb8vwj5eexWYJlaTbS42qWg6-zg5Fo4-8wEWwcWMosRJcdh1Xpw39qVN8AHllqr';

    return {
      id: a.id,
      tag: a.assetTag,
      name: a.assetName,
      category: a.category ? a.category.name : '',
      serialNumber: a.serialNumber,
      acquisitionDate: a.purchaseDate || '',
      acquisitionCost: a.purchasePrice || 0,
      condition: a.condition === 'SCRAP' ? 'Poor' : a.condition === 'DAMAGED' ? 'Fair' : 'Excellent',
      location: a.location || 'San Francisco',
      photo: localPhoto || defaultPhoto,
      shared: a.sharedBookable || false,
      status: a.status === 'UNDER_MAINTENANCE' ? 'Under Maintenance' : a.status === 'AVAILABLE' ? 'Available' : a.status === 'ALLOCATED' ? 'Allocated' : a.status === 'RETIRED' ? 'Retired' : 'Lost',
      assignedTo: null, // Filled dynamically below
      expectedReturnDate: null, // Filled dynamically below
      categoryFields: {},
      history: []
    };
  };

  const mapBooking = (b) => ({
    id: b.id,
    resourceId: b.resource ? b.resource.name : 'Room A',
    type: b.resource ? b.resource.type : 'Venues',
    user: b.employee ? b.employee.fullName : 'Priya Patel',
    date: b.startTime ? b.startTime.split('T')[0] : '',
    startTime: b.startTime ? b.startTime.split('T')[1].substring(0, 5) : '09:00',
    endTime: b.endTime ? b.endTime.split('T')[1].substring(0, 5) : '10:00',
    status: b.status === 'CANCELLED' ? 'Cancelled' : 'Upcoming'
  });

  const mapTicket = (t) => ({
    id: t.id ? t.id.toString() : 'AF-001',
    title: t.asset ? `${t.asset.assetName} Malfunction` : t.issue,
    desc: t.description || t.issue,
    status: t.status === 'PENDING' ? 'Pending' : t.status === 'APPROVED' ? 'Approved' : t.status === 'ASSIGNED' ? 'Technician Assigned' : t.status === 'IN_PROGRESS' ? 'In Progress' : 'Resolved',
    priority: t.priority || 'Warning',
    assignee: t.assignedTo ? t.assignedTo.fullName : 'Unassigned',
    date: t.createdAt ? t.createdAt.split('T')[0] : '',
    assetName: t.asset ? t.asset.assetName : 'Unknown',
    assetLoc: t.asset ? t.asset.location : 'HQ',
    report: t.description || t.issue,
    photo: null,
    logs: [{ title: 'Maintenance request logged.', time: '12:00 PM', done: true }]
  });

  const mapTransfer = (tr) => ({
    id: tr.id,
    assetTag: tr.asset ? tr.asset.assetTag : 'AF-0001',
    assetName: tr.asset ? tr.asset.assetName : 'Asset',
    requester: tr.requestedBy ? tr.requestedBy.fullName : 'Raj Sharma',
    currentHolder: 'Priya Patel',
    targetDept: tr.toDepartment ? tr.toDepartment.name : 'Marketing',
    status: tr.status === 'PENDING' ? 'Pending' : tr.status === 'APPROVED' ? 'Approved' : 'Rejected',
    date: tr.createdAt ? tr.createdAt.split('T')[0] : ''
  });

  const mapAudit = (au) => ({
    id: au.id,
    title: au.name,
    scopeType: au.department ? 'Department' : 'Location',
    scopeValue: au.department ? au.department.name : (au.location || 'San Francisco'),
    startDate: au.startDate || '',
    endDate: au.endDate || '',
    auditors: [au.createdBy ? au.createdBy.fullName : 'System'],
    status: au.status === 'CLOSED' ? 'Closed' : 'Active',
    assessments: {}
  });

  const mapNotification = (n) => ({
    id: n.id,
    text: n.message || n.title,
    time: n.createdAt ? n.createdAt.split('T')[0] : 'Just now',
    unread: !n.read,
    type: n.title === 'OVERDUE' ? 'danger' : 'warning'
  });

  const mapLog = (l) => ({
    id: l.id,
    user: l.performedByName || 'System',
    action: l.action,
    timestamp: l.createdAt ? l.createdAt.replace('T', ' ').substring(0, 19) : ''
  });

  // --- LOADER (Fetch all items from DB) ---

  const loadAllData = async () => {
    if (!token) return;
    try {
      // 1. Employees
      const rawEmployees = await apiFetch('/api/employees');
      const mappedEmployees = rawEmployees.map(mapEmployee);
      setEmployees(mappedEmployees);

      // 2. Departments
      const rawDepts = await apiFetch('/api/departments');
      setDepartments(rawDepts.map(mapDepartment));

      // 3. Categories
      const rawCats = await apiFetch('/api/categories');
      setCategories(rawCats.map(mapCategory));

      // 4. Assets
      const rawAssets = await apiFetch('/api/assets');
      const mappedAssets = rawAssets.map(mapAsset);
      setAssets(mappedAssets);

      // 5. Transfer Requests
      const rawTransfers = await apiFetch('/api/transfers');
      setTransfers(rawTransfers.map(mapTransfer));

      // 6. Bookings
      const rawBookings = await apiFetch('/api/bookings');
      setBookings(rawBookings.map(mapBooking));

      // 7. Maintenance Tickets
      const rawTickets = await apiFetch('/api/maintenance');
      setTickets(rawTickets.map(mapTicket));

      // 8. Audits
      const rawAudits = await apiFetch('/api/audits');
      setAudits(rawAudits.map(mapAudit));

      // 9. Notifications
      const rawNotifications = await apiFetch('/api/notifications');
      setNotifications(rawNotifications.map(mapNotification));

      // 10. Activity Logs
      const rawLogs = await apiFetch('/api/activity-logs');
      setActivityLogs(rawLogs.map(mapLog));

    } catch (e) {
      console.error('Failed to load database values:', e);
    }
  };

  // Trigger loads on mount or token changes
  useEffect(() => {
    if (token) {
      loadAllData();
    }
  }, [token]);

  // --- SESSION ACTIONS ---

  const handleSignUp = async (name, email, password) => {
    try {
      // Look up engineering department ID as default signup department
      const depts = await apiFetch('/api/departments');
      const defaultDept = depts.find(d => d.name === 'Engineering') || depts[0];
      
      await apiFetch('/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({
          fullName: name,
          email,
          password,
          departmentId: defaultDept ? defaultDept.id : 1,
          role: 'EMPLOYEE'
        })
      });
      return { success: true };
    } catch (e) {
      return { success: false, message: e.message };
    }
  };

  const handleLogin = async (email, password) => {
    try {
      const response = await apiFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      
      const userObj = {
        id: response.user.id,
        name: response.user.fullName,
        email: response.user.email,
        dept: response.user.department ? response.user.department.name : 'HQ Operations'
      };

      const mappedRole = mapRole(response.user.role);

      setToken(response.token);
      setCurrentUser(userObj);
      setUserRole(mappedRole);

      localStorage.setItem('af_token', response.token);
      localStorage.setItem('af_current_user', JSON.stringify(userObj));
      localStorage.setItem('af_user_role', JSON.stringify(mappedRole));

      return { success: true, role: mappedRole };
    } catch (e) {
      return { success: false, message: e.message || 'Invalid credentials' };
    }
  };

  const handleLogout = async () => {
    try {
      if (token) {
        await apiFetch('/api/auth/logout', { method: 'POST' });
      }
    } catch(e) {}
    setToken('');
    setCurrentUser(null);
    setUserRole('Employee');
    localStorage.removeItem('af_token');
    localStorage.removeItem('af_current_user');
    localStorage.removeItem('af_user_role');
  };

  // --- CONTEXT MUTATIONS ---

  const promoteEmployee = async (id, nextRole) => {
    // Map UI role label to backend enum RoleType string
    let backendRole = 'EMPLOYEE';
    if (nextRole === 'Asset Manager') backendRole = 'ASSET_MANAGER';
    else if (nextRole === 'Department Head') backendRole = 'DEPARTMENT_HEAD';
    else if (nextRole === 'Admin') backendRole = 'ADMIN';

    try {
      await apiFetch(`/api/employees/${id}/promote`, {
        method: 'POST',
        body: JSON.stringify({ role: backendRole })
      });
      loadAllData();
    } catch (e) {
      alert(e.message);
    }
  };

  const updateEmployeeStatus = (id, status) => {
    // Informational fallback since backend user is toggled through promotion or state changes
    loadAllData();
  };

  const createDepartment = async (dept) => {
    try {
      await apiFetch('/api/departments', {
        method: 'POST',
        body: JSON.stringify({
          name: dept.name,
          description: dept.description || 'Enterprise Node Unit',
          status: 'Active'
        })
      });
      loadAllData();
    } catch (e) {
      alert(e.message);
    }
  };

  const updateDepartment = async (id, updatedFields) => {
    try {
      await apiFetch(`/api/departments/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
          name: updatedFields.name,
          description: updatedFields.description,
          status: updatedFields.status
        })
      });
      loadAllData();
    } catch (e) {
      alert(e.message);
    }
  };

  const createCategory = async (catName, attributes = []) => {
    try {
      await apiFetch('/api/categories', {
        method: 'POST',
        body: JSON.stringify({
          name: catName,
          description: `Custom Category: ${catName}`
        })
      });
      // Save attributes list inside localStorage to map fields on render
      localStorage.setItem(`af_cat_attrs_${catName}`, JSON.stringify(attributes));
      loadAllData();
      return true;
    } catch (e) {
      alert(e.message);
      return false;
    }
  };

  const registerAsset = async (assetData) => {
    try {
      // Find matching Category and Department IDs from lists
      const catObj = categories.find(c => c.name === assetData.category);
      const deptObj = departments.find(d => d.name === assetData.location) || departments[0];

      const raw = await apiFetch('/api/assets', {
        method: 'POST',
        body: JSON.stringify({
          assetTag: assetData.tag || `AF-${Math.floor(1000 + Math.random() * 9000)}`,
          assetName: assetData.name,
          serialNumber: assetData.serialNumber,
          description: assetData.description || '',
          purchaseDate: assetData.acquisitionDate || new Date().toISOString().split('T')[0],
          purchasePrice: assetData.acquisitionCost || 0,
          vendor: assetData.vendor || 'Direct Purchase',
          acquisitionCost: assetData.acquisitionCost || 0,
          sharedBookable: assetData.shared || false,
          location: assetData.location || 'San Francisco',
          status: 'AVAILABLE',
          condition: assetData.condition === 'Poor' ? 'SCRAP' : assetData.condition === 'Fair' ? 'DAMAGED' : 'GOOD',
          departmentId: deptObj ? deptObj.id : 1,
          categoryId: catObj ? catObj.id : 1
        })
      });

      if (assetData.photo) {
        localStorage.setItem(`af_asset_photo_${raw.id}`, assetData.photo);
      }

      loadAllData();
    } catch (e) {
      alert(e.message);
    }
  };

  const updateAsset = async (id, updatedFields) => {
    try {
      const assetObj = assets.find(a => a.id === id);
      const catObj = categories.find(c => c.name === updatedFields.category);
      const deptObj = departments.find(d => d.name === updatedFields.location) || departments[0];

      await apiFetch(`/api/assets/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
          assetTag: updatedFields.tag || assetObj.tag,
          assetName: updatedFields.name || assetObj.name,
          serialNumber: updatedFields.serialNumber || assetObj.serialNumber,
          description: updatedFields.description || assetObj.description,
          purchaseDate: updatedFields.acquisitionDate || assetObj.acquisitionDate,
          purchasePrice: updatedFields.acquisitionCost || assetObj.acquisitionCost,
          vendor: updatedFields.vendor || 'Direct Purchase',
          acquisitionCost: updatedFields.acquisitionCost || assetObj.acquisitionCost,
          sharedBookable: updatedFields.shared || assetObj.shared,
          location: updatedFields.location || assetObj.location,
          status: 'AVAILABLE',
          condition: updatedFields.condition === 'Poor' ? 'SCRAP' : updatedFields.condition === 'Fair' ? 'DAMAGED' : 'GOOD',
          departmentId: deptObj ? deptObj.id : 1,
          categoryId: catObj ? catObj.id : 1
        })
      });

      loadAllData();
    } catch (e) {
      alert(e.message);
    }
  };

  const allocateAsset = async (assetId, assigneeName, expectedReturnDate = null) => {
    try {
      // Find matching employee by name to retrieve their ID
      const empObj = employees.find(e => e.name === assigneeName);
      if (!empObj) {
        return { success: false, message: `Employee '${assigneeName}' not found.` };
      }

      await apiFetch('/api/allocations', {
        method: 'POST',
        body: JSON.stringify({
          assetId,
          employeeId: empObj.id,
          expectedReturnDate: expectedReturnDate ? `${expectedReturnDate}T00:00:00` : null,
          remarks: 'Direct allocation'
        })
      });
      loadAllData();
      return { success: true };
    } catch (e) {
      return { success: false, message: e.message };
    }
  };

  const returnAsset = async (assetId, returnNotes, condition = 'Good') => {
    try {
      // Find active allocation for asset by fetching detail history
      const assetDetail = await apiFetch(`/api/assets/${assetId}`);
      const activeAlloc = assetDetail.allocations.find(a => !a.returnedDate);

      let backendCond = 'GOOD';
      if (condition === 'Poor') backendCond = 'SCRAP';
      else if (condition === 'Fair') backendCond = 'DAMAGED';

      if (activeAlloc) {
        await apiFetch(`/api/allocations/${activeAlloc.id}/return`, {
          method: 'POST',
          body: JSON.stringify({
            condition: backendCond,
            remarks: returnNotes
          })
        });
        loadAllData();
      } else {
        alert('Active allocation session not found in DB history.');
      }
    } catch (e) {
      alert(e.message);
    }
  };

  const requestTransfer = async (assetTag, targetDept) => {
    try {
      const assetObj = assets.find(a => a.tag === assetTag);
      const deptObj = departments.find(d => d.name === targetDept);

      if (!assetObj || !deptObj) {
        alert('Invalid Asset or target department');
        return;
      }

      await apiFetch('/api/transfers', {
        method: 'POST',
        body: JSON.stringify({
          assetId: assetObj.id,
          toDepartmentId: deptObj.id,
          remarks: 'Requested asset transfer'
        })
      });
      loadAllData();
    } catch (e) {
      alert(e.message);
    }
  };

  const approveTransfer = async (transferId) => {
    try {
      await apiFetch(`/api/transfers/${transferId}/approve`, { method: 'PUT' });
      loadAllData();
    } catch (e) {
      alert(e.message);
    }
  };

  const rejectTransfer = async (transferId) => {
    try {
      await apiFetch(`/api/transfers/${transferId}/reject`, { method: 'PUT' });
      loadAllData();
    } catch (e) {
      alert(e.message);
    }
  };

  const bookResource = async (resourceName, type, date, startTime, endTime) => {
    try {
      // Convert resourceName to matching Resource ID from list
      const rawResources = await apiFetch('/api/resources');
      const resObj = rawResources.find(r => r.name === resourceName);
      if (!resObj) {
        return { success: false, message: 'Bookable resource not found.' };
      }

      // Convert times into LocalDateTime formats
      const startIso = `${date}T${startTime}:00`;
      const endIso = `${date}T${endTime}:00`;

      await apiFetch('/api/bookings', {
        method: 'POST',
        body: JSON.stringify({
          resourceId: resObj.id,
          startTime: startIso,
          endTime: endIso,
          purpose: 'Corporate meeting'
        })
      });
      loadAllData();
      return { success: true };
    } catch (e) {
      return { success: false, message: e.message };
    }
  };

  const cancelBooking = async (bookingId) => {
    try {
      await apiFetch(`/api/bookings/${bookingId}`, { method: 'DELETE' });
      loadAllData();
    } catch (e) {
      alert(e.message);
    }
  };

  const raiseMaintenance = async (assetId, issue, priority, photo = null) => {
    try {
      await apiFetch('/api/maintenance', {
        method: 'POST',
        body: JSON.stringify({
          assetId,
          issue,
          description: issue,
          priority
        })
      });
      loadAllData();
    } catch (e) {
      alert(e.message);
    }
  };

  const updateTicketStatus = async (ticketId, nextStatus, techName = null) => {
    try {
      const ticketIdNum = parseInt(ticketId, 10);
      if (nextStatus === 'Approved') {
        await apiFetch(`/api/maintenance/${ticketIdNum}/approve`, { method: 'PUT' });
      } else if (nextStatus === 'Rejected') {
        await apiFetch(`/api/maintenance/${ticketIdNum}/reject`, { method: 'PUT' });
      } else if (nextStatus === 'Technician Assigned') {
        // Look up employee ID of techName
        const techObj = employees.find(e => e.name === techName);
        if (techObj) {
          await apiFetch(`/api/maintenance/${ticketIdNum}/assign`, {
            method: 'PUT',
            body: JSON.stringify({ assignedToId: techObj.id })
          });
        }
      } else if (nextStatus === 'In Progress') {
        await apiFetch(`/api/maintenance/${ticketIdNum}/start`, { method: 'PUT' });
      } else if (nextStatus === 'Resolved') {
        await apiFetch(`/api/maintenance/${ticketIdNum}/resolve`, { method: 'PUT' });
      }
      loadAllData();
    } catch (e) {
      alert(e.message);
    }
  };

  const createAuditCycle = async (title, scopeType, scopeValue, startDate, endDate, auditorsList) => {
    try {
      let deptId = null;
      let locValue = null;
      if (scopeType === 'Department') {
        const deptObj = departments.find(d => d.name === scopeValue);
        deptId = deptObj ? deptObj.id : null;
      } else {
        locValue = scopeValue;
      }

      await apiFetch('/api/audits', {
        method: 'POST',
        body: JSON.stringify({
          name: title,
          startDate: startDate || new Date().toISOString().split('T')[0],
          endDate: endDate || null,
          location: locValue,
          departmentId: deptId
        })
      });
      loadAllData();
    } catch (e) {
      alert(e.message);
    }
  };

  const markAuditAsset = async (auditId, assetTag, mark, notes = '') => {
    try {
      const assetObj = assets.find(a => a.tag === assetTag);
      if (!assetObj) return;

      let backendStatus = 'VERIFIED';
      if (mark === 'Missing') backendStatus = 'MISSING';
      else if (mark === 'Damaged') backendStatus = 'DAMAGED';

      await apiFetch(`/api/audits/${auditId}/items`, {
        method: 'POST',
        body: JSON.stringify({
          assetId: assetObj.id,
          status: backendStatus,
          remarks: notes
        })
      });
      loadAllData();
    } catch (e) {
      alert(e.message);
    }
  };

  const closeAuditCycle = async (auditId) => {
    try {
      await apiFetch(`/api/audits/${auditId}/close`, { method: 'POST' });
      loadAllData();
    } catch (e) {
      alert(e.message);
    }
  };

  const clearNotifications = async () => {
    try {
      await apiFetch('/api/notifications/read-all', { method: 'PUT' });
      loadAllData();
    } catch (e) {
      alert(e.message);
    }
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
      logAction: () => {}, // Handled by DB trigger
      addNotification: () => {}, // Handled by DB trigger
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
