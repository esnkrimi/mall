import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { actions } from 'src/app/+state/action';
import { selectMessage } from 'src/app/+state/select';
import { LoadingProgressDynamicService } from 'src/app/service/loading-progress-dynamic';
import { LocalStorageService } from 'src/app/service/localstorage.service';
import { DialogueComponent } from 'src/libs/widgets/dialogue/dialogue.component';
import jalaliMoment from 'jalali-moment';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrl: './message.component.css',
})
export class MessageComponent implements OnInit {
  userLogined: any;
  messages: any = [];
  constructor(
    private store: Store,
    private dialog: MatDialog,
    private localstorage: LocalStorageService,
    private loadingProgressDynamicService: LoadingProgressDynamicService
  ) {}
  ngOnInit(): void {
    this.fetchUserLogined();
    this.fetchMessagesAction();
    this.fetchMessagesSelect();
  }
  messageBoardListActive(sender: string, email: string) {
    this.dialog.open(DialogueComponent, {
      data: { postId: 'messageBoardListActive', user: sender, email: email },
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
  fetchUserLogined() {
    const userLoginedJson: any = this.localstorage.getItem('user');
    this.userLogined = JSON.parse(userLoginedJson);
    return this.userLogined;
  }
  fetchMessagesAction() {
    this.store.dispatch(
      actions.prepareFetchMessage({ email: this.fetchUserLogined()?.email })
    );
  }
  fetchMessagesSelect() {
    this.store.select(selectMessage).subscribe((res) => {
      this.messages = res;
      this.loadingProgressDynamicService.loadingProgressDeactiveation(300);
    });
  }
}
