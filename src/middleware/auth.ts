import { NextFunction, Request, Response } from "express";
import { UserRole } from "../Types/role.check";
import { auth as betterAuth } from "../lib/auth";

const auth = (...roles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const session = await betterAuth.api.getSession({
        headers: req.headers as any,
      });
      if (!session) {
        return res.status(401).send({
          success: false,
          message: "unauthorized access",
        });
      }

      if (!session.user.emailVerified) {
        return res.status(403).send({
          success: false,
          message: "forbidden access!",
        });
      }

      req.user = {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        role: session.user.role as string,
        emailVerification: session.user.emailVerified,
      };

      if (roles.length && !roles.includes(req.user.role as UserRole)) {
        return res.status(403).send({
          success: false,
          message: "Forbidden access ! you don't have permission",
        });
      }
      next();
    } catch (err) {
      next(err);
    }
  };
};

export default auth;
