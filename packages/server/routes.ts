import express from 'express';
import { chatController } from './controllers/chat.controller';
import type { Request, Response } from 'express';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
   res.send('Hello World');
});
router.get('/api/hello', (req: Request, res: Response) => {
   res.send({ message: 'Hello World' });
});

router.post('/api/chat', chatController.sendMessage);

export default router;
