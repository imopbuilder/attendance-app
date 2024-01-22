'use client';

import { useNewSubject } from '@/client/store/dashboard/new-subject';
import { useUpdateSubject } from '@/client/store/dashboard/update-subject';
import { api } from '@/client/trpc';
import { DoughnutChart } from '@/components/global/chart/doughnut-chart';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { COLORS, NEW_SUBJECT_DRAWER_HEADER } from '@/constants/app';
import { cn } from '@/lib/utils/cn';
import { toTitleCase } from '@/lib/utils/to-title-case';
import { Subject } from '@/server/db/schema/subject';
import { zodResolver } from '@hookform/resolvers/zod';
import { Chart } from 'chart.js';
import { BadgePlus, Check, Pencil, Trash2 } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { ComponentProps, ComponentPropsWithoutRef, useState } from 'react';
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

const formSchema = z
	.object({
		subjectName: z
			.string()
			.min(2, { message: 'Subject name must contain at least 2 characters' })
			.max(50, { message: 'Subject name must contain at most 50 characters' }),
		totalClasses: z.coerce.number(),
		attendedClasses: z.coerce.number(),
		color: z.string(),
	})
	.refine((data) => data.attendedClasses <= data.totalClasses, {
		message: 'Attended classes should be less than total classes',
		path: ['attendedClasses'],
	});

