import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadWinComponent } from './upload-win.component';

describe('UploadWinComponent', () => {
  let component: UploadWinComponent;
  let fixture: ComponentFixture<UploadWinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadWinComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadWinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
