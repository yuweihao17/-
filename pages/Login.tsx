
import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../hooks/useLanguage';
import { MOCK_USERS } from '../services/mockApi';
import { AcademicCapIcon } from '../components/icons/Icons';

const Login: React.FC = () => {
  const { login } = useAuth();
  const { t, translateRole } = useLanguage();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-2xl">
        <div className="text-center">
            <div className="flex justify-center mb-4">
                <AcademicCapIcon className="w-16 h-16 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">{t('login.title')}</h1>
            <p className="mt-2 text-gray-500">{t('login.subtitle')}</p>
        </div>
        <div className="space-y-4">
          {MOCK_USERS.map(user => (
            <button
              key={user.id}
              onClick={() => login(user.id)}
              className="w-full px-4 py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform transform hover:scale-105"
            >
              {t('login.button', { name: user.name, role: translateRole(user.role)})}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Login;
