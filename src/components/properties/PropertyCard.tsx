'use client';

import React from 'react';
import { Property } from '@/types';
import { Bed, Bath, Layers, ArrowUpRight, MapPin, Wifi, CheckCircle } from 'lucide-react';

interface PropertyCardProps {
  property: Property;
  onSelect: (property: Property) => void;
  onInquire?: (property: Property) => void;
}

const statusConfig = {
  available: { 
    label: 'Available', 
    className: 'badge-available',
    dot: '#10b981'
  },
  occupied: { 
    label: 'Occupied', 
    className: 'badge-occupied',
    dot: '#f59e0b'
  },
  maintenance: { 
    label: 'Maintenance', 
    className: 'badge-maintenance',
    dot: '#ef4444'
  },
};

export function PropertyCard({ property, onSelect, onInquire }: PropertyCardProps) {
  const status = statusConfig[property.status as keyof typeof statusConfig] || statusConfig.available;

  return (
    <div 
      onClick={() => onSelect(property)}
      className="property-card flex flex-col"
    >
      {/* Image Container */}
      <div className="relative overflow-hidden" style={{ aspectRatio: '16/10' }}>
        <img
          src={property.featuredImage || property.images[0]}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          style={{ transition: 'transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}
        />
        
        {/* Dark gradient overlay */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to top, rgba(5,10,15,0.85) 0%, rgba(5,10,15,0.2) 40%, transparent 70%)'
        }} />

        {/* Top row badges */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-10">
          <span className={`text-[11px] font-bold px-3 py-1.5 rounded-full ${status.className} flex items-center gap-1.5`}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: status.dot }} />
            {status.label}
          </span>
          <span className="text-xs font-bold px-3 py-1.5 rounded-full" style={{
            background: 'rgba(8, 15, 23, 0.85)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#94a3b8',
            backdropFilter: 'blur(8px)'
          }}>
            Unit {property.house_no}
          </span>
        </div>

        {/* Bottom price overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end justify-between z-10">
          <div>
            <p className="text-[11px] font-semibold text-emerald-400 mb-0.5">Monthly Rent</p>
            <p className="text-2xl font-extrabold text-white leading-none" style={{ fontFamily: 'Space Grotesk, monospace' }}>
              ₱{property.rent.toLocaleString()}
              <span className="text-xs font-normal ml-1" style={{ color: '#64748b' }}>/mo</span>
            </p>
          </div>
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
            style={{
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.15)'
            }}
          >
            <ArrowUpRight className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between" style={{ background: 'linear-gradient(180deg, #0d1926 0%, #0a1520 100%)' }}>
        <div className="space-y-3">
          <div>
            <h3 className="text-base font-bold text-white leading-snug line-clamp-1 group-hover:text-emerald-400 transition-colors" style={{ fontFamily: 'Outfit, sans-serif' }}>
              {property.title}
            </h3>
            <p className="text-xs flex items-center gap-1.5 mt-1.5 line-clamp-1" style={{ color: '#475569' }}>
              <MapPin className="w-3 h-3 text-emerald-500 shrink-0" />
              {property.fulladdress}
            </p>
          </div>

          {/* Specs row */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { icon: <Bed className="w-3.5 h-3.5" />, value: `${property.noRoom} ${property.noRoom > 1 ? 'Beds' : 'Bed'}` },
              { icon: <Bath className="w-3.5 h-3.5" />, value: `${property.noBathroom} ${property.noBathroom > 1 ? 'Baths' : 'Bath'}` },
              { icon: <Layers className="w-3.5 h-3.5" />, value: `${property.noFloor} ${property.noFloor > 1 ? 'Floors' : 'Floor'}` },
            ].map((spec, i) => (
              <div key={i} className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl" style={{
                background: 'rgba(8, 15, 23, 0.6)',
                border: '1px solid rgba(16, 185, 129, 0.08)'
              }}>
                <span style={{ color: '#10b981' }}>{spec.icon}</span>
                <span className="text-xs font-semibold" style={{ color: '#94a3b8' }}>{spec.value}</span>
              </div>
            ))}
          </div>

          {/* Amenities */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {property.amenities.slice(0, 3).map((amenity, idx) => (
              <span
                key={idx}
                className="text-[11px] font-medium px-2.5 py-1 rounded-lg flex items-center gap-1"
                style={{
                  background: 'rgba(16, 185, 129, 0.08)',
                  color: '#34d399',
                  border: '1px solid rgba(16, 185, 129, 0.15)'
                }}
              >
                <CheckCircle className="w-2.5 h-2.5 shrink-0" />
                {amenity}
              </span>
            ))}
            {property.amenities.length > 3 && (
              <span className="text-[11px] font-medium px-2.5 py-1 rounded-lg" style={{
                background: 'rgba(255,255,255,0.04)',
                color: '#475569',
                border: '1px solid rgba(255,255,255,0.06)'
              }}>
                +{property.amenities.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Action button */}
        {property.status === 'available' && onInquire && (
          <button
            onClick={e => { e.stopPropagation(); onInquire(property); }}
            className="mt-4 w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:scale-[1.02] cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(16,185,129,0.08))',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: '#34d399'
            }}
          >
            Inquire About This Unit →
          </button>
        )}
      </div>
    </div>
  );
}
