import React, { useState, useEffect, useCallback } from 'react';
import { api, MOCK_DORMS, MOCK_STUDENTS } from '../services/mockApi';
import { Student, Room, RoomWithDetails } from '../types';
import { useLanguage } from '../hooks/useLanguage';
import { useNotifications } from '../hooks/useNotifications';
import { ArrowRightIcon } from '../components/icons/Icons';

const DormAllocation: React.FC = () => {
    const { t } = useLanguage();
    const { addNotification } = useNotifications();
    const [unassignedStudents, setUnassignedStudents] = useState<Student[]>([]);
    const [availableRooms, setAvailableRooms] = useState<RoomWithDetails[]>([]);
    const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [students, rooms] = await Promise.all([
                api.getUnassignedStudents(),
                api.getAvailableRooms() as Promise<Room[]>
            ]);

            const roomsWithDetails: RoomWithDetails[] = rooms.map(room => ({
                ...room,
                buildingName: MOCK_DORMS.find(d => d.id === room.buildingId)?.name || 'N/A',
                occupantNames: room.occupants.map(id => MOCK_STUDENTS.find(s => s.id === id)?.name || 'Unknown'),
            }));
            
            setUnassignedStudents(students);
            setAvailableRooms(roomsWithDetails);
        } catch (error) {
            addNotification(t('notifications.fetchError', { item: 'allocation data' }), 'error');
        } finally {
            setIsLoading(false);
        }
    }, [addNotification, t]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);
    
    const handleAssign = async (roomId: string) => {
        if (!selectedStudent) {
            addNotification(t('dormAllocation.selectStudentFirst'), 'error');
            return;
        }
        try {
            await api.assignStudentToRoom(selectedStudent, roomId);
            addNotification(t('dormAllocation.assignSuccess'), 'success');
            setSelectedStudent(null);
            fetchData();
        } catch (error) {
            addNotification(error instanceof Error ? error.message : t('notifications.actionError'), 'error');
        }
    };

    if (isLoading) {
        return <div className="text-center">{t('loading')}</div>;
    }

    return (
        <div className="container mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">{t('dormAllocation.title')}</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Unassigned Students Column */}
                <div>
                    <h2 className="text-xl font-semibold mb-4">{t('dormAllocation.unassignedStudents')} ({unassignedStudents.length})</h2>
                    <div className="bg-white shadow-md rounded-lg p-4 space-y-2 max-h-[60vh] overflow-y-auto">
                        {unassignedStudents.length > 0 ? unassignedStudents.map(student => (
                            <div
                                key={student.id}
                                onClick={() => setSelectedStudent(student.id)}
                                className={`p-3 rounded-md cursor-pointer transition-colors ${selectedStudent === student.id ? 'bg-blue-200 ring-2 ring-blue-500' : 'bg-gray-50 hover:bg-gray-100'}`}
                            >
                                <p className="font-semibold">{student.name} <span className="text-sm text-gray-500">({student.studentId})</span></p>
                                <p className="text-sm text-gray-600">{student.class} - {student.gender}</p>
                            </div>
                        )) : <p className="text-gray-500 text-center py-4">{t('dormAllocation.noUnassigned')}</p>}
                    </div>
                </div>

                {/* Available Rooms Column */}
                <div>
                    <h2 className="text-xl font-semibold mb-4">{t('dormAllocation.availableRooms')} ({availableRooms.length})</h2>
                    <div className="bg-white shadow-md rounded-lg p-4 space-y-2 max-h-[60vh] overflow-y-auto">
                        {availableRooms.length > 0 ? availableRooms.map(room => (
                            <div key={room.id} className="p-3 bg-gray-50 rounded-md">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold">{room.buildingName} - {room.number}</p>
                                        <p className="text-sm text-gray-600">{t('dormAllocation.occupancy', { count: room.occupants.length, capacity: room.capacity })}</p>
                                    </div>
                                    <button
                                        onClick={() => handleAssign(room.id)}
                                        disabled={!selectedStudent}
                                        className="flex items-center px-3 py-1 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                    >
                                        {t('dormAllocation.assign')} <ArrowRightIcon className="w-4 h-4 ml-1" />
                                    </button>
                                </div>
                            </div>
                        )) : <p className="text-gray-500 text-center py-4">{t('dormAllocation.noAvailable')}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DormAllocation;