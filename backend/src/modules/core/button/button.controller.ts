import { Request, Response, NextFunction } from 'express';
import { saveFinalizedComponent, listFinalizedComponents } from './button.service';

export async function createOrFinalizeButton(req: Request, res: Response, next: NextFunction) {
  try {
    const saved = await saveFinalizedComponent(req.body);
    res.status(201).json(saved);
  } catch (err) {
    next(err);
  }
}

export async function getFinalizedComponents(req: Request, res: Response, next: NextFunction) {
  try {
    const components = await listFinalizedComponents();
    res.status(200).json(components);
  } catch (err) {
    next(err);
  }
}
