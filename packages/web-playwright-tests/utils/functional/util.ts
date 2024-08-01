export class Util {
  
  private defaultCharset: string =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  private streets: string[] = [
    "Main St",
    "High St",
    "Elm St",
    "Maple Ave",
    "Pine Rd",
    "Oak St",
    "Cedar Ln",
    "Spruce St",
    "Birch Ave",
    "Walnut St",
  ];
  private cities: string[] = [
    "New York",
    "Los Angeles",
    "Chicago",
    "Houston",
    "Phoenix",
    "Philadelphia",
    "San Antonio",
    "San Diego",
    "Dallas",
    "San Jose",
  ];
  private states: string[] = [
    "NY",
    "CA",
    "IL",
    "TX",
    "AZ",
    "PA",
    "TX",
    "CA",
    "TX",
    "CA",
  ];
  private countries: string[] = [
    "USA",
    "Canada",
    "UK",
    "Australia",
    "Germany",
    "France",
    "Italy",
    "Spain",
    "Netherlands",
    "Brazil",
  ];

  generateRandomString(
    length: number,
    charset: string = this.defaultCharset
  ): string {
    let result: string = "";
    const charsetLength: number = charset.length;

    for (let i = 0; i < length; i++) {
      const randomIndex: number = Math.floor(Math.random() * charsetLength);
      result += charset[randomIndex];
    }

    return result;
  }

  generateRandomNumber(length: number): number {
    const min = Math.pow(10, length - 1);
    const max = Math.pow(10, length) - 1;
    return Math.floor(min + Math.random() * (max - min + 1));
  }

  generateRandomEmail(): string {
    const chars = "abcdefghijklmnopqrstuvwxyz1234567890";
    let username = "";
    for (let i = 0; i < 10; i++) {
      username += chars[Math.floor(Math.random() * chars.length)];
    }
    const domains = ["example.com", "test.com", "demo.com"];
    const domain = domains[Math.floor(Math.random() * domains.length)];
    return `${username}@${domain}`;
  }

  //The below has been created for AUS
}
