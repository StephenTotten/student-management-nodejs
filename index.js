const fs = require('fs');
const readline = require('readline');
let Student = require('./Student');

function main() {
    console.log('Welcome to Student Management System');
    console.log('Press the option number to perform the action');
    console.log('1. Add student');
    console.log('2. Delete student');
    console.log('3. Update student');
    console.log('4. Search student');
    console.log('5. Print all students');
    console.log('6. Exit');

    const studentList = [];
    loadStudentsFromFile(studentList);

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question('Enter your choice: ', function (choice) {
        switch (parseInt(choice)) {
            case 1:
                // Add student
                const newStudent = new Student();
                rl.question('Enter student name: ', function (name) {
                    newStudent.name = name;
                    rl.question('Enter student age: ', function (age) {
                        newStudent.age = parseInt(age);
                        rl.question('Enter student id: ', function (id) {
                            newStudent.id = parseInt(id);
                            addStudent(studentList, newStudent);
                            rl.close();
                        });
                    });
                });
                break;

            case 2:
                // Delete student
                rl.question('Enter student name to delete: ', function (deleteName) {
                    deleteStudent(studentList, deleteName);
                    rl.close();
                });
                break;

            case 3:
                // Update student
                rl.question('Enter student name to update: ', function (oldName) {
                    rl.question('Enter new name: ', function (newName) {
                        rl.question('Enter new age: ', function (newAge) {
                            rl.question('Enter new id: ', function (newId) {
                                updateStudent(studentList, oldName, newName, parseInt(newAge), parseInt(newId));
                                rl.close();
                            });
                        });
                    });
                });
                break;

            case 4:
                // Search student by name or ID
                console.log('Search by:');
                console.log('1. Name');
                console.log('2. ID');
                rl.question('Enter your choice: ', function (searchOption) {
                    switch (parseInt(searchOption)) {
                        case 1:
                            // Search by name
                            rl.question('Enter student name to search: ', function (searchName) {
                                searchStudentByName(studentList, searchName);
                                rl.close();
                            });
                            break;

                        case 2:
                            // Search by ID
                            rl.question('Enter student ID to search: ', function (searchID) {
                                searchStudentByID(studentList, parseInt(searchID));
                                rl.close();
                            });
                            break;

                        default:
                            console.log('Invalid search option. Please try again.');
                            rl.close();
                            break;
                    }
                });
                break;

            case 5:
                // Print all students
                printStudents(studentList);
                rl.close();
                break;

            case 6:
                // Exit and save to file
                saveStudentsToFile(studentList);
                console.log('Exiting...');
                rl.close();
                break;

            default:
                console.log('Invalid choice. Please try again.');
                rl.close();
                break;
        }
    });
}

function loadStudentsFromFile(studentList) {
    try {
        const data = fs.readFileSync('students.txt', 'utf8');
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

function addStudent(studentList, newStudent) {
    studentList.push(newStudent);
}

function updateStudent(studentList, oldName, newName, newAge, newId) {
    for (const student of studentList) {
        if (student.name === oldName) {
            student.name = newName;
            student.age = newAge;
            student.id = newId;
            break;
        }
    }
}

function deleteStudent(studentList, deleteName) {
    const index = studentList.findIndex(student => student.name === deleteName);
    if (index !== -1) {
        studentList.splice(index, 1);
    }
}

function printStudents(studentList) {
    for (const student of studentList) {
        console.log(`Name: ${student.name} // Age: ${student.age} // ID: ${student.id}`);
    }
}

function saveStudentsToFile(studentList) {
    try {
        const lines = studentList.map(student => `${student.name},${student.age},${student.id}`);
        const data = lines.join('\n');
        fs.writeFileSync('students.txt', data, 'utf8');
        console.log('Students saved to students.txt');
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
        console.log(`Student found: ${foundStudent.name} ${foundStudent.age}`);
    } else {
        console.log('Student not found');
    }
}

main();
