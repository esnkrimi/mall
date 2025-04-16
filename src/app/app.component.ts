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
      postfix: ' شهر ',
      min: '0',
      max: '0',
      type: 'cityid',
      name: 'cityid',
      title: 'شهر',
    },
    {
      postfix: '  ',
      min: '',
      max: '',
      type: 'select',
      name: 'glass',
      title: 'وضعیت تجرد',
    },
    {
      postfix: ' سال ',
      min: '18',
      max: '121',
      type: 'slide',
      name: 'age',
      title: 'سن',
    },
    {
      postfix: ' میلیون تومان ',
      min: '5',
      max: '80',
      type: 'slide',
      name: 'income',
      title: 'درآمد',
    },
    {
      postfix: '',
      min: '',
      max: '',
      type: 'select',
      name: 'house',
      title: 'وضعیت مسکن',
    },
    {
      postfix: '',
      min: '',
      max: '',
      type: 'select',
      name: 'car',
      title: 'اتوموبیل',
    },
    {
      postfix: '',
      min: '',
      max: '',
      type: 'select',
      name: 'region',
      title: 'مذهبی',
    },
    {
      postfix: '',
      min: '',
      max: '',
      type: 'select',
      name: 'sport',
      title: 'ورزش',
    },
    {
      postfix: '',
      min: '',
      max: '',
      type: 'select',
      name: 'smoke',
      title: 'سیگار',
    },
    {
      postfix: '',
      min: '',
      max: '',
      type: 'select',
      name: 'drink',
      title: 'نوشیدنی',
    },
    {
      postfix: '',
      min: '',
      max: '',
      type: 'select',
      name: 'openrelation',
      title: 'رابطه باز',
    },
    {
      postfix: ' سانتی متر ',
      min: '140',
      max: '220',
      type: 'slide',
      name: 'height',
      title: 'قد',
    },
    {
      postfix: ' کیلو گرم ',
      min: '30',
      max: '150',
      type: 'slide',
      name: 'weight',
      title: 'وزن',
    },
    {
      postfix: ' سانتی متر ',
      min: '20',
      max: '150',
      type: 'slide',
      name: 'arm',
      title: 'دور بازو',
    },
    {
      postfix: ' سانتی متر ',
      min: '20',
      max: '200',
      type: 'slide',
      name: 'armpit',
      title: 'زیربغل',
    },
    {
      postfix: ' سانتی متر ',
      min: '60',
      max: '120',
      type: 'slide',
      name: 'waist',
      title: 'دور سینه',
    },
    {
      postfix: ' سانتی متر ',
      min: '60',
      max: '130',
      type: 'slide',
      name: 'hips',
      title: 'دور کمر',
    },
    {
      postfix: ' سانتی متر ',
      min: '30',
      max: '250',
      type: 'slide',
      name: 'tigh',
      title: 'دور ران',
    },
    {
      postfix: '',
      min: '',
      max: '',
      type: 'select',
      name: 'bra',
      title: 'کاپ سینه',
    },
    {
      postfix: '',
      min: '',
      max: '',
      type: 'select',
      name: 'eye',
      title: 'رنگ چشم',
    },
    {
      postfix: '',
      min: '',
      max: '',
      type: 'select',
      name: 'hair',
      title: 'رنگ مو',
    },
    {
      postfix: '',
      min: '',
      max: '',
      type: 'select',
      name: 'tatto',
      title: 'تتو',
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
