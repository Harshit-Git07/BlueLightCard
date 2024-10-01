import { Queue, Stack } from 'sst/constructs';

export function eventQueue(stack: Stack, name: string): Queue {
  const deadLetterQueue = new Queue(stack, `${name}-deadLetterQueue`);

  return new Queue(stack, name, {
    cdk: {
      queue: {
        deadLetterQueue: {
          queue: deadLetterQueue.cdk.queue,
          maxReceiveCount: 3,
        },
      },
    },
  });
}
