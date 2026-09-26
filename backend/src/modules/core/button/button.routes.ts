import { Router } from 'express';
import { createOrFinalizeButton, getFinalizedComponents } from './button.controller';

const router = Router();

// POST /api/core/components  -> finalize (create or re-save) a component + its variants
// GET  /api/core/components  -> list every finalized component (used to hydrate the FE panel)
router.post('/', createOrFinalizeButton);
router.get('/', getFinalizedComponents);

export default router;
