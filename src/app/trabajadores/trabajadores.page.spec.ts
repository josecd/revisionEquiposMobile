import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TrabajadoresPage } from './trabajadores.page';

describe('TrabajadoresPage', () => {
  let component: TrabajadoresPage;
  let fixture: ComponentFixture<TrabajadoresPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(TrabajadoresPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
