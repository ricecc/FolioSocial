import NewInksButton from "@/components/NewInksButton/NewInksButton";
import { fetchBookById } from "@/lib/actions/books.actions";
import Link from "next/link";
import Accordion from "@/components/Accordion/Accordion"; // Importa il nuovo componente
import { currentUser } from "@clerk/nextjs";
import { fetchUser } from "@/lib/actions/user.actions";

async function page({ params }: { params: { id: string } }) {
    const user = await currentUser();
  if (!user) return null;
  const userInfo = await fetchUser(user.id)
    let currentBook = await fetchBookById(params.id);
    return (
        <section className="flex md:flex-row flex-col h-5/6 w-full">
            <div className="flex md:w-1/2 h-auto items-center justify-center md:justify-center  pt-4 md:pt-0  bg-zinc-50">
                <img src={currentBook.largeImage} alt="" className="w-60 shadow-2xl" />
            </div>
            <div className="flex md:w-1/2 h-full flex-col w-full items-center md:justify-start justify-center mt-7 md:mt-0 py-5 md:py-0 rounded-lg">
                <div className="h-2/3 p-4 w-full ">
                    <div className="space-y-3">
                        <h1 className="text-hoverTag text-3xl font-bold">{currentBook.title}</h1>
                        <p>{currentBook.author}</p>
                    </div>
                    <article className="mt-4 text-justify md:w-4/5 w-full min-h-32 justify-center">
                        <Accordion content={currentBook.description} />
                    </article>
                </div>
                <div className="h-1/3 w-full flex flex-col">
                <NewInksButton userId={userInfo._id.toString()} bookId={currentBook._id.toString()}  />
                    <Link href={currentBook.titleUrl}>
                        <div className="h-16 bg-slate-800 text-white hover:bg-white hover:text-slate-800 flex items-center justify-between px-8 border-t border-b border-slate-600">
                            <p className="font-fontMain text-2xl">Acquista</p>
                            <img src="/assets/arrow.svg" alt="notification" width={24} height={24} className="cursor-pointer object-contain" />
                        </div>
                    </Link>
                </div>
            </div>
        </section>
    );
}

export default page;
