import React from 'react';
import { MdCategory } from 'react-icons/md';

export default function CategoriesButton() {
  return (
    <button style={{ background: 'none', border: 'none', color: 'white', fontSize: 16 }}>
      <MdCategory size={24} style={{ marginBottom: -4 }} />
      <div>دسته‌ها</div>
    </button>
  );
}
