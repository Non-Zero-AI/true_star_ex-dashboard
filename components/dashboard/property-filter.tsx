'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Property } from '@/types'

interface PropertyFilterProps {
  properties: Property[]
  selectedProperty: string | null
  onPropertyChange: (propertyId: string | null) => void
}

export function PropertyFilter({
  properties,
  selectedProperty,
  onPropertyChange,
}: PropertyFilterProps) {
  return (
    <div className="flex items-center gap-2">
      <label htmlFor="property-filter" className="text-sm font-medium">
        Property:
      </label>
      <Select
        value={selectedProperty || 'all'}
        onValueChange={(value) => onPropertyChange(value === 'all' ? null : value)}
      >
        <SelectTrigger id="property-filter" className="w-[200px]">
          <SelectValue placeholder="Select property" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Properties</SelectItem>
          {properties.map((property) => (
            <SelectItem key={property.id} value={property.id}>
              {property.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}


