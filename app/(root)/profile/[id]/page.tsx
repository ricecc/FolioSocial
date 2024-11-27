import UserLibrary from "@/components/UserProfile/UserLibrary";

async function page({ params }: { params: { id: string } }) {
 
  return (
        <UserLibrary idUser={params.id} />
  )
}


export default page;