import { Component, Inject, Input, OnInit } from '@angular/core';
import { DynamicVariableService } from 'src/app/service/dynamic.variables.services';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/service/localstorage.service';

@Component({
  selector: 'app-usermenu',
  standalone: false,
  templateUrl: './usermenu.component.html',
  styleUrl: './usermenu.component.css',
})
export class UsermenuComponent implements OnInit {
  @Input() userLoginedObject: any;
  showResponsiveMenu = false;
  constructor(
    @Inject('deviceIsPc') public deviceIsPc: boolean,
    private router: Router,
    private dynamicVariableService: DynamicVariableService
  ) {}
  ngOnInit(): void {
    this.menuListener();
  }

  gotoRouteWithDelay(route: any) {
    this.dynamicVariableService.loadingProgressActiveation();
    setTimeout(() => {
      this.router.navigate([route]);
      this.dynamicVariableService.loadingProgressDeactiveation();
    }, 1000);
  }
  hideMenu() {
    this.dynamicVariableService.showProfileMenu.next(false);
  }
  showMenu() {
    this.dynamicVariableService.showProfileMenu.next(true);
    if (this.deviceIsPc)
      this.gotoRouteWithDelay(
        '/feature/profile/' + this.userLoginedObject?.email
      );
  }
  menuListener() {
    this.dynamicVariableService.showProfileMenu.subscribe(
      (res) => (this.showResponsiveMenu = res)
    );
  }
}
