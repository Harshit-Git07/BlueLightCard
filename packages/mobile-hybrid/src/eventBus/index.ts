import { EventBus } from './eventBus';

let instance: EventBus;

const eventBus = () => {
  if (!instance) {
    instance = new EventBus();
  }
  return instance;
};

export default eventBus;
