import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailsPaneHeaderComponent } from './details-pane-header.component';

describe('DetailsPaneHeaderComponent', () => {
  let component: DetailsPaneHeaderComponent;
  let fixture: ComponentFixture<DetailsPaneHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailsPaneHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsPaneHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
