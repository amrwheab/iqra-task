import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { HeaderComponent } from './header/header.component';
import {
  FormTypes,
  InputsFormat,
  JsonFormat,
} from '../shared/interfaces/json-format';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RecursiveFormComponent } from './recursive-form/recursive-form.component';
import { RecursivePreviewComponent } from './recursive-preview/recursive-preview.component';

@Component({
  selector: 'dynamic-form',
  imports: [HeaderComponent, RecursiveFormComponent, RecursivePreviewComponent],
  templateUrl: './dynamic-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicFormComponent {
  private _fb = inject(FormBuilder);

  public form = signal<FormGroup>(new FormGroup({}));

  public formContents = signal<InputsFormat[]>([]);

  public isError = signal<boolean>(false);

  public FormTypes = FormTypes;

  onParseJson(event: JsonFormat | null): void {
    if (!event) return this.isError.set(true);

    this.isError.set(false);

    this.formContents.set(event.fields);

    this.form.set(this.generateFormGroup(event.fields));
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
