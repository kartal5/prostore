'use client';

import { insertReviewSchema } from "@/lib/validators";
import { useState } from "react";
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from '@/components/ui/form';
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from '@/components/ui/select';
  import { StarIcon } from 'lucide-react';
  import { Textarea } from '@/components/ui/textarea';
  import { Input } from '@/components/ui/input';
  import { reviewFormDefaultValues } from '@/lib/constants';
  import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
  } from '@/components/ui/dialog';
  import { Button } from '@/components/ui/button';
  import { createUpdateReview, getReviewByProductId } from '@/lib/actions/review.actions';
  import { toast } from 'sonner';

  const ReviewForm = ({
    userId,
    productId,
    onReviewSubmitted,
  }: {
    userId: string;
    productId: string;
    onReviewSubmitted: () => void;
  }) => {
    const [open, setOpen] = useState(false);

    const form = useForm<z.infer<typeof insertReviewSchema>>({
        resolver: zodResolver(insertReviewSchema),
        defaultValues: reviewFormDefaultValues,
      });
      
       // Open Form Handler
       const handleOpenForm = async () => {
        form.setValue('productId', productId);
        form.setValue('userId', userId);

        const review = await getReviewByProductId({ productId });

        if (review) {
          form.setValue('title', review.title);
          form.setValue('description', review.description);
          form.setValue('rating', review.rating);
        }

        setOpen(true);
      }

      // Submit Form Handler
      const onSubmit: SubmitHandler<z.infer<typeof insertReviewSchema>> = async (
        values
      ) => {
        const res = await createUpdateReview({ ...values, productId });

        if (!res.success) {
          // Use Sonner toast for error
          toast.error(res.message);
          return;
        }

        setOpen(false);

        onReviewSubmitted();

        toast.success(res.message);
      };
      
      return (
        <Dialog open={open} onOpenChange={setOpen}>
          <Button onClick={handleOpenForm} variant='default'>
            Skriv anmeldelse
          </Button>
          <DialogContent className='sm:max-w-[425px]'>
            <Form {...form}>
            <form method='post' onSubmit={form.handleSubmit(onSubmit)}>
               <DialogHeader>
                <DialogTitle>Skriv anmeldelse</DialogTitle>
                <DialogDescription>
                    Del dine tanker med andre brugere
                </DialogDescription>
               </DialogHeader>
               <div className="grid gap-4 py-4">
                <FormField
                    control={form.control}
                    name='title'
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Titel</FormLabel>
                        <FormControl>
                        <Input placeholder='Skriv titel' {...field} />
                        </FormControl>
                    </FormItem>
                    )}
                 />
                <FormField
                    control={form.control}
                    name='description'
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Beskrivelse</FormLabel>
                        <FormControl>
                        <Textarea placeholder='Skriv beskrivelse' {...field} />
                        </FormControl>
                    </FormItem>
                    )}
                 />
                <FormField
                    control={form.control}
                    name='rating'
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Stjerne</FormLabel>
                        <Select
                            onValueChange={field.onChange}
                            value={field.value.toString()}
                        >
                            <FormControl>
                                <SelectTrigger>
                                <SelectValue />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {Array.from({ length: 5 }).map((_, index) => (
                                    <SelectItem
                                    key={index}
                                    value={(index + 1).toString()}
                                    >
                                    {index + 1}{' '}
                                    <StarIcon className='inline h-4 w-4' />
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                    )}
                 />
                </div>
                <DialogFooter>
                    <Button
                        type='submit'
                        size='lg'
                        className='w-full'
                        disabled={form.formState.isSubmitting}
                    >
                        {form.formState.isSubmitting ? 'Tilføjer...' : 'Tilføj'}
                    </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      );
    };
      
    
    export default ReviewForm;