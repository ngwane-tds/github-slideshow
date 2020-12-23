import { FormFieldBase } from './form-field-base';

export class FormFieldTextbox extends FormFieldBase<string> {
  controlType = 'textbox';
  inputType: string;
  maxLength: string;

  constructor(options: any = {}) {
    super(options);
    this.inputType = options['inputType'] || '';
    this.maxLength = options['maxLength'];
  }
}
