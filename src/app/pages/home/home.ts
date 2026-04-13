import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
type Card = { icon: string; title: string; desc: string; };
type Industry = { name: string; points: string[] };
type Insight = { title: string; date: string; tag: string; };
@Component({
  selector: 'app-home',
  imports: [CommonModule,RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomeComponent {
    brand = 'JD Infotech';

    capabilities: Card[] = [
    { icon: 'bi-bar-chart', title: 'Analytics & Dashboards', desc: 'KPIs, reporting, and insights for faster decisions.' },
    { icon: 'bi-diagram-3', title: 'Data Engineering', desc: 'Pipelines, ETL/ELT, warehousing, and integration.' },
    { icon: 'bi-cpu', title: 'AI Solutions', desc: 'Forecasting, classification, recommendation and automation.' },
    { icon: 'bi-shield-check', title: 'Security & Compliance', desc: 'Best practices for secure and reliable delivery.' },
    { icon: 'bi-cloud-arrow-up', title: 'Cloud & Deployment', desc: 'Deploy, scale, monitor and optimize cost.' },
    { icon: 'bi-gear', title: 'Support & Maintenance', desc: 'Enhancements, bug fixes, performance tuning.' },
  ];

  industries: Industry[] = [
    { name: 'Retail & eCommerce', points: ['Demand forecasting', 'Customer segmentation', 'Inventory insights'] },
    { name: 'Healthcare', points: ['Operational dashboards', 'Data quality', 'Workflow analytics'] },
    { name: 'Finance', points: ['Risk insights', 'KPI tracking', 'Secure reporting'] },
  ];

  insights: Insight[] = [
    { tag: 'Insight', title: 'How to choose the right dashboard KPIs', date: '2026-04-06' },
    { tag: 'Guide', title: 'A simple roadmap for data-driven growth', date: '2026-04-06' },
    { tag: 'Update', title: 'Performance checklist for Angular sites', date: '2026-04-06' },
  ];

}
