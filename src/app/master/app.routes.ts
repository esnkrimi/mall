import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { ProfileComponent } from './component/profile/profile.component';
import { NewpostComponent } from './component/newpost/newpost.component';
import { MyProfileComponent } from './component/myprofile/myprofile.component';
import { LoginComponent } from './component/login/login.component';
import { CanActivateLoginGuard } from './guard';
import { ZoomComponent } from './component/zoom/zoom.component';
import { UserBoardComponent } from './component/userboard/userboard.component';

const appRoutes: Route[] = [
  {
    path: 'profile/:email',
    component: ProfileComponent,
  },
    {
    path: 'userBoard/:email',
    component: UserBoardComponent,
  },
    {
    path: 'profile/:email/:action',
    component: ProfileComponent,
  },
  {
    path: 'post',
    component: NewpostComponent,
    canActivate: [CanActivateLoginGuard],
  },
  {
    path: 'zoom/:id',
    component: ZoomComponent,
  },
  {
    path: 'myprofile',
    component: MyProfileComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule],
  providers: [CanActivateLoginGuard],
})
export class masterRouteModule {}
