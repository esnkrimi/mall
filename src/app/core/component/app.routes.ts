import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';

const appRoutes: Route[] = [
  {
    path: 'feature',
    loadChildren: () =>
      import('../../master/master.module').then((m) => m.MasterModule),
  },
  {
    path:'',
    component:MainComponent
  }
];
@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule],
})
export class coreRouteModule {}
