import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../hooks/useLanguage';
import { Role } from '../../types';
import { HomeIcon, UsersIcon, CollectionIcon, WrenchScrewdriverIcon, ShieldCheckIcon, IdentificationIcon, AcademicCapIcon } from '../icons/Icons';
import { TranslationKey } from '../../translations';

const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const commonLinks: { to: string; key: TranslationKey; icon: React.ReactNode }[] = [
    { to: '/', key: 'sidebar.dashboard', icon: <HomeIcon /> },
  ];

  const studentLinks = [
    ...commonLinks,
    { to: '/repairs', key: 'sidebar.myRepairs' as TranslationKey, icon: <WrenchScrewdriverIcon /> },
    { to: '/hygiene', key: 'sidebar.myHygieneScore' as TranslationKey, icon: <ShieldCheckIcon /> },
    { to: '/visitors', key: 'sidebar.registerVisitor' as TranslationKey, icon: <IdentificationIcon /> },
  ];

  const managerLinks = [
    ...commonLinks,
    { to: '/students', key: 'sidebar.studentInfo' as TranslationKey, icon: <UsersIcon /> },
    { to: '/repairs', key: 'sidebar.repairRequests' as TranslationKey, icon: <WrenchScrewdriverIcon /> },
    { to: '/hygiene', key: 'sidebar.hygieneChecks' as TranslationKey, icon: <ShieldCheckIcon /> },
    { to: '/visitors', key: 'sidebar.visitorLog' as TranslationKey, icon: <IdentificationIcon /> },
  ];

  const adminLinks = [
    ...commonLinks,
    { to: '/students', key: 'sidebar.studentInfo' as TranslationKey, icon: <UsersIcon /> },
    { to: '/allocation', key: 'sidebar.dormAllocation' as TranslationKey, icon: <CollectionIcon /> },
    { to: '/repairs', key: 'sidebar.repairRequests' as TranslationKey, icon: <WrenchScrewdriverIcon /> },
    { to: '/hygiene', key: 'sidebar.hygieneChecks' as TranslationKey, icon: <ShieldCheckIcon /> },
    { to: '/visitors', key: 'sidebar.visitorLog' as TranslationKey, icon: <IdentificationIcon /> },
  ];

  let navLinks;
  switch (user?.role) {
    case Role.ADMIN:
      navLinks = adminLinks;
      break;
    case Role.MANAGER:
      navLinks = managerLinks;
      break;
    case Role.STUDENT:
      navLinks = studentLinks;
      break;
    default:
      navLinks = [];
  }

  const linkClass = "flex items-center px-4 py-3 text-gray-200 hover:bg-blue-600 transition-colors duration-200";
  const activeLinkClass = "bg-blue-700 text-white";

  return (
    <div className="hidden md:flex flex-col w-64 bg-gray-800 text-white">
        <div className="flex items-center justify-center h-20 border-b border-gray-700">
            <AcademicCapIcon className="h-8 w-8 text-blue-400" />
            <span className="ml-3 text-xl font-semibold">{t('sidebar.title')}</span>
        </div>
        <nav className="flex-1 px-2 py-4 space-y-2">
            {navLinks.map((link) => (
            <NavLink
                key={link.to}
                to={link.to}
                end
                className={({ isActive }) => `${linkClass} ${isActive ? activeLinkClass : ''}`}
            >
                <span className="h-6 w-6">{link.icon}</span>
                <span className="mx-4 font-medium">{t(link.key)}</span>
            </NavLink>
            ))}
      </nav>
    </div>
  );
};

export default Sidebar;