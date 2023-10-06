const employeeArr = document.querySelectorAll("tr");
const employeeDetailsModal = document.querySelector(".show-details-overlay")
const employeeModalClose = document.querySelector(".close-show-details");
const createButton = document.querySelector(".create-employee-button");
const addModalClose = document.querySelector(".close-add-modal");
const addEmployeeModal = document.querySelector(".add-modal-overlay")
const overlay = document.querySelector("overlay");


// clicking on row shows details modal
employeeArr.forEach(employee => {
    employee.addEventListener("click", showEmployee);
});


function showEmployee() {

    employeeDetailsModal.classList.add("show-modal");
    employeeModalClose.addEventListener("click", closeEmployee);

}

function closeEmployee() {
    employeeDetailsModal.classList.remove("show-modal");

}

// Add employee modal on button click
createButton.addEventListener("click", showAddModal);

function showAddModal() {
    addEmployeeModal.classList.add("show-modal");
    addModalClose.addEventListener("click", closeAddModal)
}

function closeAddModal() {
    addEmployeeModal.classList.remove("show-modal");
}