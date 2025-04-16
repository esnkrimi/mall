import {
  Component,
  effect,
  Inject,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogueComponent } from 'src/libs/widgets/dialogue/dialogue.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { LocalStorageService } from 'src/app/service/localstorage.service';
import { Store } from '@ngrx/store';
import { actions } from 'src/app/+state/action';
import { selectFollows } from 'src/app/+state/select';
import { map } from 'rxjs';
import { GoogleSigninButtonModule } from '@abacritt/angularx-social-login';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Route, Router, RouterModule } from '@angular/router';
import { MatBadgeModule } from '@angular/material/badge';
import { LoadingProgressDynamicService } from 'src/app/service/loading-progress-dynamic';
import { LoadingProgressDynamic } from '../loading-progress-dynamic.component/loading-progress-dynamic.component';
import { DynamicVariableService } from 'src/app/service/dynamic.variables.services';
import { MatChipsModule } from '@angular/material/chips';
import jalaliMoment from 'jalali-moment';

@Component({
  selector: 'app-post-short-unactive',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    CommonModule,
    LoadingProgressDynamic,
    GoogleSigninButtonModule,
    MatFormField,
    MatChipsModule,
    RouterModule,
    MatBadgeModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './post-short-unactive.html',
  styleUrl: './post-short-unactive.css',
})
export class PostShortUnactiveComponent implements OnChanges {
  @Input() data: any;
  @Input() typeOfShow: any;
  userLoginedLikePost: any;
  showComments = false;
  commentCounter = 10;
  userLoginedSavedPost: any;
  loadingProgressDynamicVar = '';
  shortcaseForm = true;
  IFollow = false;
  loginedUser: any;
  showDetails = false;
  formComment = new FormGroup({
    comment: new FormControl(''),
  });
  deleteConfirm = false;
  constructor(
    private dialog: MatDialog,
    private localStorage: LocalStorageService,
    private loadingProgressDynamicService: LoadingProgressDynamicService,
    private router: Router,
    private store: Store,
    private localStorageService: LocalStorageService,
    private dynamicVariableService: DynamicVariableService,
    @Inject('deviceIsPc') public deviceIsPc: boolean
  ) {}
  adminPermission = false;
  checkAdminPermission() {
    const userEmail = JSON.parse(
      this.localStorageService.getItem('user')!
    )?.email;
    this.adminPermission = this.data?.user?.email === userEmail;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.loadingProgressDynamicFetch();
    this.checkAdminPermission();
    this.loginedUser = JSON.parse(this.localStorage.getItem('user')!)?.email;
    if (JSON.parse(this.localStorage.getItem('user')!)?.email)
      this.userLoginedLikePost = this.data?.likes?.filter(
        (res: any) =>
          res?.useremail ===
          JSON.parse(this.localStorage.getItem('user')!)?.email
      );

    if (JSON.parse(this.localStorage.getItem('user')!)?.email)
      this.userLoginedSavedPost = this.data?.saves?.filter(
        (res: any) =>
          res?.useremail ===
          JSON.parse(this.localStorage.getItem('user')!)?.email
      );

    this.fetchFollowersSelect();
  }
  deletePost(post: any) {
    this.loadingProgressDynamicService.loadingProgressActiveation(
      'change profile setting'
    );
    this.store.dispatch(
      actions.prepareDeletePost({ id: post?.id, email: post?.user?.email })
    );
    setTimeout(() => {
      this.actionFetchPostOfAUser(post?.user?.email);
    }, 1000);
    this.loadingProgressDynamicService.loadingProgressDeactiveation(1500);
  }
  actionFetchPostOfAUser(email: string) {
    this.store.dispatch(actions.prepareToFetchPostsOfAUser({ email: email }));
  }
  gotoRouteWithDelay(route: any) {
    this.dynamicVariableService.loadingProgressActiveation();
    setTimeout(() => {
      this.router.navigate([route]);
      this.dynamicVariableService.loadingProgressDeactiveation();
    }, 1000);
  }
  loadingProgressDynamic(handle: string) {
    this.loadingProgressDynamicService.loadingProgressActiveation(handle);
    this.shortcaseForm = !this.shortcaseForm;
    this.loadingProgressDynamicService.loadingProgressDeactiveation(200);
  }

  loadingProgressDynamicFetch() {
    this.loadingProgressDynamicService.loadingProgressActive.subscribe(
      (res) => {
        this.loadingProgressDynamicVar = res;
      }
    );
  }
  savePost(post: any) {
    const userLogined: any = this.localStorage.getItem('user');
    let userLoginedObject = JSON.parse(userLogined);
    userLoginedObject =
      userLoginedObject === null ? { email: 'guest' } : userLoginedObject;
    if (userLoginedObject.email === 'guest') this.activeLoginModal();
    this.store.dispatch(
      actions.savePost({
        userLoginedEmail: userLoginedObject.email,
        postId: post?.id,
      })
    );
  }
  likeComment(commentId: any) {}

