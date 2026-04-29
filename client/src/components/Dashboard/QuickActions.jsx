import React from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaClipboardList, FaCreditCard, FaCog } from 'react-icons/fa';
import './QuickActions.css';

const QuickActions = () => {
  const actions = [
    {
      id: 1,
      icon: <FaPlus />,
      title: 'Book Slot',
      description: 'Reserve a new parking spot',
      link: '/dashboard/bookslot',
      color: 'blue'
    },
    {
      id: 2,
      icon: <FaClipboardList />,
      title: 'My Bookings',
      description: 'View all your reservations',
      link: '/dashboard/bookslot',
      color: 'green'
    },
    {
      id: 3,
      icon: <FaCreditCard />,
      title: 'Payments',
      description: 'Manage payment methods',
      link: '/payments',
      color: 'purple'
    },
    {
      id: 4,
      icon: <FaCog />,
      title: 'Settings',
      description: 'Update your preferences',
      link: '/settings',
      color: 'orange'
    }
  ];

  return (
    <section className="quick-actions-section">
      <h2 className="section-title-quick">Quick Actions</h2>
      <div className="quick-actions-grid">
        {actions.map((action) => (
          <Link key={action.id} to={action.link} className={`action-card action-card-${action.color}`}>
            <div className="action-icon">{action.icon}</div>
            <h3 className="action-title">{action.title}</h3>
            <p className="action-description">{action.description}</p>
            <div className="action-arrow">→</div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default QuickActions;