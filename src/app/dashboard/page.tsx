import Footer from '@/components/global/footer';
import Header from '@/components/global/header';
import { NewSubjectDrawer } from '@/components/pages/dashboard/client';
import { Fragment } from 'react';

export default function page() {
	return (
		<Fragment>
			<Header />
			<main className='relative'>
				<section>
					<div className='min-h-[500vh] mx-5 relative'>
						<p>Hello world</p>
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
