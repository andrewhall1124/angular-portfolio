import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditWeightDialogComponent } from './edit-weight-dialog.component';

describe('EditWeightDialogComponent', () => {
  let component: EditWeightDialogComponent;
  let fixture: ComponentFixture<EditWeightDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditWeightDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditWeightDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
