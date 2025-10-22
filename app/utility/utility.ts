export function camelCaseToTitleCase(camelCaseString: string) {
  let withSpaces = camelCaseString.replace(/([A-Z])/g, " $1");

  let titleCase = withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1);

  return titleCase;
}
