import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { createId } from '@paralleldrive/cuid2';
import { PrismaService } from '@/common/prisma.service';
import { MiscService } from '@/misc/misc.service';
import { Prisma } from '@prisma/client';
import {
  CreateShareRequest,
  CreateShareResult,
  DeleteShareRequest,
  GetShareContentData,
  SharedContent,
  User,
} from '@refly-packages/openapi-schema';
import { canvasPO2DTO, projectPO2DTO } from '@/knowledge/knowledge.dto';
import { MINIO_INTERNAL, MinioService } from '@/common/minio.service';
import { streamToString } from '@/utils';

const SHARE_CODE_PREFIX = {
  PROJECT: 'proj',
  CANVAS: 'canv',
};

function genProjectShareCode(): string {
  return SHARE_CODE_PREFIX.PROJECT + createId();
}

function genCanvasShareCode(): string {
  return SHARE_CODE_PREFIX.CANVAS + createId();
}

@Injectable()
export class ShareService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly miscService: MiscService,
    @Inject(MINIO_INTERNAL) private minio: MinioService,
  ) {}

  async createShare(user: User, body: CreateShareRequest): Promise<CreateShareResult> {
    const { entityType, entityId } = body;

    if (entityType !== 'project' && entityType !== 'canvas') {
      throw new BadRequestException('Unsupported entity type for sharing');
    }

    await this.miscService.checkEntity(user, entityId, entityType);

    const shareCode = entityType === 'project' ? genProjectShareCode() : genCanvasShareCode();

    if (entityType === 'project') {
      await this.prisma.project.update({
        where: { projectId: entityId },
        data: { shareCode },
      });
    } else if (entityType === 'canvas') {
      await this.prisma.canvas.update({
        where: { canvasId: entityId },
        data: { shareCode },
      });
    }

    return { shareCode };
  }

  async deleteShare(user: User, body: DeleteShareRequest) {
    const { shareCode } = body;
    let updateResult: Prisma.BatchPayload;

    if (shareCode.startsWith(SHARE_CODE_PREFIX.PROJECT)) {
      updateResult = await this.prisma.project.updateMany({
        where: { uid: user.uid, shareCode, deletedAt: null },
        data: { shareCode: null },
      });
    } else if (shareCode.startsWith(SHARE_CODE_PREFIX.CANVAS)) {
      updateResult = await this.prisma.canvas.updateMany({
        where: { uid: user.uid, shareCode, deletedAt: null },
        data: { shareCode: null },
      });
    }

    if (updateResult.count === 0) {
      throw new NotFoundException('Share not found');
    }
  }

  private async getSharedContentForProject(
    shareCode: string,
    canvasId?: string,
  ): Promise<SharedContent> {
    const result: SharedContent = {};

    const projects = await this.prisma.project.findMany({
      where: { shareCode },
      include: { canvases: { orderBy: { order: 'asc' } } },
      take: 1,
    });

    if (projects.length === 0) {
      throw new NotFoundException('Share not found');
    }

    const project = projects[0];
    result.project = projectPO2DTO(project);
    result.canvasList = project.canvases.map((c) => canvasPO2DTO(c));

    const selectedCanvasId = canvasId || project.canvases[0].canvasId;

    const canvas = project.canvases.find((c) => c.canvasId === selectedCanvasId);

    if (!canvas) {
      throw new NotFoundException('Shared canvas not found');
    }

    result.canvas = canvasPO2DTO({
      ...canvas,
      content: await streamToString(await this.minio.client.getObject(canvas.storageKey)),
    });

    return result;
  }

  private async getSharedContentForCanvas(
    shareCode: string,
    canvasId?: string,
  ): Promise<SharedContent> {
    const result: SharedContent = {};

    const canvases = await this.prisma.canvas.findMany({
      where: { shareCode, canvasId },
      take: 1,
    });

    if (canvases.length === 0) {
      throw new NotFoundException('Share not found');
    }

    const canvas = canvases[0];

    result.canvas = canvasPO2DTO({
      ...canvas,
      content: await streamToString(await this.minio.client.getObject(canvas.storageKey)),
    });

    return result;
  }

  async getShareDetail(params: GetShareContentData['query']): Promise<SharedContent> {
    const { shareCode, canvasId } = params;

    if (shareCode.startsWith(SHARE_CODE_PREFIX.PROJECT)) {
      return this.getSharedContentForProject(shareCode, canvasId);
    }
    if (shareCode.startsWith(SHARE_CODE_PREFIX.CANVAS)) {
      return this.getSharedContentForCanvas(shareCode, canvasId);
    }

    throw new BadRequestException('Invalid share code');
  }
}
