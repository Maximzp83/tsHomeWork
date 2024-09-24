/* interface IFigure {
	name: string;
	color: string;
	calculateArea(): number;
} */
abstract class Figure /* implements IFigure */ {
	public abstract name: string;
	public abstract color: string;
	public abstract calculateArea(p1: number, p2?: number): number;
}

abstract class FigureWithPrint extends Figure {
	public abstract print(): string;
}

class Rectangle extends FigureWithPrint {
	public name: string = 'Rectangle';
	public color: string = 'red';
	private static _EXPRESSION: string = 'Rectangle area = side1 * side2';
	
	public calculateArea(side1: number, side2: number): number {
    return side1 * side2;
  }

	public print(): string {
		return Rectangle._EXPRESSION;
	}
}

class Square extends FigureWithPrint {
	public name: string = 'Square';
	public color: string = 'green';
	private static _EXPRESSION: string = 'Square area = side1 * side1';

	public calculateArea(side1: number): number {
    return side1 * side1;
  }

	public print(): string {
		return Square._EXPRESSION;
	}
}

class Triangle extends Figure {
	public name: string = 'Triangle';
	public color: string = 'blue';
	
	public calculateArea(bottomSide: number, height:  number): number {
    return (bottomSide * height) / 2;
  }
}

class Circle extends Figure {
	public name: string = 'Circle';
	public color: string = 'yellow';
	private static _PI: number = 3.14;

	public calculateArea(radius: number): number {
    return Circle._PI * (radius * radius);
  }
}

const figures: Figure[] = [new Rectangle(), new Square(), new Triangle(), new Circle()];

figures.forEach((figure: Figure) => {
	console.log(`Figure: ${figure.name}, color: ${figure.color}, area: ${figure.calculateArea(2, 3)}`);
	
	if (figure instanceof FigureWithPrint) {
		console.log(`Expression: ${figure.print()}`);
	}
});