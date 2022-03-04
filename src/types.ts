export type ExtractProperties<T> = T extends (...args: any) => any ? T : never

type FuncName<T> = {
    [P in keyof T]: T[P] extends Function ? P : never
}[keyof T]

type PropertyName<T> = {
    [P in keyof T]: T[P] extends Function ? never : P
}[keyof T]

export type ClassFunc<M> = { [T in FuncName<M>]?: M[T] }

export type ClassProperty<M> = { [T in PropertyName<M>]?: M[T] }

/**
 * Exclude from M those types that are assignable to E
 */
export type ClassPropertyWithExcludeExtend<M, E> = ClassProperty<Exclude<M, E>>
