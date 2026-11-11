import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, BedDouble, Maximize2, Tag } from 'lucide-react';
import { formatRupiah } from '../../utils/formatters';

export default function RoomGalleryModal({
  isOpen,
  onClose,
  initialIndex = 0,
  galleryItems = []
}) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  if (!isOpen || galleryItems.length === 0) return null;

  const currentItem = galleryItems[currentIndex] || galleryItems[0];

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : galleryItems.length - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev < galleryItems.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ background: 'rgba(10, 15, 30, 0.92)' }}>
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] flex flex-col items-center" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar */}
        <div className="w-full flex items-center justify-between text-white mb-3 px-2">
          <div className="flex items-center gap-2">
            <BedDouble size={20} className="text-blue-400" />
            <span className="font-bold text-sm tracking-wide">
              {currentItem.title || `Foto Kamar Kos Srirahayu`}
            </span>
            <span className="text-xs text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">
              {currentIndex + 1} / {galleryItems.length}
            </span>
          </div>

          <button 
            type="button" 
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-colors"
            onClick={onClose}
            title="Tutup Galeri"
          >
            <X size={20} />
          </button>
        </div>

        {/* Main Image Stage */}
        <div className="relative w-full h-[55vh] md:h-[62vh] rounded-2xl overflow-hidden bg-black flex items-center justify-center border border-slate-800 shadow-2xl">
          <img 
            src={currentItem.src} 
            alt={currentItem.title || "Galeri Kamar"} 
            className="w-full h-full object-cover select-none"
          />

          {/* Navigation Arrows */}
          <button
            type="button"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white flex items-center justify-center border border-white/20 backdrop-blur-md transition-transform hover:scale-110"
            onClick={handlePrev}
            title="Foto Sebelumnya"
          >
            <ChevronLeft size={24} />
          </button>

          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white flex items-center justify-center border border-white/20 backdrop-blur-md transition-transform hover:scale-110"
            onClick={handleNext}
            title="Foto Berikutnya"
          >
            <ChevronRight size={24} />
          </button>

          {/* Caption Overlay */}
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent p-4 text-white">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h4 className="font-extrabold text-base md:text-lg text-white">
                  {currentItem.title}
                </h4>
                <p className="text-xs text-slate-300 mt-0.5">
                  {currentItem.subtitle || "Fasilitas lengkap sesuai standar kenyamanan Kos Srirahayu"}
                </p>
              </div>
              {currentItem.price && (
                <div className="bg-blue-600/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-blue-400/30 text-right">
                  <div className="text-xs text-blue-200 uppercase font-semibold">Tarif Bulanan</div>
                  <div className="font-extrabold text-sm md:text-base text-white">
                    {formatRupiah(currentItem.price)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Thumbnail Reel */}
        <div className="w-full flex items-center gap-2 overflow-x-auto py-3 px-2 mt-2">
          {galleryItems.map((item, idx) => (
            <button
              key={idx}
              type="button"
              className={`relative shrink-0 w-16 h-12 md:w-20 md:h-14 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                idx === currentIndex ? 'border-blue-500 scale-105 shadow-md shadow-blue-500/20' : 'border-transparent opacity-50 hover:opacity-100'
              }`}
              onClick={() => setCurrentIndex(idx)}
            >
              <img src={item.src} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
