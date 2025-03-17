export interface JsonFormat {
  fields: InputsFormat[];
}

export interface InputsFormat {
  type: FormTypes;
  label: string;
  name: string;
  required?: boolean;
  fields?: InputsFormat[];
  options?: string[];
  arrayLength?: number;
  minLength?: number;
  maxLength?: number;
  asyncValidation?: 'checkEmailUnique';
}

export enum FormTypes {
  text = 'text',
  email = 'email',
  password = 'password',
  select = 'select',
  checkbox = 'checkbox',
  group = 'group',
  array = 'array',
}
