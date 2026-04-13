import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  @ViewChild('navMenu') navMenu?: ElementRef<HTMLDivElement>;
  @ViewChild('navToggler') navToggler?: ElementRef<HTMLButtonElement>;

  brand = 'JD Infotech';

  closeMenuOnMobile(): void {
    if (window.innerWidth > 991) {
      return;
    }

    const menu = this.navMenu?.nativeElement;
    const toggler = this.navToggler?.nativeElement;

    if (!menu || !toggler || !menu.classList.contains('show')) {
      return;
    }

    // Trigger the toggler so Bootstrap updates both visibility and aria state.
    toggler.click();
  }
}
