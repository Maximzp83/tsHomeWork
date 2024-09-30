//1
interface Interface1 {
	[key: string]: string | number;
}

interface Interface2 {
	[key: number]: (() => void);
}

interface Interface3 {
	[key: number]: string; // не зовсiм зрозумiв "...а значення - певного типу." Якого саме?
}

interface Interface4 {
	name: string;
	[key: string]: string | number;	
}

// ---5---
type RandomObject = {
	[key: string]: string | number;
}
interface MyInterface {
	[key: string]: string | number | RandomObject;
}
interface MyInterface {
	property1: string;
	property2: number;
	property3: RandomObject
}

function isValidObject(object: RandomObject): boolean {
	return Object.values(object).every(value => typeof value === 'number');
}

// -----------------------
console.log(isValidObject({ a: 1, b: 2, c: 3 }));
console.log(isValidObject({ a: 1, b: '2', c: 3 }));