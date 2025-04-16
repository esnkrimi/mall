import {
  GoogleLoginProvider,
  GoogleSigninButtonModule,
  SocialAuthService,
  SocialLoginModule,
} from '@abacritt/angularx-social-login';
import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnInit,
  QueryList,
  Renderer2,
  ViewChild,
  viewChild,
  ViewChildren,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  NgModel,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Store } from '@ngrx/store';
import { NgMagnizoomModule } from 'ng-magnizoom';
import { Subscription } from 'rxjs';
import { actions } from 'src/app/+state/action';
import { IComments } from 'src/app/+state/state';
import { LoadingProgressDynamicService } from 'src/app/service/loading-progress-dynamic';
import { LocalStorageService } from 'src/app/service/localstorage.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { selectAllMessage } from 'src/app/+state/select';
import { LoadingProgressDynamic } from 'src/libs/widgets/loading-progress-dynamic.component/loading-progress-dynamic.component';
import { selectUser } from '../../../app/+state/select';

@Component({
  selector: 'app-dialogue',
  standalone: true,
  imports: [
    CommonModule,
    NgMagnizoomModule,
    MatSnackBarModule,
    MatInputModule,
    GoogleSigninButtonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatDialogModule,
    MatButtonModule,
    MatButtonModule,
    LoadingProgressDynamic,
  ],
  templateUrl: './dialogue.component.html',
  styleUrl: './dialogue.component.css',
})
export class DialogueComponent implements OnInit {
  loadingProgressDynamicVar = '';
  sentenceKnowUs = [
    'فقط با کمک همه که میتونیم مشکلات رو شکست بدیم',
    '!میخوای از تجریبات بقیه استفاده کنی و بعد تصمیم به خرید بگیری',
    '!دنبال یک نفر میگردی که قبلا جایی که میخای بری رو رفته باشه',
    '!تو انتخاب شغل مردد هستی و به همفکری بیشتری نیاز داری',
    '!برای سرمایه گذاری به مشورت نیاز داری',
    '!دنبال بهترین راه برای یادگیری یک هدف می گردی',
    '!میخای از تجربه بقیه برای انتخاب دکتر مورد نظرت استفاده کنی ',
    '!اینجا جاییه که میتونی جواب مشکلات و سوالاتتو از بقیه بپرسی',
    '!همچنین میتونی تجربیاتی که داریو برای بقیه به اشتراک بگذاری',
  ];

  outPutAnimatedString = '';
  activeNextButton = true;
  sentenceKnowUsStep: any = 0;
  displayFrameImage = true;
  comments: IComments[];
  formComment = new FormGroup({
    comment: new FormControl(''),
  });
  loginForm = new FormGroup({
    mobile: new FormControl<string>('', [
      Validators.required,
      Validators.max(9999999999),
      Validators.min(9000000000),
    ]),
    code: new FormControl<string>(''),
  });

  messageForm = new FormGroup({
    message: new FormControl<string>(''),
  });

