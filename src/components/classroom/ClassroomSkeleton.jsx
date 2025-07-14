// Muestra una UI "fantasma" mientras cargan los datos
import React from 'react';
const SkeletonLine = ({ width }) => <div className={`bg-gray-200 rounded-full h-4 ${width}`}></div>

const ClassroomSkeleton = () => (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-100 animate-pulse">
        <aside className="w-full lg:w-[400px] bg-white flex flex-col flex-shrink-0 p-4 space-y-6">
            <div className="flex justify-between"><SkeletonLine width="w-32"/><SkeletonLine width="w-6"/></div>
            <div className="space-y-2"><SkeletonLine width="w-24"/><div className="h-2.5 bg-gray-200 rounded-full w-full"></div></div>
            <div className="space-y-4"><div className="h-8 bg-gray-200 rounded w-full"></div><div className="space-y-2 pl-4"><SkeletonLine width="w-full"/><SkeletonLine width="w-5/6"/></div></div>
            <div className="space-y-4"><div className="h-8 bg-gray-200 rounded w-full"></div><div className="space-y-2 pl-4"><SkeletonLine width="w-full"/><SkeletonLine width="w-4/6"/></div></div>
        </aside>
        <main className="flex-1 bg-black flex flex-col">
            <div className="w-full flex-grow bg-gray-300"></div>
            <div className="p-6 bg-white flex-shrink-0 space-y-4">
                <SkeletonLine width="w-3/5"/>
                <SkeletonLine width="w-2/5"/>
                <div className="flex justify-between pt-4 mt-4 border-t"><div className="h-10 w-24 bg-gray-200 rounded"></div><div className="h-10 w-32 bg-gray-200 rounded"></div></div>
            </div>
        </main>
    </div>
);
export default ClassroomSkeleton;