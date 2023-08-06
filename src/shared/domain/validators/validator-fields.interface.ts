export type FieldsError = {
  [field: string]: string[];
};

export interface IValidatorFields<ValidatedProps> {
  errors: FieldsError;
  validatedData: ValidatedProps;
  validate(data: any): boolean;
}
