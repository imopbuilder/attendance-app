import Footer from '@/components/global/footer';
import Header from '@/components/global/header';
import { SubjectsLoader, UserSubjects } from '@/components/pages/dashboard';
import { NewSubjectDrawer } from '@/components/pages/dashboard/client';
import { auth } from '@clerk/nextjs';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Fragment, Suspense } from 'react';

export const metadata: Metadata = {
	title: 'Dashboard',
};

export default function page() {
	const session = auth();

	if (!session.userId) return redirect('/auth/sign-in');

	return (
		<Fragment>
			<Header />
			<main className='relative'>
				<section>
					<div className='min-h-hvh mx-5 relative py-5'>
						<h2 className='text-2xl font-semibold text-center'>Your subjects</h2>
						<div className='max-w-2xl mx-auto py-4'>
							<Suspense fallback={<SubjectsLoader />}>
								<UserSubjects session={session} />
							</Suspense>
						</div>
					</div>
				</section>
				<div className='sticky bottom-0 ml-auto w-max mr-5 pb-5'>
					<NewSubjectDrawer />
				</div>
			</main>
			<Footer />
		</Fragment>
	);
}
