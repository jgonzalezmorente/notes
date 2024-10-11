import { Request, Response, NextFunction } from 'express';

export const loggerFun = (req: Request, res: Response, next: NextFunction) => {
    console.log('loggerFun');
    next();
}