import React, { useState } from 'react';
import WideNavbar from './WideNavbar';
import AdBanner from '../common/Ads/AdBanner';

export default function TopNav() {
    return (
      <div className='fixed top-[10px] left-[10px] right-[10px] z-[1000] pointer-events-none'>
        <div className="pointer-events-auto">
        <AdBanner
  content={<img src="/gift/6831618277c514f21f69a714dfd8a21dc58938dc_1748446476.gif" className="" />}
  onClick={() => alert("بنر کلیک شد!")}
  className="bg-red-600/20 2xl:hidden"
/>
          <WideNavbar />
        </div>
      </div>
    );
  }

