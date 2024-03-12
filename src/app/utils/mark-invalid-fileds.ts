import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';

/** пометить некорректно заполненные контролы */
export function markInvalidFields(form: AbstractControl, invalidFields: string[] = []): string[] {
  if (!(form instanceof FormGroup || form instanceof FormArray)) {
    return invalidFields;
  }
  Object.keys(form.controls).forEach((key) => {
    if (form.controls[key].invalid) {
      if (form.controls[key] instanceof FormGroup) {
        markInvalidFields(form.controls[key] as FormGroup, invalidFields);
      }
      if (form.controls[key] instanceof FormArray) {
        form.controls[key].controls.forEach((control) => markInvalidFields(control, invalidFields));
      }
      if (form.controls[key] instanceof FormControl) {
        form.controls[key].markAsDirty();
        invalidFields.push(key);
      }
    }
  });
  return invalidFields;
}
