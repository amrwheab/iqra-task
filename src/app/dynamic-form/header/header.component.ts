import {
  ChangeDetectionStrategy,
  Component,
  output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputsFormat, JsonFormat } from '../../shared/interfaces/json-format';

@Component({
  selector: 'app-header',
  imports: [FormsModule],
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  jsonInput = signal<string>(`{
  "fields": [
    { "type": "text", "label": "Full Name", "name": "fullName", "required": true },
    { "type": "email", "label": "Email", "name": "email", "required": true, "asyncValidation": "checkEmailUnique" },
    { "type": "password", "label": "Password", "name": "password", "required": true, "minLength": 6 },
    { "type": "select", "label": "Country", "name": "country", "options": ["USA", "UK", "Germany"], "required": true },
    { "type": "checkbox", "label": "Accept Terms", "name": "terms", "required": true },
    { "type": "group", "label": "Address", "name": "address", "fields": [
        { "type": "text", "label": "Street", "name": "street", "required": true },
        { "type": "text", "label": "City", "name": "city", "required": true }
      ]
    },
    { "type": "array", "label": "Hobbies", "name": "hobbies", "fields": [
        { "type": "text", "label": "Hobby", "name": "hobby" }
      ]
    }
  ]
}`);
  parsedJson = output<JsonFormat | null>();

  processJson() {
    try {
      const parsed = JSON.parse(this.jsonInput());

      // if (this.isValidJsonFormat(parsed)) {
      //   this.parsedJson.emit(null);
      // } else {
      //   this.parsedJson.emit(parsed);
      // }
      this.parsedJson.emit(parsed);
    } catch (error) {
      console.error('Invalid JSON input:', error);
      this.parsedJson.emit(null);
    }
  }

  // isValidJsonFormat(obj: JsonFormat): boolean {
  //   return (
  //     typeof obj === 'object' &&
  //     obj !== null &&
  //     Array.isArray(obj.fields) &&
  //     obj.fields.every(
  //       (field: InputsFormat) =>
  //         typeof field === 'object' &&
  //         field !== null &&
  //         typeof field.type === 'string' &&
  //         typeof field.label === 'string' &&
  //         typeof field.name === 'string'
  //     )
  //   );
  // }
}
