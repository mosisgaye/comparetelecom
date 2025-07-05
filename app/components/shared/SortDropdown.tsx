import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface SortOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface SortDropdownProps {
  options: SortOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SortDropdown({ 
  options, 
  value, 
  onChange, 
  placeholder = 'Trier par',
  className = '' 
}: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fermer le dropdown si on clique à l'extérieur
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between gap-3 w-full px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:border-gray-300 focus:outline-none focus:border-gray-900 transition-colors"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="flex items-center gap-2">
          {selectedOption?.icon}
          <span className={selectedOption ? 'text-gray-900' : 'text-gray-500'}>
            {selectedOption?.label || placeholder}
          </span>
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
          <div className="py-1" role="listbox">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`flex items-center justify-between w-full px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${
                  value === option.value ? 'bg-gray-50' : ''
                }`}
                role="option"
                aria-selected={value === option.value}
              >
                <span className="flex items-center gap-2">
                  {option.icon}
                  <span className={value === option.value ? 'font-medium text-gray-900' : 'text-gray-700'}>
                    {option.label}
                  </span>
                </span>
                {value === option.value && (
                  <Check className="w-4 h-4 text-gray-900" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Version mobile avec drawer bottom sheet
export function MobileSortDrawer({ 
  options, 
  value, 
  onChange, 
  isOpen,
  onClose,
  title = 'Trier par' 
}: SortDropdownProps & { 
  isOpen: boolean; 
  onClose: () => void;
  title?: string;
}) {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 md:hidden"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 md:hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <span className="sr-only">Fermer</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="py-2 max-h-[70vh] overflow-y-auto">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                onClose();
              }}
              className={`flex items-center justify-between w-full px-6 py-4 hover:bg-gray-50 transition-colors ${
                value === option.value ? 'bg-gray-50' : ''
              }`}
            >
              <span className="flex items-center gap-3">
                {option.icon}
                <span className={value === option.value ? 'font-medium text-gray-900' : 'text-gray-700'}>
                  {option.label}
                </span>
              </span>
              {value === option.value && (
                <Check className="w-5 h-5 text-gray-900" />
              )}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}