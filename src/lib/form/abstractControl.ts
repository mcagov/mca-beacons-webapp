import { FormGroupControl } from "./formGroupControl";
import { ValidationRule } from "./validators";

/**
 * This is the base class for `FormControl`, and `FormGroupControl`.
 *
 * It provides shared behaviour, like running validators and calculating status.
 */
export abstract class AbstractControl {
  protected _value: any;

  /**
   * A control is `pristine` if the user has not edited the form.
   *
   * This is the case if the user has not submitted form data to the server to be validated.
   */
  protected pristine = true;

  private _parent: FormGroupControl = null;

  constructor(value: any, public readonly validators: ValidationRule[]) {
    this._value = value;
  }

  /**
   * @param parent {FormGroupControl}   Sets the parent form group control
   */
  setParent(parent: FormGroupControl): void {
    this._parent = parent;
  }

  /**
   * Getter for the parent control.
   */
  public get parent(): FormGroupControl {
    return this._parent;
  }

  /**
   * Marks the control as `dirty`.
   */
  public markAsDirty(): void {
    this.pristine = false;
  }

  /**
   * Validates this control against the validation rules.
   *
   * @returns {string[]}   The array of error messages
   */
  public errorMessages(): string[] {
    const validators = this.pristine ? [] : this.validators;
    return validators
      .filter((rule: ValidationRule) => rule.hasErrorFn(this))
      .map((rule: ValidationRule) => rule.errorMessage);
  }

  public abstract get value(): any;

  /**
   * Determines if the control has any errors.
   */
  public abstract hasErrors(): boolean;
}
