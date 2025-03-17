import { FormTypes } from './../../shared/interfaces/json-format';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AbstractControl, FormArray, FormGroup } from '@angular/forms';
import { InputsFormat } from '../../shared/interfaces/json-format';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-recursive-preview',
  imports: [AsyncPipe],
  templateUrl: './recursive-preview.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecursivePreviewComponent {
  public form = input<FormGroup | null | undefined | AbstractControl<any>>(
    new FormGroup({})
  );
  public formContents = input.required<InputsFormat[]>();

  FormTypes = FormTypes;

  formArray(name: string): FormGroup[] {
    return (this.form()?.get(name) as FormArray).controls as FormGroup[];
  }
}
