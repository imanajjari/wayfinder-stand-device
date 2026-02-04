import React from 'react';
import { usePath } from '../../contexts/PathContext';
import { useSearchResults } from '../../contexts/SearchResultsContext';
import { findFloorOfDestination } from '../../lib/floorUtils';
import { getMyStand } from '../../storage/floorStorage';
import DestinationCard from '../cards/DestinationCard';
import { MultiPathButton } from '../buttons/MultiPathButton';

export default function NavigatorSearchResultsModal() {
  const { results, isResultsModalOpen, modalTitle, hideResults } = useSearchResults();
  const { fetchPathV2 } = usePath();
  const myStand = getMyStand();

  const handleSelectShop = (shop) => {
    // CHECK:V1
    // updateDestination({
    //   x: shop.entrance.x,
    //   y: shop.entrance.y,
    //   z: 1,
    //   floorNumber: shop.floorNum,
    //   floorId: findFloorOfDestination(shop).floorId,
    // });
    fetchPathV2({end:shop})
    hideResults(); // بستن مودال بعد از انتخاب
  };

  if (!isResultsModalOpen) return null;

  return (
    <div className="">
      <div className="mx-auto w-full max-w-screen-xl">
        <div className="bg-black/40 backdrop-blur-md border border-gray-500 text-white px-10 py-4 mb-3 space-y-6 rounded-2xl">
          {/* عنوان و دکمه بستن */}
          <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-2">
            <h2 className="text-xl font-semibold">{modalTitle}</h2>
            <div >
              <MultiPathButton onClick={hideResults} destinationsID={results.map(result => result.id)} className='border border-[#59ffc8] text-white rounded-xl px-2 py-1  ml-4 bg-[#2e463e] hover:bg-[#59ffc8] hover:text-black transition'>
            انتخاب تمام موارد
            </MultiPathButton>
            <button onClick={hideResults} className="text-red-400 hover:text-red-600 text-lg font-bold">
              ✕
            </button>
            </div>
            
          </div>

          {/* محتوای نتایج */}
          <div className="space-y-4 max-h-96 overflow-y-auto">

            {results.length === 0 ? (
              <p className="text-center text-gray-300">نتیجه‌ای یافت نشد.</p>
            ) : (
              results.map((shop, index) => (
                <div
                  key={index}
                  className="transition-all duration-500 ease-out"
                >
                  <DestinationCard
                    shop={shop}
                    onClick={() => handleSelectShop(shop)}
                    myStand={myStand}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 