import { Task, StatCardData } from './types';
import { Layout, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import React from 'react';

export const MOCK_TASKS: Task[] = [
  {
    id: '1',
    title: 'Q3 Financial Review',
    description: 'Analyze the quarterly reports, focus on the marketing budget variances, and prepare the slide deck for the board meeting next Tuesday. Ensure all charts are updated with the latest figures from the data team.',
    status: 'in-progress',
    priority: 'high',
    tags: ['Finance', 'Meeting'],
    dueDate: '2023-10-24',
  },
  {
    id: '2',
    title: 'Update Dependences',
    description: 'Run audit on npm packages and update React to v19.',
    status: 'pending',
    priority: 'medium',
    tags: ['Dev', 'Maintenance'],
    dueDate: '2023-10-25',
  },
  {
    id: '3',
    title: 'Client Lunch: Acme Corp',
    description: 'Meeting at Le Petit Bistro. discuss the new roadmap.',
    status: 'pending',
    priority: 'low',
    tags: ['Social'],
    dueDate: '2023-10-26',
  },
  {
    id: '4',
    title: 'Refactor Auth Logic',
    description: 'The current authentication middleware is causing latency issues in the EU region. We need to rewrite the token validation logic and implement Redis caching for session management. This is critical for the upcoming launch.',
    status: 'in-progress',
    priority: 'high',
    tags: ['Dev', 'Critical'],
    dueDate: '2023-10-28',
  },
  {
    id: '5',
    title: 'Design System Polish',
    description: 'Standardize button paddings.',
    status: 'completed',
    priority: 'low',
    tags: ['Design'],
    dueDate: '2023-10-22',
  },
  {
    id: '6',
    title: 'Write Blog Post',
    description: 'Topic: "The Future of AI in Project Management". Outline: 1. Intro 2. Automation 3. Prediction 4. Conclusion. Target word count: 1200.',
    status: 'pending',
    priority: 'medium',
    tags: ['Marketing', 'Content'],
    dueDate: '2023-11-01',
  },
  {
    id: '7',
    title: 'Gym',
    description: 'Leg day.',
    status: 'pending',
    priority: 'low',
    tags: ['Personal'],
    dueDate: '2023-10-24',
  },
];

export const MOCK_STATS: StatCardData[] = [
  { label: 'Total Tasks', value: 24, trend: '+4%', positive: true, iconName: 'Layout' },
  { label: 'In Progress', value: 7, trend: 'Active', positive: true, iconName: 'Clock' },
  { label: 'Completed', value: 12, trend: '+12%', positive: true, iconName: 'CheckCircle' },
  { label: 'Efficiency', value: '94%', trend: '+2.4%', positive: true, iconName: 'TrendingUp' },
];