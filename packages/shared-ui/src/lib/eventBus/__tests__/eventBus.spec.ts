import eventBus from '../';

describe('EventBus', () => {
  const bus = eventBus();

  enum Channels {
    CHANNEL_1 = 'channel_1',
    CHANNEL_2 = 'channel_2',
    CHANNEL_3 = 'channel_3',
    CHANNEL_4 = 'channel_4',
  }

  afterEach(() => {
    bus.clearMessages(Channels.CHANNEL_1);
    bus.clearMessages(Channels.CHANNEL_2);
    bus.clearMessages(Channels.CHANNEL_3);
    bus.clearMessages(Channels.CHANNEL_4);
  });

  describe('subscriptions', () => {
    it('should receive messages for topic', (done) => {
      const bus = eventBus();
      bus.on(Channels.CHANNEL_1, (messages) => {
        expect(messages).toHaveLength(2);
        done();
      });
      bus.broadcast(Channels.CHANNEL_1, 'Hello', 'World');
    });

    it('should receive backlog of messages on subscribing after broadcast', (done) => {
      const bus = eventBus();
      bus.broadcast(Channels.CHANNEL_2, 'Late', 'Message');
      bus.on(Channels.CHANNEL_2, (messages) => {
        expect(messages).toHaveLength(2);
        done();
      });
    });

    it('should get the most recent message in message backlog', async () => {
      const bus = eventBus();
      bus.broadcast(Channels.CHANNEL_3, 'Hello');
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve(null);
        }, 100);
      });
      bus.broadcast(Channels.CHANNEL_3, 'World');
      await new Promise((resolve) => {
        bus.on(Channels.CHANNEL_3, () => {
          expect(bus.getLatestMessage(Channels.CHANNEL_3)?.message).toBe('World');
          resolve(null);
        });
      });
    });
  });

  describe('listeners', () => {
    it('should unregister listener from a channel using a listener Id', () => {
      const bus = eventBus();
      bus.broadcast(Channels.CHANNEL_4, 'Hello World');
      bus.on(Channels.CHANNEL_4, () => {});
      const listenerId = bus.on(Channels.CHANNEL_4, () => {});
      const unregistered = bus.off(Channels.CHANNEL_4, listenerId);
      expect(unregistered).toBe(true);
    });
  });
});
