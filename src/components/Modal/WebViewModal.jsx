import React from "react";

export default function WebViewModal({ url }) {
  return (
    
    <div className="w-[90vw] h-[80vh] bg-white rounded-xl overflow-hidden shadow-xl ">
      <iframe
        src={url}
        title="external-site"
        className="w-full h-full rounded-xl border-0"
      />
    </div>
  );
}
