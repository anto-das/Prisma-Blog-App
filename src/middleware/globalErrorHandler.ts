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
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2025") {
      statusCode = 400;
      errorMessage = "Requested record could no be found";
    } else if (err.code === "P2015") {
      statusCode = 400;
      errorMessage = "A related record could not be found.";
    }
  } else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    statusCode = 500;
    errorMessage = "An unexpected error occurred. Our team has been notified.";
  } else if (err instanceof Prisma.PrismaClientRustPanicError) {
    statusCode = 500;
    errorMessage =
      "An unexpected system error occurred while processing your request. Our technical team has been notified. Please try again in a few moments.";
  } else if (err instanceof Prisma.PrismaClientInitializationError) {
    if (err.errorCode === "P1000") {
      statusCode = 401;
      errorMessage = "Authentication failed";
    } else if (err.errorCode === "P1002") {
      statusCode = 400;
      errorMessage = "Can't reach data base";
    }
  }
  res.status(statusCode);
  res.send({
    message: errorMessage,
    error: errDetails,
  });
}

export default globalErrorHandler;
