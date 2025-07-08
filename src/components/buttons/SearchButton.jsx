import React from 'react';
import { MdSearch } from 'react-icons/md';

export default function SearchButton() {
  return (
    <button style={{ background: 'none', border: 'none', color: 'white', fontSize: 16 }}>
      <MdSearch size={24} style={{ marginBottom: -4 }} />
      <div>جستجو</div>
    </button>
  );
}
