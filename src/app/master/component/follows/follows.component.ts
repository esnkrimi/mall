import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { actions } from 'src/app/+state/action';
import { selectFollows } from 'src/app/+state/select';
import { LocalStorageService } from 'src/app/service/localstorage.service';

@Component({
  selector: 'app-follows',
  templateUrl: './follows.component.html',
  styleUrl: './follows.component.css',
})
export class FollowsComponent implements OnInit {
  componentSetting = {
    toggleHandle: 'follower',
  };
  componentVariables :any= {
    userLogined: '',
    listOfFollows: [],
  };
  constructor(
    private store: Store,
    private localstorage: LocalStorageService
  ) {}
  ngOnInit(): void {
    this.fetchUserLogined();
    this.fetchUserFollowsSelect('follower');
  }

  fetchUserLogined() {
    const userLogined: any = this.localstorage.getItem('user');
    this.componentVariables.userLogined = JSON.parse(userLogined).email;
    this.fetchUserFollowsAction(this.componentVariables.userLogined);
  }
  fetchUserFollowsAction(user: string) {
    this.store.dispatch(actions.prepareToFetchFollowers({ user: user }));
  }
  changeHandle(type: string) {
    this.componentSetting.toggleHandle = type;
    this.fetchUserFollowsSelect(type);
  }
  fetchUserFollowsSelect(type: string) {
    this.store.select(selectFollows).subscribe((res) => {
      this.componentVariables.listOfFollows =
        this.componentSetting.toggleHandle === 'follower'
          ? res[0].follower
          : res[0].following;
    });
  }
}
