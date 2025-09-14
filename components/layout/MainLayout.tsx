import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Notification from '../shared/Notification';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 sm:p-6 lg:p-8 relative">
          <Notification />
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;