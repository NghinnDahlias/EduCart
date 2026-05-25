import React from 'react';
import { Download, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

export function ActionButtons() {
    return (
        <div className="mt-8 flex flex-wrap gap-4">
            <button className="flex items-center gap-2.5 px-6 py-3.5 bg-[#1c55e9] hover:bg-[#1542c2] text-white font-semibold text-sm rounded-lg transition-colors shadow-sm uppercase tracking-wide">
                <Download className="w-5 h-5" />
                Mua sách ngay
            </button>
            <button className="flex items-center gap-2.5 px-6 py-3.5 bg-transparent border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold text-sm rounded-lg transition-colors shadow-sm uppercase tracking-wide">
                <Calendar className="w-5 h-5 text-gray-500" />
                Thuê sách ngay
            </button>
        </div>
    );
}

interface NavArrowsProps {
    onPrev?: () => void;
    onNext?: () => void;
}

export function NavArrows({ onPrev, onNext }: NavArrowsProps) {
    return (
        <div className="hidden items-center gap-3 sm:flex">
            <button
                onClick={onPrev}
                className="flex items-center justify-center w-10 h-10 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-sm text-gray-600 hover:text-gray-900"
            >
                <ChevronLeft className="w-5 h-5" />
            </button>
            <button
                onClick={onNext}
                className="flex items-center justify-center w-10 h-10 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-sm text-gray-600 hover:text-gray-900"
            >
                <ChevronRight className="w-5 h-5" />
            </button>
        </div>
    );
}
