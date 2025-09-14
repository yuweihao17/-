import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import { api, MOCK_ROOMS, MOCK_DORMS } from '../services/mockApi';
import { Student, Role, Room } from '../types';
import { useLanguage } from '../hooks/useLanguage';
import { useNotifications } from '../hooks/useNotifications';
import Modal from '../components/shared/Modal';
import { PlusIcon, PencilIcon, TrashIcon } from '../components/icons/Icons';

const StudentManagement: React.FC = () => {
    const { user } = useAuth();
    const { t } = useLanguage();
    const { addNotification } = useNotifications();
    const [students, setStudents] = useState<Student[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStudent, setEditingStudent] = useState<Student | null>(null);
    const [formData, setFormData] = useState<Partial<Student>>({});
    
    const availableRooms = useMemo(() => MOCK_ROOMS.filter(r => r.occupants.length < r.capacity), []);

    const fetchData = useCallback(async () => {
        if (!user) return;
        setIsLoading(true);
        try {
            const data = await api.getStudents(user);
            setStudents(data);
        } catch (error) {
            addNotification(t('notifications.fetchError', { item: t('students') }), 'error');
        } finally {
            setIsLoading(false);
        }
    }, [user, addNotification, t]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleOpenModal = (student: Student | null = null) => {
        setEditingStudent(student);
        setFormData(student ? { ...student } : { gender: 'Male' });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingStudent(null);
        setFormData({});
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingStudent) {
                await api.updateStudent(editingStudent.id, formData);
                addNotification(t('notifications.updateSuccess', { item: t('student') }), 'success');
            } else {
                await api.addStudent(formData as Omit<Student, 'id'>);
                addNotification(t('notifications.addSuccess', { item: t('student') }), 'success');
            }
            fetchData();
            handleCloseModal();
        } catch (error) {
            addNotification(error instanceof Error ? error.message : t('notifications.actionError'), 'error');
        }
    };
    
    const handleDelete = async (studentId: string) => {
        if (window.confirm(t('confirmDelete', { item: t('student') }))) {
            try {
                await api.deleteStudent(studentId);
                addNotification(t('notifications.deleteSuccess', { item: t('student') }), 'success');
                fetchData();
            } catch (error) {
                addNotification(t('notifications.actionError'), 'error');
            }
        }
    };

    const getRoomInfo = (roomId?: string) => {
        if (!roomId) return t('unassigned');
        const room = MOCK_ROOMS.find(r => r.id === roomId);
        if (!room) return t('na');
        const dorm = MOCK_DORMS.find(d => d.id === room.buildingId);
        return `${dorm?.name || ''} - ${room.number}`;
    };

    return (
        <div className="container mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">{t('studentManagement.title')}</h1>
                {user?.role === Role.ADMIN && (
                    <button onClick={() => handleOpenModal()} className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none">
                        <PlusIcon className="w-5 h-5 mr-2" />
                        {t('studentManagement.addStudent')}
                    </button>
                )}
            </div>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('studentManagement.table.name')}</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('studentManagement.table.studentId')}</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('studentManagement.table.gender')}</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('studentManagement.table.class')}</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('studentManagement.table.dormRoom')}</th>
                                {user?.role === Role.ADMIN && <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('table.actions')}</th>}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {isLoading ? (
                                <tr><td colSpan={user?.role === Role.ADMIN ? 6 : 5} className="text-center py-4">{t('loading')}</td></tr>
                            ) : (
                                students.map((student) => (
                                    <tr key={student.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.studentId}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.gender}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.class}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getRoomInfo(student.roomId)}</td>
                                        {user?.role === Role.ADMIN && (
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                                <button onClick={() => handleOpenModal(student)} className="text-indigo-600 hover:text-indigo-900"><PencilIcon className="w-5 h-5"/></button>
                                                <button onClick={() => handleDelete(student.id)} className="text-red-600 hover:text-red-900"><TrashIcon className="w-5 h-5"/></button>
                                            </td>
                                        )}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingStudent ? t('studentManagement.editStudent') : t('studentManagement.addStudent')}>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">{t('studentManagement.table.name')}</label>
                            <input type="text" name="name" id="name" value={formData.name || ''} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required />
                        </div>
                        <div>
                            <label htmlFor="studentId" className="block text-sm font-medium text-gray-700">{t('studentManagement.table.studentId')}</label>
                            <input type="text" name="studentId" id="studentId" value={formData.studentId || ''} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required />
                        </div>
                        <div>
                            <label htmlFor="gender" className="block text-sm font-medium text-gray-700">{t('studentManagement.table.gender')}</label>
                            <select name="gender" id="gender" value={formData.gender || ''} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="class" className="block text-sm font-medium text-gray-700">{t('studentManagement.table.class')}</label>
                            <input type="text" name="class" id="class" value={formData.class || ''} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                        </div>
                        <div className="sm:col-span-2">
                             <label htmlFor="roomId" className="block text-sm font-medium text-gray-700">{t('studentManagement.table.dormRoom')}</label>
                             <select name="roomId" id="roomId" value={formData.roomId || ''} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                                 <option value="">{t('unassigned')}</option>
                                 {availableRooms.map(room => <option key={room.id} value={room.id}>{getRoomInfo(room.id)}</option>)}
                                 {editingStudent?.roomId && !availableRooms.some(r => r.id === editingStudent.roomId) && <option value={editingStudent.roomId}>{getRoomInfo(editingStudent.roomId)}</option>}
                             </select>
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end space-x-2">
                        <button type="button" onClick={handleCloseModal} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">{t('cancel')}</button>
                        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700">{editingStudent ? t('saveChanges') : t('addStudent')}</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default StudentManagement;