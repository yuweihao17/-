import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import { api, MOCK_ROOMS, MOCK_DORMS } from '../services/mockApi';
import { HygieneCheck, Role } from '../types';
import { useLanguage } from '../hooks/useLanguage';
import { useNotifications } from '../hooks/useNotifications';
import Modal from '../components/shared/Modal';
import { PlusIcon } from '../components/icons/Icons';

const HygieneCheckPage: React.FC = () => {
    const { user } = useAuth();
    const { t } = useLanguage();
    const { addNotification } = useNotifications();
    const [checks, setChecks] = useState<HygieneCheck[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState<{ roomId: string; score: number; notes: string }>({ roomId: '', score: 100, notes: '' });

    const managerRooms = useMemo(() => {
        if (user?.role === Role.ADMIN) return MOCK_ROOMS;
        if (user?.role === Role.MANAGER) return MOCK_ROOMS.filter(r => r.buildingId === user.dormId);
        return [];
    }, [user]);

    const fetchData = useCallback(async () => {
        if (!user) return;
        setIsLoading(true);
        try {
            const data = await api.getHygieneChecks(user);
            setChecks(data.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
        } catch (error) {
            addNotification(t('notifications.fetchError', { item: t('hygieneCheck.title') }), 'error');
        } finally {
            setIsLoading(false);
        }
    }, [user, addNotification, t]);
    
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleOpenModal = () => {
        setFormData({ roomId: managerRooms[0]?.id || '', score: 100, notes: '' });
        setIsModalOpen(true);
    };
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'score' ? parseInt(value) : value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const room = MOCK_ROOMS.find(r => r.id === formData.roomId);
        if (!room) return;
        
        try {
            await api.addHygieneCheck({ ...formData, buildingId: room.buildingId });
            addNotification(t('notifications.addSuccess', { item: t('hygieneCheck.titleSingle') }), 'success');
            fetchData();
            setIsModalOpen(false);
        } catch (error) {
            addNotification(t('notifications.actionError'), 'error');
        }
    };

    const getRoomInfo = (roomId: string) => {
        const room = MOCK_ROOMS.find(r => r.id === roomId);
        if (!room) return t('na');
        const dorm = MOCK_DORMS.find(d => d.id === room.buildingId);
        return `${dorm?.name || ''} - ${room.number}`;
    };

    const getScoreColor = (score: number) => {
        if (score >= 90) return 'text-green-600';
        if (score >= 70) return 'text-yellow-600';
        return 'text-red-600';
    };

    return (
        <div className="container mx-auto">
            <div className="flex justify-between items-center mb-6">
                 <h1 className="text-3xl font-bold text-gray-900">{t('hygieneCheck.title')}</h1>
                 {(user?.role === Role.ADMIN || user?.role === Role.MANAGER) && (
                     <button onClick={handleOpenModal} className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                         <PlusIcon className="w-5 h-5 mr-2" />
                         {t('hygieneCheck.logCheck')}
                     </button>
                 )}
            </div>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('hygieneCheck.table.room')}</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('hygieneCheck.table.score')}</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('hygieneCheck.table.notes')}</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('hygieneCheck.table.date')}</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {isLoading ? (
                                <tr><td colSpan={4} className="text-center py-4">{t('loading')}</td></tr>
                            ) : (
                                checks.map((check) => (
                                    <tr key={check.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{getRoomInfo(check.roomId)}</td>
                                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold ${getScoreColor(check.score)}`}>{check.score}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{check.notes}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(check.date).toLocaleDateString()}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={t('hygieneCheck.logCheck')}>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="roomId" className="block text-sm font-medium text-gray-700">{t('hygieneCheck.table.room')}</label>
                            <select name="roomId" id="roomId" value={formData.roomId} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" required>
                                {managerRooms.map(room => <option key={room.id} value={room.id}>{getRoomInfo(room.id)}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="score" className="block text-sm font-medium text-gray-700">{t('hygieneCheck.table.score')}</label>
                            <input type="number" name="score" id="score" min="0" max="100" value={formData.score} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" required />
                        </div>
                        <div>
                             <label htmlFor="notes" className="block text-sm font-medium text-gray-700">{t('hygieneCheck.table.notes')}</label>
                            <textarea name="notes" id="notes" rows={3} value={formData.notes} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" />
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end space-x-2">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">{t('cancel')}</button>
                        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700">{t('hygieneCheck.submit')}</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default HygieneCheckPage;