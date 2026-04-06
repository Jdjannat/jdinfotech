import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-services',
  imports: [CommonModule],
  templateUrl: './services.html',
  styleUrl: './services.scss',
})
export class ServicesComponent {
  services = [
    {
      icon: 'bi-window',
      title: 'Website Development',
      desc: 'Responsive, SEO-friendly websites for businesses and brands.',
    },
    {
      icon: 'bi-kanban',
      title: 'Web Applications',
      desc: 'Custom dashboards, admin panels, and business automation tools.',
    },
    {
      icon: 'bi-palette',
      title: 'UI/UX Design',
      desc: 'Modern layouts and user flows that convert visitors into customers.',
    },
    {
      icon: 'bi-shield-check',
      title: 'Maintenance & Support',
      desc: 'Bug fixes, speed optimization, updates, and feature enhancements.',
    },
    {
      icon: 'bi-cloud-arrow-up',
      title: 'Deployment',
      desc: 'Deploy to GitHub Pages, Netlify, Vercel, or cloud hosting.',
    },
    {
      icon: 'bi-plug',
      title: 'API Integration',
      desc: 'Payments, maps, analytics, CRM, WhatsApp, and more.',
    },
  ];
}