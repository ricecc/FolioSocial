import React, { useState } from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button"; // Assumendo che ci sia un bottone già stilizzato da shadcn
import { deletePost } from '@/lib/actions/posts.actions'; // Funzione deletePost creata
import { Badge } from "@/components/ui/badge"
interface Params {
  postId: string;
}

const DeletePost = ({ postId }: Params) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Per indicare il caricamento durante l'eliminazione

  const handleDelete = async () => {
    try {
      setIsLoading(true); // Mostra lo stato di caricamento
      await deletePost(postId, "path/to/resource"); // Chiama la funzione deletePost
      setIsLoading(false);
      setIsDialogOpen(false); // Chiude il dialog dopo l'eliminazione
      // Aggiorna l'interfaccia utente dopo l'eliminazione, se necessario
      console.log("Post eliminato con successo.");
    } catch (error) {
      setIsLoading(false);
      console.error("Errore durante l'eliminazione del post:", error);
    }
  };

  return (
    <div>
      {/* Trigger per aprire il dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Badge onClick={() => setIsDialogOpen(true)} >Elimina</Badge>
        </DialogTrigger>

        {/* Dialog di conferma */}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Conferma Eliminazione</DialogTitle>
            <DialogDescription>
              Sei sicuro di voler eliminare questo post? Questa azione non può essere annullata.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isLoading}>
              Annulla
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
              {isLoading ? "Eliminazione..." : "Elimina"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DeletePost;
