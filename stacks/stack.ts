import {EventBus, StackContext} from "sst/constructs";

export function Shared({ stack }: StackContext) {
    //common event bus
    const bus = new EventBus(stack, "eventBus");
    stack.addOutputs({
        EventBusName: bus.eventBusName
    });
    return {
        bus
    }
}
