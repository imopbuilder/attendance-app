import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Skeleton } from '@/components/ui/skeleton';
import { COLORS } from '@/constants/app';
import { toTitleCase } from '@/lib/utils/to-title-case';
import { db } from '@/server/db';
import { Subject, subjects } from '@/server/db/schema/subject';
import { SignedInAuthObject } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { ChevronsUpDown, Pencil, Trash2 } from 'lucide-react';
import { Fragment } from 'react';
import { AbsentClassBtn, AttendanceChart, DeleteSubjectBtn, EditSubjectDrawer, PresentClassBtn } from './client';

export function SubjectsLoader() {
	return (
		<Fragment>
			<div>
				<Button className='w-full justify-between px-4 rounded-lg' variant='secondary' size='lg'>
					<span>Your subjects</span>
					<ChevronsUpDown size={16} className='text-muted-foreground' />
				</Button>
				<div className='max-w-2xl mx-auto py-4'>
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
									<span style={{ backgroundColor: `${COLORS.default}` }} className='size-4 rounded-full inline-block' />
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
				</div>
			</div>
		</Fragment>
	);
}

export async function UserSubjects({ session }: { session: SignedInAuthObject }) {
	const userSubjects = await getSubjects(session.userId);

	// when there are no user's subjects
	if (userSubjects.length === 0) return <p className='text-center text-sm text-muted-foreground'>- No Subjects -</p>;

	return (
		<div>
			<Collapsible>
				<CollapsibleTrigger asChild>
					<Button className='w-full justify-between px-4 rounded-lg' variant='secondary' size='lg'>
						<span>Your subjects</span>
						<ChevronsUpDown size={16} className='text-muted-foreground' />
					</Button>
				</CollapsibleTrigger>
				<CollapsibleContent>
					<AllSubjectsCard subjects={userSubjects} />
				</CollapsibleContent>
			</Collapsible>
			<div className='max-w-2xl mx-auto py-4'>
				{userSubjects.map((val) => (
					<SubjectCard key={val.id} {...val} />
				))}
			</div>
		</div>
	);
}

async function getSubjects(id: string) {
	const userSubjects = await db.select().from(subjects).where(eq(subjects.userId, id));
	return userSubjects;
}

function AllSubjectsCard({ subjects }: { subjects: Subject[] }) {
	const totalAttendedClasses = subjects.reduce((sum, val) => sum + val.attendedClasses, 0);
	const totalClassesVal = subjects.reduce((sum, val) => sum + val.totalClasses, 0);
	const data = {
		labels: [...subjects.map((val) => toTitleCase(val.subjectName)), 'Absents'],
		datasets: [
			{
				label: 'Classes',
				data: [...subjects.map((val) => val.attendedClasses), totalClassesVal === 0 ? 2 : totalClassesVal - totalAttendedClasses],
				backgroundColor: ['#8b5cf6', '#71717a'],
				borderRadius: 100,
				borderWidth: 0,
				spacing: 2,
			},
		],
	};

	return (
		<Fragment>
			<div className='p-4 rounded-lg border mt-4 max-w-2xl mx-auto'>
				<p className='text-center text-xs text-muted-foreground pb-4'>
					Attendance:{' '}
					<span className='font-medium'>
						{totalAttendedClasses}/{totalClassesVal}
					</span>
				</p>
				<div className='flex items-center justify-between sm:items-start flex-col-reverse sm:flex-row gap-y-4'>
					<div className='space-y-2'>
						{subjects.map((val) => (
							<div key={val.id} className='flex items-center justify-start gap-4'>
								<span style={{ backgroundColor: val.color }} className='inline-block size-4 rounded-full' />
								<p className='capitalize text-sm text-muted-foreground'>{val.subjectName}</p>
							</div>
						))}
					</div>
					<div className='w-[175px] aspect-square'>
						<AttendanceChart
							width={100}
							height={100}
							data={data}
							options={{
								cutout: 73,
								plugins: { legend: { display: false } },
							}}
							centerText={`${Math.round((totalAttendedClasses * 100) / totalClassesVal)}%`}
						/>
					</div>
				</div>
			</div>
		</Fragment>
	);
}

function SubjectCard(props: Subject) {
	const { subjectName, totalClasses, attendedClasses, color } = props;

	const data = {
		labels: ['Present', 'Absent'],
		datasets: [
			{
				label: 'Classes',
				data: [attendedClasses, totalClasses === 0 ? 2 : totalClasses - attendedClasses],
				backgroundColor: [color, '#71717a'],
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
					<p className='text-muted-foreground text-xs mt-1.5 mb-2.5'>
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
					<span style={{ backgroundColor: `${color}` }} className='size-4 rounded-full inline-block' />
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