  deleteComment(comment: any) {
    this.loadingProgressDynamicService.loadingProgressActiveation(
      'change post type'
    );
    this.store.dispatch(
      actions.prepareDeleteComment({ id: comment?.id, postId: this.data?.id })
    );
    this.loadingProgressDynamicService.loadingProgressDeactiveation(200);
  }
  fetchFollowersSelect() {
    this.store
      .select(selectFollows)
      .pipe(
        map((res) => res?.filter((res: any) => res.id === this.data.user.id))
      )
      .subscribe((res: any) => {
        if (res !== undefined) {
          this.IFollow =
            res[0]?.follower?.filter(
              (res: any) =>
                res.email !==
                JSON.parse(this.localStorage.getItem('user')!)?.email
            )?.length > 0;
        }
      });
  }
  findPersianChar(ch: any) {
    const nums = [
      ['1', '۱'],
      ['2', '۲'],
      ['3', '۳'],
      ['4', '۴'],
      ['5', '۵'],
      ['6', '۶'],
      ['7', '۷'],
      ['8', '۸'],
      ['9', '۹'],
      ['0', '.'],
    ];
    for (let i = 0; i < nums.length; i++) {
      if (ch === nums[i][0]) {
        return nums[i][1];
      }
    }
    return ch;
  }

  toPersianNumber(num: string) {
    let result = '';
    const toString = String(num);
    for (let i = 0; i < toString.length; i++) {
      result = result + '' + this.findPersianChar(toString[i]);
    }
    return result;
  }
  otDateTime(timestamp: any) {
    const date_ =
      timestamp.substring(0, 4) +
      '/' +
      timestamp.substring(4, 6) +
      '/' +
      timestamp.substring(6, 8) +
      ' ' +
      timestamp.substring(8, 10) +
      ':' +
      timestamp.substring(10, 12);
    return (
      this.toPersianNumber(
        jalaliMoment(date_, 'YYYY/MM/DD')
          .locale('fa')
          .format('YYYY/MM/DD')
          .toLocaleString()
      ) +
      ' ' +
      jalaliMoment(date_, 'YYYY/MM/DD').locale('fa').format('ddd')
    );
  }
  shortcase(content: any) {
    const contentShort =
      content.length > 3000
        ? content.substring(1, 3000) +
          '<span class="text-light-green">' +
          ' ... بیشتر ' +
          '</span>'
        : content;
    if (!this.shortcaseForm) return content;
    else return contentShort;
  }
  likeCounter(like: any) {
    const count = like?.filter((res: any) => res.useremail);
    return this.toPersianNumber(String(count?.length));
  }
  likePost(postId: number) {
    const userLogined: any = this.localStorage.getItem('user');
    let userLoginedObject = JSON.parse(userLogined);
    userLoginedObject =
      userLoginedObject === null ? { email: 'guest' } : userLoginedObject;
    if (userLoginedObject.email === 'guest') this.activeLoginModal();
    else
      this.store.dispatch(
        actions.likePost({
          userLoginedEmail: userLoginedObject.email,
          postId: postId,
        })
      );
  }
  imageZoom(imgSrc: string) {
    const dialogRef = this.dialog.open(DialogueComponent, {
      data: { postId: 'imageZoom', imgSrc: imgSrc },
    });
  }
  activeLoginModal() {
    const dialogRef = this.dialog.open(DialogueComponent, {
      data: { postId: 'mustLogin', poolType: this.typeOfShow },
    });
  }

  addUserDestination(user: any) {
    const currentText = this.formComment.get('comment')?.value;
    this.formComment.get('comment')?.setValue(currentText + ' @' + user + ' ');
  }
  messageBoardActive(user: string) {
    this.dialog.open(DialogueComponent, {
      data: { postId: 'messageBoardActive', user: user },
    });
  }
  submitComment() {
    let userLogined: any = this.localStorage.getItem('user');
    userLogined =
      userLogined === null ? 'guest' : JSON.parse(userLogined).email;
    if (userLogined === 'guest') this.activeLoginModal();
    else {
      const comment: any = this.formComment.get('comment')?.value;
      this.data.comments;
      this.store.dispatch(
        actions.prepareToSubmitCommentOnZoom({
          loginedId: userLogined,
          postId: this.data.id,
          comment: comment,
        })
      );
    }
  }
}