function NewSubjectForm({ className }: ComponentProps<'form'>) {
	const router = useRouter();
	const setloading = useNewSubject((state) => state.setloading);
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			subjectName: '',
			totalClasses: 0,
			attendedClasses: 0,
			color: COLORS.value[0],
		},
	});
	const mutation = api.subject.createSubject.useMutation({
		onSuccess: () => {
			router.refresh();
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
			{ ...values },
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
				<FormField
					control={form.control}
					name='color'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Color</FormLabel>
							<FormControl>
								<div className='flex items-start justify-start flex-wrap gap-3.5 mt-2 px-[3px]'>
									{COLORS.value.map((val) => (
										<button
											key={val}
											style={{ backgroundColor: `${val}`, ...(field.value === val ? { outline: `2px solid ${val}` } : {}) }}
											className={cn('size-6 rounded-full outline-offset-2 inline-flex items-center justify-center')}
											type='button'
											{...field}
											onClick={() => field.onChange(val)}
										>
											{field.value === val ? <Check size={14} className='text-background' strokeWidth={3} /> : null}
										</button>
									))}
								</div>
							</FormControl>
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

export function DeleteSubjectBtn({ id, subjectName }: Subject) {
	const router = useRouter();
	const mutation = api.subject.deleteSubject.useMutation({
		onSuccess: () => router.refresh(),
	});
	const [warning, setWarning] = useState(false);

	function handleClick() {
		if (warning) {
			const toastId = toast.loading(`Deleting subject... ${toTitleCase(subjectName)}`);
			mutation.mutate(
				{ id },
				{
					onSuccess: (data) => {
						toast.success('Subject deleted successfully', {
							id: toastId,
							description: toTitleCase(data!.subjectName),
						});
					},
					onError: () => {
						toast.error('Failed to delete subject!', {
							id: toastId,
							description: toTitleCase(subjectName),
						});
					},
				},
			);
			return;
		}

		toast.warning(`Confirm delete subject - ${toTitleCase(subjectName)}`, {
			onDismiss: () => setWarning(false),
			onAutoClose: () => setWarning(false),
		});
		setWarning(true);
	}

	return (
		<Button
			className={`p-1.5 h-auto w-auto group hover:bg-destructive ${warning ? 'animate-pulse' : ''}`}
			variant='ghost'
			size='icon'
			onClick={handleClick}
			disabled={mutation.isLoading}
		>
			<Trash2 size={16} className='text-muted-foreground group-hover:text-destructive-foreground duration-200' />
		</Button>
	);
}

export function PresentClassBtn({ id, totalClasses, attendedClasses }: Subject) {
	const router = useRouter();
	const mutation = api.subject.presentClass.useMutation({
		onSuccess: () => {
			router.refresh();
		},
	});

	function handleClick() {
		const toastId = toast.loading('Updating subject...');
		mutation.mutate(
			{ id, totalClasses, attendedClasses },
			{
				onSuccess: () => {
					toast.success('Updated subject successfully', { id: toastId });
				},
				onError: () => {
					toast.success('Failed to update subject!', { id: toastId });
				},
			},
		);
	}

	return (
		<Button
			className='h-auto py-0.5 hover:text-muted-foreground'
			type='button'
			variant='secondary'
			size='sm'
			onClick={handleClick}
			disabled={mutation.isLoading}
		>
			Present
		</Button>
	);
}

export function AbsentClassBtn({ id, totalClasses }: Subject) {
	const router = useRouter();
	const mutation = api.subject.absentClass.useMutation({
		onSuccess: () => {
			router.refresh();
		},
	});

	function handleClick() {
		const toastId = toast.loading('Updating subject...');
		mutation.mutate(
			{ id, totalClasses },
			{
				onSuccess: () => {
					toast.success('Updated subject successfully', { id: toastId });
				},
				onError: () => {
					toast.success('Failed to update subject!', { id: toastId });
				},
			},
		);
	}

	return (
		<Button
			className='h-auto py-0.5 ml-3 hover:text-muted-foreground'
			type='button'
			variant='secondary'
			size='sm'
			onClick={handleClick}
			disabled={mutation.isLoading}
		>
			Absent
		</Button>
	);
}

export function AttendanceChart({ className, centerText, ...restProps }: ComponentPropsWithoutRef<typeof DoughnutChart> & { centerText?: string }) {
	const { resolvedTheme } = useTheme();

	function percentageLabel() {
		if (!centerText) return { id: 'no-label' };

		return {
			id: 'percentageLabel',
			afterDatasetsDraw(charts: Chart<'doughnut', number[], unknown>) {
				const { ctx } = charts;
				const { x, y } = charts.getDatasetMeta(0).data[0]!;

				// Text
				ctx.save();
				ctx.font = 'bold 13px sans-serif';
				ctx.fillStyle = resolvedTheme === 'dark' ? 'hsl(240 5% 64.9%)' : 'hsl(240 3.8% 46.1%)';
				ctx.textAlign = 'center';
				ctx.textBaseline = 'middle';
				ctx.fillText(centerText, x, y);
			},
		};
	}

	return <DoughnutChart className={cn('', className)} plugins={[percentageLabel()]} {...restProps} />;
}

export function EditSubjectDrawer(props: Subject) {
	const loading = useUpdateSubject((state) => state.loading);

	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button className='p-1.5 h-auto w-auto ml-auto mr-1 group' variant='ghost' size='icon'>
					<Pencil size={16} className='text-muted-foreground group-hover:text-foreground duration-200' />
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
					<SheetTitle>Edit subject</SheetTitle>
					<SheetDescription>You can edit your subject</SheetDescription>
				</SheetHeader>
				<EditSubjectForm {...props} />
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

const editSubjectFormSchema = z
	.object({
		subjectName: z
			.string()
			.min(2, { message: 'Subject name must contain at least 2 characters' })
			.max(50, { message: 'Subject name must contain at most 50 characters' }),
		totalClasses: z.coerce.number(),
		attendedClasses: z.coerce.number(),
		color: z.string(),
	})
	.refine((data) => data.attendedClasses <= data.totalClasses, {
		message: 'Attended classes should be less than total classes',
		path: ['attendedClasses'],
	});

function EditSubjectForm({ id, subjectName, attendedClasses, totalClasses, color }: Subject) {
	const router = useRouter();
	const setloading = useUpdateSubject((state) => state.setloading);
	const form = useForm<z.infer<typeof editSubjectFormSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			subjectName,
			totalClasses,
			attendedClasses,
			color,
		},
	});
	const mutation = api.subject.editSubject.useMutation({
		onSuccess: (data) => {
			router.refresh();
			form.reset({ ...data });
		},
		onSettled: () => {
			setloading(false);
		},
	});

	function onSubmit(values: z.infer<typeof editSubjectFormSchema>) {
		setloading(true);
		const toastId = toast.loading('Updating subject...');

		mutation.mutate(
			{ id, ...values },
			{
				onSuccess: () => {
					toast.success('Subject updated successfully', { id: toastId });
				},
				onError: () => {
					toast.error('Failed to shorten', { id: toastId });
				},
			},
		);
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5 pt-2'>
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
				<FormField
					control={form.control}
					name='color'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Color</FormLabel>
							<FormControl>
								<div className='flex items-start justify-start flex-wrap gap-3.5 mt-2 px-[3px]'>
									{COLORS.value.map((val) => (
										<button
											key={val}
											style={{ backgroundColor: `${val}`, ...(field.value === val ? { outline: `2px solid ${val}` } : {}) }}
											className={cn('size-6 rounded-full outline-offset-2 inline-flex items-center justify-center')}
											type='button'
											{...field}
											onClick={() => field.onChange(val)}
										>
											{field.value === val ? <Check size={14} className='text-background' strokeWidth={3} /> : null}
										</button>
									))}
								</div>
							</FormControl>
						</FormItem>
					)}
				/>
				<div className='pt-1'>
					<Button type='submit' className='w-full' size='lg' disabled={false}>
						Update Subject
					</Button>
				</div>
			</form>
		</Form>
	);
}
