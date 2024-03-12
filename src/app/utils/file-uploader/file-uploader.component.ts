import { Component, OnInit, ElementRef, ViewChild, forwardRef, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'bk-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FileUploaderComponent),
      multi: true,
    },
  ],
})
export class FileUploaderComponent implements OnInit, ControlValueAccessor {
  @ViewChild('inputFileContainer') private inputFileContainer: ElementRef<HTMLDivElement>;
  @ViewChild('image') private image: ElementRef<HTMLImageElement>;

  @Input() fullSize: boolean = false;

  public value: File;
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

  writeValue(out: File) {
    this.value = out;
  }

  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
  }

  updateValue(value: File) {
    this.value = value;
    this.onChange(value);
    this.onTouched();
  }

  constructor() {}

  ngOnInit(): void {}

  onRemoveFileClick(event: PointerEvent): void {
    event.preventDefault();
    this.updateValue(null);
  }

  onUploadFileClick(event: PointerEvent): void {
    event.preventDefault();
    const fileInput = this.createUploadFileInput();
    this.inputFileContainer.nativeElement.append(fileInput);

    fileInput.addEventListener('change', (event) => {
      const file = (event.target as HTMLInputElement).files[0];
      const reader = new FileReader();

      reader.onload = ({ target }) => {
        this.image.nativeElement.src = target.result.toString();
      };

      reader.readAsDataURL(file);
      this.updateValue(file);

      fileInput.remove();
    });

    fileInput.click();
  }

  private createUploadFileInput(): HTMLInputElement {
    const wrapper = document.createElement('div');

    wrapper.innerHTML = `
      <input hidden name="images" type="file" accept="image/*">
    `;

    return wrapper.firstElementChild as HTMLInputElement;
  }
}
