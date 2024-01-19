import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';
import { subjects } from '@/server/db/schema/subject';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

export const subjectRouter = createTRPCRouter({
	createSubject: protectedProcedure
		.input(
			z.object({
				subjectName: z.string(),
				totalClasses: z.number(),
				attendedClasses: z.number(),
				previousClasses: z.string(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			try {
				const { userId } = ctx.session;
				const val = await ctx.db
					.insert(subjects)
					.values({ ...input, userId })
					.returning();

				revalidatePath('/dashboard');

				return val[0];
			} catch (err) {
				throw new Error('Failed to create new subject!');
			}
		}),

	deleteSubject: protectedProcedure
		.input(
			z.object({
				id: z.number(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			try {
				const val = await ctx.db.delete(subjects).where(eq(subjects.id, input.id)).returning();

				revalidatePath('/dashboard');
				return val[0];
			} catch (err) {
				throw new Error('Failed to delete subject!');
			}
		}),
});
