import {
  AfterViewInit,
  Component,
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
import { interval, map } from 'rxjs';
import { GoogleSigninButtonModule } from '@abacritt/angularx-social-login';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { MatBadgeModule } from '@angular/material/badge';
import { LoadingProgressDynamicService } from 'src/app/service/loading-progress-dynamic';
import { LoadingProgressDynamic } from '../loading-progress-dynamic.component/loading-progress-dynamic.component';
import { MatChipsModule } from '@angular/material/chips';
import jalaliMoment from 'jalali-moment';
import { selectZoom } from 'src/app/+state/select';

@Component({
  selector: 'app-post',
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
  templateUrl: './post.component.html',
  styleUrl: './post.component.css',
})
export class PostComponent implements OnChanges, AfterViewInit {
  @Input() postId: any;
  @Input() typeOfShow: any;
  data: any;
  animatedFlagLike = false;
  animatedFlagrotateIcon = false;
  userLoginedLikePost: any;
  showComments = true;
  commentCounter = 100;
  userLoginedSavedPost: any;
  loadingProgressDynamicVar = '';
  shortcaseForm = true;
  IFollow = false;
  loginedUser: any;
  formComment = new FormGroup({
    comment: new FormControl(''),
  });
  commentShowFlag = false;
  attributesOfData = [
    {
      postfix: 'سال',
      title: 'سن',
      field: 'age',
    },
    {
      postfix: '',
      title: 'محل زندگی',
      field: 'city',
    },
    {
      postfix: '',
      title: 'جنسیت',
      field: 'typeofpost',
    },
    {
      postfix: '',
      title: 'جنسیت تیتراژ',
      field: 'groups',
    },
    {
      postfix: '',
      title: 'تایپ',
      field: 'typeInterrested',
    },
    {
      postfix: '',
      title: 'تجربه زندگی',
      field: 'glass',
    },
    {
      postfix: 'میلون تومان ',
      title: 'درآمد ماهیانه',
      field: 'price',
    },
    {
      postfix: '',
      title: 'خانه',
      field: 'house',
    },
    {
      postfix: '',
      title: 'اتوموبیل',
      field: 'car',
    },
    {
      postfix: '',
      title: 'مهمترین خصوصیت ',
      field: 'mainattr',
    },

    {
      postfix: '',
      title: 'رنگ چشم',
      field: 'brand',
    },
    {
      postfix: '',
      title: 'رنگ مو',
      field: 'color',
    },
    {
      postfix: '',
      title: 'اهل نوشیدنی',
      field: 'scent',
    },
    {
      postfix: '',
      title: 'دخانیات',
      field: 'sx',
    },
    {
      postfix: '',
      title: 'سطح مذهبی',
      field: 'country',
    },
    {
      postfix: '',
      title: 'رابطه باز',
      field: 'discount',
    },
    {
      postfix: 'سانتی متر',
      title: 'قد',
      field: 'height',
    },
    {
      postfix: 'کیلوگرم',
      title: 'وزن',
      field: 'weight',
    },
    {
      postfix: 'سانتی متر',
      title: 'دور بازو',
      field: 'arm',
    },
    {
      postfix: 'سانتی متر',
      title: 'زیر بغل',
      field: 'armpit',
    },
    {
      postfix: 'سانتی متر',
      title: 'دور کمر ',
      field: 'hips',
    },
    {
      postfix: 'سانتی متر',
      title: 'دور باسن ',
      field: 'thigh',
    },
    {
      postfix: 'سانتی متر',
      title: 'دور سینه',
      field: 'waist',
    },
  ];
  constructor(
    private dialog: MatDialog,
    private localStorage: LocalStorageService,
    private loadingProgressDynamicService: LoadingProgressDynamicService,
    private store: Store,
    @Inject('deviceIsPc') public deviceIsPc: boolean
  ) {}
  ngAfterViewInit(): void {
    this.scrollToBottom();
  }
  ngOnChanges(changes: SimpleChanges): void {
    const intv = interval(10000).subscribe((res) => {
      actions.preparingLoadComment({ postId: this.postId });
    });
    this.loadComments();
    this.loadingProgressDynamicFetch();
    this.checkSex();
    this.loginedUser = JSON.parse(this.localStorage.getItem('user')!)?.email;

    this.fetchFollowersSelect();
  }
  loadComments() {
    this.fetchZoomPoolAction(this.postId);
    this.fetchZoomPool(this.postId);
  }
  fetchZoomPoolAction(id: any) {
    this.store.dispatch(actions.prepareToZoomPost({ id: id }));
  }

  setLikeSavePost() {
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
  }
  fetchZoomPool(postid: any) {
    this.store
      .select(selectZoom)
      .pipe(map((res: any) => res.filter((res: any) => res.id === postid)))
      .subscribe((r) => {
        this.data = r[r.length - 1];
        this.setLikeSavePost();
        this.store.dispatch(
          actions.preparingLoadComment({ postId: this.postId })
        );
      });
  }
  scrollToBottom() {
    //const objDiv: any = document.getElementById('scrollerverticalmsg');
    //objDiv.scrollTop = objDiv.scrollHeight;
  }
  checkSex() {
    if (this.data?.typeofpost === 'خانم')
      this.attributesOfData.push({
        postfix: 'سانتی متر',
        title: 'کاپ سینه',
        field: 'sizes',
      });
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

  likePost(post: any) {
    const userLogined: any = this.localStorage.getItem('user');
    let userLoginedObject = JSON.parse(userLogined);
    userLoginedObject =
      userLoginedObject === null ? { email: 'guest' } : userLoginedObject;
    if (userLoginedObject.email === 'guest') this.activeLoginModal();
    else
      this.store.dispatch(
        actions.likePost({
          userLoginedEmail: userLoginedObject.email,
          postId: post?.id,
        })
      );

    const res = post.likes.filter(
      (res: any) => res.useremail === userLoginedObject?.email
    );
    if (res?.length === 0) {
      this.animatedFlagrotateIcon = true;
      setTimeout(() => {
        this.animatedFlagrotateIcon = false;
      }, 1000);
    }
  }

  savePost(post: any) {
    const loginedUser = JSON.parse(this.localStorage.getItem('user')!)?.email;
    const res = post.saves.filter((res: any) => res.useremail === loginedUser);
    if (res?.length === 0) {
      this.animatedFlagLike = true;
      setTimeout(() => {
        this.animatedFlagLike = false;
      }, 1000);
    }
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
    console.log(comment);
    this.loadingProgressDynamicService.loadingProgressActiveation(
      'change post type'
    );
    this.store.dispatch(
      actions.prepareDeleteComment({ id: comment?.id, postId: this.postId })
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
  returnIteration(count: number) {
    const result: any = [];
    for (let i = 0; i < count; i++) result.push('1');
    return result;
  }
  toPersianNumber(num: string) {
    let result = '';
    const numInt = parseInt(num, 10);
    const toString = String(numInt);
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
