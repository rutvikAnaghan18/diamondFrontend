import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadBidComponent } from './upload-bid.component';

describe('UploadBidComponent', () => {
  let component: UploadBidComponent;
  let fixture: ComponentFixture<UploadBidComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadBidComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadBidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
