'use client';
import { useState, useEffect, Suspense } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ClinicianCard } from '@/lib/components/ClinicianCard';
import { getClinicians } from '@/lib/supabase-server';

interface Clinician {
  id: string;
  name: string;
  specialty: string;
  city: string;
  state: string;
  phone: string;
  email: string;
  telehealth: boolean;
  rating: number;
}

function CliniciansContent() {
  const [clinicians, setClinicians] = useState<Clinician[]>([]);
  const [filteredClinicians, setFilteredClinicians] = useState<Clinician[]>([]);
  const [cityFilter, setCityFilter] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchClinicians() {
      try {
        const data = await getClinicians();
        setClinicians(data);
        setFilteredClinicians(data);
      } catch (error) {
        console.error('Error fetching clinicians:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchClinicians();
  }, []);

  useEffect(() => {
    let filtered = clinicians;

    if (cityFilter) {
      filtered = filtered.filter(c => c.city.toLowerCase().includes(cityFilter.toLowerCase()));
    }

    if (specialtyFilter) {
      filtered = filtered.filter(c => c.specialty.toLowerCase().includes(specialtyFilter.toLowerCase()));
    }

    setFilteredClinicians(filtered);
  }, [cityFilter, specialtyFilter, clinicians]);

  const clearFilters = () => {
    setCityFilter('');
    setSpecialtyFilter('');
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading clinicians...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Find a Clinician</h1>

      <div className="max-w-2xl mx-auto mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <Input
            placeholder="Filter by city"
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
          />
          <Input
            placeholder="Filter by specialty"
            value={specialtyFilter}
            onChange={(e) => setSpecialtyFilter(e.target.value)}
          />
          <Button onClick={clearFilters} variant="outline">
            Clear Filters
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClinicians.map((clinician) => (
          <ClinicianCard key={clinician.id} clinician={clinician} />
        ))}
      </div>

      {filteredClinicians.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          No clinicians found matching your criteria.
        </div>
      )}
    </div>
  );
}

export default function CliniciansPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen">Loading...</div>}>
      <CliniciansContent />
    </Suspense>
  );
}