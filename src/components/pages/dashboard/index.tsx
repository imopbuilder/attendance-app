import { DoughnutChart } from '@/components/global/chart/doughnut-chart';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';
import { db } from '@/server/db';
import { Subject, subjects } from '@/server/db/schema/subject';
import { SignedInAuthObject } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { Pencil, Settings } from 'lucide-react';
import { Fragment } from 'react';
import { DeleteSubjectBtn } from './client';

export function SubjectsLoader() {
	return (
		<div>
			<p>loading...</p>
		</div>
	);
}

export async function UserSubjects({ session }: { session: SignedInAuthObject }) {
	const userSubjects = await getUrls(session.userId);

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

async function getUrls(id: string) {
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
						<Button className='h-auto py-0.5 hover:text-muted-foreground' type='button' variant='secondary' size='sm'>
							Present
						</Button>
						<Button className='h-auto py-0.5 ml-3 hover:text-muted-foreground' type='button' variant='secondary' size='sm'>
							Absent
						</Button>
					</div>
				</div>
				<div className='w-[100px] aspect-square'>
					<DoughnutChart
						data={data}
						options={{
							cutout: 39,
							plugins: {
								legend: {
									display: false,
								},
							},
						}}
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
					<Button className='p-1.5 h-auto w-auto ml-auto mr-1 group' variant='ghost' size='icon'>
						<Pencil size={16} className='text-muted-foreground group-hover:text-foreground duration-200' />
					</Button>
					<Button className='p-1.5 h-auto w-auto group mr-1' variant='ghost' size='icon'>
						<Settings size={16} className='text-muted-foreground group-hover:text-foreground duration-200' />
					</Button>
					<DeleteSubjectBtn {...props} />
				</div>
			</div>
		</div>
	);
}
