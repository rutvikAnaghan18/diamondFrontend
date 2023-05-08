import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BidMasterComponent } from './bid-master.component';

describe('BidMasterComponent', () => {
  let component: BidMasterComponent;
  let fixture: ComponentFixture<BidMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BidMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BidMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
