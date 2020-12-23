export class FormFieldBase<T> {
  value: T;
  key: string;
  label: string;
  required: boolean;
  controlType: string;
  selectOptions: any[];
  readonly: boolean;
  inputType: string;
  maxLength: string;

  constructor(
    options: {
      value?: T;
      key?: string;
      label?: string;
      required?: boolean;
      controlType?: string;
      selectOptions?: any[];
      readonly?: boolean;
      inputType?: string;
      maxLength?: string;
    } = {}
  ) {
    this.value = options.value;
    this.key = options.key || '';
    this.label = options.label || '';
    this.required = !!options.required;
    this.controlType = options.controlType || '';
    this.selectOptions = this.selectOptions;
    this.readonly = options.readonly;
    this.inputType = options.inputType;
  }
}
