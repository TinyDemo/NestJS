import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void): any {
    const authorization = req.header('Authorization');
    if (typeof authorization === 'string' && authorization.startsWith('Bearer ')) {
      const tokenStr = authorization.substring(7);
      console.log(tokenStr);
      next();
    } else {
      res.status(403).send({
        code: 100403,
        message: 'Unauthorized',
      });
    }
  }
}
