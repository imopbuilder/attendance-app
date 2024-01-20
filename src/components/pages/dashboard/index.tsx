import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils/cn';
import { db } from '@/server/db';
import { Subject, subjects } from '@/server/db/schema/subject';
import { SignedInAuthObject } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { Pencil, Trash2 } from 'lucide-react';
import { Fragment } from 'react';
import { AbsentClassBtn, AttendanceChart, DeleteSubjectBtn, EditSubjectDrawer, PresentClassBtn } from './client';

export function SubjectsLoader() {
	return (
		<Fragment>
			{[1, 2, 3, 4, 5].map((val) => (
				<div key={val} className='p-4 rounded-lg border mb-4'>
					<div className='flex items-start justify-between mb-4 gap-5'>
						<div className='w-full'>
							<h2 className='font-medium capitalize'>
								<Skeleton className='w-full h-6' />
							</h2>
							<Skeleton className='w-full h-5 mt-1 mb-2 max-w-40' />
							<div className='mt-2'>
								<Skeleton className='w-full h-6 max-w-40' />
							</div>
						</div>
						<div className='w-full max-w-[100px] aspect-square'>
							<Skeleton className='w-full aspect-square' />
						</div>
					</div>
					<hr />
					<div className='mt-3 flex items-end justify-between'>
						<div className='space-x-2 pl-1.5'>
							{'NNNNN'
								.toLowerCase()
								.split('')
								.map((_, index) => (
									<span key={`${index}`} className={cn('size-2.5 inline-block rounded-full relative -top-0.5', 'bg-muted-foreground')} />
								))}
						</div>
						<div>
							<Button className='p-1.5 h-auto w-auto ml-auto mr-1 group' variant='ghost' size='icon'>
								<Pencil size={16} className='text-muted-foreground group-hover:text-foreground duration-200' />
							</Button>
							<Button className={'p-1.5 h-auto w-auto group hover:bg-destructive'} variant='ghost' size='icon' disabled={true}>
								<Trash2 size={16} className='text-muted-foreground group-hover:text-destructive-foreground duration-200' />
							</Button>
						</div>
					</div>
				</div>
			))}
		</Fragment>
	);
}

export async function UserSubjects({ session }: { session: SignedInAuthObject }) {
	const userSubjects = await getSubjects(session.userId);

	// when there are no user's subjects
	if (userSubjects.length === 0) return <p className='text-center text-sm text-muted-foreground'>- No Subjects -</p>;

	return (
		<Fragment>
			{userSubjects.map((val) => (
				<SubjectCard key={val.id} {...val} />
			))}
		</Fragment>
	);
}

async function getSubjects(id: string) {
	const userSubjects = await db.select().from(subjects).where(eq(subjects.userId, id));
	return userSubjects;
}

function SubjectCard(props: Subject) {
	const { subjectName, totalClasses, attendedClasses, previousClasses } = props;

	const data = {
		labels: ['Present', 'Absent'],
		datasets: [
			{
				label: 'Classes',
				data: [attendedClasses, totalClasses === 0 ? 2 : totalClasses - attendedClasses],
				// data: [45, 55],
				backgroundColor: ['#8b5cf6', '#71717a'],
				borderRadius: 100,
				borderWidth: 0,
				spacing: 2,
			},
		],
	};

	return (
		<div className='p-4 rounded-lg border mb-4'>
			<div className='flex items-start justify-between mb-4'>
				<div>
					<h2 className='font-medium capitalize'>{subjectName}</h2>
					<p className='text-muted-foreground text-sm mt-1 mb-2'>
						Attendance:{' '}
						<span className='font-medium'>
							{attendedClasses}/{totalClasses}
						</span>
					</p>
					<div className='mt-2'>
						<PresentClassBtn {...props} />
						<AbsentClassBtn {...props} />
					</div>
				</div>
				<div className='w-[100px] aspect-square'>
					<AttendanceChart
						width={100}
						height={100}
						data={data}
						options={{
							cutout: 39,
							plugins: { legend: { display: false } },
						}}
						centerText={`${Math.round((attendedClasses * 100) / totalClasses)}%`}
					/>
				</div>
			</div>
			<hr />
			<div className='mt-3 flex items-end justify-between'>
				<div className='space-x-2 pl-1.5'>
					{previousClasses
						.toLowerCase()
						.split('')
						.map((val, index) => (
							<span
								key={`${index}`}
								className={cn(
									'size-2.5 inline-block rounded-full relative -top-0.5',
									val === 'p' ? 'bg-green-300' : val === 'a' ? 'bg-yellow-200' : 'bg-muted-foreground',
								)}
							/>
						))}
				</div>
				<div>
					<EditSubjectDrawer {...props} />
					{/* <Button className='p-1.5 h-auto w-auto group mr-1' variant='ghost' size='icon'>
						<Settings size={16} className='text-muted-foreground group-hover:text-foreground duration-200' />
					</Button> */}
					<DeleteSubjectBtn {...props} />
				</div>
			</div>
		</div>
	);
}
