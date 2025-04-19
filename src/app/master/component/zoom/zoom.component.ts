import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { DynamicVariableService } from 'src/app/service/dynamic.variables.services';
@Component({
  selector: 'app-zoom',
  templateUrl: './zoom.component.html',
  styleUrl: './zoom.component.css',
})
export class ZoomComponent implements OnInit {
  postId: any;
  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private dynamicVariableService: DynamicVariableService
  ) {}
  ngOnInit(): void {
    this.fetchZoomIDFromRoute();
    this.dynamicVariableService.pathRoute.next('main');
  }

  fetchZoomIDFromRoute() {
    this.route.paramMap.subscribe((res: any) => {
      this.postId = res?.params?.id;
    });
  }
}
