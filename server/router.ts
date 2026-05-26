// import { router, publicProcedure } from './trpc';
// import { z } from 'zod';

// export const appRouter = router({
//   getUser: publicProcedure.query(async () => {
//     // lógica de tu getUser actual
//   }),

//   updateUser: publicProcedure
//     .input(z.object({
//       firstName: z.string(),
//       lastName: z.string(),
//       userAge: z.number(),
//       phoneNumber: z.number(),
//     }))
//     .mutation(async ({ input }) => {
//       // lógica de tu updateUser actual
//     }),

//   buyProduct: publicProcedure
//     .input(z.object({ id: z.string() }))
//     .mutation(async ({ input }) => {
//       // lógica de useBuyProduct
//     }),
// });

// export type AppRouter = typeof appRouter;