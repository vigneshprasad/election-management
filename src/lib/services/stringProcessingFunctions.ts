import { Gender, Relation } from "@prisma/client";

export function generateRelationString(relationName:string, relationType:Relation, gender:Gender) {
    let relationString:string =  relationName;
    if (relationType === Relation.F || relationType === Relation.M) {
        if(gender == Gender.F) {
            relationString = "Daughter of " + relationName;
        }
        if(gender == Gender.M) {
            relationString = "Son of " + relationName;
        }
    } else if (relationType === Relation.H) {
        relationString = "Wife of " + relationName
    }
    return relationString;
}