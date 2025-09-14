import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import { api, MOCK_STUDENTS } from '../services/mockApi';
import { Visitor, Role, Student } from '../types';
import { useLanguage } from '../hooks/useLanguage';
import { useNotifications } from '../hooks/useNotifications';
import Modal from '../components/shared/Modal';
import { PlusIcon } from '../components/icons/Icons';

const VisitorLog: React.FC = () => {
    const { user } = useAuth();
    const { t } = useLanguage();
    const { addNotification } = useNotifications();
    const [visitors, setVisitors] = useState<Visitor[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', idNumber: '', studentToVisitId: '' });

    const studentsForSelection = useMemo(() => {
        if (user?.role === Role.ADMIN) return MOCK_STUDENTS;
        if (user?.role === Role.MANAGER) return MOCK_STUDENTS.filter(s => s.buildingId === user.dormId);
        return [];
    }, [user]);

    const fetchData = useCallback(async () => {
        if (!user) return;
        setIsLoading(true);
        try {
            const data = await api.getVisitors(user);
            setVisitors(data.sort((a,b) => new Date(b.checkInTime).getTime() - new Date(a.checkInTime).getTime()));
        } catch (error) {
            addNotification(t('notifications.fetchError', { item: t('visitorLog.title') }), 'error');
        } finally {
            setIsLoading(false);
        }
    }, [user, addNotification, t]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleOpenModal = () => {
        const defaultStudent = user?.role === Role.STUDENT ? user.studentId : studentsForSelection[0]?.id;
        setFormData({ name: '', idNumber: '', studentToVisitId: defaultStudent || '' });
        setIsModalOpen(true);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.studentToVisitId) {
            addNotification(t('visitorLog.selectStudentError'), 'error');
            return;
        }
        try {
            await api.addVisitor(formData);
            addNotification(t('notifications.addSuccess', { item: t('visitorLog.visitor') }), 'success');
            fetchData();
            setIsModalOpen(false);
        } catch (error) {
            addNotification(t('notifications.actionError'), 'error');
        }
    };
    
    const handleCheckOut = async (visitorId: string) => {
        try {
            await api.checkOutVisitor(visitorId);
            addNotification(t('visitorLog.checkOutSuccess'), 'success');
            fetchData();
        } catch (error) {
            addNotification(t('notifications.actionError'), 'error');
        }
    };
    
    const getStudentName = (studentId: string) => MOCK_STUDENTS.find(s => s.id === studentId)?.name || t('na');

    return (
        <div className="container mx-auto">
            <div className="flex justify-between items-center mb-6">
                 <h1 className="text-3xl font-bold text-gray-900">{t('visitorLog.title')}</h1>
                 <button onClick={handleOpenModal} className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                     <PlusIcon className="w-5 h-5 mr-2" />
                     {t('visitorLog.registerVisitor')}
                 </button>
            </div>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('visitorLog.table.visitorName')}</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('visitorLog.table.idNumber')}</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('visitorLog.table.visitingStudent')}</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('visitorLog.table.checkIn')}</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('visitorLog.table.checkOut')}</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {isLoading ? (
                                <tr><td colSpan={5} className="text-center py-4">{t('loading')}</td></tr>
                            ) : (
                                visitors.map((visitor) => (
                                    <tr key={visitor.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{visitor.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{visitor.idNumber}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getStudentName(visitor.studentToVisitId)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(visitor.checkInTime).toLocaleString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {visitor.checkOutTime ? new Date(visitor.checkOutTime).toLocaleString() : (
                                                (user?.role === Role.ADMIN || user?.role === Role.MANAGER) ? (
                                                     <button onClick={() => handleCheckOut(visitor.id)} className="px-2 py-1 text-xs font-medium text-white bg-green-600 rounded-md hover:bg-green-700">{t('visitorLog.checkOutButton')}</button>
                                                ) : <span className="text-green-600 font-semibold">{t('active')}</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={t('visitorLog.registerVisitor')}>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">{t('visitorLog.table.visitorName')}</label>
                            <input type="text" name="name" id="name" value={formData.name} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" required />
                        </div>
                        <div>
                            <label htmlFor="idNumber" className="block text-sm font-medium text-gray-700">{t('visitorLog.table.idNumber')}</label>
                            <input type="text" name="idNumber" id="idNumber" value={formData.idNumber} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" required />
                        </div>
                        <div>
                             <label htmlFor="studentToVisitId" className="block text-sm font-medium text-gray-700">{t('visitorLog.table.visitingStudent')}</label>
                             <select name="studentToVisitId" id="studentToVisitId" value={formData.studentToVisitId} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" required disabled={user?.role === Role.STUDENT}>
                                 {user?.role !== Role.STUDENT && <option value="">{t('visitorLog.selectStudent')}</option>}
                                 {user?.role === Role.STUDENT ? (
                                    <option value={user.studentId}>{user.name}</option>
                                 ) : (
                                    studentsForSelection.map(s => <option key={s.id} value={s.id}>{s.name} ({s.studentId})</option>)
                                 )}
                             </select>
                        </div>
                    </div>
                     <div className="mt-6 flex justify-end space-x-2">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">{t('cancel')}</button>
                        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700">{t('visitorLog.submit')}</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default VisitorLog;