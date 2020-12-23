import { FormFieldBase } from './form-field-base';

export class FormFieldTextArea extends FormFieldBase<string> {
  controlType = 'textarea';
  inputType: string;
  maxLength: string;

  constructor(options: any = {}) {
    super(options);
    this.inputType = options['inputType'] || '';
    this.maxLength = options['maxLength'];
  }
}
