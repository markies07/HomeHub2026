'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Property } from '@/types';
import { Bed, Bath, Layers, MapPin, CheckCircle, Calculator, PhoneCall, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

interface PropertyDetailModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
  onInquire: (property: Property) => void;
}

export function PropertyDetailModal({ property, isOpen, onClose, onInquire }: PropertyDetailModalProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [property?.id]);

  if (!property) return null;

  const imagesList = property.images && property.images.length > 0 ? property.images : [property.featuredImage || '/img/uploads/6669ab9d41e18-428388204_7526491760743274_298134187706128058_n.jpg'];
  const safeImageIndex = activeImageIndex < imagesList.length ? activeImageIndex : 0;

  const totalMoveIn = property.rent * 1 + property.rent * 2; // 1mo advance + 2mo deposit

  const handlePrev = () => setActiveImageIndex(p => p === 0 ? imagesList.length - 1 : p - 1);
  const handleNext = () => setActiveImageIndex(p => p === imagesList.length - 1 ? 0 : p + 1);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={property.title}
      subtitle={`Unit ${property.house_no} • ${property.fulladdress}`}
      maxWidth="3xl"
    >
      <div className="pt-2 space-y-6">
        {/* Gallery */}
        <div className="relative rounded-2xl overflow-hidden group aspect-[16/9] bg-slate-100 border border-slate-200 shadow-xs">
          <img
            src={imagesList[safeImageIndex]}
            alt={property.title}
            className="w-full h-full object-cover transition-all duration-300"
          />

          {/* Status badge */}
          <div className="absolute top-4 left-4">
            <span className={`text-xs font-bold px-3 py-1.5 rounded-full shadow-sm backdrop-blur-md ${
              property.status === 'occupied'
                ? 'bg-amber-500 text-white'
                : property.status === 'available'
                ? 'bg-emerald-600 text-white'
                : 'bg-rose-500 text-white'
            }`}>
              {property.status === 'occupied' ? 'Currently Occupied' : property.status === 'available' ? 'Available for Rent' : 'Under Maintenance'}
            </span>
          </div>

          {/* Navigation */}
          {imagesList.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer hover:scale-110 bg-white/90 shadow-md text-slate-800"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer hover:scale-110 bg-white/90 shadow-md text-slate-800"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Counter */}
          <div className="absolute bottom-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white">
            {safeImageIndex + 1} / {imagesList.length}
          </div>
        </div>

        {/* Thumbnails */}
        {imagesList.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {imagesList.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`relative w-20 h-14 rounded-xl overflow-hidden shrink-0 transition-all cursor-pointer border ${
                  safeImageIndex === idx ? 'ring-2 ring-emerald-500 border-transparent scale-105' : 'opacity-60 hover:opacity-100 border-slate-200'
                }`}
              >
                <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Key Specs in clean light cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: <Bed className="w-5 h-5" />, label: 'Bedrooms', value: `${property.noRoom} ${property.noRoom > 1 ? 'Rooms' : 'Room'}` },
            { icon: <Bath className="w-5 h-5" />, label: 'Bathrooms', value: `${property.noBathroom} Bath` },
            { icon: <Layers className="w-5 h-5" />, label: 'Storeys', value: `${property.noFloor} Floor${property.noFloor > 1 ? 's' : ''}` },
            { icon: <Maximize2 className="w-5 h-5" />, label: 'Floor Area', value: `${property.squareMeters || '45'} m²` },
          ].map((spec, i) => (
            <div key={i} className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-emerald-50 text-emerald-600">
                {spec.icon}
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">{spec.label}</p>
                <p className="text-sm font-black text-slate-800 mt-0.5">{spec.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Description */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">About This Unit</h4>
          <p className="text-sm leading-relaxed text-slate-600">{property.description}</p>
        </div>

        {/* Amenities in clean light pills */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">Amenities &amp; Inclusions</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {property.amenities.map((amenity, idx) => (
              <div key={idx} className="flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold bg-slate-50 border border-slate-200 text-slate-700">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{amenity}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Move-In Cost Calculator in clean light theme */}
        <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80">
          <div className="flex items-center gap-2 mb-3">
            <Calculator className="w-4 h-4 text-emerald-700" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800">Move-In Cost Estimator</h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
              <p className="text-xs font-semibold text-slate-500">Advance Rent (1 mo)</p>
              <p className="text-xl font-black text-slate-900 mt-1 font-mono">
                ₱{property.rent.toLocaleString()}
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
              <p className="text-xs font-semibold text-slate-500">Security Deposit (2 mos)</p>
              <p className="text-xl font-black text-slate-900 mt-1 font-mono">
                ₱{(property.rent * 2).toLocaleString()}
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-emerald-600 text-white shadow-sm">
              <p className="text-xs font-semibold text-emerald-100">Total Move-In Cost</p>
              <p className="text-2xl font-black text-white mt-1 font-mono">
                ₱{totalMoveIn.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={() => { onClose(); onInquire(property); }}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white cursor-pointer transition-all shadow-sm hover:brightness-105"
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            }}
          >
            <PhoneCall className="w-4 h-4" />
            Inquire for Unit {property.house_no}
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl text-sm font-semibold cursor-pointer transition-all bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}
