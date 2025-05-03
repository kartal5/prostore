  'use client';
  import { Badge } from '@/components/ui/badge';
  import { Card, CardContent } from '@/components/ui/card';
  import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from '@/components/ui/table';
  import { Button } from '@/components/ui/button';
  import { formatCurrency, formatDateTime, formatId } from '@/lib/utils';
  import { Order } from '@/types';
  import Link from 'next/link';
  import Image from 'next/image';
  import { toast } from 'sonner';
  import { useTransition } from 'react';
  import {
    PayPalButtons,
    PayPalScriptProvider,
    usePayPalScriptReducer,
  } from '@paypal/react-paypal-js';
  import {
    createPayPalOrder,
    approvePayPalOrder,
    updateOrderToPaidCOD,
    deliverOrder,
  } from '@/lib/actions/order.actions';
  import StripePayment from './stripe-payment';

  // Define an interface for the response to add type safety
  interface OrderActionResponse {
    success: boolean;
    message: string;
    data?: unknown;
  }

  const OrderDetailsTable = ({ 
    order, 
    paypalClientId,
    isAdmin,
    stripeClientSecret,
  }: { 
    order: Omit<Order, 'paymentResult'>, 
    paypalClientId: string;
    isAdmin: boolean;
    stripeClientSecret: string | null;
  }) => {
    const {
      id,
      shippingAddress,
      orderitems,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
      paymentMethod,
      isDelivered,
      isPaid,
      paidAt,
      deliveredAt
    } = order;


    const PrintLoadingState = () => {
      const [{ isPending, isRejected }] = usePayPalScriptReducer();
      let status = '';
    
      if (isPending) {
        status = 'Indlæser PayPal…';
      } else if (isRejected) {
        status = 'Fejl ved indlæsning af PayPal';
      }
    
      return status;
    };

    const handleCreatePayPalOrder = async (): Promise<string> => {
      // Provide a default response if undefined
      const res: OrderActionResponse = await createPayPalOrder(order.id) ?? {
        success: false,
        message: 'Kunne ikke oprette PayPal-ordre',
        data: null
      };
    
      if (!res.success) {
        toast.error(res.message);
        // Return some fallback string, or you can throw instead:
        throw new Error('Kunne ikke oprette PayPal ordren');
      }
    
      // The PayPalButtons component wants a string (the order ID).
      // If you’re certain data is a string, cast it:
      return res.data as string;
    };

    const handleApprovePayPalOrder = async (data: { orderID: string }) => {
      // Provide a default response if undefined
      const res: OrderActionResponse = await approvePayPalOrder(order.id, data) ?? {
        success: false,
        message: 'Kunne ikke godkende PayPal-ordre',
        data: null
      };
    
      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    };

      // Button to mark order as paid
      const MarkAsPaidButton = () => {
        const [isPending, startTransition] = useTransition();
    
        return (
          <Button
            type="button"
            disabled={isPending}
            onClick={() =>
              startTransition(async () => {
                const res = await updateOrderToPaidCOD(order.id);
                if (res.success) {
                  toast.success(res.message);
                } else {
                  toast.error(res.message);
                }
              })
            }
          >
            {isPending ? "behandler..." : "Markér som betalt"}
          </Button>
        );
      };

    // Button to mark order as delivered
    const MarkAsDeliveredButton = () => {
      const [isPending, startTransition] = useTransition();
  
      return (
        <Button
          type="button"
          disabled={isPending}
          onClick={() =>
            startTransition(async () => {
              const res = await deliverOrder(order.id);
              if (res.success) {
                toast.success(res.message);
              } else {
                toast.error(res.message);
              }
            })
          }
        >
          {isPending ? "behandler…" : "Markér som leveret"}
        </Button>
      );
    };
    
    
    return (
      <>
        <h1 className='py-4 text-2xl'>Order {formatId(id)}</h1>
        <div className="grid md:grid-cols-3 md:gap-5">
          <div className="col-span-2 space-4-y overlow-x-auto">
          <Card>
              <CardContent className='p-4 gap-4'>
                <h2 className='text-xl pb-4'>Betalingsmetode</h2>
                <p className='mb-2'>{paymentMethod}</p>
                {isPaid ? (
                  <Badge variant='secondary'>
                    Paid at {formatDateTime(paidAt!).dateTime}
                  </Badge>
                ) : (
                  <Badge variant='destructive'>Ikke betalt</Badge>
                )}
              </CardContent>
            </Card>
            <Card className='my-2'>
              <CardContent className='p-4 gap-4'>
                <h2 className='text-xl pb-4'>Leveringsadresse</h2>
                <p>{shippingAddress.fullName}</p>
                <p className='mb-2'>
                  {shippingAddress.streetAddress}, {shippingAddress.city}
                  {shippingAddress.postalCode}, {shippingAddress.country}
                </p>
                {isDelivered ? (
                  <Badge variant='secondary'>
                    Delivered at {formatDateTime(deliveredAt!).dateTime}
                  </Badge>
                ) : (
                  <Badge variant='destructive'>Ikke leveret</Badge>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardContent className='p-4 gap-4'>
                <h2 className='text-xl pb-4'>Ordreoversigt</h2>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Produkt</TableHead>
                      <TableHead>Antal</TableHead>
                      <TableHead>Pris</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orderitems.map((item) => (
                      <TableRow key={item.slug}>
                        <TableCell>
                          <Link
                            href={`/product/{item.slug}`}
                            className='flex items-center'
                          >
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={50}
                              height={50}
                            />
                            <span className='px-2'>{item.name}</span>
                          </Link>
                        </TableCell>
                        <TableCell>
                          <span className='px-2'>{item.qty}</span>
                        </TableCell>
                        <TableCell className='text-right'>{formatCurrency(item.price)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
          <div>
            <Card>
              <CardContent className='p-4 gap-4 space-y-4'>
                <div className='flex justify-between'>
                  <div>Varer</div>
                  <div>{formatCurrency(itemsPrice)}</div>
                </div>
                <div className='flex justify-between'>
                  <div>Moms</div>
                  <div>{formatCurrency(taxPrice)}</div>
                </div>
                <div className='flex justify-between'>
                  <div>Forsendelse</div>
                  <div>{formatCurrency(shippingPrice)}</div>
                </div>
                <div className='flex justify-between'>
                  <div>Samlet</div>
                  <div>{formatCurrency(totalPrice)}</div>
                </div>
                  {/* PayPal Payment */}
                  {!isPaid && paymentMethod === 'PayPal' && (
                    <div>
                      <PayPalScriptProvider options={{ clientId: paypalClientId }}>
                        <PrintLoadingState />
                        <PayPalButtons
                          createOrder={handleCreatePayPalOrder}
                          onApprove={handleApprovePayPalOrder}
                        />
                      </PayPalScriptProvider>
                    </div>
                  )}

                  {/* Stripe Payment */}
                  {!isPaid && paymentMethod === 'Stripe' && stripeClientSecret && (
                    <StripePayment
                      priceInCents={Number(order.totalPrice) * 100}
                      orderId={order.id}
                      clientSecret={stripeClientSecret}
                    />
                  )}

                  {/* Cash On Delivery */}
                  {isAdmin && !isPaid && paymentMethod === 'CashOnDelivery' && (
                    <MarkAsPaidButton />
                  )}
                  {isAdmin && isPaid && !isDelivered && <MarkAsDeliveredButton />}
              </CardContent>
            </Card>
          </div>
        </div>
      </>
    );
  };


  export default OrderDetailsTable;
