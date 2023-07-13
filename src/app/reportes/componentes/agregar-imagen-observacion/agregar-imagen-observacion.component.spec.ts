import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AgregarImagenObservacionComponent } from './agregar-imagen-observacion.component';

describe('AgregarImagenObservacionComponent', () => {
  let component: AgregarImagenObservacionComponent;
  let fixture: ComponentFixture<AgregarImagenObservacionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AgregarImagenObservacionComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AgregarImagenObservacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
