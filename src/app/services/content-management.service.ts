import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';

export interface PortfolioItem {
  id: number;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  link: string;
  technologies: string[];
}

export interface Service {
  id: number;
  title: string;
  description: string;
  icon: string;
  price?: string;
}

export interface TeamMember {
  id: number;
  name: string;
  position: string;
  bio: string;
  imageUrl: string;
  email: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
}

export interface Testimonial {
  id: number;
  clientName: string;
  company: string;
  comment: string;
  rating: number;
  imageUrl: string;
}

export interface BlogPost {
  id: number;
  title: string;
  content: string;
  author: string;
  publishDate: Date;
  category: string;
  tags: string[];
  imageUrl: string;
  excerpt: string;
}

@Injectable({
  providedIn: 'root',
})
export class ContentManagementService {
  private platformId = inject(PLATFORM_ID);
  private portfolioItems = new BehaviorSubject<PortfolioItem[]>(this.getStoredPortfolio());
  public portfolioItems$ = this.portfolioItems.asObservable();

  private services = new BehaviorSubject<Service[]>(this.getStoredServices());
  public services$ = this.services.asObservable();

  private teamMembers = new BehaviorSubject<TeamMember[]>(this.getStoredTeam());
  public teamMembers$ = this.teamMembers.asObservable();

  private testimonials = new BehaviorSubject<Testimonial[]>(this.getStoredTestimonials());
  public testimonials$ = this.testimonials.asObservable();

  private blogPosts = new BehaviorSubject<BlogPost[]>(this.getStoredBlog());
  public blogPosts$ = this.blogPosts.asObservable();

  constructor() {
    this.initializeSampleData();
  }

