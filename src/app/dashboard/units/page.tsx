'use client';

import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { Property, PropertyStatus, Tenant } from '@/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { 
  Plus, Search, Home, Bed, Bath, Layers, Edit, Trash2, 
  MapPin, Check, X, Building2, Eye, ArrowLeft, Image as ImageIcon,
  User, Phone, Users, Calendar, DollarSign, ShieldAlert, CheckCircle2,
  AlertCircle, Maximize2, Sparkles, UploadCloud, FileText, Receipt
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function UnitsManagementPage() {
  const { properties, tenants, payments, addProperty, updateProperty, deleteProperty, addTenant, terminateTenant } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // View mode: 'list' or 'detail' (mimicking old HomeHub's units.php and houseInfo.php)
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPropertyId, setEditingPropertyId] = useState<string | null>(null);
  const [isAddTenantModalOpen, setIsAddTenantModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [lightboxImageUrl, setLightboxImageUrl] = useState<string | null>(null);

  // Form states for Add / Edit Property
  const [formHouseNo, setFormHouseNo] = useState<number>(301);
  const [formTitle, setFormTitle] = useState('');
  const [formAddress, setFormAddress] = useState('HomeHub Residences, Acacia Ave., Cavite');
  const [formRooms, setFormRooms] = useState(2);
  const [formBaths, setFormBaths] = useState(1);
  const [formFloors, setFormFloors] = useState(1);
  const [formRent, setFormRent] = useState(20000);
  const [formStatus, setFormStatus] = useState<PropertyStatus>('available');
  const [formImageUrl, setFormImageUrl] = useState('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80');
  const [formDescription, setFormDescription] = useState('Modern residence with complete inclusions and fiber connectivity.');
  const [formAmenities, setFormAmenities] = useState('Air Conditioning, High-speed WiFi, Balcony, Keycard Entry');

  // Form state for Add Tenant (when house is unoccupied, like in houseInfo.php)
  const [tenantName, setTenantName] = useState('');
  const [tenantContact, setTenantContact] = useState('');
  const [tenantOccupants, setTenantOccupants] = useState(2);
  const [tenantDeposit, setTenantDeposit] = useState(20000);
  const [tenantStartDate, setTenantStartDate] = useState(new Date().toISOString().split('T')[0]);

  // Image addition state in Detailed View
  const [newCustomImageUrl, setNewCustomImageUrl] = useState('');

  // Sample quick-add images
  const sampleApartmentPhotos = [
    { label: 'Master Bedroom', url: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Modern Kitchen', url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Living Room', url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Balcony View', url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Luxury Bath', url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80' },
  ];

  // Active property for detail view
  const currentDetailProp = selectedPropertyId ? properties.find(p => p.id === selectedPropertyId) || null : null;
  // Associated tenant if occupied
  const currentTenant = currentDetailProp ? tenants.find(t => t.house_no === currentDetailProp.house_no && t.status === 'active') || null : null;
  // Associated payments
  const unitPayments = currentDetailProp ? payments.filter(p => p.house_no === currentDetailProp.house_no) : [];

  // Filter list
  const filtered = properties.filter(p => {
    const matchesSearch = 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.house_no.toString().includes(searchQuery) ||
      p.fulladdress.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenAdd = () => {
    setEditingPropertyId(null);
    const maxHouse = properties.reduce((max, p) => (p.house_no > max ? p.house_no : max), 100);
    setFormHouseNo(maxHouse + 1);
    setFormTitle(`Executive Suite ${maxHouse + 1}`);
    setFormAddress('HomeHub Residences, Acacia Ave., Cavite');
    setFormRooms(2);
    setFormBaths(1);
    setFormFloors(1);
    setFormRent(20000);
    setFormStatus('available');
    setFormImageUrl('https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80');
    setFormDescription('Contemporary suite designed for comfort and peace.');
    setFormAmenities('Air Conditioning, Balcony, Fiber Internet Ready');
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (prop: Property) => {
    setEditingPropertyId(prop.id);
    setFormHouseNo(prop.house_no);
    setFormTitle(prop.title);
    setFormAddress(prop.fulladdress);
    setFormRooms(prop.noRoom);
    setFormBaths(prop.noBathroom);
    setFormFloors(prop.noFloor);
    setFormRent(prop.rent);
    setFormStatus(prop.status);
    setFormImageUrl(prop.featuredImage || prop.images[0]);
    setFormDescription(prop.description);
    setFormAmenities(prop.amenities ? prop.amenities.join(', ') : '');
    setIsEditModalOpen(true);
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const amenitiesArr = formAmenities.split(',').map(s => s.trim()).filter(Boolean);
    addProperty({
      house_no: Number(formHouseNo),
      title: formTitle,
      fulladdress: formAddress,
      noRoom: Number(formRooms),
      noBathroom: Number(formBaths),
      noFloor: Number(formFloors),
      rent: Number(formRent),
      status: formStatus,
      squareMeters: Number(formRooms) * 28,
      description: formDescription,
      amenities: amenitiesArr,
      featuredImage: formImageUrl,
      images: [formImageUrl]
    });
    setIsAddModalOpen(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetId = editingPropertyId || (currentDetailProp ? currentDetailProp.id : null);
    if (!targetId) return;
    const targetProp = properties.find(p => p.id === targetId);
    if (!targetProp) return;

    const amenitiesArr = formAmenities.split(',').map(s => s.trim()).filter(Boolean);
    updateProperty(targetProp.id, {
      house_no: Number(formHouseNo),
      title: formTitle,
      fulladdress: formAddress,
      noRoom: Number(formRooms),
      noBathroom: Number(formBaths),
      noFloor: Number(formFloors),
      rent: Number(formRent),
      status: formStatus,
      description: formDescription,
      amenities: amenitiesArr,
      featuredImage: formImageUrl,
      images: targetProp.images.includes(formImageUrl) ? targetProp.images : [formImageUrl, ...targetProp.images]
    });
    setIsEditModalOpen(false);
    setEditingPropertyId(null);
  };

  const handleDeleteProperty = (id: string, house_no: number, fulladdress: string) => {
    if (confirm(`Are you sure you want to remove this property?\n\nHouse: ${house_no}\nAddress: ${fulladdress}`)) {
      deleteProperty(id);
      if (selectedPropertyId === id) {
        setSelectedPropertyId(null);
      }
    }
  };

  // Image Gallery Management
  const handleAddImageToGallery = (urlToAdd: string) => {
    if (!currentDetailProp || !urlToAdd.trim()) return;
    const trimmed = urlToAdd.trim();
    if (currentDetailProp.images.includes(trimmed)) {
      alert('This image is already in the gallery.');
      return;
    }
    const updatedImages = [...currentDetailProp.images, trimmed];
    updateProperty(currentDetailProp.id, {
      images: updatedImages,
      featuredImage: currentDetailProp.featuredImage || trimmed
    });
    setNewCustomImageUrl('');
  };

  const handleRemoveImageFromGallery = (indexToRemove: number) => {
    if (!currentDetailProp) return;
    if (currentDetailProp.images.length <= 1) {
      alert('A property must have at least one image in its gallery.');
      return;
    }
    if (!confirm('Are you sure you want to remove this image from the unit gallery?')) {
      return;
    }

    const removedUrl = currentDetailProp.images[indexToRemove];
    const updatedImages = currentDetailProp.images.filter((_, idx) => idx !== indexToRemove);
    const newFeatured = currentDetailProp.featuredImage === removedUrl ? updatedImages[0] : currentDetailProp.featuredImage;

    updateProperty(currentDetailProp.id, {
      images: updatedImages,
      featuredImage: newFeatured
    });
  };

  const handleSetAsCover = (url: string) => {
    if (!currentDetailProp) return;
    updateProperty(currentDetailProp.id, {
      featuredImage: url
    });
  };

  // Tenant Assignment (houseInfo.php "ADD TENANT" logic)
  const handleAddTenantSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentDetailProp) return;
    if (tenantDeposit < currentDetailProp.rent) {
      if (!confirm(`Deposit is less than the monthly rent (₱${currentDetailProp.rent.toLocaleString()}). Do you still want to proceed?`)) {
        return;
      }
    }

    addTenant({
      house_no: currentDetailProp.house_no,
      fullname: tenantName,
      email: `${tenantName.toLowerCase().replace(/\s+/g, '.')}@homehub.resident`,
      contact: tenantContact,
      occupants: Number(tenantOccupants),
      deposit: Number(tenantDeposit),
      startDate: tenantStartDate,
      emergencyContactName: 'Family Member',
      emergencyContactPhone: tenantContact
    });

    setIsAddTenantModalOpen(false);
    setTenantName('');
    setTenantContact('');
  };

  // Terminate Tenant (houseInfo.php "TERMINATE" logic)
  const handleTerminateTenant = (tenant: Tenant) => {
    if (confirm(`Are you sure you want to terminate this tenant?\n\nHouse: ${tenant.house_no}\nName: ${tenant.fullname}\nStart Date: ${tenant.startDate}`)) {
      terminateTenant(tenant.id, 'Terminated by Property Owner');
    }
  };

  // Calculate dynamic months of staying (exact math from houseInfo.php)
  const calculateMonthsStaying = (startDateStr: string) => {
    const start = new Date(startDateStr);
    const now = new Date();
    const diffMonths = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
    return Math.max(diffMonths, 1);
  };

  // Common derived variables
  const monthsStayed = currentTenant ? calculateMonthsStaying(currentTenant.startDate) : 0;
  const isOccupied = currentDetailProp ? (currentDetailProp.status === 'occupied' && currentTenant !== null) : false;

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {currentDetailProp ? (
          /* ========================================== */
          /* VIEW 1: DEDICATED FULL DETAIL VIEW (houseInfo.php) */
          /* ========================================== */
          <motion.div
            key="detail"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22 }}
            className="space-y-6 pb-12 w-full"
          >
        {/* Top Back Navigation & Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedPropertyId(null)}
              className="p-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700 transition-colors cursor-pointer shadow-xs flex items-center gap-1.5 text-xs font-bold"
            >
              <ArrowLeft className="w-4 h-4 text-emerald-600" />
              <span>Back to Units</span>
            </button>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  House {currentDetailProp.house_no}
                </h1>
                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full capitalize shadow-xs ${
                  isOccupied
                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : currentDetailProp.status === 'available'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}>
                  ● {currentDetailProp.status}
                </span>
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                {currentDetailProp.fulladdress}
              </p>
            </div>
          </div>

          {/* Action Buttons (replicating houseInfo.php buttons) */}
          <div className="flex flex-wrap items-center gap-2">
            {!isOccupied && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  setTenantDeposit(currentDetailProp.rent);
                  setIsAddTenantModalOpen(true);
                }}
                leftIcon={<Plus className="w-4 h-4" />}
                className="shadow-sm font-bold"
              >
                Add Tenant
              </Button>
            )}

            {isOccupied && currentTenant && (
              <>
                <button
                  onClick={() => setIsHistoryModalOpen(true)}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Receipt className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Payment History</span>
                </button>

                <button
                  onClick={() => handleTerminateTenant(currentTenant)}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-100 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Terminate Tenant</span>
                </button>
              </>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={() => handleOpenEdit(currentDetailProp)}
              leftIcon={<Edit className="w-3.5 h-3.5" />}
              className="bg-white hover:bg-slate-50 font-semibold"
            >
              Edit Property
            </Button>

            <button
              onClick={() => handleDeleteProperty(currentDetailProp.id, currentDetailProp.house_no, currentDetailProp.fulladdress)}
              className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 hover:text-rose-600 border border-rose-200/80 transition-colors cursor-pointer"
              title="Remove Property"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Layout: 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: House Specifications & Tenant Card (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Rent & Overview Banner */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Monthly House Rent</p>
                  <h2 className="text-3xl font-black text-slate-900 mt-0.5">
                    ₱{currentDetailProp.rent.toLocaleString()}<span className="text-sm font-semibold text-slate-400"> / month</span>
                  </h2>
                </div>
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Active in Public Directory</span>
                </div>
              </div>

              {/* Key Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
                  <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold">
                    <Bed className="w-4 h-4 text-emerald-600" />
                    <span>Rooms</span>
                  </div>
                  <p className="text-lg font-black text-slate-800 mt-1">{currentDetailProp.noRoom} Rooms</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
                  <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold">
                    <Bath className="w-4 h-4 text-emerald-600" />
                    <span>Bathrooms</span>
                  </div>
                  <p className="text-lg font-black text-slate-800 mt-1">{currentDetailProp.noBathroom} Baths</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
                  <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold">
                    <Layers className="w-4 h-4 text-emerald-600" />
                    <span>Storeys</span>
                  </div>
                  <p className="text-lg font-black text-slate-800 mt-1">{currentDetailProp.noFloor} Floors</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
                  <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold">
                    <Home className="w-4 h-4 text-emerald-600" />
                    <span>Floor Area</span>
                  </div>
                  <p className="text-lg font-black text-slate-800 mt-1">{currentDetailProp.squareMeters || 45} m²</p>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">About this Property</h3>
                <p className="text-sm text-slate-600 leading-relaxed bg-slate-50/70 p-4 rounded-xl border border-slate-100">
                  {currentDetailProp.description}
                </p>
              </div>

              {/* Amenities */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Amenities &amp; Inclusions</h3>
                <div className="flex flex-wrap gap-2">
                  {currentDetailProp.amenities.map((item, idx) => (
                    <span key={idx} className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200/60 text-xs font-semibold flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* OCCUPIED: TENANT INFORMATION (houseInfo.php matching logic) */}
            {isOccupied && currentTenant && (
              <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200/80 flex items-center justify-center p-1 shrink-0">
                      <img src="/icons/tenant.png" alt="Tenant" className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Current Tenant Information</h3>
                      <p className="text-[11px] text-slate-400">Lease record for Unit {currentDetailProp.house_no}</p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-black ${
                    currentTenant.status === 'active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700'
                  }`}>
                    ● Active Lease
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 font-medium">Tenant Full Name:</span>
                    <p className="text-sm font-bold text-slate-900 mt-0.5">{currentTenant.fullname}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 font-medium">Contact Number:</span>
                    <p className="text-sm font-bold text-slate-900 mt-0.5">{currentTenant.contact}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 font-medium">Start Date:</span>
                    <p className="text-sm font-bold text-slate-900 mt-0.5">
                      {new Date(currentTenant.startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 font-medium">Months of Staying:</span>
                    <p className="text-sm font-bold text-emerald-700 mt-0.5">{monthsStayed} Month(s)</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 font-medium">Number of Occupants:</span>
                    <p className="text-sm font-bold text-slate-900 mt-0.5">{currentTenant.occupants} person(s)</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 font-medium">Payment Status:</span>
                    <div className="mt-0.5">
                      {currentTenant.balance > 0 ? (
                        <span className="text-sm font-black text-rose-600">UNPAID (₱{currentTenant.balance.toLocaleString()} due)</span>
                      ) : (
                        <span className="text-sm font-black text-emerald-600">PAID (Up to date)</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* UNOCCUPIED: ADD TENANT CTA CARD */}
            {!isOccupied && (
              <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50/50 to-white border border-emerald-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-emerald-900">This Unit is Currently Available</h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Ready to assign a new resident? Register the tenant profile and activate their lease contract.
                  </p>
                </div>
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => {
                    setTenantDeposit(currentDetailProp.rent);
                    setIsAddTenantModalOpen(true);
                  }}
                  leftIcon={<Plus className="w-4 h-4" />}
                  className="shadow-sm font-bold shrink-0"
                >
                  Add Tenant to Unit
                </Button>
              </div>
            )}

          </div>

          {/* Right Column: Image Gallery Management (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs">
                    <ImageIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Property Imagery &amp; Gallery</h3>
                    <p className="text-[11px] text-slate-400">{currentDetailProp.images.length} photos live in public directory</p>
                  </div>
                </div>
              </div>

              {/* Gallery Grid */}
              <div className="grid grid-cols-2 gap-3">
                {currentDetailProp.images.map((imgUrl, idx) => {
                  const isFeatured = currentDetailProp.featuredImage === imgUrl;
                  return (
                    <div 
                      key={idx} 
                      className="group relative rounded-xl overflow-hidden border border-slate-200/80 aspect-[4/3] bg-slate-100 shadow-xs hover:shadow-md transition-all"
                    >
                      <img 
                        src={imgUrl} 
                        alt={`Unit Photo ${idx + 1}`} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                      />

                      {/* Cover Badge */}
                      {isFeatured && (
                        <div className="absolute top-2 left-2 z-10">
                          <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-emerald-600 text-white shadow-sm">
                            Cover Photo
                          </span>
                        </div>
                      )}

                      {/* Action Overlay */}
                      <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2.5 z-20">
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={() => setLightboxImageUrl(imgUrl)}
                            title="Preview Full Size"
                            className="p-1.5 rounded-lg bg-white/90 hover:bg-white text-slate-800 transition-colors cursor-pointer"
                          >
                            <Maximize2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleRemoveImageFromGallery(idx)}
                            title="Remove Photo"
                            className="p-1.5 rounded-lg bg-rose-600/90 hover:bg-rose-600 text-white transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {!isFeatured && (
                          <button
                            onClick={() => handleSetAsCover(imgUrl)}
                            className="w-full py-1 px-2 rounded-lg bg-white/90 hover:bg-white text-slate-900 text-[10px] font-bold text-center transition-colors cursor-pointer shadow-xs"
                          >
                            Set as Cover
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Add New Image Input */}
              <div className="pt-2 border-t border-slate-100 space-y-3">
                <label className="block text-xs font-bold text-slate-700">Add Image to Unit Gallery</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={newCustomImageUrl}
                    onChange={e => setNewCustomImageUrl(e.target.value)}
                    placeholder="Paste image URL (https://...)"
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleAddImageToGallery(newCustomImageUrl)}
                    className="shrink-0 text-xs font-bold"
                  >
                    Add Photo
                  </Button>
                </div>

                {/* Sample Library Presets */}
                <div>
                  <p className="text-[10px] font-bold uppercase text-slate-400 mb-1.5">Or choose from sample library:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {sampleApartmentPhotos.map((sample, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleAddImageToGallery(sample.url)}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 border border-slate-200/60 text-[10px] font-semibold text-slate-600 transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <Plus className="w-2.5 h-2.5 text-emerald-600" />
                        {sample.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
          </motion.div>
        ) : (
          /* ========================================== */
          /* VIEW 2: UNITS DIRECTORY GRID (units.php)    */
          /* ========================================== */
          <motion.div
            key="grid"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22 }}
            className="space-y-6 pb-10 w-full"
          >
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Properties &amp; Units
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage apartment inventory, pricing, room specifications, and availability across Cavite.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={handleOpenAdd}
          leftIcon={<Plus className="w-4 h-4" />}
          className="shadow-sm font-bold"
        >
          Add New Unit
        </Button>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col sm:flex-row gap-3 justify-between items-center">
        <div className="relative flex-1 w-full sm:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by unit number, title, or address..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
          />
        </div>

        {/* Status Filters */}
        <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-full sm:w-auto overflow-x-auto">
          {(['all', 'available', 'occupied', 'maintenance'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`relative px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors cursor-pointer whitespace-nowrap ${
                statusFilter === tab
                  ? 'text-emerald-800'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {statusFilter === tab && (
                <motion.div
                  layoutId="unitsStatusPill"
                  className="absolute inset-0 bg-white rounded-lg shadow-xs"
                  transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                />
              )}
              <span className="relative z-10">{tab}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Units Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(prop => (
          <motion.div
            key={prop.id}
            layout
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="rounded-2xl bg-white border border-slate-200/80 overflow-hidden hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div>
              {/* Image Banner */}
              <div 
                className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 cursor-pointer"
                onClick={() => setSelectedPropertyId(prop.id)}
              >
                <img
                  src={prop.featuredImage || prop.images[0]}
                  alt={prop.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full capitalize shadow-xs backdrop-blur-md ${
                    prop.status === 'occupied'
                      ? 'bg-amber-500/95 text-white'
                      : prop.status === 'available'
                      ? 'bg-emerald-600/95 text-white'
                      : 'bg-rose-500/95 text-white'
                  }`}>
                    {prop.status}
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-xs font-black bg-white/95 backdrop-blur-md text-slate-800 shadow-xs border border-slate-200/50">
                    Unit {prop.house_no}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 space-y-3.5">
                <div>
                  <h3 
                    onClick={() => setSelectedPropertyId(prop.id)}
                    className="text-base font-bold text-slate-900 line-clamp-1 hover:text-emerald-700 cursor-pointer transition-colors"
                  >
                    {prop.title}
                  </h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-1 line-clamp-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    {prop.fulladdress}
                  </p>
                </div>

                {/* Specs */}
                <div className="grid grid-cols-3 gap-2 py-2.5 border-y border-slate-100 text-xs text-slate-600 font-medium">
                  <div className="flex items-center gap-1.5">
                    <Bed className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{prop.noRoom} Bed</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Bath className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{prop.noBathroom} Bath</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{prop.squareMeters || 45}m²</span>
                  </div>
                </div>

                {/* Pricing & Occupant */}
                <div className="flex items-center justify-between pt-1">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400">Monthly Rent</p>
                    <p className="text-lg font-black text-slate-900">
                      ₱{prop.rent.toLocaleString()}<span className="text-xs font-normal text-slate-400">/mo</span>
                    </p>
                  </div>
                  {prop.currentTenantName && (
                    <div className="text-right">
                      <p className="text-[10px] uppercase font-bold text-slate-400">Resident</p>
                      <p className="text-xs font-bold text-slate-800">{prop.currentTenantName}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Actions Bar (matching old HomeHub's INFO button + Edit/Delete) */}
            <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center gap-2">
              <Button
                variant="primary"
                size="sm"
                onClick={() => setSelectedPropertyId(prop.id)}
                leftIcon={<Eye className="w-3.5 h-3.5" />}
                className="flex-1 text-xs font-bold shadow-xs"
              >
                View Full Details
              </Button>
              <button
                onClick={() => handleOpenEdit(prop)}
                className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 transition-colors border border-slate-200 cursor-pointer"
                title="Edit Unit"
              >
                <Edit className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleDeleteProperty(prop.id, prop.house_no, prop.fulladdress)}
                className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 transition-colors border border-rose-200/60 cursor-pointer"
                title="Delete Unit"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )}
</AnimatePresence>

      {/* ADD UNIT MODAL */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Apartment Unit"
        subtitle="Specify unit parameters, rental rates, and imagery"
        maxWidth="lg"
      >
        <form onSubmit={handleSaveAdd} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">House / Unit #</label>
              <input
                type="number"
                required
                value={formHouseNo}
                onChange={e => setFormHouseNo(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Monthly Rent (₱)</label>
              <input
                type="number"
                required
                value={formRent}
                onChange={e => setFormRent(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Unit Title</label>
            <input
              type="text"
              required
              value={formTitle}
              onChange={e => setFormTitle(e.target.value)}
              placeholder="e.g. Executive 2BR Loft Suite"
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Full Address</label>
            <input
              type="text"
              required
              value={formAddress}
              onChange={e => setFormAddress(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Bedrooms</label>
              <input
                type="number"
                min="1"
                required
                value={formRooms}
                onChange={e => setFormRooms(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Bathrooms</label>
              <input
                type="number"
                min="1"
                required
                value={formBaths}
                onChange={e => setFormBaths(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Floors / Storeys</label>
              <input
                type="number"
                min="1"
                required
                value={formFloors}
                onChange={e => setFormFloors(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Initial Status</label>
            <select
              value={formStatus}
              onChange={e => setFormStatus(e.target.value as PropertyStatus)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="available">Available (Unoccupied)</option>
              <option value="occupied">Occupied</option>
              <option value="maintenance">Under Maintenance</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Featured Image URL</label>
            <input
              type="url"
              required
              value={formImageUrl}
              onChange={e => setFormImageUrl(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Amenities (Comma-separated)</label>
            <input
              type="text"
              value={formAmenities}
              onChange={e => setFormAmenities(e.target.value)}
              placeholder="Air Conditioning, Balcony, Fiber WiFi"
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="pt-3 flex gap-3">
            <Button type="submit" variant="primary" className="flex-1 py-2.5">
              Create Unit
            </Button>
            <Button type="button" variant="ghost" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      {/* EDIT UNIT MODAL */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={`Edit Unit ${formHouseNo}`}
        subtitle="Update unit parameters and rental details"
        maxWidth="lg"
      >
        <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">House / Unit #</label>
              <input
                type="number"
                required
                value={formHouseNo}
                onChange={e => setFormHouseNo(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Monthly Rent (₱)</label>
              <input
                type="number"
                required
                value={formRent}
                onChange={e => setFormRent(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Unit Title</label>
            <input
              type="text"
              required
              value={formTitle}
              onChange={e => setFormTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Bedrooms</label>
              <input
                type="number"
                min="1"
                required
                value={formRooms}
                onChange={e => setFormRooms(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Bathrooms</label>
              <input
                type="number"
                min="1"
                required
                value={formBaths}
                onChange={e => setFormBaths(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Floors</label>
              <input
                type="number"
                min="1"
                required
                value={formFloors}
                onChange={e => setFormFloors(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Status</label>
            <select
              value={formStatus}
              onChange={e => setFormStatus(e.target.value as PropertyStatus)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="available">Available</option>
              <option value="occupied">Occupied</option>
              <option value="maintenance">Under Maintenance</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Amenities (Comma-separated)</label>
            <input
              type="text"
              value={formAmenities}
              onChange={e => setFormAmenities(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="pt-3 flex gap-3">
            <Button type="submit" variant="primary" className="flex-1 py-2.5">
              Update Unit
            </Button>
            <Button type="button" variant="ghost" onClick={() => { setIsEditModalOpen(false); setEditingPropertyId(null); }}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      {/* 3. LIGHTBOX MODAL */}
      {lightboxImageUrl && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in"
          onClick={() => setLightboxImageUrl(null)}
        >
          <div className="relative max-w-4xl max-h-[85vh] w-full bg-white rounded-2xl overflow-hidden shadow-2xl p-2" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setLightboxImageUrl(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <img 
              src={lightboxImageUrl} 
              alt="Enlarged View" 
              className="w-full h-full max-h-[80vh] object-contain rounded-xl"
            />
          </div>
        </div>
      )}

      {/* 4. ADD TENANT MODAL (houseInfo.php ADDING TENANT FORM) */}
      {currentDetailProp && (
        <Modal
          isOpen={isAddTenantModalOpen}
          onClose={() => setIsAddTenantModalOpen(false)}
          title={`Add Tenant to House ${currentDetailProp.house_no}`}
          subtitle={`Monthly Rent: ₱${currentDetailProp.rent.toLocaleString()}`}
          maxWidth="md"
        >
          <form onSubmit={handleAddTenantSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={tenantName}
                onChange={e => setTenantName(e.target.value)}
                placeholder="e.g. Maria Santos"
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Contact Number</label>
              <input
                type="text"
                required
                value={tenantContact}
                onChange={e => setTenantContact(e.target.value)}
                placeholder="+63 917 123 4567"
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">No. of Occupants</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={tenantOccupants}
                  onChange={e => setTenantOccupants(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Deposit &amp; Advance (₱)</label>
                <input
                  type="number"
                  required
                  value={tenantDeposit}
                  onChange={e => setTenantDeposit(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Lease Start Date</label>
              <input
                type="date"
                required
                value={tenantStartDate}
                onChange={e => setTenantStartDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="pt-2 flex gap-3">
              <Button type="submit" variant="primary" className="flex-1 py-2.5 font-bold">
                Confirm &amp; Assign Tenant
              </Button>
              <Button type="button" variant="ghost" onClick={() => setIsAddTenantModalOpen(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* 5. PAYMENT HISTORY MODAL (houseInfo.php PAYMENT HISTORY) */}
      {currentDetailProp && (
        <Modal
          isOpen={isHistoryModalOpen}
          onClose={() => setIsHistoryModalOpen(false)}
          title={`Payment History • House ${currentDetailProp.house_no}`}
          subtitle={`Resident: ${currentTenant?.fullname || 'N/A'}`}
          maxWidth="lg"
        >
          <div className="space-y-4">
            {unitPayments.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">No payment records found for this unit.</p>
            ) : (
              <div className="rounded-xl border border-slate-200 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                    <tr>
                      <th className="py-2.5 px-3">Receipt #</th>
                      <th className="py-2.5 px-3">Date Paid</th>
                      <th className="py-2.5 px-3">Mode</th>
                      <th className="py-2.5 px-3">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                    {unitPayments.map(p => (
                      <tr key={p.id} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-mono text-emerald-700 font-bold">{p.receiptNumber}</td>
                        <td className="py-2.5 px-3 text-slate-500">{new Date(p.datePaid).toLocaleDateString()}</td>
                        <td className="py-2.5 px-3">{p.MOP}</td>
                        <td className="py-2.5 px-3 font-bold text-slate-900">₱{p.amount.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </Modal>
      )}

    </div>
  );
}
