import { HttpStatus, ValidationPipe, type ValidationError } from '@nestjs/common';
import { AppException, type FieldError } from '../errors/app.exception';
import { ErrorCode } from '../errors/error-codes';

function flatten(errors: ValidationError[], parent = ''): FieldError[] {
  return errors.flatMap((error) => {
    const field = parent ? `${parent}.${error.property}` : error.property;
    const own = Object.values(error.constraints ?? {}).map((message) => ({ field, message }));
    return [...own, ...flatten(error.children ?? [], field)];
  });
}

/**
 * Global DTO validation: strips unknown fields, rejects extra ones, converts types,
 * and returns field-level `details` with code VALIDATION_ERROR.
 */
export function createValidationPipe() {
  return new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: { enableImplicitConversion: true },
    exceptionFactory: (errors) =>
      new AppException(
        HttpStatus.BAD_REQUEST,
        'The request contains invalid fields.',
        ErrorCode.VALIDATION_ERROR,
        flatten(errors),
      ),
  });
}
