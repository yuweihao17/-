import { User, Role, Student, DormBuilding, Room, RepairRequest, RepairStatus, HygieneCheck, Visitor } from '../types';

export const MOCK_USERS: User[] = [
  { id: 'user-admin', name: 'Alice Smith', role: Role.ADMIN },
  { id: 'user-manager-a', name: 'Bob Johnson', role: Role.MANAGER, dormId: 'dorm-a' },
  { id: 'user-manager-b', name: 'Charlie Brown', role: Role.MANAGER, dormId: 'dorm-b' },
  { id: 'user-student-1', name: 'David Lee', role: Role.STUDENT, studentId: 'stu-1' },
  { id: 'user-student-5', name: 'Eve Williams', role: Role.STUDENT, studentId: 'stu-5' },
];

export const MOCK_DORMS: DormBuilding[] = [
    { id: 'dorm-a', name: 'Building A' },
    { id: 'dorm-b', name: 'Building B' },
];

export let MOCK_ROOMS: Room[] = [
    { id: 'room-a-101', number: '101', buildingId: 'dorm-a', capacity: 4, occupants: ['stu-1', 'stu-2'] },
    { id: 'room-a-102', number: '102', buildingId: 'dorm-a', capacity: 4, occupants: ['stu-3'] },
    { id: 'room-b-201', number: '201', buildingId: 'dorm-b', capacity: 2, occupants: ['stu-4', 'stu-5'] },
    { id: 'room-b-202', number: '202', buildingId: 'dorm-b', capacity: 2, occupants: [] },
];

export let MOCK_STUDENTS: Student[] = [
    { id: 'stu-1', name: 'David Lee', studentId: 'S001', gender: 'Male', class: 'CS 101', roomId: 'room-a-101', buildingId: 'dorm-a' },
    { id: 'stu-2', name: 'Frank Green', studentId: 'S002', gender: 'Male', class: 'CS 101', roomId: 'room-a-101', buildingId: 'dorm-a' },
    { id: 'stu-3', name: 'Grace Hall', studentId: 'S003', gender: 'Female', class: 'BIO 202', roomId: 'room-a-102', buildingId: 'dorm-a' },
    { id: 'stu-4', name: 'Heidi White', studentId: 'S004', gender: 'Female', class: 'ENG 301', roomId: 'room-b-201', buildingId: 'dorm-b' },
    { id: 'stu-5', name: 'Eve Williams', studentId: 'S005', gender: 'Female', class: 'ENG 301', roomId: 'room-b-201', buildingId: 'dorm-b' },
    { id: 'stu-6', name: 'Ivan Black', studentId: 'S006', gender: 'Male', class: 'MATH 150' },
];

export let MOCK_REPAIRS: RepairRequest[] = [
    { id: 'rep-1', studentId: 'stu-1', roomId: 'room-a-101', buildingId: 'dorm-a', description: 'Leaky faucet in the bathroom', status: RepairStatus.PENDING, submittedAt: new Date(Date.now() - 86400000).toISOString() },
    { id: 'rep-2', studentId: 'stu-5', roomId: 'room-b-201', buildingId: 'dorm-b', description: 'Desk lamp is not working', status: RepairStatus.IN_PROGRESS, submittedAt: new Date(Date.now() - 172800000).toISOString() },
    { id: 'rep-3', studentId: 'stu-3', roomId: 'room-a-102', buildingId: 'dorm-a', description: 'Window latch is broken', status: RepairStatus.COMPLETED, submittedAt: new Date(Date.now() - 259200000).toISOString() },
];

export let MOCK_HYGIENE: HygieneCheck[] = [
    { id: 'hyg-1', roomId: 'room-a-101', buildingId: 'dorm-a', score: 95, notes: 'Very clean and tidy.', date: new Date().toISOString() },
    { id: 'hyg-2', roomId: 'room-a-102', buildingId: 'dorm-a', score: 80, notes: 'Some clutter on the floor.', date: new Date().toISOString() },
    { id: 'hyg-3', roomId: 'room-b-201', buildingId: 'dorm-b', score: 90, notes: 'Good condition.', date: new Date().toISOString() },
];