  position = { x: 200, y: 100 };
  zoom = 9;
  formLoginStep = 0;
  showLoadingWaitFlag = true;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(MAT_DIALOG_DATA) public PoolType: string,
    @Inject('deviceIsPc') public deviceIsPc: boolean,
    private socialAuthService: SocialAuthService,
    private localStorageService: LocalStorageService,
    private dialogRef: MatDialogRef<DialogueComponent>,
    private store: Store,
    private matSnackBar: MatSnackBar,
    private dialog: MatDialog,
    private loadingProgressDynamicService: LoadingProgressDynamicService
  ) {
    this.comments = [];
  }
  subscription: Subscription | undefined;
  debounceTime = 500;
  messageList: any = [];
  userLogined: any;
  seenMessage() {
    this.store.dispatch(
      actions.prepareToSeenMessage({
        sender: this.data.user,
        receiver: this.data.email,
      })
    );
  }
  ngOnInit(): void {
    if (this.data?.postId === 'messageBoardListActive') this.seenMessage();
    this.showLoadingWait();
    this.loadingProgressDynamicFetch();
    if (!this.deviceIsPc) this.sentenceKnowUsStep++;
    this.selectGoogleAuth();
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
    const showKnowUs = this.localStorageService?.getItem('showKnowUs');
    this.displayFrameImage = showKnowUs === 'no' ? false : true;
    this.charAnimatedLoad();
    const userLoginedJson: any = this.localStorageService.getItem('user');
    this.userLogined = JSON.parse(userLoginedJson).email;
    if (this.data?.postId === 'messageBoardListActive') {
      this.fetchMessageChatAction(this.data?.user, this.data?.email);
      this.fetchMessageChatSelect();
    }
  }
  fetchMessageChatAction(sender: any, receiver: any) {
    this.store.dispatch(
      actions.prepareFetchAllMessage({ sender: sender, receiver: receiver })
    );
  }
  fetchMessageChatSelect() {
    this.store.select(selectAllMessage).subscribe((res) => {
      this.messageList = res;
    });
  }

  showLoadingWait() {
    setTimeout(() => {
      this.showLoadingWaitFlag = false;
    }, 2000);
  }
  async charAnimatedLoad() {
    this.outPutAnimatedString = '';
    if (this.sentenceKnowUsStep <= 9) {
      await this.charAnimated(this.sentenceKnowUs[this.sentenceKnowUsStep]);
      this.sentenceKnowUsStep =
        this.sentenceKnowUsStep <= 9 ? this.sentenceKnowUsStep + 1 : 9;
    }
  }
  charAnimated(words: any) {
    let counter = 0;
    this.activeNextButton = false;
    const interval = setInterval(() => {
      this.outPutAnimatedString = this.outPutAnimatedString + words[counter++];
      if (counter === words.length) {
        clearInterval(interval);
        this.activeNextButton = true;
      }
    }, 20);
  }
  //sentenceKnowUsStep = sentenceKnowUsStep < 5 ? sentenceKnowUsStep + 1 : 5
  stringLength(source: string) {
    return source.split('');
  }
  sendMessage(email: string, close: boolean) {
    const userLoginedJson: any = this.localStorageService.getItem('user');
    const userLogined = JSON.parse(userLoginedJson).email;
    this.loadingProgressDynamicService.loadingProgressActiveation(
      'change post type'
    );
    this.store.dispatch(
      actions.sendMessage({
        email: email,
        sender: userLogined,
        message: this.messageForm.value.message,
      })
    );
    this.loadingProgressDynamicService.loadingProgressDeactiveation(300);
    if (close) {
      setTimeout(() => {
        this.sendSnack('پیغام شما ارسال شد');
      }, 1000);
      this.close();
    } else this.fetchMessageChatAction(this.data?.user, this.data?.email);
  }
  loadingProgressDynamicFetch() {
    this.loadingProgressDynamicService.loadingProgressActive.subscribe(
      (res) => {
        this.loadingProgressDynamicVar = res;
      }
    );
  }
  sendSnack(message: string) {
    this.matSnackBar.open(message,"");
    setTimeout(() => {
    this.matSnackBar.dismiss()
    }, 2500);
  }

  sendCodeMobile() {
    this.loadingProgressDynamicService.loadingProgressActiveation(
      'wait login authentication to be done'
    );
    this.store.dispatch(
      actions.sendMobileCode({ mobile: this.loginForm.value.mobile })
    );
    this.loadingProgressDynamicService.loadingProgressDeactiveation(800);
    setTimeout(() => {
      this.formLoginStep = 1;
    }, 300);
  }
  errorShow(error: string) {
    this.dialog.open(DialogueComponent, {
      data: { postId: 'error', data: error },
    });
  }
  loginViaMobile() {
    this.loadingProgressDynamicService.loadingProgressActiveation(
      'wait login authentication to be done'
    );
    this.store.dispatch(
      actions.prepareToLoginViaMobile({
        mobile: this.loginForm.value.mobile,
        code: this.loginForm.value.code,
      })
    );
    setTimeout(() => {
      this.store.select(selectUser).subscribe((res) => {
        if (Number(res?.id) > 0) location.reload();
        else {
          this.loadingProgressDynamicService.loadingProgressDeactiveation(800);
          alert('نام کاربری و یا کلمه عبور صحیحی نمی باشد');
        }
      });
    }, 1000);
  }

  activeLoginModal() {
    this.dialog.open(DialogueComponent, {
      data: { postId: 'mustLogin', poolType: 'main' },
    });
  }

  signInWithGoogle(): void {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  selectGoogleAuth() {
    this.socialAuthService.authState.subscribe((user) => {
      this.store.dispatch(actions.login({ user: user }));
      setTimeout(() => {
        // location.reload();
      }, 1000);
    });
  }

  close() {
    this.dialogRef.close();
  }

  closeEver() {
    this.dialogRef.close();
    this.localStorageService?.setItem('showKnowUs', 'no');
  }
}
