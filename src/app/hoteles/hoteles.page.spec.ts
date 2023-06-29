import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HotelesPage } from './hoteles.page';

describe('HotelesPage', () => {
  let component: HotelesPage;
  let fixture: ComponentFixture<HotelesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(HotelesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
