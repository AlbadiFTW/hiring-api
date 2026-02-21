import { Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { AuthRequest } from "../middleware/auth";

const applicationSchema = z.object({
  coverNote: z.string().optional(),
});

export async function applyToJob(req: AuthRequest, res: Response) {
  try {
    const body = applicationSchema.parse(req.body);
    const job = await prisma.job.findUnique({ where: { id: req.params.jobId as string } });
    if (!job) { res.status(404).json({ error: "Job not found" }); return; }

    const existing = await prisma.application.findFirst({
      where: { userId: req.user!.id, jobId: req.params.jobId as string },
    });
    if (existing) { res.status(400).json({ error: "Already applied to this job" }); return; }

    const application = await prisma.application.create({
      data: { userId: req.user!.id, jobId: req.params.jobId as string, ...body },
      include: { job: true },
    });
    res.status(201).json(application);
  } catch (err) {
    if (err instanceof z.ZodError) { res.status(400).json({ error: err.issues }); return; }
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getMyApplications(req: AuthRequest, res: Response) {
  const applications = await prisma.application.findMany({
    where: { userId: req.user!.id },
    include: { job: true },
    orderBy: { createdAt: "desc" },
  });
  res.json({ count: applications.length, applications });
}

export async function updateApplicationStatus(req: AuthRequest, res: Response) {
  const { status } = req.body;
  const validStatuses = ["Pending", "Reviewed", "Interview", "Rejected", "Accepted"];
  if (!validStatuses.includes(status)) {
    res.status(400).json({ error: "Invalid status" });
    return;
  }
  const application = await prisma.application.update({
    where: { id: req.params.id as string },
    data: { status },
  });
  res.json(application);
}