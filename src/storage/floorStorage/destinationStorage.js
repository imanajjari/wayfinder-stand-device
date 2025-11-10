

/**
 * ذخیره مقاصد در localStorage
 * @param {Array} destinations - آرایه مقاصد
 */
export const saveDestinations = (destinations) => {
  try {
    localStorage.setItem('destinations', JSON.stringify(destinations));
  } catch (error) {
    console.error('خطا در ذخیره destinations در localStorage:', error);
  }
};

/**
 * دریافت مقاصد از localStorage
 * @returns {Array} لیست مقاصد
 */
export const getDestinations = () => {
  try {
    const savedDestinations = localStorage.getItem('destinations');
    if (savedDestinations) {
      return JSON.parse(savedDestinations).data;
    }
    return [];
  } catch (error) {
    console.error('خطا در خواندن destinations از localStorage:', error);
    return [];
  }
};

