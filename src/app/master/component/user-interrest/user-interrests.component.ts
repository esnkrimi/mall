import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { LocalStorageService } from 'src/app/service/localstorage.service';
import { actions } from 'src/app/+state/action';
import { selectCategory, selectUserProfile } from 'src/app/+state/select';
import { FormControl, FormGroup } from '@angular/forms';
import { map, tap } from 'rxjs';
import { LoadingProgressDynamicService } from 'src/app/service/loading-progress-dynamic';

@Component({
  selector: 'app-user-interrests',
  templateUrl: './user-interrests.component.html',
  styleUrl: './user-interrests.component.css',
})
export class UserInterrestsComponent implements OnInit {
  @Input() deviceIsPc: any;
  allCategories: any = [];
  selectedCategory: any = [];
  selectedCategorySet: any = [];
  formCategory = new FormGroup({
    category: new FormControl(''),
  });
  categories: any = [];
  constructor(
    private store: Store,
    private localStoreageService: LocalStorageService,
    private loadingProgressDynamicService: LoadingProgressDynamicService
  ) {}
  ngOnInit(): void {
    this.fetchCategoriesAction();
    this.fetchCategoriesSelect();
    this.listenToFetchCategory();
    this.fetchUserProfileInterrests();
  }
  fetchUserLogined() {
    const userLogined: any = this.localStoreageService.getItem('user');
    return JSON.parse(userLogined);
  }
  isWordSimilar(word1: any, word2: any) {
    const sim1 = word1?.includes(word2);
    return sim1 > 0;
  }
  listenToFetchCategory() {
    this.formCategory.get('category')?.valueChanges.subscribe((ch: any) => {
      this.categories = [];
      const tmp = this.allCategories?.filter((res: any) =>
        this.isWordSimilar(res.name, ch)
      );
      if (ch.length > 0) this.categories = tmp.slice(0, 5);
    });
  }
  fetchCategoriesAction() {
    this.store.dispatch(actions.prepareToFetchPostCategory());
  }
  fetchCategoriesSelect() {
    this.store.select(selectCategory).subscribe((res) => {
      this.allCategories = res;
    });
  }
  fetchUserProfileInterrests() {
    this.store.select(selectUserProfile).subscribe((res) => {
      this.loadingProgressDynamicService.loadingProgressDeactiveation(300);
      this.selectedCategory = res[0]?.interrests;
      this.selectedCategorySet = new Set(this.selectedCategory);
    });
  }
  makeCategory(item: any) {
    const isExists = this.selectedCategory.filter(
      (res: any) => res.name === item.name
    );
    if (isExists.length === 0) {
      this.selectedCategory = [...this.selectedCategory, item];
      this.selectedCategorySet = new Set(this.selectedCategory);
      this.formCategory.get('category')?.setValue('');
      this.makeCategoryBackend(
        this.fetchUserLogined().email,
        item.catid,
        'add'
      );
    } else {
      this.categories = [];
    }
  }
  makeCategoryBackend(user: any, catid: string, action: string) {
    this.store.dispatch(
      actions.prepareToMakeCategoryInterrested({
        user: user,
        catid: catid,
        action: action,
      })
    );
  }
  removeFromCategory(catName: string) {
    this.selectedCategory = [...this.selectedCategory];
    for (let i = 0; i < this.selectedCategory.length; i++) {
      if (catName === this.selectedCategory[i].name) {
        this.selectedCategory[i] = '';
      }
    }
    this.selectedCategorySet = new Set(this.selectedCategory);
    this.findCatidByCatname(catName);
  }
  findCatidByCatname(catName: string) {
    this.store
      .select(selectCategory)
      .pipe(map((res) => res.filter((res) => res.name === catName)))
      .subscribe((res: any) => {
        this.makeCategoryBackend(
          this.fetchUserLogined().email,
          res[0].id,
          'remove'
        );
      });
  }
}
