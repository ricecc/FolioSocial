import mongoose, { Schema, Document } from 'mongoose';

// Definizione del documento Book (senza interfaccia)
const bookSchema: Schema = new Schema({
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }],
  title: { type: String, required: true },
  titleUrl: { type: String, required: true },
  smallImage: { type: String, required: true },
  author: { type: String, required: true },
  publisher: { type: String, required: true },
  largeImage: { type: String, required: true },
  description: { type: String, required: true },
  ean: { type: String, required: true },
  genre1: { type: String, required: true },
  genre2: { type: String, required: true },
  genre3: { type: String, required: true },
  year: { type: String, required: true },
}, {
  timestamps: true // Aggiunge createdAt e updatedAt
});

// Creazione del modello Book
const Book = mongoose.models.Book || mongoose.model('Book', bookSchema);

export default Book;
