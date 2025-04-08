export type World = {
    id : string;
    worldName : string; 
    worldDescription : string;
    owners : string[];
    categories : string[];
    nodes : string[];
    changes : string[];
}

export type NodeType = {
    id : string,
    nodeName : string,
    nodePicture : string,
    nodeDescription : string,
    images : string[],
    relationships : string[],
    tags : string[],
    positionX : number,
    positionY : number
}