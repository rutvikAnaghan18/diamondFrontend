import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadBaseDocComponent } from './upload-base-doc.component';

describe('UploadBaseDocComponent', () => {
  let component: UploadBaseDocComponent;
  let fixture: ComponentFixture<UploadBaseDocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadBaseDocComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadBaseDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
