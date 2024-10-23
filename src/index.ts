// -----1------

function foo(param: string): any {
	return param;
};

function bar(): string {
  return "Hello!";
}

type FindType<T> = T extends (...args: any[]) => infer U ? U : never;

type ResultType = FindType<typeof foo>; // any
type ResultType2 = FindType<typeof bar>; // string

// -----2-----
function baz(param: number): string {
	return `${param}`;
};

type FindType2<T> = T extends (param: infer P) => infer R ? [P, R] : never;

type ResultType3 = FindType2<typeof baz>; // [number, string]
