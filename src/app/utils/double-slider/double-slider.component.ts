import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'bk-double-slider',
  templateUrl: './double-slider.component.html',
  styleUrls: ['./double-slider.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DoubleSliderComponent),
      multi: true,
    },
  ],
})
export class DoubleSliderComponent implements OnInit, AfterViewInit, ControlValueAccessor {
  @ViewChild('thumbLeft') private thumbLeftRef: ElementRef<HTMLSpanElement>;
  @ViewChild('thumbRight') private thumbRightRef: ElementRef<HTMLSpanElement>;
  @ViewChild('sliderInner') private sliderInnerRef: ElementRef<HTMLSpanElement>;
  @ViewChild('progress') private progressRef: ElementRef<HTMLSpanElement>;

  private thumbLeft: HTMLSpanElement;
  private thumbRight: HTMLSpanElement;
  private sliderInner: HTMLSpanElement;
  private progress: HTMLSpanElement;

  private shiftX: number;
  private sliderLeft: number;

  private currentThumb: HTMLSpanElement;

  @Input() public range: SliderRange;
  @Input() public formatValue = (value) => value;

  public selected: SliderSelected;

  public disabled: boolean;

  private onChange = (value: any) => {};
  private onTouched = () => {};

  /*
    Value Accessor
  */
  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  writeValue(out: SliderSelected) {
    this.selected = out;
  }

  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
  }

  updateValue(value: SliderSelected) {
    this.selected = value;
    this.onChange(value);
    this.onTouched();
  }

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.thumbLeft = this.thumbLeftRef.nativeElement;
    this.thumbRight = this.thumbRightRef.nativeElement;
    this.sliderInner = this.sliderInnerRef.nativeElement;
    this.progress = this.progressRef.nativeElement;

    this.initThumbPosition();
    this.initThumbListeners();
  }

  public getProgressLeft() {
    return this.thumbLeft.getBoundingClientRect().left - this.sliderInner.getBoundingClientRect().left;
  }

  public getProgressRight() {
    return this.thumbRight.getBoundingClientRect().right - this.sliderInner.getBoundingClientRect().right;
  }

  private initThumbPosition() {
    if (!this.range) {
      console.error('DoubleSlider', 'Укажите диапазон');
      return;
    }
    if (!this.selected) {
      console.error('DoubleSlider', 'Укажите выбранный диапазон');
      return;
    }
    if (this.range) {
      const left = ((this.selected.from - this.range.min) / (this.range.max - this.range.min)) * 100;
      const right = ((this.range.max - this.selected.to) / (this.range.max - this.range.min)) * 100;

      this.thumbLeft.style.left = left + '%';
      this.thumbRight.style.right = right + '%';
      this.progress.style.left = left + '%';
      this.progress.style.right = right + '%';
      return;
    }
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
    if (!this.range) {
      return;
    }

    const { clientX } = event;
    this.sliderLeft = this.sliderInner.getBoundingClientRect().left;

    let newLeft = clientX + this.shiftX - this.sliderLeft;

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
    this.progress.style.left = this.thumbLeft.style.left;
    this.progress.style.right = (this.sliderInner.getBoundingClientRect().right - this.thumbRight.getBoundingClientRect().right) + 'px';
    this.setSelected(newLeft);
  };

  private setSelected(position) {
    if (this.currentThumb === this.thumbLeft) {
      this.selected.from = Math.round(this.range.min + (position / this.sliderInner.offsetWidth) * (this.range.max - this.range.min)); 
    }
    if (this.currentThumb === this.thumbRight) {
      this.selected.to = Math.round(
        this.range.min + ((position + this.currentThumb.offsetWidth) / this.sliderInner.offsetWidth) * (this.range.max - this.range.min)
      );
    }

    this.updateValue(this.selected);
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

export interface SliderRange {
  min: number;
  max: number;
}

export interface SliderSelected {
  from: number;
  to: number;
}
