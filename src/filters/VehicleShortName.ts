export const VehicleShortName = (name: string) => {
  // Replace Anti-Vehicle with AV
  name = name.replace('Anti-Vehicle', 'AV');
  name = name.replace('Anti-Personnel', 'AI');
  name = name.replace('Anti-Aircraft', 'AA');
  return name;
}
