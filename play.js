// const fs = require('fs');
// fs.writeFileSync('hello.txt', 'Hello from NodeJS');
// console.log('Hello from NodeJS');


const person = {
    name: 'Orifjon',
    age: 33,
    greet() {
        console.log(`Hi, I am ${this.name}`);
    }
};

person.greet();

const printName = ({ name, age }) => {
    console.log(name, age);
};

printName(person);

const hobbies = ['Sports', 'Programming'];
const [hobby1, hobby2] = hobbies;

console.log(hobby1, hobby2);