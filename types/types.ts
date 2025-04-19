export type World = {
    id : string;
    worldName : string; 
    worldDescription : string;
    owners : string[];
    objects : string[];
    changes : string[];
}

export type NodeObject = {
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
    type : string
    relationshipDescription : string
}

export type NodeData = {
    objectName: string;
    objectPicture: string;
    objectDescription?: string;
    images : string[],
    tags : string[],
    relationship : string[]
};

export type RelationshipData = {
    relationshipDescription : string; 
};