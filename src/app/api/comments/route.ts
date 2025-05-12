// /pages/api/comments/index.ts
import { prisma } from '@/lib/db'; // Adjust path as needed

export default async function handler(req: { method: string; query: { requirementVersionId: any; }; body: { content: any; requirementVersionId: any; parentCommentId: any; author: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: any): any; new(): any; }; }; }) {
  if (req.method === 'GET') {
    const { requirementVersionId } = req.query;

    const comments = await prisma.comment.findMany({
      where: { requirementVersionId: Number(requirementVersionId) },
      orderBy: { createdAt: 'asc' },
    });

    res.status(200).json(comments);
  } else if (req.method === 'POST') {
    const { content, requirementVersionId, parentCommentId, author } = req.body;

    const comment = await prisma.comment.create({
      data: {
        content,
        requirementVersionId: Number(requirementVersionId),
        parentCommentId: parentCommentId ? Number(parentCommentId) : null,
        author,
      },
    });

    res.status(200).json(comment);
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}

