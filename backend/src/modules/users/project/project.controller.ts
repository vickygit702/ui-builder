import { Request, Response, NextFunction } from "express";
import {
  getOrCreateUserProject,
  saveUserProject,
  exportUserProject,
} from "./project.service";

const DEFAULT_USER_ID = 1;

export async function getProject(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const project = await getOrCreateUserProject(DEFAULT_USER_ID);
    res.status(200).json(project);
  } catch (err) {
    next(err);
  }
}

export async function saveProject(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const saved = await saveUserProject(DEFAULT_USER_ID, req.body);
    res.status(200).json(saved);
  } catch (err) {
    next(err);
  }
}

export async function exportProject(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const rawId = req.body?.projectId;
    const projectId =
      typeof rawId === "number"
        ? rawId
        : rawId
          ? parseInt(rawId, 10)
          : undefined;
    const projectData = req.body?.projectData;
    const { zipBuffer, filename } = await exportUserProject(
      DEFAULT_USER_ID,
      projectId,
      projectData,
    );

    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.status(200).send(zipBuffer);
  } catch (err) {
    next(err);
  }
}
