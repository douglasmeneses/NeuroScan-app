import { PrismaClient } from "@prisma/client";
declare const app: import("express-serve-static-core").Express;
declare global {
    var prisma: PrismaClient | undefined;
}
export default app;
//# sourceMappingURL=index.d.ts.map