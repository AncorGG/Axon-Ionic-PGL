import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RoutinesPage } from './routines.page';

describe('RoutinesPage', () => {
  let component: RoutinesPage;
  let fixture: ComponentFixture<RoutinesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RoutinesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
