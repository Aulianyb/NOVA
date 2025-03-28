export type World = {
    id : string;
    worldName : string; 
    worldDescription : string;
    owners : string[];
    categories : string[];
    objects : string[];
    changes : string[];
}

export type Position = {
    x : number,
    y : number
}

export type Object = {
    objectName : string,
    objectPicture : string,
    objectDescription : string,
    images : string[],
    relationships : string[],
    tags : string[],
    position : Position
}