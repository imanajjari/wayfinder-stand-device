/**
 * سرویس مدیریت اطلاعات طبقات
 */

/**
 * دریافت اطلاعات طبقات از localStorage
 * @returns {Array} آرایه اطلاعات طبقات
 */
export const getFloors = () => {
  try {
    const savedFloors = localStorage.getItem('floors');
    if (savedFloors) {
      return JSON.parse(savedFloors);
    }
    return [];
  } catch (error) {
    console.error('خطا در خواندن اطلاعات floors از localStorage:', error);
    return [];
  }
};

/**
 * ذخیره اطلاعات طبقات در localStorage
 * @param {Array} floors - آرایه اطلاعات طبقات
 */
export const saveFloors = (floors) => {
  try {
    localStorage.setItem('floors', JSON.stringify(floors));
  } catch (error) {
    console.error('خطا در ذخیره اطلاعات floors در localStorage:', error);
  }
};

/**
 * پاک کردن اطلاعات از localStorage
 */
export const clearFloorData = () => {
  try {
    localStorage.removeItem('floors');
    localStorage.removeItem('standData');
    localStorage.removeItem('myStand');
  } catch (error) {
    console.error('خطا در پاک کردن اطلاعات از localStorage:', error);
  }
};
