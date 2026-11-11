import React from 'react';

export default function StatCard({ title, value, subtext, icon: Icon, color = 'blue', trend }) {
  const colorMap = {
    blue: {
      bg: '#eff6ff',
      text: '#2563eb',
      border: '#bfdbfe'
    },
    emerald: {
      bg: '#ecfdf5',
      text: '#059669',
      border: '#a7f3d0'
    },
    amber: {
      bg: '#fffbeb',
      text: '#d97706',
      border: '#fde68a'
    },
    rose: {
      bg: '#fff1f2',
      text: '#e11d48',
      border: '#fecdd3'
    },
    indigo: {
      bg: '#eef2ff',
      text: '#4f46e5',
      border: '#c7d2fe'
    }
  };

  const scheme = colorMap[color] || colorMap.blue;

  return (
    <div className="stat-card">
      <div className="stat-card-header">
        <span className="stat-title">{title}</span>
        <div className="stat-icon-wrap" style={{ backgroundColor: scheme.bg, color: scheme.text }}>
          <Icon size={20} />
        </div>
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-footer">
        {trend && (
          <span className={`stat-trend ${trend.positive ? 'trend-up' : 'trend-down'}`}>
            {trend.text}
          </span>
        )}
        <span className="stat-subtext">{subtext}</span>
      </div>
    </div>
  );
}
