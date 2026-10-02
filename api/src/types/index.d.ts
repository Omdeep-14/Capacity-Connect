declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: "super admin" | "admin" | "trainer" | "trainee";
      };
    }
  }
}
