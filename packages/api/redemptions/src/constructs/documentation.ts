import { Stack } from 'aws-cdk-lib';
import { CfnDocumentationPart, CfnDocumentationVersion } from 'aws-cdk-lib/aws-apigateway';
import { DependencyGroup } from 'constructs';

interface DocumentationPartConfig {
    apiId: string;
    name: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS' | 'PATCH';
    path: string;
    type: 'METHOD';
    description: string;
}

/**
 *  This class creates all the documentation parts for the Redemptions API
 *  @param stack - The stack to add the documentation parts to
 */
export class Documentation {
  documentationVersion: any
  postAffiliate: any

  constructor (private stack: Stack, apiId: string, version: string) {
    const dependencyGroup = new DependencyGroup();

    // Add documentation parts below
    this.postAffiliate = this.createDocumentationPart(stack, dependencyGroup, {
        apiId,
        name: 'PostAffiliate',
        method: 'POST',
        path: '/member/connection/affiliate',
        type: 'METHOD',
        description: `Retrieves the fully qualified affiliate URL for the member.`
    } )
    
    // Documentation Version
    this.documentationVersion = this.createDocumentationVersion(stack, apiId, version)
    this.documentationVersion.node.addDependency(dependencyGroup);
  }

  private createDocumentationPart (stack: Stack, dependencyGroup: any, config: DocumentationPartConfig): void {
    return dependencyGroup.add(
        new CfnDocumentationPart(stack, config.name, {
            restApiId: config.apiId,
            location: {
                method: config.method,
                path: config.path,
                type: config.type,
            },
            properties: JSON.stringify({ description: config.description }),
        }))
  }

  private createDocumentationVersion (stack: Stack, apiId: string, version: string) {
    return new CfnDocumentationVersion(stack, `DocumentationVersion-${version}`, {
        restApiId: apiId,
        documentationVersion: version,
    })
  }
}
