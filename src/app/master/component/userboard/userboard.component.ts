import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogModule,
  MatDialog,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Ng2ImgMaxService } from 'ng2-img-max';
import { map, tap } from 'rxjs';
import { actions } from 'src/app/+state/action';
import { selectPostOfUser, selectUserProfile } from 'src/app/+state/select';
import { IUser } from 'src/app/+state/state';
import { DynamicVariableService } from 'src/app/service/dynamic.variables.services';
import { LoadingProgressDynamicService } from 'src/app/service/loading-progress-dynamic';
import { LocalStorageService } from 'src/app/service/localstorage.service';
import { selectUserBoard } from '../../../+state/select';

@Component({
  selector: 'app-userboard',
  templateUrl: './userboard.component.html',
  styleUrl: './userboard.component.css',
})
export class UserBoardComponent implements OnInit {
  @ViewChild('fileImageProfile') fileImageProfile: any;
  timestap = new Date().getSeconds();
  userEmailViaRoute = '';
  loadingProgressDynamicVar = '';
  user: any;
  constructor(
    private store: Store,
    @Inject('deviceIsPc') public deviceIsPc: boolean,
    private localstorage: LocalStorageService,
    private ng2ImgMaxService: Ng2ImgMaxService,
    private route: ActivatedRoute,
    private dynamicVariableService: DynamicVariableService,
    private loadingProgressDynamicService: LoadingProgressDynamicService
  ) {}
  ngOnInit(): void {
    this.fetchUserProfilePath();
    this.getEmailViaRoute();
  }
  getEmailViaRoute() {
    this.route.paramMap.subscribe((res: any) => {
      this.userEmailViaRoute = res.params.email;
      this.actionUserProfilePath(this.userEmailViaRoute)
    });
  }
  actionUserProfilePath(userEmailViaRoute:string) {
    this.store.dispatch(
      actions.prepareToFetchUserBoard({ email: userEmailViaRoute })
    );
  }
  fetchUserProfilePath() {
    this.store.select(selectUserBoard).subscribe(res=>{
      this.user=res[0]
    })
  }
  loadingProgressDynamicFetch() {
    this.loadingProgressDynamicService.loadingProgressActive.subscribe(
      (res) => {
        this.loadingProgressDynamicVar = res;
      }
    );
  }
}
