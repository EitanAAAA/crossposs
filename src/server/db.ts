import { PrismaClient } from '@prisma/client';
import { User, VideoRecord, PlatformStatus, Platform } from '../../types';

const prisma = new PrismaClient();

export class DatabaseService {
  async getUsers(): Promise<User[]> {
    const users = await prisma.user.findMany({
      include: {
        videos: {
          include: {
            platformStatuses: true
          }
        }
      }
    });
    return users.map(this.mapUserFromPrisma);
  }

  async saveUser(user: Omit<User, 'id'> | User): Promise<User> {
    const existing = await prisma.user.findUnique({
      where: { email: user.email }
    });
    if (existing) {
      return this.mapUserFromPrisma(existing);
    }
    const data: any = {
        email: user.email,
        name: user.name,
      connectedPlatforms: user.connectedPlatforms as string[]
    };
    if (user.platformTokens) {
      data.platformTokens = JSON.stringify(user.platformTokens);
      }
    const created = await prisma.user.create({ data });
    return this.mapUserFromPrisma(created);
  }

  async getUserById(userId: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        videos: {
          include: {
            platformStatuses: true
          },
          orderBy: {
            timestamp: 'desc'
          }
        }
      }
    });
    return user ? this.mapUserFromPrisma(user) : null;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        videos: {
          include: {
            platformStatuses: true
          },
          orderBy: {
            timestamp: 'desc'
          }
        }
      }
    });
    return user ? this.mapUserFromPrisma(user) : null;
  }

  async getVideos(userId: string): Promise<VideoRecord[]> {
    const videos = await prisma.video.findMany({
      where: { userId },
      include: {
        platformStatuses: true
      },
      orderBy: {
        timestamp: 'desc'
      }
    });
    return videos.map(this.mapVideoFromPrisma);
  }

  async saveVideo(userId: string, video: VideoRecord): Promise<VideoRecord> {
    const data: any = {
        userId,
        thumbnail: video.thumbnail,
        title: video.title,
        description: video.description,
      hashtags: video.hashtags as string[],
        timestamp: video.timestamp,
        platformStatuses: {
          create: video.platformStatuses.map(ps => ({
            platform: ps.platform,
            status: ps.status,
            errorMessage: ps.errorMessage
          }))
        }
    };
    if (video.platformVideoIds) {
      data.platformVideoIds = JSON.stringify(video.platformVideoIds);
    }
    const created = await prisma.video.create({
      data,
      include: {
        platformStatuses: true
      }
    });
    return this.mapVideoFromPrisma(created);
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<User> {
    const data: any = {};
    if (updates.email !== undefined) data.email = updates.email;
    if (updates.name !== undefined) data.name = updates.name;
    if (updates.connectedPlatforms !== undefined) data.connectedPlatforms = updates.connectedPlatforms as string[];
    if (updates.platformTokens !== undefined) data.platformTokens = updates.platformTokens ? JSON.stringify(updates.platformTokens) : null;
    
    const updated = await prisma.user.update({
      where: { id: userId },
      data,
      include: {
        videos: {
          include: {
            platformStatuses: true
          }
        }
      }
    });
    return this.mapUserFromPrisma(updated);
  }

  private mapUserFromPrisma(user: any): User {
    let platformTokens;
    try {
      platformTokens = user.platformTokens ? JSON.parse(user.platformTokens) : undefined;
    } catch {
      platformTokens = undefined;
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name || undefined,
      connectedPlatforms: (user.connectedPlatforms || []) as any as Platform[],
      platformTokens
    };
  }

  private mapVideoFromPrisma(video: any): VideoRecord {
    let platformVideoIds;
    try {
      platformVideoIds = video.platformVideoIds ? JSON.parse(video.platformVideoIds) : undefined;
    } catch {
      platformVideoIds = undefined;
    }

    return {
      id: video.id,
      thumbnail: video.thumbnail,
      title: video.title,
      description: video.description,
      hashtags: video.hashtags,
      timestamp: video.timestamp,
      platformVideoIds,
      platformStatuses: video.platformStatuses.map((ps: any) => ({
        platform: ps.platform,
        status: ps.status,
        errorMessage: ps.errorMessage || undefined
      }))
    };
  }

  async disconnect(): Promise<void> {
    await prisma.$disconnect();
  }
}

export const databaseService = new DatabaseService();

