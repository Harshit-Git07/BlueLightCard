export function getPrefix(brand: string): string {
    switch (brand) {
      case "BLC_UK":
      case "BLC_AU":
        return "BLC";
      case "DDS_UK":
        return "DDS";
      default:
        return "";
    }
  }

