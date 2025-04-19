import { HttpClient, HttpClientModule } from '@angular/common/http';
import {
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Ng2ImgMaxService } from 'ng2-img-max';
import { actions } from 'src/app/+state/action';
import {
  selectCategory,
  selectCitySelectedOfProvince,
  selectGroupCats,
  selectProvinces,
} from 'src/app/+state/select';
import { IProvince } from 'src/app/+state/state';
import { DynamicVariableService } from 'src/app/service/dynamic.variables.services';
import { LoadingProgressDynamicService } from 'src/app/service/loading-progress-dynamic';
import { LocalStorageService } from 'src/app/service/localstorage.service';

@Component({
  selector: 'app-newpost',
  templateUrl: './newpost.component.html',
  styleUrl: './newpost.component.css',
})
export class NewpostComponent implements OnInit {
  [x: string]: any;
  @ViewChild('file') file: any;
  formNewPost = new FormGroup({
    userEmail: new FormControl(''),
    group: new FormControl('1', Validators.required),
    title: new FormControl('', Validators.required),
    category: new FormControl(''),
    content: new FormControl('', Validators.required),
    color: new FormControl(''),
    count: new FormControl('1'),
    brand: new FormControl(''),
    sizes: new FormControl('A'),
    price: new FormControl('10'),
    material: new FormControl(''),
    sx: new FormControl('اصلا'),
    scent: new FormControl('اصلا'),
    country: new FormControl('iran'),
    discount: new FormControl('0'),
    cityid: new FormControl(''),
    provinceid: new FormControl(''),
  });
  @ViewChild('title') titleInput: ElementRef | undefined;
  @ViewChild('content') content: ElementRef | undefined;
  existsSet: any = [];
  myFiles: any = [];
  groupCats: any = [];
  categories: any = [];
  allCategories: any = [];
  selectedCategory: any = [];
  selectedCategorySet: any = [];
  pageOfForm = 1;
  lockStep = false;
  loadingProgress: any;
  usePicture = true;
  profileImage: any;
  provinces: IProvince[] = [];
  cities: any = [];
  provinceidSelected: any;
  sexSelected = '';
  successSubmit = false;
  constructor(
    private ng2ImgMaxService: Ng2ImgMaxService,
    private dynamicVariableService: DynamicVariableService,
    private localStorageService: LocalStorageService,
    private sanitizer: DomSanitizer,
    private store: Store,
    private loadingProgressDynamicService: LoadingProgressDynamicService
  ) {}

  ngOnInit(): void {
    this.dynamicVariableService.loadingProgressDeactiveation();
    this.loadingProgressDynamicFetch();
    this.fetchGroupCatsAction();
    this.fetchGroupCats();
    this.fetchPostCategoriesAction();
    this.fetchAllProvinceAction();
    this.changeProvince('7');
    this.fetchCities();
    this.fetchAllProvinceSelect();
    this.fetchPostCategoriesSelect();
    this.listenToFetchCategory();
  }
  loadingProgressDynamicFetch() {
    this.loadingProgressDynamicService.loadingProgressActive.subscribe(
      (res) => {
        this.loadingProgress = res;
      }
    );
  }

