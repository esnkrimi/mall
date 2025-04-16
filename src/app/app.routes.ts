import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

const appRoutes: Route[] = [
  {
    path: '',
    loadChildren: () =>
      import('./core/core.module').then((m) => m.CoreModule),
  },
];
@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class rootRouteModule {}
