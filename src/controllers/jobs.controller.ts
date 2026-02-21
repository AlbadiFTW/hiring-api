import { Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { AuthRequest } from "../middleware/auth";

const jobSchema = z.object({
  title: z.string().min(2),
  company: z.string().min(2),
  location: z.string().min(2),
  type: z.enum(["Full-time", "Part-time", "Contract", "Remote"]),
  salary: z.string().optional(),
  description: z.string().min(10),
});

export async function getJobs(req: AuthRequest, res: Response) {
  const search = req.query.search as string | undefined;
  const type = req.query.type as string | undefined;
  const location = req.query.location as string | undefined;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  const where = {
    ...(search && {
      OR: [
        { title: { contains: search, mode: "insensitive" as const } },
        { company: { contains: search, mode: "insensitive" as const } },
      ],
    }),
    ...(type && { type }),
    ...(location && { location: { contains: location, mode: "insensitive" as const } }),
  };

  const [jobs, total] = await Promise.all([
    prisma.job.findMany({
      where,
      skip,
      take: limit,
      include: { user: { select: { name: true, email: true } }, _count: { select: { applications: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.job.count({ where }),
  ]);

  res.json({
    jobs,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}

export async function getJob(req: AuthRequest, res: Response) {
  const job = await prisma.job.findUnique({
    where: { id: req.params.id as string },
    include: { user: { select: { name: true, email: true } } },
  });
  if (!job) { res.status(404).json({ error: "Job not found" }); return; }
  res.json(job);
}

export async function createJob(req: AuthRequest, res: Response) {
  try {
    const body = jobSchema.parse(req.body);
    const job = await prisma.job.create({
      data: { ...body, userId: req.user!.id },
    });
    res.status(201).json(job);
  } catch (err) {
    if (err instanceof z.ZodError) { res.status(400).json({ error: err.issues }); return; }
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function updateJob(req: AuthRequest, res: Response) {
  try {
    const job = await prisma.job.findUnique({ where: { id: req.params.id as string } });
    if (!job) { res.status(404).json({ error: "Job not found" }); return; }
    if (job.userId !== req.user!.id) { res.status(403).json({ error: "Forbidden" }); return; }
    const body = jobSchema.partial().parse(req.body);
    const updated = await prisma.job.update({ where: { id: req.params.id as string }, data: body });
    res.json(updated);
  } catch (err) {
    if (err instanceof z.ZodError) { res.status(400).json({ error: err.issues }); return; }
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function deleteJob(req: AuthRequest, res: Response) {
  const job = await prisma.job.findUnique({ where: { id: req.params.id as string } });
  if (!job) { res.status(404).json({ error: "Job not found" }); return; }
  if (job.userId !== req.user!.id) { res.status(403).json({ error: "Forbidden" }); return; }
  await prisma.job.delete({ where: { id: req.params.id as string } });
  res.json({ message: "Job deleted successfully" });
}