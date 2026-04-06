import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  imports: [CommonModule],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class AboutComponent {
  brand = 'JD Infotech';

  points = [
    'We are a client-focused IT services team.',
    'We build modern websites and web apps for startups and businesses.',
    'We care about clean UI, speed, and maintainable code.',
  ];
}