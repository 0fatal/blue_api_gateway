type FuncName<T> = {
    [P in keyof T]: T[P] extends Function ? P : never
}[keyof T]

type PropertyName<T> = {
    [P in keyof T]: T[P] extends Function ? never : P
}[keyof T]

export type ClassFunc<M> = { [T in FuncName<M>]?: M[T] }

export type ClassProperty<M> = { [T in PropertyName<M>]?: M[T] }

// exclude properties U from T, and get the rest properties name
type Exclude<T, U> = {
    [P in keyof T]: P extends U ? never : P
}[keyof T]

/**
 * Exclude from M those types that are assignable to E
 */
export type ClassPropertyWithExcludeExtend<M, E> = ClassProperty<{
    [T in Exclude<M, keyof E>]?: M[T]
}>
