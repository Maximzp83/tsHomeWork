type Lecturer = { 
  name: string,
  surname: string,
  position: string,
  company: string,
  experience: number, 
  courses: string[], 
  contacts: string
};

// Дуже хотiлося винести однакову логiку видалення елементiв в окрему функцiю, та зрозумiти як це аннотувати у TS.
// в мене не виходило та я знайшов таке рiшення: (можливо це забiгання наперед)
function removeItemByKey<Obj>(params: { arr: Obj[], value: string, property: keyof Obj }): Obj[] {
  const { arr, value, property } = params;
  return arr.filter(item => item[property] !== value);
}

class School {
  // implement 'add area', 'remove area', 'add lecturer', and 'remove lecturer' methods

  _areas: Area[] = [];
  _lecturers: Lecturer[] = []; // Name, surname, position, company, experience, courses, contacts
  
  get areas(): Area[] {
    return this._areas;
  }

  get lecturers(): Lecturer[] {
    return this._lecturers;
  }

  addArea(area: Area): void {
    this.areas.push(area);
  }

  removeArea(areaName: string): void {
    this._areas = removeItemByKey({ arr: this._areas, value: areaName, property: 'name' });
    // this._areas.filter(area => area.name !== areaName);
  }

  addLecturer(lecturer: Lecturer): void {
    this.lecturers.push(lecturer);
  }

  removeLecturer(lecturerName: string): void {
    this._lecturers = removeItemByKey({ arr: this._lecturers, value: lecturerName, property: 'name' });
  }
}

class Area {
  // implement getters for fields and 'add/remove level' methods
  _levels: Level[] = [];
  _name: string;

  constructor(name: string) {
    this._name = name;
  }

  get name(): string {
    return this._name;
  }

  get levels(): Level[] {
    return this._levels;
  }

  addLevel(level: Level): void {
    this.levels.push(level);
  }

  removeLevel(levelName: string): void {
    this._levels = removeItemByKey({ arr: this._levels, value: levelName, property: 'name' });
  }
}

class Level {
  // implement getters for fields and 'add/remove group' methods

  _groups: Group[] = [];
  _name: string;
  _description: string;

  constructor(name: string, description: string) {
    this._name = name;
    this._description = description;
  }

  get name(): string {
    return this._name;
  }
  get groups(): Group[] {
    return this._groups;
  }

  addGroup(group: Group): void {
    this.groups.push(group);
  }

  removeGroup(directionName: string): void {
    this._groups = removeItemByKey({ arr: this._groups, value: directionName, property: 'directionName' });
  }
}

type statusType = string | number;

class Group {
  // implement getters for fields and 'add/remove student' and 'set status' methods

  _area: Area | null = null;
  _status: string | number = '';
  _students: Student[] = []; // Modify the array so that it has a valid toSorted method*
  _directionName: string;
  _levelName: string;

  constructor(directionName: string, levelName: string) {
    this._directionName = directionName;
    this._levelName = levelName;
  }
  
  get directionName(): string {
    return this._directionName;
  }
  get students(): Student[] {
    return this._students;
  }
  set status(value: statusType) {
    this._status = value;
  }

  showPerformance(): Student[] {
    const sortedStudents: Student[] = this.students.toSorted((a, b) => b.getPerformanceRating() - a.getPerformanceRating());
    return sortedStudents;
  }
}

type AvarageFunctionType = (arr: number[]) => number;
const calcAverage: AvarageFunctionType = (arr: number[]) => arr.reduce((sum, grade) => sum + grade, 0) / arr.length;
class Student {
  // implement 'set grade' and 'set visit' methods

  _firstName: string;
  _lastName: string;
  _birthYear: number;
  _grades:  number[] = []; // workName: mark
  _visits: boolean[] = []; // lesson: present

  constructor(firstName: string, lastName: string, birthYear: number) {
    this._firstName = firstName;
    this._lastName = lastName;
    this._birthYear = birthYear;
  }

  get fullName(): string {
    return `${this._lastName} ${this._firstName}`;
  }

  set fullName(value: string) {
    [this._lastName, this._firstName] = value.split(' ');
  }

  get age(): number {
    return new Date().getFullYear() - this._birthYear;
  }

  // не впевнений у цьому. Або так:
  set grade(grade: number) {
    this._grades.push(grade);
  }
  set visit(visit: boolean) {
    this._visits.push(visit);
  }

 // Або так:
  setGrade(grade: number): void {
    this._grades.push(grade);
  }
  setVisit(visit: boolean): void { 
    this._visits.push(visit);
  }

  getPerformanceRating(): number {
    const gradeValues: number[] = Object.values(this._grades);

    if (!gradeValues.length) return 0;

    // const averageGrade: number = gradeValues.reduce((sum, grade) => sum + grade, 0) / gradeValues.length;
    const averageGrade: number = calcAverage(gradeValues);
    const attendancePercentage: number = (this._visits.filter((present: boolean) => present).length / this._visits.length) * 100;

    return (averageGrade + attendancePercentage) / 2;
  }
}