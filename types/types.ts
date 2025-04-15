export type World = {
    id : string;
    worldName : string; 
    worldDescription : string;
    owners : string[];
    objects : string[];
    changes : string[];
}

export type Object = {
    id : string,
    objectName : string,
    objectPicture : string,
    objectDescription : string,
    images : string[],
    relationships : string[],
    tags : string[],
    positionX : number,
    positionY : number
}

export type Relationship = {
    id : string,
    source : string,
    target : string,
    tags : string[],
    relationshipDescription : string
}