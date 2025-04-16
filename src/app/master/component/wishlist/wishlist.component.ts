import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { actions } from 'src/app/+state/action';
import {
  selectFollows,
  selectPost,
  selectUserLoginedSavedPosts,
} from 'src/app/+state/select';
import { DynamicVariableService } from 'src/app/service/dynamic.variables.services';
import { LoadingProgressDynamicService } from 'src/app/service/loading-progress-dynamic';
import { LocalStorageService } from 'src/app/service/localstorage.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css',
})
export class WishlistComponent implements OnInit {
  datas: any = [];
  constructor(
    private store: Store,
    private localStorage: LocalStorageService,
    private router: Router,
    private dynamicVariableService: DynamicVariableService,
    private loadingProgressDynamicService: LoadingProgressDynamicService
  ) {}
  ngOnInit(): void {
    this.fetchPostAction();
    this.fetchDatasSaved();
  }
  fetchDatasSaved() {
    this.store.select(selectUserLoginedSavedPosts).subscribe((res: any) => {
      this.datas = res;
      this.loadingProgressDynamicService.loadingProgressDeactiveation(300);
    });
  }
  shortcase(content: any) {
    return content.substring(1, 1000) + ' ... ';
  }
  gotoRouteWithDelay(route: any) {
    this.dynamicVariableService.loadingProgressActiveation();
    setTimeout(() => {
      this.router.navigate([route]);
      this.dynamicVariableService.loadingProgressDeactiveation();
    }, 1000);
  }
  otDateTime(timestamp: any) {
    return (
      timestamp.substring(0, 4) +
      '/' +
      timestamp.substring(4, 6) +
      '/' +
      timestamp.substring(6, 8) +
      ' ' +
      timestamp.substring(8, 10) +
      ':' +
      timestamp.substring(10, 12)
    );
  }
  fetchPostAction() {
    const loginedUser = JSON.parse(this.localStorage.getItem('user')!)?.email;
    this.store.dispatch(
      actions.prepareFetchUserSavedPost({ email: loginedUser })
    );
  }
}
