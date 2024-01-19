import Footer from '@/components/global/footer';
import AuthHeader from '@/components/pages/auth';
import { SignIn } from '@clerk/nextjs';
import { Metadata } from 'next';
import { Fragment } from 'react';

export const metadata: Metadata = {
	title: 'Sign in',
};

export default function page() {
	return (
		<Fragment>
			<AuthHeader />
			<main>
				<section>
					<div className='max-w-maxi mx-auto flex items-center justify-center py-14 min-h-hvh'>
						<SignIn />
					</div>
				</section>
			</main>
			<Footer />
		</Fragment>
	);
}
