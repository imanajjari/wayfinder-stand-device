// components/common/StickyPanels.jsx
import SearchPanel from '../panels/SearchPanel';
import CategoriesPanel from '../panels/CategoriesPanel';
import AmenityPanel from '../panels/AmenityPanel';
import { useTranslation } from 'react-i18next';
import { MdElectricalServices,
  MdBuild,
  MdPrecisionManufacturing,
  MdSensors,
  MdComputer,
  MdSettingsInputAntenna,
  MdSmartToy,
  MdSettings,
  MdElectricBolt,
  MdCompareArrows,
  MdSchema,
  MdFunctions,
  MdBatteryChargingFull,
  MdSyncAlt,
} from 'react-icons/md';
import { getAllCategories , getAllAmenities} from '../../services/categoryService';
import { useEffect, useState } from 'react';

export default function StickyPanels({ onShowResult }) {

  const [categories, setCategories] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories();
        setCategories(data.data.data);
      } catch (err) {
        console.error('خطا در دریافت دسته‌بندی‌ها:', err);
      }
    };

    const fetchAmenities = async () => {
      try {
        const data = await getAllAmenities();
        setAmenities(data.data.data);
      } catch (err) {
        console.error('خطا در دریافت دسته‌بندی‌ها:', err);
      }
    };
    
    fetchCategories();
    fetchAmenities();
  }, []);
  

  console.log("amenities :",amenities);

  const Amenity = [
    { key: 'tool.power_calc', icon: <MdElectricBolt /> },
    { key: 'tool.unit_converter', icon: <MdCompareArrows /> },
    { key: 'tool.circuit_diagram', icon: <MdSchema /> },
    { key: 'tool.resistance_calc', icon: <MdFunctions /> },
    { key: 'tool.bms_analysis', icon: <MdBatteryChargingFull /> },
    { key: 'tool.voltage_converter', icon: <MdSyncAlt /> },
  ];
  
  return (
    <div className="bg-black/40 backdrop-blur-md border border-gray-500 text-white  py-4 z-[999] space-y-6 rounded-2xl">
      <SearchPanel />
      <CategoriesPanel
        categories={categories}
        maxVisible={20}
        onShowResult={onShowResult}
      />
      
      <AmenityPanel
        amenity={amenities}
      />
    </div>
  );
}
