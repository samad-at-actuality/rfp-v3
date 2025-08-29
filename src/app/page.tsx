import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function HomePage(): React.ReactNode {
  return (
    <div>
      <h1>HomePage</h1>
      <Button>Click</Button>
      <div>
        <Input name='name' size={12} />
      </div>
    </div>
  );
}
