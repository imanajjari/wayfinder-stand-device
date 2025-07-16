import { useState, useEffect } from 'react';
import { getFloors, getStandData } from '../services/floorService';

/**
 * Custom hook برای مدیریت اطلاعات طبقات
 * @returns {Object} شامل floors, standData, و توابع utility
 */
export const useFloors = () => {
  const [floors, setFloors] = useState([]);
  const [standData, setStandData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFloors = () => {
      try {
        setLoading(true);
        const savedFloors = getFloors();
        const savedStandData = getStandData();
        
        setFloors(savedFloors);
        setStandData(savedStandData);
      } catch (error) {
        console.error('خطا در بارگذاری اطلاعات floors:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFloors();
  }, []);

  /**
   * یافتن طبقه بر اساس شماره
   * @param {number} floorNumber - شماره طبقه
   * @returns {Object|null} اطلاعات طبقه یا null
   */
  const getFloorByNumber = (floorNumber) => {
    return floors.find(floor => floor.number === floorNumber) || null;
  };

  /**
   * یافتن طبقه بر اساس نام
   * @param {string} floorName - نام طبقه
   * @returns {Object|null} اطلاعات طبقه یا null
   */
  const getFloorByName = (floorName) => {
    return floors.find(floor => floor.name === floorName) || null;
  };

  /**
   * دریافت فایل مدل برای طبقه
   * @param {number} floorNumber - شماره طبقه
   * @returns {string|null} نام فایل مدل یا null
   */
  const getModelFileByFloor = (floorNumber) => {
    const floor = getFloorByNumber(floorNumber);
    return floor ? floor.file : null;
  };

  /**
   * بروزرسانی اطلاعات floors
   */
  const refreshFloors = () => {
    const savedFloors = getFloors();
    const savedStandData = getStandData();
    
    setFloors(savedFloors);
    setStandData(savedStandData);
  };

  return {
    floors,
    standData,
    loading,
    getFloorByNumber,
    getFloorByName,
    getModelFileByFloor,
    refreshFloors,
    hasFloors: floors.length > 0
  };
}; 