
import React from 'react';
import { User, AppView, Notification } from '../types';
import PatientDashboard from './PatientDashboard';
import PhysicianDashboard from './PhysicianDashboard';

interface DashboardContainerProps {
  user: User;
  view: AppView;
  setView: (view: AppView) => void;
  addNotification: (n: Notification) => void;
}

const DashboardContainer: React.FC<DashboardContainerProps> = ({ user, view, setView, addNotification }) => {
  return (
    <div className="pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        {user.role === 'PATIENT' ? (
          <PatientDashboard user={user} view={view} setView={setView} addNotification={addNotification} />
        ) : (
          <PhysicianDashboard user={user} addNotification={addNotification} />
        )}
      </div>
    </div>
  );
};

export default DashboardContainer;
