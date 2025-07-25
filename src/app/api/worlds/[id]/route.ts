import { NextRequest, NextResponse } from "next/server";
import World from "@model/World";
import User from "@model/User";
import { errorHandling, verifyWorld, verifyUser} from "../../function";
import Object from "@model/Object";
import Relationship from "@model/Relationship";
import cloudinary from "@/app/lib/connect";
import { verifyObject } from "../../function";
import { UploadApiResponse } from "cloudinary";
import Image from "@model/Image";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }){
    try {
        const userID = await verifyUser();
        if (!userID) {
            throw new Error("No Session Found"); 
        }
        const { id } = await params;
        await verifyWorld(id, userID); 
        const world = await World.findById(id)
        .populate("collaborators", "username")
        return NextResponse.json({data : world, message : "World Found!"})
    } catch(error){
        return errorHandling(error);
    }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userID = await verifyUser();
    if (!userID) {
      throw new Error("No Session Found");
    }

    const { id } = await params;
    const world = await verifyWorld(id, userID);

    // Remove world ID from all users who own/collab
    await User.updateMany(
      { _id: { $in: world.owners } },
      { $pull: { ownedWorlds: id } }
    );
    await User.updateMany(
      { _id: { $in: world.collaborators } },
      { $pull: { ownedWorlds: id } }
    );

    const deletableCoverPublicIDs: string[] = [];
    const deletableGalleryImagePublicIDs: string[] = [];
    const deletableImageDocIDs: string[] = [];

    for (const objectID of world.objects) {
      const object = await verifyObject(objectID);

      if (
        object.objectPicture &&
        object.objectPicture !== "objectPicture/fuetkmzyox2su7tfkib3"
      ) {
        deletableCoverPublicIDs.push(object.objectPicture);
      }

      const images = await Image.find({ _id: { $in: object.images } });

      for (const image of images) {
        if (image.imageID) {
          deletableGalleryImagePublicIDs.push(image.imageID); // Cloudinary
        }
        deletableImageDocIDs.push(image._id.toString()); // MongoDB
      }
    }

    const allPublicIDsToDelete = [
      ...deletableCoverPublicIDs,
      ...deletableGalleryImagePublicIDs,
    ];

    if (allPublicIDsToDelete.length > 0) {
      await cloudinary.api.delete_resources(allPublicIDsToDelete);
    }

    if (deletableImageDocIDs.length > 0) {
      await Image.deleteMany({ _id: { $in: deletableImageDocIDs } });
    }

    await Object.deleteMany({ _id: { $in: world.objects } });
    await Relationship.deleteMany({ _id: { $in: world.relationships } });

    const deletedWorld = await World.findByIdAndDelete({ _id: id });

    return NextResponse.json(
      { data: deletedWorld, message: "World Deleted!" },
      { status: 200 }
    );
  } catch (error) {
    return errorHandling(error);
  }
}


export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }){
    try {
        const userID = await verifyUser();
        if (!userID) {
            throw new Error("No Session Found"); 
        }

        const formData = await req.formData();
        const { id } = await params;

        await verifyWorld(id, userID); 
        const message : string[] = [];
        const worldCoverRaw = formData.get("worldCover");
        const newWorldName = formData.get("worldName");
        const newWorldDesc = formData.get("worldDescription");

        if (worldCoverRaw instanceof File &&
            worldCoverRaw.size > 0
        ){
            const imageFile = formData.get("worldCover") as File;
            const arrayBuffer = await imageFile.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const result : UploadApiResponse = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream({ folder: "worldCover" }, (error, result) => {
                    if (!result) return reject(new Error("No result returned from Cloudinary"));
                    if (error) return reject(error);
                    resolve(result);
                }).end(buffer);
                });
            const worldCoverID = result.public_id;
            await World.findByIdAndUpdate(id, {
                worldCover : worldCoverID
            })
            message.push("Changed cover picture of " + formData.get("worldName"));
        } 
        const oldData = await World.findById(id);
        const editedWorld = await World.findByIdAndUpdate(id,
            {worldName : newWorldName,
            worldDescription : newWorldDesc},
            {new: true}
        );

        if (oldData.worldName != newWorldName) {
            message.push("Changed name of " + oldData.worldName + " into " + newWorldName);
        }
        if (oldData.worldDescription != formData.get("worldDescription")){
            message.push("Changed description of " + newWorldName + " into '" + newWorldDesc + "'");
        }

        const currentUser = await User.findById(userID);
        const newChange = {
            description : message,
            username : currentUser.username,
        }
        await World.updateOne({_id: id}, { $push: { changes : newChange} });
        return NextResponse.json({ data : editedWorld, message : "World Edited!"}, { status: 200 });
    } catch(error){
        return errorHandling(error);
    }
}