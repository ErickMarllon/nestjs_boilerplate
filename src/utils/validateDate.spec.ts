import validateDate from './validate-date';

describe('validateDate', () => {
  it('should return true for valid Date instance', () => {
    const date = new Date();
    expect(validateDate(date)).toBe(true);
  });

  it('should return false for empty string', () => {
    expect(validateDate('')).toBe(false);
  });

  it('should return false for string that is not a date', () => {
    expect(validateDate('hello')).toBe(false);
  });
  it('should return false for invalid Date instance', () => {
    const date = new Date('invalid');
    expect(validateDate(date)).toBe(false);
  });

  it('should return false for valid date string', () => {
    expect(validateDate('2024-06-12')).toBe(false);
  });

  it('should return false for invalid date string', () => {
    expect(validateDate('invalid-date')).toBe(false);
  });

  it('should return false for timestamp number', () => {
    expect(validateDate(Date.now())).toBe(false);
  });

  it('should return false for undefined', () => {
    expect(validateDate(undefined)).toBe(false);
  });

  it('should return false for null', () => {
    expect(validateDate(null as any)).toBe(false);
  });

  it('should return false for number that is not a Date instance', () => {
    expect(validateDate(1234567890)).toBe(false);
  });
});
