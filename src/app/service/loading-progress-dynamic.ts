import { Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoadingProgressDynamicService {
  loadingProgressActive = new BehaviorSubject('');
  loadingProgressActiveation(handle: string) {
    this.loadingProgressActive.next(handle);
  }
  loadingProgressDeactiveation(time:number) {
    setTimeout(() => {
      this.loadingProgressActive.next('');
    }, time);
  }
}
