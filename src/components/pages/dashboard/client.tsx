'use client';

import { useNewSubject } from '@/client/store/dashboard/new-subject';
import { api } from '@/client/trpc';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { NEW_SUBJECT_DRAWER_HEADER } from '@/constants/app';
import { cn } from '@/lib/utils/cn';
import { zodResolver } from '@hookform/resolvers/zod';
import { BadgePlus } from 'lucide-react';
import { ComponentProps } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

export function NewSubjectDrawer() {
	const loading = useNewSubject((state) => state.loading);

	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button className='gap-2.5'>
					<BadgePlus size={16} />
					<span className='hidden md:inline-block'>New Subject</span>
				</Button>
			</SheetTrigger>
			<SheetContent
				className='flex items-stretch justify-start flex-col'
				onEscapeKeyDown={(e) => loading && e.preventDefault()}
				onPointerDown={(e) => loading && e.preventDefault()}
				onInteractOutside={(e) => loading && e.preventDefault()}
				loading={loading}
			>
				<SheetHeader className='text-left'>
					<SheetTitle>{NEW_SUBJECT_DRAWER_HEADER.title}</SheetTitle>
					<SheetDescription>{NEW_SUBJECT_DRAWER_HEADER.description}</SheetDescription>
				</SheetHeader>
				<NewSubjectForm />
				<SheetFooter className='mt-auto'>
					<SheetClose asChild>
						<Button variant='secondary' size='lg' className='w-full' disabled={loading}>
							Close
						</Button>
					</SheetClose>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}

const formSchema = z.object({
	subjectName: z
		.string()
		.min(2, { message: 'Subject name must contain at least 2 characters' })
		.max(50, { message: 'Subject name must contain at most 50 characters' }),
	totalClasses: z.coerce.number(),
	attendedClasses: z.coerce.number(),
});

function NewSubjectForm({ className }: ComponentProps<'form'>) {
	const setloading = useNewSubject((state) => state.setloading);
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			subjectName: '',
			totalClasses: 0,
			attendedClasses: 0,
		},
	});
	const mutation = api.subject.createSubject.useMutation({
		onSuccess: () => {
			form.reset({ subjectName: '', totalClasses: 0, attendedClasses: 0 });
		},
		onSettled: () => {
			setloading(false);
		},
	});

	function onSubmit(values: z.infer<typeof formSchema>) {
		setloading(true);
		const toastId = toast.loading('Creating subject...', {
			description: <span className='capitalize'>{values.subjectName}</span>,
		});

		mutation.mutate(
			{ ...values, previousClasses: 'NNNNN' },
			{
				onSuccess: (data) => {
					toast.success('Subject created successfully', {
						id: toastId,
						description: <span className='capitalize'>{data!.subjectName}</span>,
					});
				},
				onError: () => {
					toast.error('Failed to shorten', { id: toastId });
				},
			},
		);
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className={cn('space-y-5 pt-2', className)}>
				<FormField
					control={form.control}
					name='subjectName'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Subject</FormLabel>
							<FormControl>
								<Input placeholder='Power systems' autoComplete='off' {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='totalClasses'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Total classes</FormLabel>
							<FormControl>
								<Input
									placeholder='0'
									type='number'
									inputMode='numeric'
									autoComplete='off'
									{...field}
									value={field.value ?? ''}
									onChange={(e) => {
										if (e.target.value === '') return field.onChange(undefined);
										field.onChange(Number(e.target.value));
									}}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='attendedClasses'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Attended classes</FormLabel>
							<FormControl>
								<Input
									placeholder='0'
									type='number'
									inputMode='numeric'
									autoComplete='off'
									{...field}
									value={field.value ?? ''}
									onChange={(e) => {
										if (e.target.value === '') return field.onChange(undefined);
										field.onChange(Number(e.target.value));
									}}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<div className='pt-1'>
					<Button type='submit' className='w-full' size='lg' disabled={mutation.isLoading}>
						Create Subject
					</Button>
				</div>
			</form>
		</Form>
	);
}
