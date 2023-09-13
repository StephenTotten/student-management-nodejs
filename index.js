const fs = require('fs');
const readline = require('readline');
let Student = require('./Student');
const studentList = [];

function main() {
    console.log('Welcome to Student Management System');
    loadStudentsFromFile();
    promptUser();
}

function promptUser() {
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

    rl.question('Enter your choice: ', function (choice) {
        switch (parseInt(choice)) {
            case 1:
                // Add student
                rl.question('Enter student name: ', function (name) {
                    rl.question('Enter student age: ', function (age) {
                        rl.question('Enter student id: ', function (id) {
                            addStudent(name, parseInt(age), parseInt(id));
                            promptUser();
                        });
                    });
                });
                break;
            
            case 2:
                // Delete student
                rl.question('Enter student name to delete: ', function (deleteName) {
                    deleteStudent(studentList, deleteName);
                    promptUser(); // Go back to the main prompt
                });
                break;

            case 3:
                // Update student
                rl.question('Enter student name to update: ', function (oldName) {
                    rl.question('Enter new name: ', function (newName) {
                        rl.question('Enter new age: ', function (newAge) {
                            rl.question('Enter new id: ', function (newId) {
                                updateStudent(studentList, oldName, newName, parseInt(newAge), parseInt(newId));
                                promptUser(); // Go back to the main prompt
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
                                promptUser(); // Go back to the main prompt
                            });
                            break;

                        case 2:
                            // Search by ID
                            rl.question('Enter student ID to search: ', function (searchID) {
                                searchStudentByID(studentList, parseInt(searchID));
                                promptUser(); // Go back to the main prompt
                            });
                            break;

                        default:
                            console.log('Invalid search option. Please try again.');
                            promptUser(); // Go back to the main prompt
                            break;
                    }
                });
                break;

            case 5:
                // Print all students
                printStudents(studentList);
                promptUser(); // Go back to the main prompt
                break;

            case 6:
                // Exit and save to file
                saveStudentsToFile(studentList);
                console.log('Exiting...');
                rl.close();
                break;

            default:
                console.log('Invalid choice. Please try again.');
                promptUser(); // Go back to the main prompt
                break;
        }
    });
}

function loadStudentsFromFile() {
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

function saveStudentsToFile() {
    try {
        const lines = studentList.map(student => `${student.name},${student.age},${student.id}`);
        const data = lines.join('\n');
        fs.writeFileSync('students.txt', data, 'utf8');
        console.log('Changes saved to students.txt');
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

main();
