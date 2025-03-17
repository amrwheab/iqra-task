import { FormTypes, InputsFormat } from './../../shared/interfaces/json-format';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  Signal,
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-recursive-form',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './recursive-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecursiveFormComponent {
  public form = input<FormGroup | null | undefined | AbstractControl<any>>(
    new FormGroup({})
  );
  public formForTemplate = computed(() => this.form() as FormGroup);
  public formContents = input.required<InputsFormat[]>();
  private _fb = inject(FormBuilder);

  FormTypes = FormTypes;
  FormGroup = FormGroup;

  formArray(name: string): FormGroup[] {
    return (this.form()?.get(name) as FormArray).controls as FormGroup[];
  }

  addItemToArray(name: string, fields: InputsFormat[]) {
    (this.form()?.get(name) as FormArray).push(this.generateFormGroup(fields));
  }

  removeItemFromArray(name: string, index: number) {
    (this.form()?.get(name) as FormArray).removeAt(index);
  }

  generateFormGroup(inputs: InputsFormat[]): FormGroup {
    const obj: { [key: string]: any } = {};

    inputs.map((field: InputsFormat) => {
      if (field.type === FormTypes.group) {
        obj[field.name] = this.generateFormGroup(field.fields || []);
      } else if (field.type === FormTypes.array) {
        obj[field.name] = this._fb.array(
          new Array(field.arrayLength || 0)
            .fill(null)
            .map(() => this.generateFormGroup(field.fields || []))
        );
      } else {
        obj[field.name] = this._fb.control(null);

        if (field.required && field.type !== FormTypes.checkbox) {
          (obj[field.name] as FormControl).setValidators(Validators.required);
        }
        if (field.minLength) {
          (obj[field.name] as FormControl).setValidators(
            Validators.minLength(field.minLength)
          );
        }
        if (field.maxLength) {
          (obj[field.name] as FormControl).setValidators(
            Validators.maxLength(field.maxLength)
          );
        }
        if (field.type === FormTypes.email) {
          (obj[field.name] as FormControl).setValidators(Validators.email);
        }
        (obj[field.name] as FormControl).updateValueAndValidity();
      }
    });

    return this._fb.group(obj);
  }
}
