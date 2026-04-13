import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContentManagementService, BlogPost } from '../../services/content-management.service';

@Component({
  selector: 'app-blog-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './blog-component.html',
  styleUrl: './blog-component.scss',
})
export class BlogComponent implements OnInit {
  blogPosts: BlogPost[] = [];
  showForm = false;
  formData: Partial<BlogPost> = {};

  constructor(private contentService: ContentManagementService) {}

  ngOnInit(): void {
    this.contentService.blogPosts$.subscribe((posts) => {
      this.blogPosts = posts;
    });
  }

  addPost(): void {
    if (this.formData.title && this.formData.content) {
      this.contentService.addBlogPost({
        title: this.formData.title,
        content: this.formData.content,
        author: this.formData.author || 'Admin',
        publishDate: new Date(),
        category: this.formData.category || '',
        tags: this.formData.tags || [],
        imageUrl: this.formData.imageUrl || 'https://via.placeholder.com/400x250',
        excerpt: this.formData.excerpt || '',
      });
      this.resetForm();
    }
  }

  editPost(post: BlogPost): void {
    this.formData = { ...post };
    this.showForm = true;
  }

  savePost(): void {
    if (this.formData.id) {
      this.contentService.updateBlogPost(this.formData.id, this.formData);
      this.resetForm();
    }
  }

  deletePost(id: number): void {
    if (confirm('Delete this blog post?')) {
      this.contentService.deleteBlogPost(id);
    }
  }

  onTagsChange(value: string): void {
    this.formData.tags = (value || '').split(',').map((t) => t.trim());
  }

  resetForm(): void {
    this.formData = {};
    this.showForm = false;
  }
}
