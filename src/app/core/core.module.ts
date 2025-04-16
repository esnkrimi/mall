import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentComponent } from './component/comment/comment.component';
import { FooterComponent } from './component/footer/footer.component';
import { HeaderComponent } from './component/header/header.component';
import { SearchComponent } from './component/search/search.component';
import { ImageComponent } from './component/image/image.component';
import { MainComponent } from './component/main/main.component';
import { UsermenuComponent } from './component/usermenu/usermenu.component';
import { MenuComponent } from './component/menu/menu.component';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { coreRouteModule } from './component/app.routes';
import { MatButtonModule } from '@angular/material/button';
import { MasterModule } from '../master/master.module';
import { MatBadgeModule } from '@angular/material/badge';
import { PostComponent } from 'src/libs/widgets/post/post.component';
import { LoadingProgressDynamic } from 'src/libs/widgets/loading-progress-dynamic.component/loading-progress-dynamic.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { PostShortComponent } from 'src/libs/widgets/post-short/post-short';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ProgressBarStyle } from '../directive/progress-bar-style';

@NgModule({
  declarations: [
    CommentComponent,
    FooterComponent,
    HeaderComponent,
    SearchComponent,
    ImageComponent,
    MainComponent,
    UsermenuComponent,
    MenuComponent,
    ProgressBarStyle
  ],
  imports: [
    CommonModule,
    MatInputModule,
    MatBadgeModule,
    MatFormFieldModule,
    FormsModule,
    MatProgressBarModule,
    ReactiveFormsModule,
    MatChipsModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    PostComponent,
    LoadingProgressDynamic,
    PostShortComponent,
    coreRouteModule,
    ReactiveFormsModule,
    MatButtonModule,
    MasterModule,
  ],
  exports: [
    CommentComponent,
    FooterComponent,
    HeaderComponent,
    SearchComponent,
    ImageComponent,
    MainComponent,
    UsermenuComponent,
    MenuComponent,
  ],
})
export class CoreModule {}
