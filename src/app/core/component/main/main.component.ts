import {
  Component,
  effect,
  ElementRef,
  HostListener,
  Inject,
  Injector,
  OnInit,
  ViewChild,
} from '@angular/core';
import { IPost } from 'src/app/+state/state';
import { Store } from '@ngrx/store';
import { DynamicVariableService } from 'src/app/service/dynamic.variables.services';
import { LocalStorageService } from 'src/app/service/localstorage.service';
import { actions } from 'src/app/+state/action';
import { selectGroupCats, selectPost } from 'src/app/+state/select';
import { Router } from '@angular/router';
import { LoadingProgressDynamicService } from 'src/app/service/loading-progress-dynamic';
import { map } from 'rxjs';

@Component({
  selector: 'app-main',
  standalone: false,
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
})
export class MainComponent implements OnInit {
  @ViewChild('#moreLoadButton') moreLoadButton: ElementRef | undefined;
  postDatas: IPost[] = [];
  sort = 'new';
  componentSetting: any = {
    visualDirectives: {
      loadingProgressActive: true,
    },
    settingVariables: {
      offset: 0,
      groupCategory: 'all',
      groupCategoryName: 'all',
      typeOfPost: 'all',
      userLoginedEmail: '',
      filters: '',
    },
  };
  groupCategoryName = '';
  loadingProgressDynamicVar = '';
  seed = 'public';
  constructor(
    @Inject('deviceIsPc') public deviceIsPc: boolean,
    private store: Store,
    private dynamicVariableService: DynamicVariableService,
    private injector: Injector,
    private router: Router,
    private loadingProgressDynamicService: LoadingProgressDynamicService,
    public localStorage: LocalStorageService
  ) {}
  ngOnInit(): void {
    //this.listenToSearchPool();
    this.dynamicVariableService.loadingProgressActive.next(true);
    this.fetchPostsAction(2, true);
    this.fetchPostsSelect();
    this.loadingGroupCategory();
    this.fetchUserLogined();
    this.fetchFollowersAction();
    this.loadingProgressDynamicFetch();
  }

  loadingProgressDynamicFetch() {
    this.loadingProgressDynamicService.loadingProgressActive.subscribe(
      (res) => {
        this.loadingProgressDynamicVar = res;
      }
    );
  }
  showBranches() {
    this.dynamicVariableService.showMenu.next(true);
  }
  fetchCategoryName() {
    this.store
      .select(selectGroupCats)
      .pipe(
        map((res: any) =>
          res.filter(
            (res: any) =>
              String(res.id) ===
              String(this.dynamicVariableService.groupCategory())
          )
        )
      )
      .subscribe((res: any) => {
        this.groupCategoryName = res[0]?.title;
      });
  }

  fetchUserLogined() {
    this.componentSetting.settingVariables.userLoginedEmail = JSON.parse(
      this.localStorage.getItem('user')!
    )?.email;
    return JSON.parse(this.localStorage.getItem('user')!)?.email;
  }
  sortData(v: any) {
    this.loadingProgressDynamicService.loadingProgressActiveation(
      'change post type'
    );
    this.fetchPostsAction(0, true);
  }
  changePathVariable() {
    this.dynamicVariableService.pathRoute.next('main');
  }
  fetchPostsSelect() {
    this.store.select(selectPost).subscribe((res: any) => {
      this.postDatas = res;
      this.loadingProgressDynamicService.loadingProgressDeactiveation(1000);
      if (res?.length > 0)
        setTimeout(() => {
          this.changePathVariable();
        }, 1000);
    }),
      (err: any) => {
        this.loadingProgressDynamicService.loadingProgressDeactiveation(200);
      };
  }

  fetchPostsAction(offset: number, fetchData: boolean) {
    this.store.dispatch(
      actions.prepareFetchPosts({
        userEmail: JSON.parse(this.localStorage.getItem('user')!)?.email,
        offset: offset,
        typeOfPost: this.componentSetting?.settingVariables?.typeOfPost,
        groupId: this.componentSetting?.settingVariables?.groupCategory,
        sort: this.sort,
        restartFetchData: fetchData,
        seed: this.seed,
        filters: this.componentSetting?.settingVariables?.filters,
      })
    );
  }

  fetchFollowersAction() {
    this.store.dispatch(
      actions.prepareToFetchFollowers({
        user: JSON.parse(this.localStorage.getItem('user')!)?.email,
      })
    );
  }

  nextPagesLoad() {
    const tmp = this.componentSetting.settingVariables.offset;
    this.componentSetting.settingVariables.offset = tmp + 10;
    this.fetchPostsAction(this.componentSetting.settingVariables.offset, false);
  }
  resetSetting() {
    this.componentSetting = {
      visualDirectives: {
        loadingProgressActive: true,
      },
      settingVariables: {
        offset: 0,
        groupCategory: 'all',
        groupCategoryName: 'all',
        typeOfPost: 'all',
        filters: '',
      },
    };
  }

  mySeed() {
    this.resetSetting();
    this.seed = 'mySeed';
    this.fetchPostsAction(0, true);
  }

  @HostListener('window:scroll', ['$event'])
  takeScroller(event: any) {
    const t: any = document
      .getElementById('moreLoadButton')
      ?.getBoundingClientRect();
    if (window.innerHeight >= t.y) {
      this.nextPagesLoad();
    }
  }
  publicPosts() {
    this.resetSetting();
    this.seed = 'public';
    this.fetchPostsAction(0, true);
  }
  experiencesTrackBy(index: any, exp: any) {
    return exp.id;
  }
  typeOfPostChange(typeOfPost: string) {
    this.loadingProgressDynamicService.loadingProgressActiveation(
      'change post type'
    );
    setTimeout(() => {
      this.store.dispatch(actions.clearPostArray());
      this.componentSetting = {
        visualDirectives: {
          loadingProgressActive: true,
        },
        settingVariables: {
          offset: 0,
          groupCategory: 'all',
          groupCategoryName: 'all',
          typeOfPost: typeOfPost,
          filter: '',
        },
      };
      this.fetchPostsAction(0, true);
      //  this.loadingProgressDynamicService.loadingProgressDeactiveation(300);
    }, 1000);
  }
  gotoRouteWithDelay(route: any) {
    this.dynamicVariableService.loadingProgressActiveation();
    setTimeout(() => {
      this.router.navigate([route]);
      //  this.dynamicVariableService.loadingProgressDeactiveation();
    }, 1000);
  }
  loadingGroupCategory() {
    effect(
      () => {
        this.fetchCategoryName();

        this.postDatas = [];
        this.store.dispatch(actions.clearPostArray());
        this.componentSetting = {
          visualDirectives: {
            loadingProgressActive: true,
          },
          settingVariables: {
            offset: 0,
            groupCategory: this.dynamicVariableService.groupCategory(),
            groupCategoryName: 'all',
            typeOfPost: 'all',
            filters: this.dynamicVariableService.filter(),
          },
        };
        this.fetchPostsAction(0, false);
      },
      { injector: this.injector }
    );
  }

  resetCategoryFilter() {
    this.dynamicVariableService.setGroupCat('all');
  }
}
