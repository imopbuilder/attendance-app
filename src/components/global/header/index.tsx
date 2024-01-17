import { Skeleton } from '@/components/ui/skeleton';
import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { Suspense } from 'react';
import { ThemeToggle } from '../theme-toggle';

export default function Header() {
	return (
		<header className='border-b px-[4%]'>
			<div className='max-w-maxi mx-auto h-16 flex items-center justify-between'>
				<div className='flex items-center justify-center'>
					<Link href={'/'} className='font-semibold'>
						Attandence app
					</Link>
				</div>
				<nav className='flex items-center justify-center sm:gap-5 gap-3'>
					<ThemeToggle />
					<Suspense fallback={<Skeleton className='size-10 rounded-full' />}>
						<UserButton />
					</Suspense>
				</nav>
			</div>
		</header>
	);
}
