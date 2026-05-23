export const checkIsOpen = (openingHours: any): boolean => {
  if (!openingHours) return false;

  const now = new Date();
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const today = dayNames[now.getDay()];
  
  const todayHours = openingHours[today];
  if (!todayHours || !todayHours.open) return false;

  const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  
  return currentTime >= todayHours.from && currentTime <= todayHours.to;
};
