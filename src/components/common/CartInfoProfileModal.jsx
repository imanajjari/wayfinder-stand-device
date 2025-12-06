import React from 'react'

export default function CartInfoProfileModal({ content, className, children }) {
    return (
        <div className={`flex-col justify-end  w-full m-1 ${className}`}>
            <p className="text-white">{content}</p>
            <div className="bg-[#324154]  m-1 p-2 w-full  rounded-xl">
                <p className="text-white">{children}</p>
            </div>
        </div>
    )
}
