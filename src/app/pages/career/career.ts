import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CareerManagementService } from '../../services/career-management.service';

@Component({
  selector: 'app-career',
  imports: [CommonModule, RouterLink],
  templateUrl: './career.html',
  styleUrl: './career.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Career {
  private readonly careerService = inject(CareerManagementService);

  readonly careers = this.careerService.careers;
  
  readonly openCareers = computed(() => {
    return this.careers().filter((career) => career.status?.toLowerCase() === 'open');
  });
  
  readonly totalOpenings = computed(() => this.openCareers().length);

  trackByCareer(_index: number, career: any): string | number {
    return career.id;
  }
}
