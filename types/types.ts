export type World = {
    id : string;
    worldName : string; 
    worldDescription : string;
    owners : string[];
    categories : string[];
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