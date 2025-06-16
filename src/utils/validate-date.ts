function validateDate(value?: Date | string | number): boolean {
  return value instanceof Date && !isNaN(value.getTime());
}
export default validateDate;
