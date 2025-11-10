
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