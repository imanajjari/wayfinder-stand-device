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
 * دریافت کل اطلاعات استند از localStorage
 * @returns {Object|null} اطلاعات کامل استند یا null
 */
export const getStandData = () => {
  try {
    const savedStandData = localStorage.getItem('standData');
    if (savedStandData) {
      return JSON.parse(savedStandData);
    }
    return null;
  } catch (error) {
    console.error('خطا در خواندن اطلاعات standData از localStorage:', error);
    return null;
  }
};

/**
 * ذخیره کل اطلاعات استند در localStorage
 * @param {Object} standData - اطلاعات کامل استند
 */
export const saveStandData = (standData) => {
  try {
    localStorage.setItem('standData', JSON.stringify(standData));
  } catch (error) {
    console.error('خطا در ذخیره اطلاعات standData در localStorage:', error);
  }
};

export const getMyStand = () => {
  try {
    const myStand = localStorage.getItem('myStand');
    if (myStand) {
      return JSON.parse(myStand);
    }
    return null;
  } catch (error) {
    console.error('خطا در خواندن myStand از localStorage:', error);
    return null;
  }
};



export const saveMyStand = (myStand) => {
  try {
    localStorage.setItem('myStand', JSON.stringify(myStand));
  } catch (error) {
    console.error('خطا در ذخیره myStand در localStorage:', error);
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
