import React, { useState, useMemo } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import * as HugeIcons from '@hugeicons/core-free-icons';

interface IconPickerProps {
  value?: string;
  onChange?: (value: string) => void;
}

const inputContentIntl = { placeholder: 'Procure um icone...', clear: "Limpar seleção", select: "Selecione um Ícone" };

export const IconPicker: React.FC<IconPickerProps> = ({ value = '', onChange }) => {
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const iconNames = useMemo(() => {
    const excludeList = ['default'];
    return Object.keys(HugeIcons)
      .filter((name) => !excludeList.includes(name))
      .filter((name) => name.toLowerCase().includes(search.toLowerCase()))
      .sort();
  }, [search]);

  const selectedIcon = value && (HugeIcons as any)[value];

  return (
    <div className='relative'>
      <div
        className='flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md cursor-pointer hover:border-gray-400 bg-white'
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedIcon ? (
          <>
            <HugeiconsIcon icon={selectedIcon} size={20} color='currentColor' />
            <span className='text-sm text-gray-700'>{value}</span>
          </>
        ) : (
          <span className='text-sm text-gray-500'>{inputContentIntl.select}</span>
        )}
        <svg className={`ml-auto h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
        </svg>
      </div>
      {isOpen && (
        <div className='absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-300 rounded-md shadow-lg'>
          <div className='p-2 border-b'>
            <input
              type='text'
              placeholder={inputContentIntl.placeholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className='w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500'
              autoFocus
            />
          </div>
          <div className='max-h-64 overflow-y-auto'>
            <div className='grid grid-cols-6 gap-1 p-2'>
              {iconNames.slice(0, 120).map((iconName) => {
                const IconComponent = (HugeIcons as any)[iconName];
                return (
                  <div
                    key={iconName}
                    className={`p-2 cursor-pointer hover:bg-blue-50 rounded text-center transition-colors ${
                      value === iconName ? 'bg-blue-100 ring-1 ring-blue-500' : ''
                    }`}
                    onClick={() => {
                      if (typeof onChange === 'function') {
                        onChange(iconName);
                      }
                      setIsOpen(false);
                      setSearch('');
                    }}
                    title={iconName}
                  >
                    <HugeiconsIcon icon={IconComponent} size={20} color='currentColor' className='mx-auto' />
                    <div className='text-xs mt-1 truncate text-gray-600'>{iconName}</div>
                  </div>
                );
              })}
            </div>
            {iconNames.length > 120 && (
              <div className='p-2 text-center text-sm text-gray-500 border-t'>Showing first 120 results. Use search to find more icons.</div>
            )}
          </div>
          {value && (
            <div className='border-t p-2'>
              <button
                onClick={() => {
                  if (typeof onChange === 'function') {
                    onChange('');
                  }
                  setIsOpen(false);
                }}
                className='w-full px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded'
              >
                {inputContentIntl.clear}
              </button>
            </div>
          )}
        </div>
      )}
      {isOpen && <div className='fixed inset-0 z-40' onClick={() => setIsOpen(false)} />}
    </div>
  );
};


export const useIconPicker = () => {
  return {
    Component: IconPicker,
    name: 'iconPicker',
    type: 'string',
  };
};
