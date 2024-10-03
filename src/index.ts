class Company {
	public name: string;
	public departments: Department[] = [];
	public prehired_employees: PreHiredEmployee[] = [];
	public all_employees: Employee[] = [];

	constructor(name: string) {
		this.name = name;
	}	
}

type Budget = {
	debet: number;
	credit: number;
}
class Department {
	public name: string;
	public employees: Employee[] = [];
	public domain_area: string;
	budget: Budget = {debet: 0, credit: 0};

	constructor(name: string, domain_area: string) {
		this.name = name;
		this.domain_area = domain_area;
	}

	income(value: number): void {
		this.budget.debet += value;
	}

	paySalary(): void {
		this.employees.forEach(e => {
			if (e.status === EmployeeStatus.ACTIVE) {
				this.budget.credit += e.salary;
			}
		});
	}

	calcBalance(): number {
		return this.budget.debet - this.budget.credit;
	}

	addEmployee(employee: Employee): void {
		this.employees.push(employee);
	}

	removeEmployee(employee: Employee): void {
		this.employees = this.employees.filter(e => e.bank_id !== employee.bank_id);
	}
}

abstract class EmployeeCore {
	public bank_id: number;
	public name: string;
	public surname: string;
	public salary: number;

	constructor(bank_id: number, name: string, surname: string, salary: number) {
		this.bank_id = bank_id;
		this.name = name;
		this.surname = surname;
		this.salary = salary;
	}
}

class PreHiredEmployee extends EmployeeCore {
	constructor(bank_id: number, name: string, surname: string, salary: number) {
		super(bank_id, name, surname, salary);
	}
}

enum EmployeeStatus {
	ACTIVE = 1,
	INACTIVE = 2,
	VACATION = 3
}

class Employee extends EmployeeCore {
	public department: Department;
	status: EmployeeStatus = EmployeeStatus.INACTIVE;

	constructor(bank_id: number, name: string, surname: string, salary: number, department: Department) {
		super(bank_id, name, surname, salary);
		this.department = department;
	}
}

class Accounting extends Department {
	public balance: (Employee | Department)[] = [];

	addToBalance(instance: Employee | Department): void {
		if (instance instanceof Employee) {
      if (this.balance.some(e => e instanceof Employee && e.bank_id === instance.bank_id)) {
        throw new Error('Employee already in balance');
      } else {
        this.balance.push(instance);
      }
    } else if (instance instanceof Department) {
      if (this.balance.some(e => e instanceof Department && e.name === instance.name)) {
        throw new Error('Department already in balance');
      } else {
        this.balance.push(instance);
      }
    }
	}

	removeFromBalance(instance: Employee | Department): void {
		this.balance = this.balance.filter(e => e !== instance);
	}

	paySalaryForAllEmploees(): void {
		this.balance.forEach((item: Employee | Department) => {
			if (item instanceof Employee && item.status === EmployeeStatus.ACTIVE) {
				this.budget.credit += item.salary;
			} else if (item instanceof Department) {
				item.paySalary();
				this.budget.credit += item.calcBalance();
			}
		});
	}
}