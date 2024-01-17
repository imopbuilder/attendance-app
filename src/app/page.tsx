import Footer from '@/components/global/footer';
import Header from '@/components/global/header';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ClerkLoaded, ClerkLoading, SignedIn, SignedOut } from '@clerk/nextjs';
import { LayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import { Fragment } from 'react';

export default function pome() {
	return (
		<Fragment>
			<Header />
			<main>
				<section>
					<div className='mx-5 min-h-hvh py-14'>
						<h2 className='text-center text-3xl sm:text-4xl md:text-6xl font-semibold'>Manage your attendance</h2>
						<p className='max-w-lg md:max-w-xl w-11/12 mx-auto mt-4 text-center text-sm text-muted-foreground'>
							Attendance app is an efficient and easy-to-use attendance managing service that streamlines your online experience.
						</p>
						<div className='text-center pt-4 md:pt-5'>
							<SignedOut>
								<ul className='flex items-center justify-center gap-4'>
									<li>
										<Button asChild variant='secondary' size='lg'>
											<Link href='/auth/sign-in'>Sign in</Link>
										</Button>
									</li>
									<li>
										<Button asChild size='lg'>
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
									<Button asChild>
										<Link href={'/dashboard'} className='gap-2'>
											Go to Dashboard <LayoutDashboard size={18} strokeWidth={2} />
										</Link>
									</Button>
								</ClerkLoaded>
							</SignedIn>
						</div>
					</div>
				</section>
			</main>
			<Footer />
		</Fragment>
	);
}