  showLoadingProgress(msg: string) {
    this.loadingProgressDynamicService.loadingProgressActiveation(msg);
    this.loadingProgressDynamicService.loadingProgressDeactiveation(2000);
  }
  isWordSimilar(word1: any, word2: any) {
    const sim1 = word1?.includes(word2);
    return sim1 > 0;
  }
  listenToFetchCategory() {
    this.formNewPost.get('category')?.valueChanges.subscribe((ch: any) => {
      this.categories = [];
      const tmp = this.allCategories?.filter((res: any) =>
        this.isWordSimilar(res.name, ch)
      );
      if (ch.length > 0) {
        this.categories = tmp.slice(0, 5);
      }
      if (this.categories.length === 0) {
        this.categories.push({ name: ch });
      }
    });
  }
  addExists() {
    this.existsSet.push({
      size: this.formNewPost.get('sizes')?.value,
      color: this.formNewPost.get('color')?.value,
      count: this.formNewPost.get('count')?.value,
    });
    console.log(this.existsSet);
  }
  setSex(sex: string) {
    this.formNewPost.get('sx')?.setValue(sex);
    this.sexSelected = sex;
    this.showSexStepChangedProgress();
  }
  makeCategory(item: any) {
    this.selectedCategory.push(item);
    this.lockStep = true;
    this.selectedCategorySet = new Set(this.selectedCategory);
    this.formNewPost.get('category')?.setValue('');
    this.categories = [];
  }
  checkContent() {
    /* const contentLength: any = this.formNewPost.get('content')?.value;
    if (contentLength.length > 10) this.lockStep = true;
    else this.lockStep = false;*/
  }
  fetchGroupCatsAction() {
    this.store.dispatch(actions.prepareToFetchGroupCats());
  }
  fetchGroupCats() {
    this.store.select(selectGroupCats).subscribe((res) => {
      this.groupCats = res;
    });
  }
  fetchAllProvinceAction() {
    this.store.dispatch(actions.prepareFetchAllProvince());
  }
  fetchAllProvinceSelect() {
    this.store.select(selectProvinces).subscribe((res: any) => {
      this.provinces = res;
      this.formNewPost.get('provinceid')?.setValue('7');
    });
  }
  fetchCities() {
    this.store.select(selectCitySelectedOfProvince).subscribe((res: any) => {
      this.cities = res;
      this.formNewPost.get('cityid')?.setValue(res[0]?.id);
    });
  }
  changeProvince(provinceid: any) {
    this.store.dispatch(actions.prepareFetchCity({ provinceid: provinceid }));
  }
  selectFile() {
    this.file.nativeElement.click();
  }
  onFileChange(event: any) {
    this.myFiles = [];
    for (let i = 0; i < event.target.files.length; i++) {
      if (event.target.files[i].size > 1000000) {
        this.resizeImage(event.target.files[i]);
      } else this.myFiles.push(event.target.files[i]);
    }
    if (this.pageOfForm === 6) this.pageOfForm++;
    this.updateImage(this.myFiles);
    this.showLoadingProgress('wait login authentication to be done');
  }
  showSexStepChangedProgress() {
    this.showLoadingProgress('sex changed');
  }
  fetchPostCategoriesAction() {
    this.store.dispatch(actions.prepareToFetchPostCategory());
  }
  fetchPostCategoriesSelect() {
    this.store.select(selectCategory).subscribe((res) => {
      this.allCategories = res;
    });
  }
  resizeImage(file: File) {
    this.ng2ImgMaxService.compressImage(file, 0.5).subscribe(
      (result: any) => {
        this.myFiles.push(result);
      },
      (error) => {}
    );
  }
  submitFile() {
    this.dynamicVariableService.loadingProgressActiveation();
    let user: any = this.localStorageService?.getItem('user');
    user = JSON.parse(user);
    const formData = new FormData();
    this.myFiles = this.myFiles.reverse();
    let tmpContent: any = this.formNewPost.get('content')?.value;
    tmpContent = encodeURIComponent(tmpContent);
    let tmpTitle: any = this.formNewPost.get('title')?.value;
    tmpTitle = encodeURIComponent(tmpTitle);
    this.formNewPost.get('title')?.setValue(tmpTitle);
    this.formNewPost.get('userEmail')?.setValue(user?.email);
    this.formNewPost.get('content')?.setValue(tmpContent);
    this.formNewPost
      .get('category')
      ?.setValue(Array.from(this.selectedCategorySet).toString());

    for (let i = 0; i < this.myFiles.length; i++) {
      formData.append('file[]', this.myFiles[i]);
    }

    this.store.dispatch(
      actions.prepareToSubmitPost({
        existsSet: this.existsSet,
        formValues: this.formNewPost.value,
        formData: formData,
      })
    );
    setTimeout(() => {
      this.dynamicVariableService.loadingProgressDeactiveation();
      // this.pageOfForm = 0;
      // this.router.navigate(['feature/profile/' + user.email + '/myPosts']);
      this.successSubmit = true;
    }, 1500);
  }

  removeFromCategory(cat: string) {
    for (let i = 0; i < this.selectedCategory.length; i++) {
      if (cat === this.selectedCategory[i]) {
        this.selectedCategory[i] = '';
      }
    }
    const checkFilledSteps = this.selectedCategory.filter(
      (res: any) => res !== ''
    );
    this.selectedCategory = checkFilledSteps;
    if (checkFilledSteps.length === 0) this.lockStep = false;
    this.selectedCategorySet = new Set(this.selectedCategory);
  }
  formatLabelCm(value: number): string {
    return Math.round(value) + ' سانتی متر';
  }
  formatLabelMoney(value: number): string {
    return Math.round(value) + 'میلیون تومان';
  }
  formatLabelAge(value: number): string {
    return Math.round(value) + 'سال';
  }
  formatLabelWeight(value: number): string {
    return Math.round(value) + 'کیلو گرم';
  }
  updateImage(ev: any) {
    this.profileImage = this.sanitizer.bypassSecurityTrustUrl(
      window.URL.createObjectURL(ev[0])
    );
  }
}
