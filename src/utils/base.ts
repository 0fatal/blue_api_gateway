import { ClassProperty } from '@/types'

export function defineProperties<T>(
    self: ThisType<T>,
    props: ClassProperty<T>
) {
    for (let key in props) {
        self[key] = props[key]
    }
}

export function modelFromJson<T>(json: string): T {
    return JSON.parse(json) as T
}
