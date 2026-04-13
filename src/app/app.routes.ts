import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { AboutComponent } from './pages/about/about';
import { ServicesComponent } from './pages/services/services';
import { PortfolioComponent } from './pages/portfolio/portfolio';
import { ContactComponent } from './pages/contact/contact';
import { Login } from './Admin/login/login';
import { Main } from './layout/main/main';

import { AdminPanelComponent } from './Admin/admin-panel/admin-panel';
import { Dashboard } from './Admin/dashboard/dashboard';
import { TestimonialsComponent } from './Admin/testimonials-component/testimonials-component';
import { TeamComponent } from './Admin/team-component/team-component';
import { SettingsComponent } from './Admin/settings-component/settings-component';
import { BlogComponent } from './Admin/blog-component/blog-component';
import { PortfolioComponentComp } from './Admin/portfoliocomponent/portfoliocomponent';

export const routes: Routes = [
  {
    path: '',
    component: Main,
    children: [
      { path: '', component: HomeComponent },
      { path: 'about', component: AboutComponent },
      { path: 'services', component: ServicesComponent },
      { path: 'portfolio', component: PortfolioComponent },
      { path: 'contact', component: ContactComponent },
    ],
  },

  // Login
  { path: 'admin/login', component: Login },

  // Admin Panel
  {
    path: 'admin',
    component: AdminPanelComponent,
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'portfolio', component: PortfolioComponentComp },
      { path: 'blog', component: BlogComponent },
      { path: 'testimonials', component: TestimonialsComponent },
      { path: 'team', component: TeamComponent },
      { path: 'settings', component: SettingsComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  { path: '**', redirectTo: '' }
];