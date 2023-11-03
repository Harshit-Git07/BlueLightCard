import { TagRepository } from '../repositories/tagRepository';
import { Tag } from '../models/tag';
import { v4 } from 'uuid';
import { Logger } from '@aws-lambda-powertools/logger';

export class TagService {
  private tagRepository: TagRepository;
  constructor(private readonly tableName: string, private readonly logger: Logger) {
    this.tagRepository = new TagRepository(tableName);
  }

  async getOrCreateTagsByNames(tagNames: string[]) {
    let tags: Tag[] = [];

    for (const tagName of tagNames) {
      const result = await this.tagRepository.getByName(tagName);
      if (result && result.Items && result.Items.length > 0) {
        tags.push(result.Items[0] as Tag);
      } else {
        tags.push(await this.createNewTag(tagName));
      }
    }
    return tags;
  }

  async getTagsByNames(tagNames: string[]) {
    let tags: Tag[] = [];

    for (const tagName of tagNames) {
      const result = await this.tagRepository.getByName(tagName);
      if (result && result.Items && result.Items.length > 0) {
        tags.push(result.Items[0] as Tag);
      }
    }
    return tags;
  }

  private async createNewTag(tagName: string) {
    const tag = this.createTagObject(tagName);

    try {
      await this.tagRepository.save(tag);
      return tag;
    } catch (error) {
      throw error;
    }
  }

  private createTagObject(tagName: string) {
    return {
      id: v4(),
      name: tagName,
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
    };
  }
}
