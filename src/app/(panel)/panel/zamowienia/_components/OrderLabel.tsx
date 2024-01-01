import { Badge } from '@/components/ui/badge';
import { TStatuses } from '@/utils/constans';

export type TOrderStatus = (typeof TStatuses)[number]['value'];

type TOrderLabel = {
  status: TOrderStatus;
};
const OrderLabel = ({ status }: TOrderLabel) => {
  const data = TStatuses.find((entry) => entry.value === status);
  if (!data) return '?';

  const { color, label } = data;

  return <Badge style={{ backgroundColor: color }}>{label}</Badge>;
};

export default OrderLabel;
