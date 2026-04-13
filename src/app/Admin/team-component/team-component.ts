import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContentManagementService, TeamMember } from '../../services/content-management.service';

@Component({
  selector: 'app-team-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './team-component.html',
  styleUrl: './team-component.scss',
})
export class TeamComponent implements OnInit {
  teamMembers: TeamMember[] = [];
  showForm = false;
  formData: Partial<TeamMember> = {};

  constructor(private contentService: ContentManagementService) {}

  ngOnInit(): void {
    this.contentService.teamMembers$.subscribe((members) => {
      this.teamMembers = members;
    });
  }

  addMember(): void {
    if (this.formData.name && this.formData.email) {
      this.contentService.addTeamMember({
        name: this.formData.name,
        position: this.formData.position || '',
        bio: this.formData.bio || '',
        imageUrl: this.formData.imageUrl || 'https://via.placeholder.com/200x200',
        email: this.formData.email,
      });
      this.resetForm();
    }
  }

  editMember(member: TeamMember): void {
    this.formData = { ...member };
    this.showForm = true;
  }

  saveMember(): void {
    if (this.formData.id) {
      this.contentService.updateTeamMember(this.formData.id, this.formData);
      this.resetForm();
    }
  }

  deleteMember(id: number): void {
    if (confirm('Delete this team member?')) {
      this.contentService.deleteTeamMember(id);
    }
  }

  resetForm(): void {
    this.formData = {};
    this.showForm = false;
  }
}