export let MOCK_VISITORS: Visitor[] = [
    { id: 'vis-1', name: 'John Doe', idNumber: '123456789', studentToVisitId: 'stu-1', checkInTime: new Date(Date.now() - 3600000).toISOString(), checkOutTime: new Date(Date.now() - 1800000).toISOString() },
    { id: 'vis-2', name: 'Jane Roe', idNumber: '987654321', studentToVisitId: 'stu-5', checkInTime: new Date(Date.now() - 7200000).toISOString() },
];

// --- UTILS ---
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
const generateId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

// --- API FUNCTIONS ---
export const api = {
    // READ
    getStudents: async (user: User) => {
        await delay(300);
        if (user.role === Role.ADMIN) return [...MOCK_STUDENTS];
        if (user.role === Role.MANAGER) return MOCK_STUDENTS.filter(s => s.buildingId === user.dormId);
        return MOCK_STUDENTS.filter(s => s.id === user.studentId);
    },
    getRepairs: async (user: User) => {
        await delay(300);
        if (user.role === Role.ADMIN) return [...MOCK_REPAIRS];
        if (user.role === Role.MANAGER) return MOCK_REPAIRS.filter(r => r.buildingId === user.dormId);
        return MOCK_REPAIRS.filter(r => r.studentId === user.studentId);
    },
    getHygieneChecks: async (user: User) => {
        await delay(300);
        const student = MOCK_STUDENTS.find(s => s.id === user.studentId);
        if (user.role === Role.ADMIN) return [...MOCK_HYGIENE];
        if (user.role === Role.MANAGER) return MOCK_HYGIENE.filter(h => h.buildingId === user.dormId);
        return MOCK_HYGIENE.filter(h => h.roomId === student?.roomId);
    },
    getVisitors: async (user: User) => {
        await delay(300);
        if (user.role === Role.STUDENT) {
             return MOCK_VISITORS.filter(v => v.studentToVisitId === user.studentId);
        }
        if (user.role === Role.MANAGER) {
            const studentIdsInDorm = MOCK_STUDENTS.filter(s => s.buildingId === user.dormId).map(s => s.id);
            return MOCK_VISITORS.filter(v => studentIdsInDorm.includes(v.studentToVisitId));
        }
        return [...MOCK_VISITORS];
    },
    getDashboardStats: async (user: User) => {
        await delay(300);
        const repairs = await api.getRepairs(user);

        if (user.role === Role.STUDENT) {
            const student = MOCK_STUDENTS.find(s => s.id === user.studentId);
            const room = MOCK_ROOMS.find(r => r.id === student?.roomId);
            return {
                roomInfo: room ? `${MOCK_DORMS.find(d => d.id === room.buildingId)?.name} - ${room.number}` : 'N/A',
                pendingRepairs: repairs.filter(r => r.status === RepairStatus.PENDING).length,
                totalStudents: 0,
                activeVisitors: 0,
                roomsOccupied: 0,
            };
        }
        
        const students = await api.getStudents(user);
        const visitors = await api.getVisitors(user);
        return {
            totalStudents: students.length,
            pendingRepairs: repairs.filter(r => r.status === RepairStatus.PENDING).length,
            activeVisitors: visitors.filter(v => !v.checkOutTime).length,
            roomsOccupied: MOCK_ROOMS.filter(r => r.occupants.length > 0 && (user.role === Role.ADMIN || r.buildingId === user.dormId)).length,
        };
    },
    getUnassignedStudents: async () => {
        await delay(200);
        return MOCK_STUDENTS.filter(s => !s.roomId);
    },
    getAvailableRooms: async () => {
        await delay(200);
        return MOCK_ROOMS.filter(r => r.occupants.length < r.capacity);
    },

    // CREATE
    addStudent: async (studentData: Omit<Student, 'id'>) => {
        await delay(500);
        const newStudent: Student = { ...studentData, id: generateId('stu') };
        MOCK_STUDENTS.push(newStudent);
        return newStudent;
    },
    addRepairRequest: async (requestData: Omit<RepairRequest, 'id' | 'submittedAt' | 'status'>) => {
        await delay(500);
        const newRequest: RepairRequest = {
            ...requestData,
            id: generateId('rep'),
            submittedAt: new Date().toISOString(),
            status: RepairStatus.PENDING,
        };
        MOCK_REPAIRS.unshift(newRequest);
        return newRequest;
    },
    addHygieneCheck: async (checkData: Omit<HygieneCheck, 'id' | 'date'>) => {
        await delay(500);
        const newCheck: HygieneCheck = {
            ...checkData,
            id: generateId('hyg'),
            date: new Date().toISOString(),
        };
        MOCK_HYGIENE.unshift(newCheck);
        return newCheck;
    },
    addVisitor: async (visitorData: Omit<Visitor, 'id' | 'checkInTime'>) => {
        await delay(500);
        const newVisitor: Visitor = {
            ...visitorData,
            id: generateId('vis'),
            checkInTime: new Date().toISOString(),
        };
        MOCK_VISITORS.unshift(newVisitor);
        return newVisitor;
    },

    // UPDATE
    updateStudent: async (studentId: string, studentData: Partial<Student>) => {
        await delay(500);
        const studentIndex = MOCK_STUDENTS.findIndex(s => s.id === studentId);
        if (studentIndex === -1) throw new Error("Student not found");
        
        const originalStudent = MOCK_STUDENTS[studentIndex];

        // Handle room change logic
        if (studentData.roomId !== originalStudent.roomId) {
            // Remove from old room
            if(originalStudent.roomId) {
                const oldRoom = MOCK_ROOMS.find(r => r.id === originalStudent.roomId);
                if (oldRoom) {
                    oldRoom.occupants = oldRoom.occupants.filter(id => id !== studentId);
                }
            }
            // Add to new room
            if (studentData.roomId) {
                const newRoom = MOCK_ROOMS.find(r => r.id === studentData.roomId);
                if (newRoom) {
                    if (newRoom.occupants.length >= newRoom.capacity) {
                        throw new Error("New room is already full");
                    }
                    newRoom.occupants.push(studentId);
                    studentData.buildingId = newRoom.buildingId;
                }
            } else {
                 studentData.buildingId = undefined;
            }
        }

        MOCK_STUDENTS[studentIndex] = { ...originalStudent, ...studentData };
        return MOCK_STUDENTS[studentIndex];
    },
    updateRepairStatus: async (repairId: string, status: RepairStatus) => {
        await delay(400);
        const repair = MOCK_REPAIRS.find(r => r.id === repairId);
        if (!repair) throw new Error("Repair not found");
        repair.status = status;
        return repair;
    },
    checkOutVisitor: async (visitorId: string) => {
        await delay(400);
        const visitor = MOCK_VISITORS.find(v => v.id === visitorId);
        if (!visitor) throw new Error("Visitor not found");
        visitor.checkOutTime = new Date().toISOString();
        return visitor;
    },
    assignStudentToRoom: async (studentId: string, roomId: string) => {
        await delay(500);
        const student = MOCK_STUDENTS.find(s => s.id === studentId);
        const room = MOCK_ROOMS.find(r => r.id === roomId);

        if (!student) throw new Error("Student not found");
        if (!room) throw new Error("Room not found");
        if (student.roomId) throw new Error("Student already has a room");
        if (room.occupants.length >= room.capacity) throw new Error("Room is full");

        room.occupants.push(studentId);
        student.roomId = roomId;
        student.buildingId = room.buildingId;

        return { student, room };
    },

    // DELETE
    deleteStudent: async (studentId: string) => {
        await delay(500);
        const studentIndex = MOCK_STUDENTS.findIndex(s => s.id === studentId);
        if (studentIndex === -1) throw new Error("Student not found");

        const student = MOCK_STUDENTS[studentIndex];
        // Remove from room occupants
        if (student.roomId) {
            const room = MOCK_ROOMS.find(r => r.id === student.roomId);
            if (room) {
                room.occupants = room.occupants.filter(id => id !== studentId);
            }
        }

        MOCK_STUDENTS.splice(studentIndex, 1);
        return { success: true };
    },
};