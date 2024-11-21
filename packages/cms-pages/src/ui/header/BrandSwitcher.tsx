'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CheckIcon } from '@radix-ui/react-icons';
import { updateBrand } from '../../app/actions';
import { useTheme } from 'next-themes';

const brands = [
  { value: 'BLC_UK', label: 'Bluelightcard UK', theme: 'blcUk' },
  { value: 'BLC_AU', label: 'Bluelightcard Australia', theme: 'blcAu' },
  { value: 'DDS', label: 'Defence Discount Service', theme: 'dds' },
];

const getTheme = (brand: string) => {
  const theme = brands.find((item) => item.value === brand)?.theme;
  if (theme) {
    return theme;
  } else {
    return 'blcUk';
  }
};

const BrandSwitcher = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string | undefined>(undefined);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const brand = document.cookie
      .split('; ')
      .find((row) => row.startsWith('selectedBrand='))
      ?.split('=')[1];

    if (brand) {
      setValue(brand);
      const theme = getTheme(brand);
      console.log(`Setting initial theme to: ${theme}`);
      setTheme(theme);
    }
  }, []);

  const handleSelect = async (currentValue: string) => {
    const newValue = currentValue === value ? '' : currentValue;
    setValue(newValue);
    setOpen(false);
    await updateBrand(newValue);
    const theme = getTheme(newValue);
    console.log(`Switching theme to: ${theme}`);
    setTheme(theme);
  };

  return (
    <div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="secondary"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between"
          >
            {value ? brands.find((brand) => brand.value === value)?.label : 'Select brand...'}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search..." />
            <CommandList>
              <CommandGroup>
                {brands.map((brand) => (
                  <CommandItem key={brand.value} value={brand.value} onSelect={handleSelect}>
                    <CheckIcon
                      className={cn(
                        'mr-2 h-4 w-4',
                        value === brand.value ? 'opacity-100' : 'opacity-0',
                      )}
                    />
                    {brand.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default BrandSwitcher;
