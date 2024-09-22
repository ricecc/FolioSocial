import ImageDialog from "@/components/ImageDialog/ImageDialog";
import SaveToggle from "@/components/ui/SaveToggle";
interface PostImageParams{
    imageUrl:string,
    userId:string,
    imageId:string,
    isSaved:boolean
}
const PostImage = ({ imageUrl, userId, imageId,isSaved }:PostImageParams) => {
  return (
    <div className="row-span-2 flex justify-center relative">
       <ImageDialog imageSrc={imageUrl} />
       <div className="absolute bottom-3 right-3 bg-white rounded-full p-2 flex flex-row space-x-2">
        <SaveToggle fromUserId={userId} type="picture" toElement={imageId} isSaved={isSaved} />
      </div>
    </div>
  );
};

export default PostImage;
