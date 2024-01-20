import { ThemeProvider } from '@/client/providers/theme-provider';
import { TRPCReactProvider } from '@/client/providers/trpc-react-provider';
import { Toaster } from '@/components/ui/sonner';
import '@/styles/main.scss';
import { ClerkProvider } from '@clerk/nextjs';
import { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: {
		template: 'Attendance app - %s',
		default: 'Attendance app',
	},
	description: 'A next.js app in typescript that is used to manage your attendance with ease.',
};

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang='en' suppressHydrationWarning>
			<body className={`${inter.className}`}>
				<ClerkProvider>
					<TRPCReactProvider>
						<ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
							{children}
							<Toaster />
						</ThemeProvider>
					</TRPCReactProvider>
				</ClerkProvider>
			</body>
		</html>
	);
}
