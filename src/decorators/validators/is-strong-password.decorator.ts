import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function IsStrongPassword(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return (object, propertyName) => {
    registerDecorator({
      name: 'isStrongPassword',
      target: object.constructor,
      propertyName: propertyName as string,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: string): boolean {
          if (typeof value !== 'string') return false;

          return (
            /[a-z]/.test(value) &&
            /[A-Z]/.test(value) &&
            /\d/.test(value) &&
            /[!@$%^&*()\-=+{}|;:,.<>?]/.test(value)
          );
        },
        defaultMessage(args: ValidationArguments) {
          const value = args.value as string;

          if (typeof value !== 'string') {
            return `${args.property} must be a string`;
          }

          if (!/[a-z]/.test(value)) {
            return 'The password should contain at least 1 lowercase letter';
          }

          if (!/[A-Z]/.test(value)) {
            return 'The password should contain at least 1 capital letter';
          }

          if (!/\d/.test(value)) {
            return 'The password should contain at least 1 number';
          }

          if (!/[!@$%^&*()\-=+{}|;:,.<>?]/.test(value)) {
            return 'The password should contain at least 1 special character';
          }

          return `${args.property} is invalid`;
        },
      },
    });
  };
}
