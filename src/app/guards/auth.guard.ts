import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router';

function hasAuthToken(platformId: object): boolean {
  if (!isPlatformBrowser(platformId)) {
    return false;
  }

  return Boolean(localStorage.getItem('auth_token'));
}

export const adminAuthGuard: CanActivateFn = (_route, state) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  if (hasAuthToken(platformId)) {
    return true;
  }

  return router.createUrlTree(['/admin/login'], {
    queryParams: { returnUrl: state.url },
  });
};

export const adminChildAuthGuard: CanActivateChildFn = (childRoute, state) => {
  return adminAuthGuard(childRoute, state);
};

export const loginGuard: CanActivateFn = () => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  if (hasAuthToken(platformId)) {
    return router.createUrlTree(['/admin/dashboard']);
  }

  return true;
};
