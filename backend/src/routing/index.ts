import { Router } from 'express';
import buttonRoutes from '../modules/core/button/button.routes';

const router = Router();

// Core module routes. Mounted under /api in app.ts, so the full path is
// /api/core/components. Additional core components (dialog, card, ...) will
// register their own router here the same way button does.
router.use('/core/components', buttonRoutes);

export default router;
