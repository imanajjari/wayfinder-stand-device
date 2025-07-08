import React from 'react';
import { MdBuild } from 'react-icons/md';

export default function ToolsButton() {
  return (
    <button style={{ background: 'none', border: 'none', color: 'white', fontSize: 16 }}>
      <MdBuild size={24} style={{ marginBottom: -4 }} />
      <div>ابزارها</div>
    </button>
  );
}
