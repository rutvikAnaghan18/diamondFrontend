import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WinMasterComponent } from './win-master.component';

describe('WinMasterComponent', () => {
  let component: WinMasterComponent;
  let fixture: ComponentFixture<WinMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WinMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WinMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
