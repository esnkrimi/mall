import {
  Component,
  Inject,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { DynamicVariableService } from 'src/app/service/dynamic.variables.services';
import { LoadingProgressDynamicService } from 'src/app/service/loading-progress-dynamic';
import { DialogueComponent } from 'src/libs/widgets/dialogue/dialogue.component';
import { actions } from '../../../+state/action';
import { LocalStorageService } from '../../../service/localstorage.service';
import { selectMessage } from '../../../+state/select';

@Component({
  selector: 'app-header',
  standalone: false,

  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnChanges {
  @Input() userLoginedObject: any;
  homeWaitRoute = false;
  numUnseenMessage = 0;
  constructor(
    private dynamicVariableService: DynamicVariableService,
    @Inject('deviceIsPc') public deviceIsPc: boolean,
    private store: Store,
    private dialog: MatDialog,
    private localstorage: LocalStorageService,
    private router: Router
  ) {}
  ngOnChanges(changes: SimpleChanges): void {
    this.fetchMessagesAction();
    this.fetchMessagesSelect();
  }
  fetchMessagesAction() {
    this.store.dispatch(
      actions.prepareFetchMessage({ email: this.fetchUserLogined()?.email })
    );
  }
  fetchMessagesSelect() {
    this.store.select(selectMessage).subscribe((res) => {
      this.numUnseenMessage = res.reduce(function (acc, obj: any) {
        return acc + obj.numunseen;
      }, 0);
    });
  }
  fetchUserLogined() {
    const userLoginedJson: any = this.localstorage.getItem('user');
    return JSON.parse(userLoginedJson);
  }

  activeLoginModal() {
    const dialogRef = this.dialog.open(DialogueComponent, {
      data: { postId: 'mustLogin', poolType: 'main' },
    });
  }
  gotoProfileFeatures(feature: string) {
    this.dynamicVariableService.loadingProgressActiveation();
    this.router.navigate([
      '/feature/profile/' + this.userLoginedObject?.email + '/' + feature,
    ]);
    setTimeout(() => {
      this.dynamicVariableService.loadingProgressDeactiveation();
    }, 2000);
  }

  gotoRouteWithDelay(route: any) {
    this.dynamicVariableService.loadingProgressActiveation();
    this.homeWaitRoute = true;
    setTimeout(() => {
      this.router.navigate([route]);
    }, 1000);
  }
  goHome() {
    this.homeWaitRoute = true;
    this.gotoRouteWithDelay('');
  }
}
