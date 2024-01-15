import Footer from '@/components/global/footer';
import Header from '@/components/global/header';
import { Fragment } from 'react';

export default function pome() {
	return (
		<Fragment>
			<Header />
			<div>
				<p>Hello world</p>
			</div>
			<Footer />
		</Fragment>
	);
}
