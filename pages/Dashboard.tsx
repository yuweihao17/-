import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { api } from '../services/mockApi';
import { generateDashboardSummary } from '../services/geminiService';
import { Role, RepairRequest, HygieneCheck, Visitor } from '../types';
import { UsersIcon, WrenchScrewdriverIcon, IdentificationIcon, BuildingOfficeIcon, SparklesIcon, HomeModernIcon } from '../components/icons/Icons';
import { useLanguage } from '../hooks/useLanguage';

interface Stats {
    totalStudents?: number;
    pendingRepairs?: number;
    activeVisitors?: number;
    roomsOccupied?: number;
    roomInfo?: string;
}

const DashboardCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 flex items-center space-x-4">
        <div className="bg-blue-100 p-3 rounded-full">
            {icon}
        </div>
        <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
    </div>
);

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { language, t } = useLanguage();
  const [stats, setStats] = useState<Stats>({});
  const [summary, setSummary] = useState('');
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [loadingStats, setLoadingStats] = useState(true);

  const fetchDashboardData = useCallback(async () => {
      if (!user) return;
      setLoadingStats(true);
      try {
          const fetchedStats = await api.getDashboardStats(user);
          setStats(fetchedStats);
      } catch (error) {
          console.error("Failed to fetch dashboard stats", error);
      } finally {
          setLoadingStats(false);
      }
  }, [user]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleGenerateSummary = async () => {
    if (!user) return;
    setLoadingSummary(true);
    try {
        const [repairs, hygiene, visitors] = await Promise.all([
            api.getRepairs(user) as Promise<RepairRequest[]>,
            api.getHygieneChecks(user) as Promise<HygieneCheck[]>,
            api.getVisitors(user) as Promise<Visitor[]>
        ]);
        const generatedSummary = await generateDashboardSummary(repairs, hygiene, visitors, language);
        setSummary(generatedSummary);
    } catch (error) {
        setSummary(t('dashboard.ai.error'));
    } finally {
        setLoadingSummary(false);
    }
  };
  
  const renderAdminManagerCards = () => (
    <>
        <DashboardCard title={t('dashboard.card.totalStudents')} value={stats.totalStudents ?? 0} icon={<UsersIcon className="w-6 h-6 text-blue-600" />} />
        <DashboardCard title={t('dashboard.card.pendingRepairs')} value={stats.pendingRepairs ?? 0} icon={<WrenchScrewdriverIcon className="w-6 h-6 text-orange-600" />} />
        <DashboardCard title={t('dashboard.card.activeVisitors')} value={stats.activeVisitors ?? 0} icon={<IdentificationIcon className="w-6 h-6 text-green-600" />} />
        <DashboardCard title={t('dashboard.card.roomsOccupied')} value={stats.roomsOccupied ?? 0} icon={<BuildingOfficeIcon className="w-6 h-6 text-indigo-600" />} />
    </>
  );

  const renderStudentCards = () => (
    <>
        <DashboardCard title={t('dashboard.card.myRoom')} value={stats.roomInfo ?? t('unassigned')} icon={<HomeModernIcon className="w-6 h-6 text-blue-600" />} />
        <DashboardCard title={t('dashboard.card.myPendingRepairs')} value={stats.pendingRepairs ?? 0} icon={<WrenchScrewdriverIcon className="w-6 h-6 text-orange-600" />} />
    </>
  );


  return (
    <div className="space-y-8">
        <h1 className="text-3xl font-bold text-gray-900">{t('dashboard.title')}</h1>

        <div className={`grid grid-cols-1 gap-6 sm:grid-cols-2 ${user?.role === Role.STUDENT ? 'lg:grid-cols-2' : 'lg:grid-cols-4'}`}>
            {loadingStats ? (
                Array.from({ length: user?.role === Role.STUDENT ? 2 : 4 }).map((_, index) => (
                    <div key={index} className="bg-white p-6 rounded-xl shadow-md animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-10 bg-gray-200 rounded w-1/2"></div>
                    </div>
                ))
            ) : (
                user?.role === Role.STUDENT ? renderStudentCards() : renderAdminManagerCards()
            )}
        </div>

        {user?.role !== Role.STUDENT && (
            <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">{t('dashboard.ai.title')}</h2>
                    <button
                        onClick={handleGenerateSummary}
                        disabled={loadingSummary}
                        className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                        <SparklesIcon className="w-5 h-5 mr-2" />
                        {loadingSummary ? t('dashboard.ai.button.loading') : t('dashboard.ai.button')}
                    </button>
                </div>
                {loadingSummary ? (
                    <div className="space-y-2 animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                ) : (
                    <p className="text-gray-600 whitespace-pre-wrap">{summary || t('dashboard.ai.placeholder')}</p>
                )}
            </div>
        )}
    </div>
  );
};

export default Dashboard;