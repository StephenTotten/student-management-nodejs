const fs = require('fs').promises;
const readline = require('readline');
const Student = require('./student');
const studentList = [];

async function main() {
    console.log('Welcome to Student Management System');
    await loadStudentsFromFile();
    await promptUser();
}

async function promptUser() {
    console.log('Press the option number to perform the action');
    console.log('1. Add student');
    console.log('2. Delete student');
    console.log('3. Update student');
    console.log('4. Search student');
    console.log('5. Print all students');
    console.log('6. Exit');

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const choice = await askQuestion(rl, 'Enter your choice: ');

    switch (parseInt(choice)) {
        case 1:
            // Add student
            const name = await askQuestion(rl, 'Enter student name: ');
            const age = parseInt(await askQuestion(rl, 'Enter student age: '));
            const id = parseInt(await askQuestion(rl, 'Enter student id: '));
            addStudent(name, age, id);
            rl.close();
            await promptUser();
            break;

        case 2:
            // Delete student
            const deleteName = await askQuestion(rl, 'Enter student name to delete: ');
            deleteStudent(studentList, deleteName);
            rl.close();
            await promptUser();
            break;

        case 3:
            // Update student
            const oldName = await askQuestion(rl, 'Enter student name to update: ');
            const newName = await askQuestion(rl, 'Enter new name: ');
            const newAge = parseInt(await askQuestion(rl, 'Enter new age: '));
            const newId = parseInt(await askQuestion(rl, 'Enter new id: '));
            updateStudent(studentList, oldName, newName, newAge, newId);
            rl.close();
            await promptUser();
            break;

        case 4:
            // Search student by name or ID
            console.log('Search by:');
            console.log('1. Name');
            console.log('2. ID');
            const searchOption = await askQuestion(rl, 'Enter your choice: ');

            switch (parseInt(searchOption)) {
                case 1:
                    // Search by name
                    const searchName = await askQuestion(rl, 'Enter student name to search: ');
                    searchStudentByName(studentList, searchName);
                    rl.close();
                    await promptUser();
                    break;

                case 2:
                    // Search by ID
                    const searchID = parseInt(await askQuestion(rl, 'Enter student ID to search: '));
                    searchStudentByID(studentList, searchID);
                    rl.close();
                    await promptUser();
                    break;

                default:
                    console.log('Invalid search option. Please try again.');
                    rl.close();
                    await promptUser();
                    break;
            }
            break;

        case 5:
            // Print all students
            printStudents(studentList);
            rl.close();
            await promptUser();
            break;

        case 6:
            // Exit and save to file
            await saveStudentsToFile(studentList);
            console.log('Exiting...');
            rl.close();
            break;

        default:
            console.log('Invalid choice. Please try again.');
            rl.close();
            await promptUser();
            break;
    }
}

async function loadStudentsFromFile() {
    try {
        const data = await fs.readFile('students.csv', 'utf8');
        const lines = data.split('\n');
        for (const line of lines) {
            const parts = line.split(',');
            const student = new Student(parts[0], parseInt(parts[1]), parseInt(parts[2]));
            studentList.push(student);
        }
    } catch (err) {
        console.error('Error reading file: ' + err.message);
    }
}

function addStudent(name, age, id) {
    const newStudent = new Student(name, age, id);
    studentList.push(newStudent);
    saveStudentsToFile();
}

function updateStudent(studentList, oldName, newName, newAge, newId) {
    for (const student of studentList) {
        if (student.name === oldName) {
            student.name = newName;
            student.age = newAge;
            student.id = newId;
            saveStudentsToFile();
            break;
        }
    }
}

function deleteStudent(studentList, deleteName) {
    const updatedStudentList = studentList.filter(student => student.name !== deleteName);
    if (updatedStudentList.length === studentList.length) {
        console.log('Student not found');
    } else {
        studentList.length = 0; // Clear the existing studentList
        Array.prototype.push.apply(studentList, updatedStudentList); // Copy the updated list back
        saveStudentsToFile();
    }
}

function printStudents(studentList) {
    for (const student of studentList) {
        console.log(`Name: ${student.name} // Age: ${student.age} // ID: ${student.id}`);
    }
}

async function saveStudentsToFile() {
    try {
        const lines = studentList.map(student => `${student.name},${student.age},${student.id}`);
        const data = lines.join('\n');
        await fs.writeFile('students.csv', data, 'utf8');
        console.log('Changes saved to students.csv');
    } catch (err) {
        console.error('Error writing to file: ' + err.message);
    }
}

function searchStudentByName(studentList, name) {
    const foundStudent = studentList.find(student => student.name === name);
    if (foundStudent) {
        console.log(`Student found: ${foundStudent.name}, Age: ${foundStudent.age}, ID: ${foundStudent.id}`);
    } else {
        console.log('Student not found');
    }
}

function searchStudentByID(studentList, id) {
    const foundStudent = studentList.find(student => student.id === id);
    if (foundStudent) {
        console.log(`Student found: ${foundStudent.name} // Age: ${foundStudent.age}`);
    } else {
        console.log('Student not found');
    }
}

async function askQuestion(rl, question) {
    return new Promise((resolve) => {
        rl.question(question, resolve);
    });
}

main();
