import { FaPlus, FaMinus } from 'react-icons/fa';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useState } from 'react';

type TFeature = {
  id: number;
  label: string;
  totalQuantity: number;
};
const Feature = ({ id, totalQuantity, label }: TFeature) => {
  const [featureQuantity, setFeatureQuantity] = useState(0);

  const handleQuantity = (method: 'ADD' | 'REMOVE') => {
    if (method === 'ADD') {
      if (featureQuantity + 1 > totalQuantity) return;
      setFeatureQuantity((prev) => prev + 1);
    } else {
      if (featureQuantity - 1 < 0) return;
      setFeatureQuantity((prev) => prev - 1);
    }
  };

  return (
    <div key={id} className="flex items-center justify-between">
      <div>
        <Badge>{label}</Badge>
      </div>
      <div className="space-x-2">
        <Button
          size="icon"
          variant="secondary"
          onClick={() => handleQuantity('ADD')}
          disabled={featureQuantity === totalQuantity}
        >
          <FaPlus className="h-6 w-6" />
        </Button>
        <Button size="icon" variant="secondary" onClick={() => handleQuantity('REMOVE')} disabled={!featureQuantity}>
          <FaMinus className="h-6 w-6" />
        </Button>
      </div>
      <div>
        {featureQuantity} / {totalQuantity}
      </div>
    </div>
  );
};

export default Feature;
