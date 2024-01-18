'use client';

import { useMediaQuery } from '@/client/hooks/use-meida-query.hook';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from '@/components/ui/drawer';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { NEW_SUBJECT_DRAWER_HEADER } from '@/constants/app';
import { cn } from '@/lib/utils/cn';
import { zodResolver } from '@hookform/resolvers/zod';
import { BadgePlus } from 'lucide-react';
import { ComponentProps, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export function NewSubjectDrawer() {
	const [open, setOpen] = useState(false);
	const isDesktop = useMediaQuery('(min-width: 768px)');

	if (isDesktop) {
		return (
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogTrigger asChild>
					<Button className='gap-2.5'>
						<BadgePlus size={16} />
						<span>New Subject</span>
					</Button>
				</DialogTrigger>
				<DialogContent className='sm:max-w-[425px]'>
					<DialogHeader>
						<DialogTitle>{NEW_SUBJECT_DRAWER_HEADER.title}</DialogTitle>
						<DialogDescription>{NEW_SUBJECT_DRAWER_HEADER.description}</DialogDescription>
					</DialogHeader>
					<NewSubjectForm />
				</DialogContent>
			</Dialog>
		);
	}

	return (
		<Drawer open={open} onOpenChange={setOpen}>
			<DrawerTrigger asChild>
				<Button className='gap-2.5'>
					<BadgePlus size={16} />
				</Button>
			</DrawerTrigger>
			<DrawerContent>
				<DrawerHeader className='text-left'>
					<DrawerTitle>{NEW_SUBJECT_DRAWER_HEADER.title}</DrawerTitle>
					<DrawerDescription>{NEW_SUBJECT_DRAWER_HEADER.description}</DrawerDescription>
				</DrawerHeader>
				<NewSubjectForm className='px-4' />
				<DrawerFooter className='pt-2'>
					<DrawerClose asChild>
						<Button variant='outline'>Cancel</Button>
					</DrawerClose>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
}

const formSchema = z.object({
	subjectName: z
		.string()
		.min(2, { message: 'Subject name must contain at least 2 characters' })
		.max(50, { message: 'Subject name must contain at most 50 characters' }),
	totalClasses: z.coerce.number().optional(),
	attendedClasses: z.coerce.number().optional(),
});

function NewSubjectForm({ className }: ComponentProps<'form'>) {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			subjectName: '',
			totalClasses: 0,
			attendedClasses: 0,
		},
	});

	function onSubmit(values: z.infer<typeof formSchema>) {
		console.log(values);
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className={cn('space-y-5', className)}>
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
					<Button type='submit' className='w-full' size='lg'>
						Create Subject
					</Button>
				</div>
			</form>
		</Form>
	);
}
