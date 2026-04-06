import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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
    services = [
    {
      icon: 'bi-code-slash',
      title: 'Web Development',
      desc: 'Modern, scalable websites and web applications built with latest technologies.'
    },
    {
      icon: 'bi-phone',
      title: 'Mobile App Development',
      desc: 'iOS and Android apps designed for performance and great user experience.'
    },
    {
      icon: 'bi-cloud',
      title: 'Cloud Solutions',
      desc: 'Deploy and manage applications on AWS, Azure, or Google Cloud.'
    },
    {
      icon: 'bi-bar-chart',
      title: 'Data & Analytics',
      desc: 'Turn your business data into actionable insights and dashboards.'
    },
    {
      icon: 'bi-shield-check',
      title: 'Security & Compliance',
      desc: 'Secure applications with best practices and compliance standards.'
    },
    {
      icon: 'bi-gear',
      title: 'Custom Solutions',
      desc: 'Tailored software solutions built specifically for your business needs.'
    }
  ];

}