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

/**
 * Batch creates non-existing tags by names.
 *
 * @param {string[]} tagNames - The names of tags to create.
 * @return {Tag[], Tag[]}} New Tags and Existing Tags
 */
  async batchCreateNoneExistingTagsByNames(tagNames: string[]) {
    let newTags: Tag[] = [];
    let existingTags: Tag[] = [];

    //create new tags if they don't exist
    for (const tagName of tagNames) {
      if(tagName){
        const result = await this.tagRepository.getByName(tagName); 
        if (!(result && result.Items && result.Items.length > 0)) {
          newTags.push(await this.createTagObject(tagName));
        } else {
          existingTags.push(result.Items[0] as Tag);
        }
      }
    }
    if(newTags.length > 0){
      await this.createBatchOfNewTags(newTags);
    }
    return {newTags, existingTags};
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

  private async createBatchOfNewTags(tags: Tag[]) {
    try {
      await this.tagRepository.batchWrite(tags);
      return tags;
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
