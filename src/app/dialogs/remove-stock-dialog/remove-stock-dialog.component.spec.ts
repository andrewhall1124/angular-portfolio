import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveStockDialogComponent } from './remove-stock-dialog.component';

describe('RemoveStockDialogComponent', () => {
  let component: RemoveStockDialogComponent;
  let fixture: ComponentFixture<RemoveStockDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RemoveStockDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RemoveStockDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
