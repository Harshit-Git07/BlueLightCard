import cls from 'cls-hooked'
import { RequestHandler } from 'express'

const namespace = 'blc'

export const getClsValue = (key: string): any => {
  const ns = cls.getNamespace(namespace)
  if (ns && ns.active) {
    return ns.get(key)
  }
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const setClsValue = (key: string, value: any): any => {
  const ns = cls.getNamespace(namespace)
  if (ns && ns.active) {
    return ns.set(key, value)
  }
}

export const clsMiddleware: RequestHandler = (req, res, next) => {
  const ns = cls.getNamespace(namespace) ?? cls.createNamespace(namespace)
  ns.run(() => next())
}