import { ThemeToggle } from '@/components/global/theme-toggle';
import Link from 'next/link';
import { ThemeAnimate } from './client';

export default function AuthHeader() {
	return (
		<header className='border-b'>
			<div className='mx-5 h-16 flex items-center justify-between'>
				<div className='flex items-center justify-center'>
					<Link href={'/'} className='font-semibold'>
						Attandence App
					</Link>
				</div>
				<nav className='flex items-center justify-center sm:gap-5 gap-3'>
					<ThemeAnimate>
						<ThemeToggle />
					</ThemeAnimate>
				</nav>
			</div>
		</header>
	);
}
