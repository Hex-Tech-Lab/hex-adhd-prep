import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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

interface ClinicianCardProps {
  clinician: Clinician;
}

export function ClinicianCard({ clinician }: ClinicianCardProps) {
  const handleCall = () => {
    window.location.href = `tel:${clinician.phone}`;
  };

  const handleEmail = () => {
    window.location.href = `mailto:${clinician.email}`;
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-lg">{clinician.name}</CardTitle>
        <CardDescription>
          {clinician.specialty} • {clinician.city}, {clinician.state}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-medium">Rating:</span>
          <div className="flex items-center">
            <span className="text-yellow-500">★</span>
            <span className="text-sm ml-1">{clinician.rating}</span>
          </div>
        </div>
        {clinician.telehealth && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-secondary text-secondary-foreground">
            Telehealth Available
          </span>
        )}
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button variant="outline" size="sm" onClick={handleCall}>
          Call
        </Button>
        <Button variant="outline" size="sm" onClick={handleEmail}>
          Email
        </Button>
      </CardFooter>
    </Card>
  );
}