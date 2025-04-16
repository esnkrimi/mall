import {
  Component,
  effect,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  Output,
  output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogueComponent } from 'src/libs/widgets/dialogue/dialogue.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { LocalStorageService } from 'src/app/service/localstorage.service';
import { Store } from '@ngrx/store';
import { actions } from 'src/app/+state/action';
import {
  selectCitySelectedOfProvince,
  selectFilters,
  selectFollows,
  selectProvinces,
} from 'src/app/+state/select';
import { map } from 'rxjs';
import { GoogleSigninButtonModule } from '@abacritt/angularx-social-login';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterModule } from '@angular/router';
import { MatBadgeModule } from '@angular/material/badge';
import { LoadingProgressDynamicService } from 'src/app/service/loading-progress-dynamic';
import { LoadingProgressDynamic } from '../loading-progress-dynamic.component/loading-progress-dynamic.component';
import { DynamicVariableService } from 'src/app/service/dynamic.variables.services';
import { MatChipsModule } from '@angular/material/chips';
import jalaliMoment from 'jalali-moment';
import { MatSliderModule } from '@angular/material/slider';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { IProvince } from 'src/app/+state/state';
import { BrowserModule } from '@angular/platform-browser';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    CommonModule,
    LoadingProgressDynamic,
    GoogleSigninButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatOptionModule,
    BrowserModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormField,
    MatChipsModule,
    RouterModule,
    MatSliderModule,
    MatBadgeModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.css',
})
export class FilterComponent implements OnChanges {
  @Input() filter: any;
  @Output() returnValue = new EventEmitter<any>();
  filterData: any = [];
  filterValueMin: any;
  filterValueMax: any;
  filterValue: any;
  rangeData: any = [];
  provinces: IProvince[] = [];
  cities: any = [];

  provinceidSelected: any = 'ssss';
  formFilter = new FormGroup({
    filter: new FormControl(''),
    provinceid: new FormControl(''),
    cityid: new FormControl(''),
  });
  constructor(
    private store: Store,
    private router: Router,
    @Inject('deviceIsPc') public deviceIsPc: boolean
  ) {}
  ngOnChanges(changes: SimpleChanges): void {
    if (this.filter.type === 'select') this.fetchFiltersSelect();
    else this.setMinMaxSlider();
    this.fetchAllProvinceAction();
    this.fetchAllProvinceSelect();
    this.fetchCities();
  }
  setMinMaxSlider() {}
  fetchAllProvinceAction() {
    this.store.dispatch(actions.prepareFetchAllProvince());
  }
  fetchCities() {
    this.store.select(selectCitySelectedOfProvince).subscribe((res: any) => {
      this.cities = res;
      this.formFilter.get('cityid')?.setValue(res[0]?.id);
    });
  }
  fetchAllProvinceSelect() {
    this.store.select(selectProvinces).subscribe((res: any) => {
      this.provinces = res;
    });
  }
  changeProvince(provinceid: any) {
    this.store.dispatch(actions.prepareFetchCity({ provinceid: provinceid }));
  }
  trackFilter() {
    this.router.navigate(['']);
    if (this.filterValueMax === undefined) this.filterValueMax = '100000';
    if (this.filterValueMin === undefined) this.filterValueMin = '0';
    this.returnValue.emit({
      title: this.filter.title,
      name: this.filter.name,
      value: this.filterValue,
      valueMax: this.filterValueMax,
      valueMin: this.filterValueMin,
    });
  }
  fetchFiltersSelect() {
    this.store.select(selectFilters).subscribe((res) => {
      this.filterData = res;
      this.fetchRange(res, this.filter?.name);
    });
  }
  fetchRange(source: any, title: string) {
    const tmp = source?.filter((res: any) => res?.name === title);
    this.rangeData = tmp[0]?.values;
    const d: any = Object.values(this.rangeData[0])[0];
    this.formFilter.get('filter')?.setValue(d);
  }
}
