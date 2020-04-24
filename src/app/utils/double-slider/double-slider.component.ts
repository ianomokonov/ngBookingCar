import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'bk-double-slider',
  templateUrl: './double-slider.component.html',
  styleUrls: ['./double-slider.component.scss'],
})
export class DoubleSliderComponent implements OnInit, AfterViewInit {
  @ViewChild('thumbLeft') private thumbLeftRef: ElementRef<HTMLSpanElement>;
  @ViewChild('thumbRight') private thumbRightRef: ElementRef<HTMLSpanElement>;
  @ViewChild('sliderInner') private sliderInnerRef: ElementRef<HTMLSpanElement>;

  private thumbLeft: HTMLSpanElement;
  private thumbRight: HTMLSpanElement;
  private sliderInner: HTMLSpanElement;

  private shiftX: number;
  private sliderLeft: number;

  private currentThumb: HTMLSpanElement;

  public range = {
    min: 0,
    max: 100,
  };

  public selected = {
    from: 0,
    to: 100,
  };

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.thumbLeft = this.thumbLeftRef.nativeElement;
    this.thumbRight = this.thumbRightRef.nativeElement;
    this.sliderInner = this.sliderInnerRef.nativeElement;

    this.initThumbPosition();
    this.initThumbListeners();
  }

  private initThumbPosition() {
    const left = ((this.selected.from - this.range.min) / (this.range.max - this.range.min)) * 100;
    const right = ((this.range.max - this.selected.to) / (this.range.max - this.range.min)) * 100;

    this.thumbLeft.style.left = left + '%';
    this.thumbRight.style.right = right + '%';
  }

  private initThumbListeners() {
    this.thumbLeft.addEventListener('pointerdown', (event) => {
      this.currentThumb = this.thumbLeft;
      this.onPointerDown(event);
    });

    this.thumbRight.addEventListener('pointerdown', (event) => {
      this.currentThumb = this.thumbRight;
      this.onPointerDown(event);
    });
  }

  private onPointerDown(event: PointerEvent) {
    this.toggleGrabbing(this.currentThumb);
    this.shiftX = event.clientX - this.currentThumb.getBoundingClientRect().left;
    document.addEventListener('pointerup', this.onMouseUp);
    document.addEventListener('pointermove', this.onThumbMove);
  }

  private removeListeners() {
    document.removeEventListener('pointerup', this.onMouseUp);
    document.removeEventListener('pointermove', this.onThumbMove);
  }

  private onThumbMove = (event: PointerEvent) => {
    event.preventDefault();

    const { clientX } = event;
    this.sliderLeft = this.sliderInner.getBoundingClientRect().left;

    let newLeft = clientX + this.shiftX - this.sliderLeft;
    console.log([this.sliderInner.getBoundingClientRect().left, this.sliderLeft]);

    // курсор вышел из слайдера => оставить бегунок в его границах.
    let leftEdge = 0;
    if (this.currentThumb === this.thumbRight) {
      leftEdge = this.thumbLeft.getBoundingClientRect().left - this.sliderLeft + this.thumbLeft.offsetWidth;
      // console.log([this.thumbLeft.getBoundingClientRect().left - this.sliderLeft + this.thumbLeft.offsetWidth, newLeft])
    }

    if (newLeft < leftEdge) {
      newLeft = leftEdge;
    }

    let rightEdge = this.sliderInner.offsetWidth - this.currentThumb.offsetWidth;

    if (this.currentThumb === this.thumbLeft) {
      rightEdge = this.thumbRight.getBoundingClientRect().left - this.sliderLeft - this.thumbRight.offsetWidth;
    }

    if (newLeft > rightEdge) {
      newLeft = rightEdge;
    }

    this.currentThumb.style.left = newLeft + 'px';
    this.setSelected(newLeft);
  };

  private setSelected(position) {
    if (this.currentThumb === this.thumbLeft) {
      this.selected.from = Math.round(this.range.min + (position / this.sliderInner.offsetWidth) * (this.range.max - this.range.min));
      return;
    }
    this.selected.to = Math.round(
      this.range.min + ((position + this.currentThumb.offsetWidth) / this.sliderInner.offsetWidth) * (this.range.max - this.range.min)
    );
  }

  private onMouseUp = (event: PointerEvent) => {
    this.toggleGrabbing(this.currentThumb);
    this.currentThumb = null;
    this.removeListeners();
  };

  private toggleGrabbing(elem: HTMLSpanElement) {
    if (elem.classList.contains('grabbing')) {
      elem.classList.remove('grabbing');
      return;
    }

    elem.classList.add('grabbing');
  }
}
