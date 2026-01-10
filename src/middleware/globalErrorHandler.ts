import { NextFunction, Request, Response } from "express";
import { Prisma } from "../../generated/prisma/client";

function globalErrorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  let statusCode = 500;
  let errorMessage = "Internal server error!";
  let errDetails = err;

  if (err instanceof Prisma.PrismaClientValidationError) {
    (statusCode = 400),
      (errorMessage = "You provide incorrect type or missing fields");
  }
  else if( err instanceof Prisma.PrismaClientKnownRequestError){
    if(err.code === "P2025"){
        statusCode=400
        errorMessage="Requested record could no be found"
    }
  }
  res.status(statusCode);
  res.send({
    message: errorMessage,
    error: errDetails,
  });
}

export default globalErrorHandler;
