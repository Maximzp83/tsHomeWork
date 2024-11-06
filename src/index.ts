
type Uuid = number;
interface INote {
  id: Uuid;
  title: string;
  text: string;
  createdAt: Date;
  updatedAt: Date | null;
  isCompleted: boolean;
  update(payload: INoteUpdated): void;
  complete(): void;
  info: string;
  // status: NoteStatus
}

interface IToDoList {
  create: (title: string, text: string) => INote;
  remove: (id: Uuid) => INote | null;
  update: (id: Uuid, payload: INoteUpdated) => INote;
  getNoteById: (id: Uuid) => INote | null;
  getNotes(): INote[];
  getNotesInfo(): string;
  complete: (id: Uuid) => INote;
  allCount: number;
  incompletedCount: number;
}

interface INoteUpdated {
  title?: INote['title'];
  text?: INote['text'];
}
// or
// type INoteUpdatedAlias = Partial<Pick<INote, 'title' | 'text'>>;

type NoteFilters = Partial<INote>;

class ToDoList implements IToDoList {
  private notes: INote[] = [];

  get allCount(): number {
    return this.notes.length;
  }

  get incompletedCount(): number {
    return this.notes.filter((note) => !note.isCompleted).length;
  }

  create(title: string, text: string): INote {
    if (!title.trim() || !text.trim()) throw new Error('Title and text are required');
    const note = new Note(title, text);
    this.notes.push(note);
    return {...note} as INote;
  }
  remove(id: Uuid): INote {
    const noteIndex = this.findByIndex(id);
    return this.notes.splice(noteIndex, 1)[0];
  }
  update(id: Uuid, payload: INoteUpdated): INote {
    const noteIndex = this.findByIndex(id);
    const note = this.notes[noteIndex];
    const oldNote = { ...note };
    note.update(payload);
    return oldNote;
  }
  getNoteById(id: Uuid): INote {
    const noteIndex = this.findByIndex(id);
    return this.notes[noteIndex];
  }
  getNotes(): INote[] {
    return [...this.notes];
  }

  getNotesInfo(): string {
    return this.notes.map((note) => note.info).join('\n');
  }

  complete(id: Uuid): INote {
    const noteIndex = this.findByIndex(id);
    const note = this.notes[noteIndex];
    note.complete();
    return note;
  }
  

  private findByIndex(id: Uuid): number {
    const noteIndex = this.notes.findIndex((note) => note.id === id);

    if (noteIndex === -1) throw new Error('Note not found');
    // if (~~noteIndex) throw new Error('Note not found'); // doesn't work
    return noteIndex;
  }

}

abstract class BaseNote implements INote {
  readonly id: Uuid = Math.random();
  title: string;
  text: string;
  readonly createdAt: Date = new Date();
  public updatedAt: Date | null = null;
  isCompleted: boolean = false;

  constructor(title: string, text: string) {
    this.title = title;
    this.text = text;
  }

  get info () {
    return `Title: ${this.title}, Text: ${this.text}, Completed: ${this.isCompleted};`;
  }

  public complete(): void {
    this.isCompleted = true;
  }

  public abstract update({title, text}: INoteUpdated, confirm?: boolean): void;
}

class Note extends BaseNote {
  public override update({title, text}: INoteUpdated): void {
    if (title?.trim())  {
      this.title = title;
    }
    if (text?.trim()) {
      this.text = text;
    }

    this.updatedAt = new Date();
  }
}

class NoteConfirmed extends BaseNote {
  public override update({title, text}: INoteUpdated, confirm: boolean): void {
    
    if (!confirm) return;
    if (title?.trim())  {
      this.title = title;
    }
    if (text?.trim()) {
      this.text = text;
    }

    this.updatedAt = new Date();
  }
}

class ToDoListWithSearch extends ToDoList {
  filterNotesBy(filters: NoteFilters): Note[] {
    let result: Note[] = [];
    if (filters.title) result = result.concat(this.searchByTitle(filters.title));
    if (filters.text) result = result.concat(this.searchByText(filters.text));
    
    return result;
  }

  searchByTitle(keyword: string): INote[] {
    return this.getNotes().filter((note) => note.title.includes(keyword));
  }
  searchByText(keyword: string): INote[] {
    return this.getNotes().filter((note) => note.text.includes(keyword));
  }
}

class TodoListWithSort extends ToDoList {
  sortNotesBy(key: string): Note[] {
    if (key == 'isCompleted') return this.sortByCompleted();
    if (key == 'createdAt') return this.sortByCreatedAt();
    return this.getNotes();
  }

  sortByCompleted(): Note[] {
    return [...this.getNotes()].sort((a, b) => a.isCompleted ? 1 : -1);
  }
  sortByCreatedAt(): Note[] {
    return [...this.getNotes()].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }
}

// Usage
const todoList = new ToDoList();
const note1 = todoList.create('title1', 'text1');
const note2 = todoList.create('title2', 'text2');
const note3 = todoList.create('title3', 'text3');
console.log('1.1', todoList.getNotesInfo());
console.log('1.2 all', todoList.allCount);
console.log('1.3 incompleted', todoList.incompletedCount);
console.log('1.4', todoList.complete(note1.id));
console.log('1.5', todoList.getNotesInfo());
console.log('1.6', todoList.allCount);
// console.log('1.7', note2.id);
console.log('1.8', todoList.remove(note2.id));
console.log('1.91 all', todoList.allCount);
console.log('1.92 incompleted', todoList.incompletedCount);
console.log('1.93', todoList.update(note3.id, {title: 'title33'}));
console.log('1.9', todoList.getNotesInfo());

const todoListWithSearch = new ToDoListWithSearch();
const note4 = todoListWithSearch.create('title4', 'text4');
const note5 = todoListWithSearch.create('title5', 'text5');
const note6 = todoListWithSearch.create('title6', 'text6');
console.log('2.1', todoListWithSearch.getNotesInfo());

console.log('2.2', todoListWithSearch.filterNotesBy({title: 'title4'}).map((note) => note.info));
console.log('2.3', todoListWithSearch.filterNotesBy({text: 'text6'}).map((note) => note.info));

const todoListWithSort = new TodoListWithSort();
const note7 = todoListWithSort.create('title7', 'text7');
const note8 = todoListWithSort.create('title8', 'text8');
const note9 = todoListWithSort.create('title9', 'text9');
console.log('3.1', todoListWithSort.getNotesInfo());

console.log('3.2', todoListWithSort.sortNotesBy('isCompleted').map((note) => note.info));
console.log('3.3', todoListWithSort.sortNotesBy('createdAt').map((note) => note.info));
// console.log('3.4', todoListWithSort.getNotesInfo());


