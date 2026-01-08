const employees = [
    { name: "saad", age: 25, position: "developer", salary: 700000, status: "active" },
    { name: "ali", age: 30, position: "designer", salary: 600000, status: "inactive" },
    { name: "hassan", age: 28, position: "manager", salary: 800000, status: "active" },
    { name: "ahmed", age: 35, position: "developer", salary: 750000, status: "inactive" },
    { name: "yousef", age: 22, position: "intern", salary: 45000, status: "active" },
];

// Function to filter active employees and map to their names and positions
const getActiveHigherSalaryEmployee = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const result = employees
                .filter((e) => { return e.salary >= 60000 && e.status === "active"; })
                .map((e) => `${e.name} - ${e.position}`)

            if (result.length > 0) { resolve(result) }
            else { reject("No Active Employees to Show") }
        }, 2000);
    })
}
async function showEmployees() {
    try {
        const data = await getActiveHigherSalaryEmployee();
        console.log("Employees:")
        console.log(data);
    } catch (error) {
        console.log(error)
    }
}
showEmployees()