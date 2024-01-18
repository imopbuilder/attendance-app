import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';
import { subjects } from '@/server/db/schema/subject';
import { z } from 'zod';

export const subjectRouter = createTRPCRouter({
	createSubject: protectedProcedure
		.input(
			z.object({
				subjectName: z.string(),
				totalClasses: z.number(),
				attendedClasses: z.number(),
				userId: z.string(),
				previousClasses: z.string(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			try {
				const subject = await ctx.db.insert(subjects).values(input).returning();

				return subject[0];
			} catch (err) {
				throw new Error('Failed to create new subject!');
			}
		}),
});
