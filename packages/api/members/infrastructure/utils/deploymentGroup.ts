import { Stack } from 'sst/constructs/Stack';
import { StackContext } from 'sst/constructs/FunctionalStack';
import { App } from 'sst/constructs';

interface Deployment {
  id: string;
  stack: (this: Stack, ctx: StackContext) => Promise<unknown>;
}

export function deploymentGroup(
  app: App,
  firstStack: Deployment | Deployment[],
  ...deploymentGroups: Array<Deployment | Deployment[]>
): Promise<void> {
  let deployment = createFirstDeploymentGroup(firstStack, app);

  for (const deploymentGroup of deploymentGroups) {
    deployment = deployment.then(() => deployAtTheSameTime(app, deploymentGroup));
  }

  return deployment;
}

function createFirstDeploymentGroup(firstStack: Deployment | Deployment[], app: App) {
  if (Array.isArray(firstStack)) {
    return deployAtTheSameTime(app, firstStack);
  }

  return app.stack(firstStack.stack, { id: firstStack.id });
}

function deployAtTheSameTime(app: App, deploymentGroup: Deployment | Deployment[]): Promise<void> {
  if (!Array.isArray(deploymentGroup)) {
    return app.stack(deploymentGroup.stack, { id: deploymentGroup.id });
  }

  return Promise.all(
    deploymentGroup.map((deployment) => {
      return app.stack(deployment.stack, { id: deployment.id });
    }),
  ).then();
}

export const skipDeployment = () => Promise.resolve();
