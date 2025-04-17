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

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  @ViewChild('fileImageProfile') fileImageProfile: any;
  timestap = new Date().getSeconds();
  adminPrivilige = false;
  userEmailViaRoute = '';
  userLogined: any;
  user: any = {
    profile: {},
    post: {},
  };
  componentSetting = {
    variables: {
      pathRouteOfProfile: '',
    },
  };
  loadingProgressDynamicVar = '';
  myFiles: any = [];
  constructor(
    private store: Store,
    @Inject('deviceIsPc') public deviceIsPc: boolean,
    private localstorage: LocalStorageService,
    private route: ActivatedRoute,
    private ng2ImgMaxService: Ng2ImgMaxService,
    private dialog: MatDialog,
    private http: HttpClient,
    private dynamicVariableService: DynamicVariableService,
    private loadingProgressDynamicService: LoadingProgressDynamicService
  ) {}
  ngOnInit(): void {
    this.fetchUserLogined();
    this.getEmailViaRoute();
    this.checkPriviligeAdmin();
    this.actionFetchPostOfAUser();
    this.actionFetchUserProfile();
    this.selectFetchPostOfAUser();
    this.loadingProgressDynamicFetch();
    this.selectFetchUserProfile();
    this.changePathVariable();
    this.fetchUserProfilePath();
    this.fetchRouteParams();
  }
  fetchRouteParams() {
    this.route.paramMap.subscribe((res: any) => {
      if (res.params.action)
        this.componentSetting = {
          variables: {
            pathRouteOfProfile: res.params.action,
          },
        };
    });
  }
  loadingProgressDynamicFetch() {
    this.loadingProgressDynamicService.loadingProgressActive.subscribe(
      (res) => {
        this.loadingProgressDynamicVar = res;
      }
    );
  }
  clearLoginedUser() {
    this.localstorage.clear();
  }

  fetchUserProfilePath() {
    this.dynamicVariableService.pathRouteOfProfile.subscribe((res) => {
      if (res === 'exit') {
        this.clearLoginedUser();
        window.location.href = '/';
      }
      this.componentSetting = {
        variables: {
          pathRouteOfProfile: res,
        },
      };
    });
  }
  fetchUserLogined() {
    const userLogined: any = this.localstorage.getItem('user');
    this.userLogined = JSON.parse(userLogined);
  }
  getEmailViaRoute() {
    this.route.paramMap.subscribe((res: any) => {
      this.userEmailViaRoute = res.params.email;
    });
  }
  checkPriviligeAdmin() {
    let userLogined: any = this.localstorage.getItem('user');
    userLogined = JSON.parse(userLogined);
    if (userLogined.email === this.userEmailViaRoute)
      this.adminPrivilige = true;
    else this.adminPrivilige = false;
  }
  changePathVariable() {
    this.dynamicVariableService.pathRoute.next('profile');
  }
  actionFetchPostOfAUser() {
    this.store.dispatch(
      actions.prepareToFetchPostsOfAUser({ email: this.userLogined.email })
    );
  }
  onFileChange(event: any) {
    this.loadingProgressDynamicService.loadingProgressActiveation(
      'change profile picture'
    );
    this.myFiles = [];
    for (let i = 0; i < event.target.files.length; i++) {
      if (event.target.files[i].size > 1000000) {
        this.resizeImage(event.target.files[i]);
      } else this.myFiles.push(event.target.files[i]);
    }
    this.submitFile();
  }
  resizeImage(file: File) {
    this.ng2ImgMaxService.compressImage(file, 0.5).subscribe(
      (result: any) => {
        this.myFiles.push(result);
      },
      (error) => {}
    );
  }
  selectFile() {
    this.fileImageProfile.nativeElement.click();
  }
  submitFile() {
    const formData = new FormData();
    this.myFiles = this.myFiles.reverse();
    for (let i = 0; i < this.myFiles.length; i++) {
      formData.append('file[]', this.myFiles[i]);
    }
    this.http
      .post(
        'https://burjcrown.com/drm/mall/index.php?id=11&email=' +
          this.userLogined.email,
        formData
      )
      .subscribe((res) => {
        this.loadingProgressDynamicService.loadingProgressDeactiveation(300);
        this.timestap = new Date().getSeconds();
      });
  }

  selectFetchPostOfAUser() {
    this.store
      .select(selectPostOfUser)
      .pipe(
        map((res: any) =>
          res.filter((res: any) => res.user.email === this.userLogined.email)
        )
      )
      .subscribe((res: any) => {
        this.user.post = res;
      });
  }

  actionFetchUserProfile() {
    this.store.dispatch(
      actions.prepareToFetchUserProfile({ email: this.userLogined.email })
    );
  }

  selectFetchUserProfile() {
    this.store
      .select(selectUserProfile)
      .pipe(map((res) => res.filter((res) => res.id === '1')))
      .subscribe((res) => {
        this.user.profile = res[0];
        this.dynamicVariableService.loadingProgressDeactiveation();
      });
  }

  openDialogEditProfile() {
    const dialogRef = this.dialog.open(DialogContentEditProfile, {
      data: { userProfile: this.user.profile },
    });
    dialogRef.afterClosed().subscribe((result: any) => {});
  }
}

@Component({
  selector: 'dialog-edit-profile',
  templateUrl: 'edit-profile.html',
  styleUrl: './edit-profile.css',
  standalone: true,
  imports: [
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
})
export class DialogContentEditProfile {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private store: Store,
    private route: ActivatedRoute,
    private localstorage: LocalStorageService,
    private dynamicVariableService: DynamicVariableService
  ) {}
  formEditProfile = new FormGroup({
    firstName: new FormControl(this.data.userProfile.name),
    lastName: new FormControl(this.data.userProfile.family),
    job: new FormControl(this.data.userProfile.job),
    email2: new FormControl(this.data.userProfile.email2),
    telegram: new FormControl(this.data.userProfile.telegram),
    instagram: new FormControl(this.data.userProfile.instagram),
    whatsapp: new FormControl(this.data.userProfile.whatsapp),
  });

  updateProfile() {
    this.dynamicVariableService.loadingProgressActiveation();
    let formObject: any = {
      firstName: '',
      lastName: '',
    };
    formObject = this.formEditProfile.value;
    const userLogined: any = this.localstorage.getItem('user');
    const userLoginedEmail: string = JSON.parse(userLogined).email;
    formObject = { ...formObject, email: userLoginedEmail };
    setTimeout(() => {
      this.store.dispatch(
        actions.prepareUpdateProfile({ formObject: formObject })
      );
    }, 500);
  }
}
