
import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { MOCK_DORMS } from '../../services/mockApi';
import { ArrowRightOnRectangleIcon } from '../icons/Icons';
import { useLanguage } from '../../hooks/useLanguage';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { language, setLanguage, t, translateRole } = useLanguage();

  const getDormName = (dormId?: string) => {
    if (!dormId) return '';
    const dorm = MOCK_DORMS.find(d => d.id === dormId);
    return dorm ? `(${dorm.name})` : '';
  };

  const langButtonClass = "px-3 py-1 text-sm font-semibold rounded-md transition-colors duration-200";
  const activeLangClass = "bg-blue-600 text-white shadow";
  const inactiveLangClass = "bg-gray-200 text-gray-700 hover:bg-gray-300";


  return (
    <header className="flex items-center justify-between h-20 px-6 bg-white border-b border-gray-200">
      <div>
         <h1 className="text-2xl font-bold text-gray-800">{t('header.welcome', { name: user?.name || '' })}</h1>
         <p className="text-sm text-gray-500">{user ? translateRole(user.role) : ''} {getDormName(user?.dormId)}</p>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-1 p-1 bg-gray-100 rounded-lg">
            <button onClick={() => setLanguage('en')} className={`${langButtonClass} ${language === 'en' ? activeLangClass : inactiveLangClass}`}>EN</button>
            <button onClick={() => setLanguage('zh')} className={`${langButtonClass} ${language === 'zh' ? activeLangClass : inactiveLangClass}`}>中文</button>
        </div>
        <button 
          onClick={logout} 
          className="flex items-center px-4 py-2 text-sm font-medium text-red-600 bg-red-100 rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5 mr-2" />
          {t('header.logout')}
        </button>
      </div>
    </header>
  );
};

export default Header;
