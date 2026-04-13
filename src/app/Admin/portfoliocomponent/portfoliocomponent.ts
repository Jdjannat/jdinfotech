import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContentManagementService, PortfolioItem } from '../../services/content-management.service';

@Component({
  selector: 'app-portfolio-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './portfoliocomponent.html',
  styleUrl: './portfoliocomponent.scss',
})
export class PortfolioComponentComp implements OnInit {
  portfolioItems: PortfolioItem[] = [];
  showForm = false;
  formData: Partial<PortfolioItem> = {};

  constructor(private contentService: ContentManagementService) {}

  ngOnInit(): void {
    this.contentService.portfolioItems$.subscribe((items) => {
      this.portfolioItems = items;
    });
  }

  addItem(): void {
    if (this.formData.title && this.formData.description) {
      this.contentService.addPortfolioItem({
        title: this.formData.title,
        description: this.formData.description,
        category: this.formData.category || '',
        imageUrl: this.formData.imageUrl || 'https://via.placeholder.com/300x200',
        link: this.formData.link || '#',
        technologies: this.formData.technologies || [],
      });
      this.resetForm();
    }
  }

  editItem(item: PortfolioItem): void {
    this.formData = { ...item };
    this.showForm = true;
  }

  saveItem(): void {
    if (this.formData.id) {
      this.contentService.updatePortfolioItem(this.formData.id, this.formData);
      this.resetForm();
    }
  }

  deleteItem(id: number): void {
    if (confirm('Delete this portfolio item?')) {
      this.contentService.deletePortfolioItem(id);
    }
  }

  onTechnologiesChange(value: string): void {
    this.formData.technologies = (value || '').split(',').map((t) => t.trim());
  }

  resetForm(): void {
    this.formData = {};
    this.showForm = false;
  }
}