  // Helper methods for SSR-safe localStorage access
  private getFromStorage(key: string): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(key);
    }
    return null;
  }

  private setInStorage(key: string, value: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(key, value);
    }
  }

  // Portfolio Methods
  private getStoredPortfolio(): PortfolioItem[] {
    const stored = this.getFromStorage('portfolioItems');
    return stored ? JSON.parse(stored) : [];
  }

  getPortfolioItems(): PortfolioItem[] {
    return this.portfolioItems.value;
  }

  addPortfolioItem(item: Omit<PortfolioItem, 'id'>): void {
    const newItem = {
      ...item,
      id: Date.now(),
    } as PortfolioItem;
    const updated = [...this.portfolioItems.value, newItem];
    this.portfolioItems.next(updated);
    this.setInStorage('portfolioItems', JSON.stringify(updated));
  }

  updatePortfolioItem(id: number, item: Partial<PortfolioItem>): void {
    const updated = this.portfolioItems.value.map((p) =>
      p.id === id ? { ...p, ...item } : p
    );
    this.portfolioItems.next(updated);
    this.setInStorage('portfolioItems', JSON.stringify(updated));
  }

  deletePortfolioItem(id: number): void {
    const updated = this.portfolioItems.value.filter((p) => p.id !== id);
    this.portfolioItems.next(updated);
    this.setInStorage('portfolioItems', JSON.stringify(updated));
  }

  // Services Methods
  private getStoredServices(): Service[] {
    const stored = this.getFromStorage('services');
    return stored ? JSON.parse(stored) : [];
  }

  getServices(): Service[] {
    return this.services.value;
  }

  addService(service: Omit<Service, 'id'>): void {
    const newService = {
      ...service,
      id: Date.now(),
    } as Service;
    const updated = [...this.services.value, newService];
    this.services.next(updated);
    this.setInStorage('services', JSON.stringify(updated));
  }

  updateService(id: number, service: Partial<Service>): void {
    const updated = this.services.value.map((s) =>
      s.id === id ? { ...s, ...service } : s
    );
    this.services.next(updated);
    this.setInStorage('services', JSON.stringify(updated));
  }

  deleteService(id: number): void {
    const updated = this.services.value.filter((s) => s.id !== id);
    this.services.next(updated);
    this.setInStorage('services', JSON.stringify(updated));
  }

  // Team Members Methods
  private getStoredTeam(): TeamMember[] {
    const stored = this.getFromStorage('teamMembers');
    return stored ? JSON.parse(stored) : [];
  }

  getTeamMembers(): TeamMember[] {
    return this.teamMembers.value;
  }

  addTeamMember(member: Omit<TeamMember, 'id'>): void {
    const newMember = {
      ...member,
      id: Date.now(),
    } as TeamMember;
    const updated = [...this.teamMembers.value, newMember];
    this.teamMembers.next(updated);
    this.setInStorage('teamMembers', JSON.stringify(updated));
  }

  updateTeamMember(id: number, member: Partial<TeamMember>): void {
    const updated = this.teamMembers.value.map((t) =>
      t.id === id ? { ...t, ...member } : t
    );
    this.teamMembers.next(updated);
    this.setInStorage('teamMembers', JSON.stringify(updated));
  }

  deleteTeamMember(id: number): void {
    const updated = this.teamMembers.value.filter((t) => t.id !== id);
    this.teamMembers.next(updated);
    this.setInStorage('teamMembers', JSON.stringify(updated));
  }

  // Testimonials Methods
  private getStoredTestimonials(): Testimonial[] {
    const stored = this.getFromStorage('testimonials');
    return stored ? JSON.parse(stored) : [];
  }

  getTestimonials(): Testimonial[] {
    return this.testimonials.value;
  }

  addTestimonial(testimonial: Omit<Testimonial, 'id'>): void {
    const newTestimonial = {
      ...testimonial,
      id: Date.now(),
    } as Testimonial;
    const updated = [...this.testimonials.value, newTestimonial];
    this.testimonials.next(updated);
    this.setInStorage('testimonials', JSON.stringify(updated));
  }

  updateTestimonial(id: number, testimonial: Partial<Testimonial>): void {
    const updated = this.testimonials.value.map((t) =>
      t.id === id ? { ...t, ...testimonial } : t
    );
    this.testimonials.next(updated);
    this.setInStorage('testimonials', JSON.stringify(updated));
  }

  deleteTestimonial(id: number): void {
    const updated = this.testimonials.value.filter((t) => t.id !== id);
    this.testimonials.next(updated);
    this.setInStorage('testimonials', JSON.stringify(updated));
  }

  // Blog Posts Methods
  private getStoredBlog(): BlogPost[] {
    const stored = this.getFromStorage('blogPosts');
    return stored
      ? JSON.parse(stored).map((post: any) => ({
          ...post,
          publishDate: new Date(post.publishDate),
        }))
      : [];
  }

  getBlogPosts(): BlogPost[] {
    return this.blogPosts.value;
  }

  addBlogPost(post: Omit<BlogPost, 'id'>): void {
    const newPost = {
      ...post,
      id: Date.now(),
    } as BlogPost;
    const updated = [...this.blogPosts.value, newPost];
    this.blogPosts.next(updated);
    this.setInStorage('blogPosts', JSON.stringify(updated));
  }

  updateBlogPost(id: number, post: Partial<BlogPost>): void {
    const updated = this.blogPosts.value.map((b) =>
      b.id === id ? { ...b, ...post } : b
    );
    this.blogPosts.next(updated);
    this.setInStorage('blogPosts', JSON.stringify(updated));
  }

  deleteBlogPost(id: number): void {
    const updated = this.blogPosts.value.filter((b) => b.id !== id);
    this.blogPosts.next(updated);
    this.setInStorage('blogPosts', JSON.stringify(updated));
  }

  // Initialize with sample data
  private initializeSampleData(): void {
    if (this.portfolioItems.value.length === 0) {
      this.portfolioItems.next([
        {
          id: 1,
          title: 'E-Commerce Platform',
          description: 'Modern e-commerce solution with payment integration',
          category: 'Web Development',
          imageUrl: 'https://via.placeholder.com/300x200?text=Ecomerce',
          link: '#',
          technologies: ['Angular', 'Node.js', 'MongoDB'],
        },
        {
          id: 2,
          title: 'Mobile App',
          description: 'Cross-platform mobile application',
          category: 'Mobile Development',
          imageUrl: 'https://via.placeholder.com/300x200?text=Mobile+App',
          link: '#',
          technologies: ['React Native', 'Firebase'],
        },
      ]);
      this.setInStorage(
        'portfolioItems',
        JSON.stringify(this.portfolioItems.value)
      );
    }

    if (this.services.value.length === 0) {
      this.services.next([
        {
          id: 1,
          title: 'Web Development',
          description: 'Custom web applications built with latest technologies',
          icon: '🌐',
        },
        {
          id: 2,
          title: 'Mobile Development',
          description: 'Native and cross-platform mobile solutions',
          icon: '📱',
        },
      ]);
      this.setInStorage('services', JSON.stringify(this.services.value));
    }

    if (this.teamMembers.value.length === 0) {
      this.teamMembers.next([
        {
          id: 1,
          name: 'John Developer',
          position: 'Senior Developer',
          bio: 'Expert in full-stack development',
          imageUrl: 'https://via.placeholder.com/200x200?text=John',
          email: 'john@jdinfotech.com',
        },
      ]);
      this.setInStorage('teamMembers', JSON.stringify(this.teamMembers.value));
    }

    if (this.testimonials.value.length === 0) {
      this.testimonials.next([
        {
          id: 1,
          clientName: 'Jane Smith',
          company: 'Tech Corp',
          comment: 'Excellent service and professional team!',
          rating: 5,
          imageUrl: 'https://via.placeholder.com/100x100?text=Jane',
        },
      ]);
      this.setInStorage(
        'testimonials',
        JSON.stringify(this.testimonials.value)
      );
    }

    if (this.blogPosts.value.length === 0) {
      this.blogPosts.next([
        {
          id: 1,
          title: 'Getting Started with Angular',
          content: 'Learn the basics of Angular framework...',
          author: 'Admin',
          publishDate: new Date(),
          category: 'Technology',
          tags: ['Angular', 'Web Development'],
          imageUrl: 'https://via.placeholder.com/400x250?text=Angular+Guide',
          excerpt: 'Learn the basics of Angular framework in this comprehensive guide.',
        },
      ]);
      this.setInStorage('blogPosts', JSON.stringify(this.blogPosts.value));
    }
  }
}
