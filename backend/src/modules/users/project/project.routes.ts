import { Router } from 'express';
import { getProject, saveProject, exportProject } from './project.controller';

const router = Router();

// GET  /api/users/project        -> get user project layout from DB
// POST /api/users/project/save   -> save user project layout & component instances to DB
// POST /api/users/project/export -> export production React project as downloadable ZIP
router.get('/', getProject);
router.post('/save', saveProject);
router.post('/export', exportProject);

export default router;
