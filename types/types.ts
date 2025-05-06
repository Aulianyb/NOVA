export type ChangeAPI = {
    _id : string,
    description : string,
    username : string,
    createdAt : string
}

export type Change = {
    _id : string,
    description : string,
    username : string,
    time : string
}

export type World = {
    _id : string,
    worldName : string, 
    worldDescription : string,
    worldCover : string | undefined,
    owners : string[],
    objects : string[],
    changes : Change[],
    relationships : string[]
}

export type NodeObject = {
    _id : string,
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
    _id : string,
    source : string,
    target : string,
    tags : string[],
    type : string
    relationshipDescription : string
}

export type Position = {
    x : number,
    y : number
}

export type NodeJSON = {
    id : string,
    data : NodeData,
    position : Position
}

export type NodeData = {
    objectName: string;
    objectPicture: string;
    objectDescription?: string;
    images : string[],
    tags : string[],
    relationship : string[]
};

export type EdgeJSON = {
    id : string,
    source : string,
    target : string,
    data : RelationshipData
}

export type RelationshipData = {
    relationshipDescription : string; 
};