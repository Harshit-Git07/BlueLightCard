import { convertTimeStampToDateTime } from '../ecFormOutrputDataLambdaHandler';

describe('convertTimeStampToDateTime', () => {
  test('should return a formatted date string for valid timestamp', () => {
    // Arrange
    const dateTime = 1701967852436; // Example timestamp representing December 7, 2023

    // Act
    const result = convertTimeStampToDateTime(dateTime);

    // Assert
    expect(result).toBe('2023-12-07 16:50:52');
  });

  test('should return the default date invalid timestamp', () => {
    // Arrange
    const dateTime = 123; // Example invalid timestamp

    // Act
    const result = convertTimeStampToDateTime(dateTime);

    // Assert
    expect(result).toBe('1970-01-01 00:00:00');
  });
});