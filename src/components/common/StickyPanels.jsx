// components/common/StickyPanels.jsx
import SearchPanel from '../panels/SearchPanel';
import CategoriesPanel from '../panels/CategoriesPanel';
import AmenityPanel from '../panels/AmenityPanel';
import { useTranslation } from 'react-i18next';
import { getAllCategories , getAllAmenities} from '../../services/categoryService';
import { useEffect, useState } from 'react';

export default function StickyPanels({ onShowResult , setIsResultOpen}) {

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
  

  
  return (
    <div className="bg-black/40 backdrop-blur-md border border-gray-500 text-white  py-4  space-y-6 rounded-2xl ">
      <SearchPanel 
        onShowResult={onShowResult}
        setIsResultOpen={setIsResultOpen}
      />
      <CategoriesPanel
        categories={categories}
        maxVisible={20}
        onShowResult={onShowResult}
        setIsResultOpen={setIsResultOpen}
      />
      
      <AmenityPanel
        amenity={amenities}
      />
    </div>
  );
}
