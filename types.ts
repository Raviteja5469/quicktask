import React from 'react';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'completed' | 'in-progress';
  priority: 'low' | 'medium' | 'high';
  tags: string[];
  dueDate: string;
}

export interface StatCardData {
  label: string;
  value: string | number;
  trend?: string;
  positive?: boolean;
  iconName?: string; // String identifier for the icon
}

export interface AnalyticsData {
    overview: StatCardData[];
    kpi: { label: string; value: string | number }[];
    weeklyProductivity: { name: string; completed: number }[];
    taskDistribution: { name: string; value: number }[];
}

export type Theme = 'light' | 'dark';

export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}