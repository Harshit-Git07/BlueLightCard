import { Message } from './types';

export class EventBus {
  // Channel map, holding message backlog per channel
  private channels: Record<string, Message[]>;

  // Stores registered channel listeners
  private channelMessageHandlers: Record<string, Array<(messages: Message[]) => void>>;

  constructor() {
    this.channels = {};
    this.channelMessageHandlers = {};
  }

  private consumeMessages(channel: string) {
    if (this.channelMessageHandlers[channel]) {
      for (const callback of this.channelMessageHandlers[channel]) {
        callback(this.channels[channel]);
      }
    }
  }

  private hasMessages(channel: string) {
    return this.channels[channel]?.length;
  }

  /**
   * Registers a listener for a specific channel. On receiving messages from the channel, the callback will be invoked with any backlog of messages
   * @param {String} channel Channel to listen on
   * @param {Function} callback Callback to invoke with messages
   *
   * @returns {Number} Returns the listener id
   */
  public on(channel: string, callback: (messages: Message[]) => void) {
    if (!this.channelMessageHandlers[channel]) {
      this.channelMessageHandlers[channel] = [];
    }

    this.channelMessageHandlers[channel].push(callback);

    const listenerId = this.channelMessageHandlers[channel].length - 1;

    if (this.hasMessages(channel)) {
      this.consumeMessages(channel);
    }

    return listenerId;
  }

  /**
   * Unregisters the listener matching the listenerId
   * @param {String} channel Channel to remove listener from
   * @param {Number} listenerId Listener id
   *
   * @returns {Boolean} Returns true if unregistered and false if listener was not found
   */
  public off(channel: string, listenerId: number) {
    if (this.channelMessageHandlers[channel]?.[listenerId]) {
      this.channelMessageHandlers[channel].splice(listenerId, 1);
      console.info(`Deleted registered listener ${listenerId}`);
      return true;
    }

    console.warn(`Listener with id ${listenerId} was not found`);
    return false;
  }

  /**
   * Broadcast a message or messages on a specific channel, so any listeners can pick these up
   * @param {String} channel Channel to broadcast on
   * @param {...any[]} messages Spread of messages
   */
  public broadcast(channel: string, ...messages: any[]) {
    if (!this.channels[channel]) {
      this.channels[channel] = [];
    }

    for (const message of messages) {
      this.channels[channel].push({
        message,
        timestamp: Date.now(),
      });
    }

    this.consumeMessages(channel);
  }

  /**
   * Retreives the latest message sent in the channel
   * @param {String} channel Channel to get the latest message
   *
   * @returns {Message | null} Returns message object or null if no message found
   */
  public getLatestMessage(channel: string): Message | null {
    if (this.hasMessages(channel)) {
      const sortedMessages = this.channels[channel].sort((a, b) => a.timestamp - b.timestamp);
      return sortedMessages[sortedMessages.length - 1];
    }
    return null;
  }

  /**
   * Clears messages from channel backlog
   * @param {String} channel Channel to clear message backlog
   */
  public clearMessages(channel: string) {
    if (this.hasMessages(channel)) {
      this.channels[channel] = [];
    }
  }

  /**
   * Get the number of messages in a specific channel
   * @param {String} channel Channel to get message count
   *
   * @returns {Number} Returns number of messages
   */
  public getChannelMessageCount(channel: string): number {
    return this.channels[channel]?.length ?? 0;
  }
}
