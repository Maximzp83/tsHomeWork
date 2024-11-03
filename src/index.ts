enum NoteStatus {
  DONE,
  PENDING,
  CANCELED
};

type NoteFilters = Partial<{
  title: string;
  content: string;
  status: NoteStatus;
  createdAt: Date;
}>;

abstract class Note {
  public readonly id: number;
  public title: string;
  public content: string;
  public createdAt: Date;
  public updatedAt: Date;
  public status: NoteStatus;

  constructor(title: string, content: string) {
    if (!title || !content) throw new Error("name and content is reqired.");
    
    this.id = Math.random();
    this.title = title;
    this.content = content;
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.status = NoteStatus.PENDING;
  }

  abstract edit(content: string): void;

  markAsCompleted(): void {
    this.status = NoteStatus.DONE;
  }
}

class DefaultNote extends Note {
  edit(content: string): void {
    if (!content) throw new Error("content is reqired.");
    this.content = content;
    this.updatedAt = new Date();
  }
}

class ConfirmableNote extends Note {
  edit(content: string): void {
    if (!content) throw new Error("content is reqired.");
    const confirmEdit = confirm("Are youre sure?");
    if (confirmEdit) {
      this.content = content;
      this.updatedAt = new Date();
    }
  }
}

abstract class ToDoList {
  public notes: Note[] = [];

  addNote<T extends Note>(note: T): void {
    this.notes.push(note);
  }

  removeNote(id: number): void {
    this.notes = this.notes.filter((note) => note.id !== id);
  }

  editNote(id: number, newContent: string): void {
    const note = this.getNoteById(id);
    note?.edit(newContent);
  }

  getNoteById(id: number): Note | undefined {
    return this.notes.find(note => note.id === id);
  }

  getAllNotes(): Note[] {
    return this.notes;
  }

  markNoteAsCompleted(id: number): void {
    const note = this.getNoteById(id);
    if (note) note.markAsCompleted();
  }

  getTotalNotes(): number {
    return this.notes.length;
  }

  getPendingNotesCount(): number {
    return this.notes.filter((note) => note.status === NoteStatus.PENDING).length;
  }

  sortNotesByStatus(): Note[] {
    return [...this.notes].sort((a, b) => a.status - b.status);
  }

  sortNotesByCreationDate(): Note[] {
    return [...this.notes].sort(
      (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
    );
  }

  public abstract filterNotesBy(filters: NoteFilters): Note[];
}

class ToDoListWithSearch extends ToDoList {
  constructor() {
    super();
  }

  filterNotesBy(filters: NoteFilters): Note[] {
    let result: Note[] = [];
    if (filters.title) result = result.concat(this.searchNotesByTitle(filters.title));
    if (filters.content) result = result.concat(this.searchNotesByContent(filters.content));
    
    return result;
  }

  searchNotesByTitle(keyword: string): Note[] {
    return this.notes.filter(note => note.title.includes(keyword));
  }
  searchNotesByContent(keyword: string): Note[] {
    return this.notes.filter(note => note.content.includes(keyword));
  }
};

class ToDoListWithSearchAndFilter extends ToDoListWithSearch {
  constructor() {
    super();
  }

  filterNotesBy(filters: NoteFilters): Note[] {
    let result = super.filterNotesBy(filters);
    if (filters.status) result.concat(this.filterNotesByStatus(filters.status));
    if (filters.createdAt) result.concat(this.filterNotesByCreationDate(filters.createdAt));
    return result;
  }

  filterNotesByStatus(status: number): Note[] {
    return this.notes.filter(note => note.status === status);
  }
  filterNotesByCreationDate(date: Date): Note[] {
    return this.notes.filter(note => new Date(note.createdAt).getTime() <= date.getTime());
  }
};