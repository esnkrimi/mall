import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserInterrestsComponent } from './user-interrests.component';

describe('UserInterrestsComponent', () => {
  let component: UserInterrestsComponent;
  let fixture: ComponentFixture<UserInterrestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserInterrestsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UserInterrestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
