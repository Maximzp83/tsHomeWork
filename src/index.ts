interface IUser {
  name: string;
  age: number;
	contacts: {
    country: string;
    email: string;
  };
};

type DeepReadonly<T> = {
	+readonly [P in keyof T]?: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

const data: DeepReadonly<IUser> = {
	name: 'John',
	age: 30,
	contacts: {  // no error
		country: 'USA',
		// email: 'email.com'		
	}
};

// data.name = 'Mike'; // Error
// data.contacts.country = 'Canada'; // Error

console.log(data);

// ---------------------------------
type DeepRequireReadonly<T> = {
	+readonly [P in keyof T]-?: T[P] extends object ? DeepRequireReadonly<T[P]> : T[P];
};

const data2: DeepRequireReadonly<IUser>  = {
	name: 'John',
	age: 30,
	contacts: { // Error
		country: 'USA',
		email: 'email.com'		
	}
};

console.log(data2);

// --------------------------
type ToUpperCase<T extends string> = Uppercase<T>;

type UpperCaseKeys<T> = {
	[K in keyof T as ToUpperCase<string & K>]: T[K];
}

interface IUser2 {
  name: string;
  age: number;
	adress: string;
};

const data3: UpperCaseKeys<IUser2> = {
	NAME: 'John',
	AGE: 30,
	ADRESS: 'USA',
	// address: 'USA' // Error
};
console.log('UpperCaseKeys:', data3);

// -----------------------
interface MyPropertyDescriptor {
  configurable?: boolean;
  enumerable?: boolean;
  writable: boolean;
  value: any;
}

type ObjectToPropertyDescriptor<T> = {
	[P in keyof T]?: T[P] extends object ? ObjectToPropertyDescriptor<T[P]> : MyPropertyDescriptor;
};

const data4: ObjectToPropertyDescriptor<IUser> = {
	name: {
		value: 'John',
		writable: true,
		configurable: false,
	},
	age: {
		value: 30,
		writable: true
	},
	contacts: {
		country: {
			value: 'USA',
			writable: true,
		},
		email: {
			value: 'email.com',
			writable: true
		}
	}
};

console.log('ObjectToPropertyDescriptor', data4);

