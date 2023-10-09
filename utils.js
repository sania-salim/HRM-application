import {
    app,
    db,
    getDatabase,
    ref,
    child,
    get,
    onValue,
    set,
    update,
    query,
} from "./firebase.js";

/* fetch functions:
    1. getEmployeeTable() => fetches all employees data for table
    2. getEmployee(employeeID) => fetches details of clicked employee, obj from array of objs
                                  and displays in show details modal
    3. addNewEmployee() => adds new entry in employee table and in more details table
    4. editEmployee(employeeID) => edit corresp entry from both tables
    5. deleteEmployee(employeeID) => deletes corresp entry from both tables
*/

/* Display functions:
    1. showEmployeeTable(employees): called by getEmployeeTable() & displays table
    2. showDetailsModal(employeeDetails): displays modal of particular employee
*/

const dbref = ref(db);

// fetch all employees & displays in table
const tableBody = document.querySelector(".table-body");

function getEmployeeTable() {

    let employees;

    get(child(dbref, 'employees')).then((snapshot) => {
        employees = snapshot.val();
        console.log(snapshot.val());

        showEmployeeTable(employees);

    })
}

// Displays fetched data as table 
function showEmployeeTable(employees) {
    let temp = "";
    employees.forEach(employee => {

        // setting icon depending on work from home or office
        let workIcon;
        if (employee.workStatus === "wfh") {
            workIcon = "assets/work-from-home.svg";
        } else if (employee.workStatus === "office") {
            workIcon = "assets/work-from-office.svg";
        }

        // adding each employee as row to table body
        temp += `
        <tr>
        <td>${employee.employeeId}</td>
        <td>${employee.employeeName}</td>
        <td>${employee.designation}</td>
        <td>${employee.mailID}</td>
        <td><img src=${workIcon} alt="" /></td>
        <td><img src="assets/edit.svg" alt="" /></td>
      </tr>`

    });
    tableBody.innerHTML = temp;
}

getEmployeeTable();

const employeeArr = document.querySelectorAll("tr");
const employeeDetailsModal = document.querySelector(".show-details-overlay")


// listener for click on row
tableBody.addEventListener("click", function (e) {

    const targetRow = e.target.closest("tr");
    employeeDetailsModal.classList.add("show-modal");

    let employeeDetails;

    get(child(dbref, 'employeeDetails/' + targetRow.rowIndex)).then((snapshot) => {
        employeeDetails = snapshot.val();
        console.log(employeeDetails);
        showDetailsModal(employeeDetails);
    })

});

const employeeDetails = document.querySelector(".show-details-modal");

function showDetailsModal(details) {

    let temp = "";

    temp = `
        <div class="photo-and-basic-details">
          <img
            src="assets/Profile photo.png"
            alt="Profile photo"
            class="profile-pic"
          />

          <div class="basic-details">
            <h2>Shawn Degree Celcius</h2>
            <p>Employee ID: 213</p>
            <h3>Senior Engineer - Development</h3>

            <div class="show-details-contact">
              <img src="assets/phone number.svg" alt="" />
              <p>${details.mobileNumber}</p>
            </div>

            <div class="show-details-contact">
              <img src="assets/mail.svg" alt="" />
              <p>shawngeorge@abcmail.com</p>
            </div>
          </div>
          <img
            class="close-button close-show-details"
            src="assets/close.svg"
            alt=""
          />
        </div>

        <div>
          <img class="location-icon" src="assets/location.svg" alt="location" />
          <a href="https://maps.app.goo.gl/nSZoY85aWnADwL7Q9"
            >Ganga Building, Technopark Phase-3, Trivanrdum</a
          >
        </div>

        <h4>Skills</h4>
        <p>React</p>
        <h4>Projects</h4>
        <p>${details.projectList}</p>
        <h4>Joined On</h4>
        <p>${details.joiningDate}</p>

        <div class="skills-projects-joining"></div>
        `

    employeeDetails.innerHTML = temp;
    const employeeModalClose = document.querySelector(".close-show-details");

    employeeModalClose.addEventListener("click", closeEmployee);
    function closeEmployee() {
        employeeDetailsModal.classList.remove("show-modal");
    }
}