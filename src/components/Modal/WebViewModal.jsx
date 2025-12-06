import React from "react";

export default function WebViewModal({ url }) {
  return (
    <div className="w-2/3 h-2/3">
      <iframe
        src={url}
        title="external-site"
        className="w-full h-full rounded-xl border-0"
      />
    </div>
  );
}
