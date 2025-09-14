import { Role, RepairStatus } from './types';

type Translation = {
  [key: string]: { en: string; zh: string };
};

export const translations: Translation = {
  // General
  'unassigned': { en: 'Unassigned', zh: '未分配' },
  'loading': { en: 'Loading...', zh: '加载中...' },
  'active': { en: 'Active', zh: '当前在访' },
  'na': { en: 'N/A', zh: '无' },
  'cancel': { en: 'Cancel', zh: '取消' },
  'saveChanges': { en: 'Save Changes', zh: '保存更改' },
  'submit': { en: 'Submit', zh: '提交' },
  'confirmDelete': { en: 'Are you sure you want to delete this {item}?', zh: '您确定要删除此{item}吗？' },
  'student': { en: 'student', zh: '学生' },
  'students': { en: 'students', zh: '学生' },
  'table.actions': { en: 'Actions', zh: '操作' },

  // Roles
  'role.administrator': { en: 'Administrator', zh: '管理员' },
  'role.dormManager': { en: 'Dorm Manager', zh: '宿管' },
  'role.student': { en: 'Student', zh: '学生' },

  // Repair Status
  'repairStatus.pending': { en: 'Pending', zh: '待处理' },
  'repairStatus.in_progress': { en: 'In Progress', zh: '处理中' },
  'repairStatus.completed': { en: 'Completed', zh: '已完成' },

  // Notifications
  'notifications.fetchError': { en: 'Failed to fetch {item}.', zh: '获取{item}失败。' },
  'notifications.addSuccess': { en: '{item} added successfully.', zh: '{item}添加成功。' },
  'notifications.updateSuccess': { en: '{item} updated successfully.', zh: '{item}更新成功。' },
  'notifications.deleteSuccess': { en: '{item} deleted successfully.', zh: '{item}删除成功。' },
  'notifications.actionError': { en: 'An error occurred. Please try again.', zh: '发生错误，请重试。' },

  // Login Page
  'login.title': { en: 'Dormitory Management System', zh: '学生宿舍管理系统' },
  'login.subtitle': { en: 'Please select a user role to log in', zh: '请选择一个用户角色登录' },
  'login.button': { en: 'Login as {name} ({role})', zh: '以 {name} ({role}) 身份登录' },
  
  // Header
  'header.welcome': { en: 'Welcome, {name}', zh: '欢迎, {name}' },
  'header.logout': { en: 'Logout', zh: '登出' },

  // Sidebar
  'sidebar.title': { en: 'DormSys', zh: '宿舍管理' },
  'sidebar.dashboard': { en: 'Dashboard', zh: '仪表盘' },
  'sidebar.myRepairs': { en: 'My Repairs', zh: '我的报修' },
  'sidebar.myHygieneScore': { en: 'My Hygiene Score', zh: '我的卫生评分' },
  'sidebar.studentInfo': { en: 'Student Info', zh: '学生信息' },
  'sidebar.repairRequests': { en: 'Repair Requests', zh: '报修请求' },
  'sidebar.hygieneChecks': { en: 'Hygiene Checks', zh: '卫生检查' },
  'sidebar.visitorLog': { en: 'Visitor Log', zh: '访客记录' },
  'sidebar.dormAllocation': { en: 'Dorm Allocation', zh: '宿舍分配' },
  'sidebar.registerVisitor': { en: 'Register Visitor', zh: '访客登记' },

  // Dashboard
  'dashboard.title': { en: 'Dashboard', zh: '仪表盘' },
  'dashboard.card.totalStudents': { en: 'Total Students', zh: '学生总数' },
  'dashboard.card.pendingRepairs': { en: 'Pending Repairs', zh: '待处理报修' },
  'dashboard.card.activeVisitors': { en: 'Active Visitors', zh: '当前访客' },
  'dashboard.card.roomsOccupied': { en: 'Rooms Occupied', zh: '已入住房间' },
  'dashboard.card.myRoom': { en: 'My Room', zh: '我的房间' },
  'dashboard.card.myPendingRepairs': { en: 'My Pending Repairs', zh: '我的待处理报修' },
  'dashboard.ai.title': { en: 'AI-Powered Daily Briefing', zh: 'AI 每日简报' },
  'dashboard.ai.button': { en: 'Generate Briefing', zh: '生成简报' },
  'dashboard.ai.button.loading': { en: 'Generating...', zh: '生成中...' },
  'dashboard.ai.placeholder': { en: 'Click "Generate Briefing" to get an AI-powered summary of today\'s activities.', zh: '点击“生成简报”以获取由 AI 提供的今日活动摘要。' },
  'dashboard.ai.error': { en: 'Failed to generate summary.', zh: '生成摘要失败。' },
  
  // Student Management
  'studentManagement.title': { en: 'Student Information', zh: '学生信息' },
  'studentManagement.addStudent': { en: 'Add Student', zh: '添加学生' },
  'studentManagement.editStudent': { en: 'Edit Student', zh: '编辑学生' },
  'studentManagement.table.name': { en: 'Name', zh: '姓名' },
  'studentManagement.table.studentId': { en: 'Student ID', zh: '学号' },
  'studentManagement.table.gender': { en: 'Gender', zh: '性别' },
  'studentManagement.table.class': { en: 'Class', zh: '班级' },
  'studentManagement.table.dormRoom': { en: 'Dorm & Room', zh: '宿舍与房间' },

  // Dorm Allocation
  'dormAllocation.title': { en: 'Dormitory Allocation', zh: '宿舍分配' },
  'dormAllocation.unassignedStudents': { en: 'Unassigned Students', zh: '未分配学生' },
  'dormAllocation.availableRooms': { en: 'Available Rooms', zh: '可用房间' },
  'dormAllocation.occupancy': { en: '{count} / {capacity} occupants', zh: '入住人数: {count} / {capacity}' },
  'dormAllocation.assign': { en: 'Assign', zh: '分配' },
  'dormAllocation.noUnassigned': { en: 'No unassigned students.', zh: '没有未分配的学生。' },
  'dormAllocation.noAvailable': { en: 'No available rooms.', zh: '没有可用的房间。' },
  'dormAllocation.selectStudentFirst': { en: 'Please select a student first.', zh: '请先选择一名学生。' },
  'dormAllocation.assignSuccess': { en: 'Student assigned successfully!', zh: '学生分配成功！' },

  // Repair Requests
  'repairRequests.title': { en: 'Repair Requests', zh: '报修请求' },
  'repairRequests.titleSingle': { en: 'Repair Request', zh: '报修请求' },
  'repairRequests.newRequest': { en: 'New Request', zh: '新建报修' },
  'repairRequests.submitRequest': { en: 'Submit Request', zh: '提交请求' },
  'repairRequests.noRoomError': { en: 'You must be assigned to a room to submit a repair request.', zh: '您必须先分配到房间才能提交报修请求。' },
  'repairRequests.table.status': { en: 'Status', zh: '状态' },
  'repairRequests.table.description': { en: 'Description', zh: '问题描述' },
  'repairRequests.table.room': { en: 'Room', zh: '房间' },
  'repairRequests.table.reportedBy': { en: 'Reported By', zh: '上报人' },
  'repairRequests.table.date': { en: 'Date', zh: '日期' },

  // Hygiene Check
  'hygieneCheck.title': { en: 'Hygiene Inspection', zh: '卫生检查' },
  'hygieneCheck.titleSingle': { en: 'Hygiene Check', zh: '卫生检查' },
  'hygieneCheck.logCheck': { en: 'Log New Check', zh: '记录新检查' },
  'hygieneCheck.submit': { en: 'Submit', zh: '提交' },
  'hygieneCheck.table.room': { en: 'Room', zh: '房间' },
  'hygieneCheck.table.score': { en: 'Score', zh: '分数' },
  'hygieneCheck.table.notes': { en: 'Notes', zh: '备注' },
  'hygieneCheck.table.date': { en: 'Date', zh: '日期' },

  // Visitor Log
  'visitorLog.title': { en: 'Visitor Log', zh: '访客记录' },
  'visitorLog.visitor': { en: 'Visitor', zh: '访客' },
  'visitorLog.registerVisitor': { en: 'Register Visitor', zh: '登记访客' },
  'visitorLog.submit': { en: 'Register', zh: '登记' },
  'visitorLog.selectStudent': { en: 'Select a student', zh: '选择一名学生' },
  'visitorLog.selectStudentError': { en: 'You must select a student to visit.', zh: '您必须选择一位被访学生。' },
  'visitorLog.checkOutButton': { en: 'Check Out', zh: '签出' },
  'visitorLog.checkOutSuccess': { en: 'Visitor checked out successfully.', zh: '访客签出成功。' },
  'visitorLog.table.visitorName': { en: 'Visitor Name', zh: '访客姓名' },
  'visitorLog.table.idNumber': { en: 'ID Number', zh: '身份证号' },
  'visitorLog.table.visitingStudent': { en: 'Visiting Student', zh: '被访学生' },
  'visitorLog.table.checkIn': { en: 'Check-in', zh: '签入时间' },
  'visitorLog.table.checkOut': { en: 'Check-out', zh: '签出时间' },

};

export type TranslationKey = keyof typeof translations;