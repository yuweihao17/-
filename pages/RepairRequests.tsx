import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { api, MOCK_STUDENTS, MOCK_ROOMS } from '../services/mockApi';
import { RepairRequest, RepairStatus, Role, Student } from '../types';
import { useLanguage } from '../hooks/useLanguage';
import { useNotifications } from '../hooks/useNotifications';
import Modal from '../components/shared/Modal';
import { PlusIcon } from '../components/icons/Icons';

const RepairRequests: React.FC = () => {
    const { user } = useAuth();
    const { t, translateRepairStatus } = useLanguage();
    const { addNotification } = useNotifications();
    const [repairs, setRepairs] = useState<RepairRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [description, setDescription] = useState('');

    const fetchData = useCallback(async () => {
        if (!user) return;
        setIsLoading(true);
        try {
            const data = await api.getRepairs(user);
            setRepairs(data.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()));
        } catch (error) {
            addNotification(t('notifications.fetchError', { item: t('repairRequests.title') }), 'error');
        } finally {
            setIsLoading(false);
        }
    }, [user, addNotification, t]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleStatusChange = async (repairId: string, newStatus: RepairStatus) => {
        try {
            await api.updateRepairStatus(repairId, newStatus);
            addNotification(t('notifications.updateSuccess', { item: t('repairRequests.table.status') }), 'success');
            fetchData();
        } catch (error) {
            addNotification(t('notifications.actionError'), 'error');
        }
    };

    const handleSubmitRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        const student = MOCK_STUDENTS.find(s => s.id === user?.studentId);
        if (!student || !student.roomId || !student.buildingId) {
            addNotification(t('repairRequests.noRoomError'), 'error');
            return;
        }
        try {
            await api.addRepairRequest({
                studentId: student.id,
                roomId: student.roomId,
                buildingId: student.buildingId,
                description,
            });
            addNotification(t('notifications.addSuccess', { item: t('repairRequests.titleSingle') }), 'success');
            fetchData();
            setIsModalOpen(false);
            setDescription('');
        } catch (error) {
            addNotification(t('notifications.actionError'), 'error');
        }
    };

    const getStudentName = (studentId: string) => MOCK_STUDENTS.find(s => s.id === studentId)?.name || t('na');
    const getRoomNumber = (roomId: string) => MOCK_ROOMS.find(r => r.id === roomId)?.number || t('na');

    const getStatusBadge = (status: RepairStatus) => {
        const baseClasses = 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full';
        switch (status) {
            case RepairStatus.PENDING: return `${baseClasses} bg-yellow-100 text-yellow-800`;
            case RepairStatus.IN_PROGRESS: return `${baseClasses} bg-blue-100 text-blue-800`;
            case RepairStatus.COMPLETED: return `${baseClasses} bg-green-100 text-green-800`;
            default: return `${baseClasses} bg-gray-100 text-gray-800`;
        }
    };

    return (
        <div className="container mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">{t('repairRequests.title')}</h1>
                {user?.role === Role.STUDENT && (
                    <button onClick={() => setIsModalOpen(true)} className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                        <PlusIcon className="w-5 h-5 mr-2" />
                        {t('repairRequests.newRequest')}
                    </button>
                )}
            </div>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('repairRequests.table.status')}</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('repairRequests.table.description')}</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('repairRequests.table.room')}</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('repairRequests.table.reportedBy')}</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('repairRequests.table.date')}</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {isLoading ? (
                                <tr><td colSpan={5} className="text-center py-4">{t('loading')}</td></tr>
                            ) : (
                                repairs.map((repair) => (
                                    <tr key={repair.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {user?.role === Role.ADMIN || user?.role === Role.MANAGER ? (
                                                <select
                                                    value={repair.status}
                                                    onChange={(e) => handleStatusChange(repair.id, e.target.value as RepairStatus)}
                                                    className={`w-full rounded-md border-gray-300 shadow-sm sm:text-sm ${getStatusBadge(repair.status).replace('px-2 inline-flex text-xs leading-5 font-semibold rounded-full', '')}`}
                                                >
                                                    {Object.values(RepairStatus).map(s => <option key={s} value={s}>{translateRepairStatus(s)}</option>)}
                                                </select>
                                            ) : (
                                                <span className={getStatusBadge(repair.status)}>{translateRepairStatus(repair.status)}</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-normal text-sm text-gray-900">{repair.description}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getRoomNumber(repair.roomId)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getStudentName(repair.studentId)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(repair.submittedAt).toLocaleDateString()}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={t('repairRequests.newRequest')}>
                <form onSubmit={handleSubmitRequest}>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">{t('repairRequests.table.description')}</label>
                        <textarea
                            id="description"
                            name="description"
                            rows={4}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        ></textarea>
                    </div>
                    <div className="mt-6 flex justify-end space-x-2">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">{t('cancel')}</button>
                        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700">{t('repairRequests.submitRequest')}</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default RepairRequests;