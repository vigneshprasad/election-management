import type { Gender, Relation } from "@prisma/client"

export type VoterBasic = {
    id: number
    gender: Gender
    name: string
    age: number
    relationName: string
    relationType: Relation
    partId: number
}