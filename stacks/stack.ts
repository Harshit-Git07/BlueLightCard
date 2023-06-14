
import {StackContext, Api, NextjsSite, Table, EventBus} from "sst/constructs";
import { Config } from "sst/constructs";
export function Shared({ stack }: StackContext) {
    //common event bus
    const bus = new EventBus(stack, "eventBus", {
    });
    stack.addOutputs({
        EventBusName: bus.eventBusName
    });
}