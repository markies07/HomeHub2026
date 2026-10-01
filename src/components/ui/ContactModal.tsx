'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Modal } from '@/components/ui/Modal';
import { useData } from '@/context/DataContext';
import { 
  Mail, Send, CheckCircle2, User, Phone, MessageSquare, 
  Calendar, Clock, ShieldCheck, ArrowRight, Building2, Check
} from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultUnit?: number;
}

type InquiryIntent = 'viewing' | 'pricing' | 'general';

export function ContactModal({ isOpen, onClose, defaultUnit }: ContactModalProps) {
  const { properties } = useData();

  const [selectedUnit, setSelectedUnit] = useState<number | undefined>(defaultUnit);
  const [intent, setIntent] = useState<InquiryIntent>('viewing');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('afternoon');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Sync defaultUnit when it changes
  useEffect(() => {
    setSelectedUnit(defaultUnit);
  }, [defaultUnit]);

  // Find target property details if a unit is selected
  const targetProperty = useMemo(() => {
    if (!selectedUnit) return null;
    return properties.find(p => p.house_no === selectedUnit) || null;
  }, [properties, selectedUnit]);

  // Update subject automatically when unit or intent changes
  useEffect(() => {
    const unitText = selectedUnit ? `Unit ${selectedUnit}` : 'Available Residences';
    if (intent === 'viewing') {
      setSubject(`Schedule a viewing for ${unitText}`);
    } else if (intent === 'pricing') {
      setSubject(`Pricing & lease terms inquiry for ${unitText}`);
    } else {
      setSubject(`General inquiry regarding ${unitText}`);
    }
  }, [selectedUnit, intent]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 600);
  };

  const handleClose = () => {
    setIsSubmitted(false);
    onClose();
  };

  const getPlaceholder = () => {
    switch (intent) {
      case 'viewing':
        return 'Please let us know your preferred date, time, and how many people will be viewing...';
      case 'pricing':
        return 'Ask about monthly rent inclusions, security deposit, parking fees, or utilities...';
      default:
        return 'Share your move-in timeline, special requests, or any questions for our leasing officer...';
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isSubmitted ? undefined : "Get in Touch"}
      subtitle={isSubmitted ? undefined : "Have questions or want to schedule a viewing? Message our leasing team!"}
      icon={isSubmitted ? undefined : <MessageSquare className="w-5 h-5" />}
      maxWidth="md"
    >
      {isSubmitted ? (
        <div className="text-center py-6 sm:py-8">
          <div className="w-16 h-16 rounded-3xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center mx-auto mb-4 shadow-sm animate-scale-in">
            <CheckCircle2 className="w-8 h-8 text-emerald-600" />
          </div>
          
          <h3 className="text-2xl font-black text-slate-900 mb-1" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Inquiry Sent Successfully!
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mb-6 max-w-sm mx-auto leading-relaxed">
            Thank you, <span className="text-slate-900 font-bold">{name}</span>. Our leasing officer has received your message and will contact you via <span className="font-semibold text-emerald-700">{email || phone}</span> shortly.
          </p>

          {/* Submission Details Card */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 max-w-sm mx-auto text-left mb-6 text-xs space-y-2">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200/60">
              <span className="text-slate-500 font-medium">Inquiry Type:</span>
              <span className="font-bold text-slate-800 capitalize">{intent} inquiry</span>
            </div>
            {targetProperty && (
              <div className="flex justify-between items-center pb-2 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">Property:</span>
                <span className="font-bold text-slate-800">Unit {targetProperty.house_no} ({targetProperty.title})</span>
              </div>
            )}
            {preferredDate && (
              <div className="flex justify-between items-center pb-2 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">Target Date:</span>
                <span className="font-bold text-slate-800">{preferredDate} ({preferredTime})</span>
              </div>
            )}
            <div className="flex justify-between items-center pt-1">
              <span className="text-slate-500 font-medium">Status:</span>
              <span className="inline-flex items-center gap-1 font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <Check className="w-3 h-3" /> Dispatched to Manager
              </span>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="px-8 py-3 rounded-xl text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 cursor-pointer transition-all shadow-md hover:shadow-lg"
          >
            Done
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Unit Context Card (if inquiring for a specific unit) */}
          {targetProperty ? (
            <div className="flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-emerald-50/90 to-teal-50/70 border border-emerald-200/80 shadow-xs">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-white border border-emerald-200 shadow-xs">
                  <img 
                    src={targetProperty.featuredImage || targetProperty.images[0]} 
                    alt={targetProperty.title} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-600 text-white font-mono">
                      Unit {targetProperty.house_no}
                    </span>
                    <span className="text-xs font-bold text-slate-900 truncate">
                      {targetProperty.title}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 font-medium mt-0.5">
                    ₱{targetProperty.rent.toLocaleString()}/month · {targetProperty.noRoom}BR / {targetProperty.noBathroom}BA
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedUnit(undefined)}
                className="text-[10px] font-bold text-emerald-700 hover:text-emerald-800 bg-white/80 hover:bg-white px-2 py-1 rounded-lg border border-emerald-200/80 transition-colors shrink-0 ml-2 cursor-pointer"
              >
                Change
              </button>
            </div>
          ) : (
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Target Residence (Optional)
              </label>
              <div className="relative">
                <select
                  value={selectedUnit || ''}
                  onChange={e => setSelectedUnit(e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs shadow-xs focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all font-medium appearance-none cursor-pointer"
                >
                  <option value="">General Inquiry / Any Available Unit</option>
                  {properties.map(p => (
                    <option key={p.id} value={p.house_no}>
                      Unit {p.house_no} - {p.title} (₱{p.rent.toLocaleString()}/mo)
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <Building2 className="w-4 h-4" />
                </div>
              </div>
            </div>
          )}

          {/* Quick Intent Tabs */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              What can we help you with?
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setIntent('viewing')}
                className={`py-2 px-2.5 rounded-xl border text-center font-bold text-[11px] transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  intent === 'viewing'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Calendar className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="truncate">Schedule Tour</span>
              </button>

              <button
                type="button"
                onClick={() => setIntent('pricing')}
                className={`py-2 px-2.5 rounded-xl border text-center font-bold text-[11px] transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  intent === 'pricing'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="truncate">Rent & Terms</span>
              </button>

              <button
                type="button"
                onClick={() => setIntent('general')}
                className={`py-2 px-2.5 rounded-xl border text-center font-bold text-[11px] transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  intent === 'general'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="truncate">General</span>
              </button>
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Full Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative group">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors pointer-events-none">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Maria Santos"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs placeholder:text-slate-400 shadow-xs hover:border-slate-300 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all font-medium"
              />
            </div>
          </div>

          {/* Email & Phone side-by-side */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative group">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors pointer-events-none">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@email.com"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs placeholder:text-slate-400 shadow-xs hover:border-slate-300 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
                  Phone Number
                </label>
                <span className="text-[10px] text-slate-400 font-medium">Optional</span>
              </div>
              <div className="relative group">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors pointer-events-none">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+63 917 000 0000"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs placeholder:text-slate-400 shadow-xs hover:border-slate-300 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all font-medium"
                />
              </div>
            </div>
          </div>

          {/* Viewing Date Options (if intent is viewing) */}
          {intent === 'viewing' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Preferred Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={preferredDate}
                    onChange={e => setPreferredDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs shadow-xs focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Preferred Time Slot
                </label>
                <select
                  value={preferredTime}
                  onChange={e => setPreferredTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs shadow-xs focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
                >
                  <option value="morning">Morning (9:00 AM – 12:00 PM)</option>
                  <option value="afternoon">Afternoon (1:00 PM – 5:00 PM)</option>
                  <option value="evening">Evening (5:00 PM – 7:00 PM)</option>
                </select>
              </div>
            </div>
          )}

          {/* Subject Line */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Subject <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={subject}
              onChange={e => setSubject(e.target.value)}
              placeholder="e.g. Schedule a unit viewing"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs placeholder:text-slate-400 shadow-xs hover:border-slate-300 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all font-medium"
            />
          </div>

          {/* Message Textarea */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Message <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              required
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder={getPlaceholder()}
              className="w-full p-3 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs placeholder:text-slate-400 shadow-xs hover:border-slate-300 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all resize-none font-medium leading-relaxed"
            />
          </div>

          {/* Fast Response Reassurance */}
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-100 text-[11px] text-emerald-800 font-medium">
            <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Fast response: Direct connection with the property leasing manager (avg. 15-30 mins).</span>
          </div>

          {/* Actions */}
          <div className="pt-2 flex gap-3">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] cursor-pointer transition-all shadow-md hover:shadow-lg disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Sending Inquiry...</span>
                </>
              ) : (
                <>
                  <span>Send Inquiry</span>
                  <Send className="w-4 h-4" />
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="px-5 py-3 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}
