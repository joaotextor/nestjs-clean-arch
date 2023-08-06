import { validateSync } from "class-validator";
import { FieldsError, IValidatorFields } from "./validator-fields.interface";

export abstract class ClassValidatorFields<ValidatedProps>
  implements IValidatorFields<ValidatedProps>
{
  errors: FieldsError = null;
  validatedData: ValidatedProps = null;
  validate(data: any): boolean {
    const errors = validateSync(data);

    if (errors.length) {
      this.errors = {};
      for (const error of errors) {
        const field = error.property;
        this.errors[field] = Object.values(error.constraints);
      }
    } else {
      this.validatedData = data;
    }

    return !errors.length;
  }
}
