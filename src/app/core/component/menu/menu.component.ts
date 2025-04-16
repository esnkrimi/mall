import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { actions } from 'src/app/+state/action';
import { selectGroupCats } from 'src/app/+state/select';
import { DynamicVariableService } from 'src/app/service/dynamic.variables.services';
import { LoadingProgressDynamicService } from 'src/app/service/loading-progress-dynamic';

@Component({
  selector: 'app-menu',
  standalone: false,

  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
})
export class MenuComponent implements OnInit {
  groupCats: any = [];
  groupIDSelected: any;
  constructor(
    private store: Store,
    @Inject('deviceIsPc') public deviceIsPc: boolean,
    private dynamicVariableService: DynamicVariableService
  ) {}
  ngOnInit(): void {
    this.fetchGroupCatsAction();
    this.fetchGroupCats();
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
  fetchGroupCatsAction() {
    this.store.dispatch(actions.prepareToFetchGroupCats()); 
  }
  fetchGroupCats() {
    this.store.select(selectGroupCats).subscribe((res) => {
      this.groupCats = res;
    });
  }
  autocompleteSearch(searchWord: any): any {
    return this.store.dispatch(
      actions.prepareToSearchPostByWord({ word: searchWord })
    );
  }
  selectGroupCat(groupId: any) {
    this.autocompleteSearch('RESET123');
    this.groupIDSelected = groupId;
    this.hideBranches();
    this.dynamicVariableService.setGroupCat(groupId);
  }
  hideBranches() {
    this.dynamicVariableService.showMenu.next(false);
  }
}
