import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ClerkLoaded, ClerkLoading, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { ThemeToggle } from '../theme-toggle';

export default function Header() {
	return (
		<header className='border-b'>
			<div className='mx-5 h-16 flex items-center justify-between'>
				<div className='flex items-center justify-center'>
					<Link href={'/'} className='font-semibold'>
						Attandence app
					</Link>
				</div>
				<nav className='flex items-center justify-center sm:gap-4 gap-3'>
					<ThemeToggle />
					<SignedOut>
						<ul className='flex items-center justify-center sm:gap-4 gap-3'>
							<li>
								<Button className='p-4 sm:px-8' variant='secondary' size='lg' asChild>
									<Link href='/auth/sign-in'>Sign in</Link>
								</Button>
							</li>
							<li>
								<Button className='p-4 sm:px-8' size='lg' asChild>
									<Link href='/auth/sign-up'>Sign up</Link>
								</Button>
							</li>
						</ul>
					</SignedOut>
					<SignedIn>
						<ClerkLoading>
							<Skeleton className='size-10 rounded-full' />
						</ClerkLoading>
						<ClerkLoaded>
							<UserButton afterSignOutUrl='/' />
						</ClerkLoaded>
					</SignedIn>
				</nav>
			</div>
		</header>
	);
}
