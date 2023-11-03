import { StackContext, use } from 'sst/constructs'
import { Identity } from '@blc-mono/identity/stack'
import { Tables } from './src/constructs/tables'
import { OffersApi } from './src/constructs/offersApi'
import { Lambda } from './src/constructs/lambda'
import { DataSource } from './src/graphql/dataSources'
import { Resolver } from './src/graphql/resolvers/resolver'
import { Buckets } from './src/constructs/buckets'
import { EventBridge } from './src/constructs/eventBridge'
import { Queues } from './src/constructs/queues'
import { ElasticCache } from "./src/constructs/elasticCache";

export function Offers ({ stack }: StackContext) {
  const { cognito } = use(Identity)
  const offersApi = OffersApi.create(stack, stack.stage, cognito.cdk.userPool, './packages/api/offers/schema.graphql')
  const elasticCache = new ElasticCache(stack, stack.stage)
  const queues = new Queues(stack)
  const tables = new Tables(stack)
  const buckets = new Buckets(stack, stack.stage, queues)
  const lambdas = new Lambda(stack, tables, buckets, queues, stack.stage, elasticCache)
  const dataSources = new DataSource(offersApi, tables, lambdas)
  const resolvers = new Resolver(dataSources)
  resolvers.initialise()
  new EventBridge(stack, stack.stage, tables, queues)

  stack.addOutputs({
    OffersApiEndpoint: offersApi.graphqlUrl,
  })

  return {
    offersApi,
  }
}
