import { Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LoadingProgressDynamicService } from './loading-progress-dynamic';

@Injectable({ providedIn: 'root' })
export class DynamicVariableService {
  constructor(
    private loadingProgressDynamicService: LoadingProgressDynamicService
  ) {}
  loadingProgressActive = new BehaviorSubject(true);
  groupCategory = signal<any>('all');
  filter = signal<any>('');
  pathRoute = new BehaviorSubject('');
  showMenu = new BehaviorSubject(false);
  showProfileMenu = new BehaviorSubject(false);
  pathRouteOfProfile = new BehaviorSubject('profile');
  loadingProgressActiveation() {
    this.loadingProgressActive.next(true);
  }
  loadingProgressDeactiveation() {
    setTimeout(() => {
      this.loadingProgressActive.next(false);
    }, 1000);
  }
  setGroupCat(groupId: any) {
    this.loadingProgressDynamicService.loadingProgressActiveation(
      'change post type'
    );
    setTimeout(() => {
      this.groupCategory.set(groupId);
      this.loadingProgressDynamicService.loadingProgressDeactiveation(300);
    }, 500);
  }
  setFilter(filter: any) {
    this.loadingProgressDynamicService.loadingProgressActiveation(
      'change post type'
    );
    setTimeout(() => {
      this.filter.set(filter);
      this.loadingProgressDynamicService.loadingProgressDeactiveation(300);
    }, 500);
  }
}
