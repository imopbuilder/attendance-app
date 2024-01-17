import Footer from '@/components/global/footer';
import AuthHeader from '@/components/pages/auth';
import { SignUp } from '@clerk/nextjs';
import { Fragment } from 'react';

export default function page() {
	return (
		<Fragment>
			<AuthHeader />
			<main>
				<section>
					<div className='max-w-maxi mx-auto flex items-center justify-center py-14 min-h-hvh'>
						<SignUp />
					</div>
				</section>
			</main>
			<Footer />
		</Fragment>
	);
}
