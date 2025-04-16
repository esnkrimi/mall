import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { IUser } from './+state/state';
import { MatDialog } from '@angular/material/dialog';
import { DialogueComponent } from 'src/libs/widgets/dialogue/dialogue.component';
import { Store } from '@ngrx/store';
import { selectFilters, selectUser } from './+state/select';
import { actions } from './+state/action';
import { LocalStorageService } from './service/localstorage.service';
import { DynamicVariableService } from './service/dynamic.variables.services';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  filterAssigned: any = [];
  classScrollerDeactive = true;
  filter = [
    {
      postfix: ' میلیون تومان ',
      min: '5',
      max: '80',
      type: 'slide',
      name: 'price',
      title: 'قیمت',
    },
    {
      postfix: '',
      min: '',
      max: '',
      type: 'select',
      name: 'country',
      title: 'کشور سازنده',
    },
    {
      postfix: '',
      min: '',
      max: '',
      type: 'select',
      name: 'sx',
      title: 'مناسب برای',
    },
    {
      postfix: '',
      min: '',
      max: '',
      type: 'select',
      name: 'scent',
      title: 'گروه بویایی',
    },
    {
      postfix: '',
      min: '',
      max: '',
      type: 'select',
      name: 'discount',
      title: ' درصد تخفیف',
    },
    {
      postfix: '',
      min: '',
      max: '',
      type: 'select',
      name: 'sizes',
      title: 'سایز',
    },
    {
      postfix: '',
      min: '',
      max: '',
      type: 'select',
      name: 'brand',
      title: 'برند',
    },
    {
      postfix: '',
      min: '',
      max: '',
      type: 'select',
      name: 'color',
      title: 'رنگ',
    },
    {
      postfix: '',
      min: '',
      max: '',
      type: 'select',
      name: 'material',
      title: 'جنس',
    },
  ];
  userLoginedObject: IUser | undefined;
  showMenu = false;
  componentSetting: any = {
    visualDirectives: {
      loadingProgressActive: false,
      routeFrom: '',
    },
    settingVariables: {
      offset: 0,
      groupCategory: 'all',
      typeOfPost: 'all',
    },
  };
  constructor(
    @Inject('deviceIsPc') public deviceIsPc: boolean,
    private store: Store,
    private dynamicVariableService: DynamicVariableService,
    private localStorageService: LocalStorageService,
    private dialog: MatDialog
  ) {}
  showMenuListener() {
    this.dynamicVariableService.showMenu.subscribe(
      (res) => (this.showMenu = res)
    );
  }
  showWhatIsMyWebsite() {
    //  this.localStorageService?.clear()
    const showKnowUs = this.localStorageService?.getItem('showKnowUs');
    if (showKnowUs !== 'no') {
      this.dialog.open(DialogueComponent, {
        data: { postId: 'knowUs' },
      });
    }
  }
  ngOnInit(): void {
    this.fetchUserLogined();
    this.fetchUserFromStorage();
    this.fetchLoadingProgressStatus();
    this.fetchIdFromRoute();
    // this.showWhatIsMyWebsite();
    this.showMenuListener(); 
    this.fetchFiltersAction();
  }
  fetchIdFromRoute() {
    this.dynamicVariableService.pathRoute.subscribe((res) => {
      this.componentSetting = {
        visualDirectives: {
          loadingProgressActive: false,
          routeFrom: res,
        },
        settingVariables: {
          offset: 0,
          groupCategory: 'all',
          typeOfPost: 'all',
        },
      };
    });
  }

  @HostListener('window:scroll', ['$event'])
  takeScroller(event: any) {
    // console.debug("Scroll Event", document.body.scrollTop);
    // see András Szepesházi's comment below
    if (!(window.pageYOffset < window.innerHeight / 2)) {
      this.classScrollerDeactive = false;
    } else {
      this.classScrollerDeactive = true;
    }
  }

  assignNewFilter(filter: any) {
    this.filterAssigned = this.filterAssigned.filter(
      (res: any) => res.title !== filter.title
    );
    this.filterAssigned.push(filter);
    this.dynamicVariableService.setFilter(this.filterAssigned);
  }
  removeFilter(filter: any) {
    this.filterAssigned = this.filterAssigned.filter(
      (res: any) => res.title !== filter.title
    );
    this.dynamicVariableService.setFilter(this.filterAssigned);
  }
  fetchFiltersAction() {
    this.store.dispatch(actions.prepareFetchAllFilterDistinctInExpTable());
  }
  fetchUserLogined() {
    this.store.select(selectUser).subscribe((user: IUser) => {
      if (user?.email?.length > 2) this.saveToStorage(user);
      this.userLoginedObject = user;
    });
  }
  saveToStorage(user: IUser) {
    this.localStorageService.setItem('user', JSON.stringify(user));
  }
  fetchUserFromStorage() {
    const user: any = this.localStorageService?.getItem('user');
    let userObject: any;
    if (user) {
      userObject = JSON.parse(user);
      userObject!.idToken = '';
    }
    if (userObject?.email?.length > 2) {
      this.store.dispatch(actions.login({ user: userObject }));
    }
  }
  fetchLoadingProgressStatus() {
    this.dynamicVariableService.loadingProgressActive.subscribe((res) => {
      this.componentSetting.visualDirectives.loadingProgressActive = res;
    });
  }
}
