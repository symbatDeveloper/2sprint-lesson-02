import {NextFunction} from "express";


export const authBearerMiddleware=async (req: Request, res: Response, next: NextFunction) => {
if (!req.headers.authorization){

}

}