import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicVariableService } from 'src/app/service/dynamic.variables.services';
import { LoadingProgressDynamicService } from 'src/app/service/loading-progress-dynamic';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from '../../../service/localstorage.service';

@Component({
  selector: 'app-profile-menu',
  templateUrl: './profile-menu.component.html',
  styleUrl: './profile-menu.component.css',
})
export class ProfileMenuComponent implements OnInit {
  constructor(
    private router: Router,
    private localStorageService: LocalStorageService,
    private dynamicVariableService: DynamicVariableService,
    private loadingProgressDynamicService: LoadingProgressDynamicService
  ) {}
  userEmail = '';
  profileMenu = [
    {
      name: 'پروفایل',
      path: 'profile',
    },
    {
      name: 'ذخیره شده ها',
      path: 'wishlist',
    },
    {
      name: 'پست های من',
      path: 'myPosts',
    },
    {
      name: ' پیغام های من',
      path: 'message',
    },
    {
      name: 'فعالیت ها',
      path: 'myFollows',
    },
    {
      name: 'علاقه مندی ها',
      path: 'interrests',
    },
    {
      name: 'خروج',
      path: 'exit',
    },
  ];
  ngOnInit(): void {
    this.userEmail = JSON.parse(this.localStorageService.getItem('user')!)?.email;
  }
  gotoRouteWithDelay(route: any) {
    this.hideMenu();
    this.dynamicVariableService.loadingProgressActiveation();
    setTimeout(() => {
      this.router.navigate([route]);
    }, 1000);
  }
  selectProfileFeature(path: string) {
    this.hideMenu();
    this.loadingProgressDynamicService.loadingProgressActiveation(
      'change profile setting'
    );
    setTimeout(() => {
      this.dynamicVariableService.pathRouteOfProfile.next(path);
    }, 500);
  }
  hideMenu() {
    this.dynamicVariableService.showProfileMenu.next(false);
  }
}
