export type ChangeAPI = {
    _id : string,
    description : string,
    username : string,
    createdAt : string
}

export type Change = {
    _id : string,
    description : string[],
    username : string,
    time : string
}

export type Collaborator = {
    _id : string,
    username : string
}

export type Tag = {
    _id : string,
    tagName : string,
    tagColor : string,
}

export type TagAPI = {
    _id : string,
    tagName : string,
    tagColor : string,
    tagRelationships : string[],
    tagObjects : string[]
}

export type World = {
    _id : string,
    worldName : string, 
    worldDescription : string,
    worldCover : string | undefined,
    owners : string[],
    objects : string[],
    changes : Change[],
    relationships : string[],
    collaborators : Collaborator[]
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

export type RelationshipJSON = {
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
    relationships : string[]
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

export type Notification = {
    _id : string,
    sender : {
        _id : string,
        username : string
    },
    worldID : {
        _id : string,
        worldName : string
    },
    status : string
}