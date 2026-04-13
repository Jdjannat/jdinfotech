import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
type Project = {
  title: string;
  category: string;
  desc: string;
  tags: string[];
  link?: string;
};
@Component({
  selector: 'app-portfolio',
  imports: [CommonModule],
  templateUrl: './portfolio.html',
  styleUrl: './portfolio.scss',
})
export class PortfolioComponent {
  categories = ['All', 'Web App', 'Ecommerce', 'Data', 'Mobile'];
  activeFilter = signal('All');

  projects: Project[] = [
    {
      title: 'Retail Command Center',
      category: 'Data',
      desc: 'Unified sales, inventory, and campaign dashboard used by leadership for daily decisions.',
      tags: ['Angular', 'Node.js', 'PostgreSQL', 'Charting'],
      link: '#',
    },
    {
      title: 'CraftCart Commerce',
      category: 'Ecommerce',
      desc: 'High-conversion storefront with custom checkout and abandoned-cart recovery flows.',
      tags: ['Angular', 'Stripe', 'Firebase'],
      link: '#',
    },
    {
      title: 'FinPulse Backoffice',
      category: 'Web App',
      desc: 'Internal operations suite for approvals, audits, and role-based process automation.',
      tags: ['Angular', 'REST API', 'RBAC'],
      link: '#',
    },
    {
      title: 'DoctorConnect Platform',
      category: 'Mobile',
      desc: 'Patient engagement platform with booking, reminders, and consultation workflow.',
      tags: ['Hybrid App', 'Notifications', 'Cloud'],
      link: '#',
    },
    {
      title: 'B2B Distributor Hub',
      category: 'Ecommerce',
      desc: 'Wholesale ordering portal with tiered pricing, account management, and invoices.',
      tags: ['Angular', 'ERP Integration', 'Payments'],
      link: '#',
    },
    {
      title: 'FieldForce Tracker',
      category: 'Web App',
      desc: 'Task assignment and geo-reporting system that reduced manual follow-up effort.',
      tags: ['Maps', 'Realtime', 'Admin Panel'],
      link: '#',
    },
  ];

  filteredProjects = computed(() => {
    const filter = this.activeFilter();
    if (filter === 'All') {
      return this.projects;
    }

    return this.projects.filter((project) => project.category === filter);
  });

  setFilter(category: string): void {
    this.activeFilter.set(category);
  }
}