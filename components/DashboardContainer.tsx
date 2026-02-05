
import React from 'react';
import { User, AppView, Notification } from '../types';
import PatientDashboard from './PatientDashboard';
import PhysicianDashboard from './PhysicianDashboard';
import AttendantDashboard from './AttendantDashboard';

interface DashboardContainerProps {
  user: User;
  view: AppView;
  setView: (view: AppView) => void;
  addNotification: (n: Notification) => void;
}

const DashboardContainer: React.FC<DashboardContainerProps> = ({ user, view, setView, addNotification }) => {
  return (
    <div className="pt-24 pb-6 px-6 h-screen overflow-hidden flex flex-col">
      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col overflow-hidden">
        {user.role === 'PATIENT' ? (
          <PatientDashboard user={user} view={view} setView={setView} addNotification={addNotification} />
        ) : user.role === 'PHYSICIAN' ? (
          <PhysicianDashboard user={user} addNotification={addNotification} />
        ) : (
          <AttendantDashboard user={user} addNotification={addNotification} />
        )}
      </div>
    </div>
  );
};

export default DashboardContainer;
