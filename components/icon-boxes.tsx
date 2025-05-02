import { DollarSign, Headset, ShoppingBag, WalletCards } from 'lucide-react';
import { Card, CardContent } from './ui/card';

const IconBoxes = () => {
  return (
    <div>
      <Card>
        <CardContent className='grid md:grid-cols-4 gap-4 p-4'>
          <div className='space-y-2'>
            <ShoppingBag />
            <div className='text-sm font-bold'>Gratis levering</div>
            <div className='text-sm text-muted-foreground'>
            Gratis levering på ordrer over 1000 DKK
            </div>
          </div>
          <div className='space-y-2'>
            <DollarSign />
            <div className='text-sm font-bold'>Returret</div>
            <div className='text-sm text-muted-foreground'>
              Senest 30 dage efter dit køb
            </div>
          </div>
          <div className='space-y-2'>
            <WalletCards />
            <div className='text-sm font-bold'>Fleksibel betaling</div>
            <div className='text-sm text-muted-foreground'>
            Betal med kreditkort, PayPal eller betaling ved levering
            </div>
          </div>
          <div className='space-y-2'>
            <Headset />
            <div className='text-sm font-bold'>24/7 Support</div>
            <div className='text-sm text-muted-foreground'>
            Få hjælp når som helst
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IconBoxes;