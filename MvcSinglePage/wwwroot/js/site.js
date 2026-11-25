// Load Person Data
async function LoadPersons() {
    try {
        const response = await fetch('/Person/GetAll');

        if (!response.ok) {
            throw new Error('Failed to load persons.');
        }

        const persons = await response.json();

        const tableBody = document.getElementById('personTableBody');

        tableBody.innerHTML = '';

        persons.forEach(person => {

            const row = document.createElement('tr');

            row.innerHTML = `
    <td>${person.firstName}</td>
    <td>${person.lastName}</td>
    <td>
        <a href="/Person/Update/${person.id}">Edit</a> |

        <button type="button"
                class="btn btn-link p-0"
                onclick="ShowPersonDetails(${person.id})">
            Details
        </button> |

        <a href="/Person/Delete/${person.id}">Delete</a>
    </td>
`;

            tableBody.appendChild(row);
        });
    }
    catch (error) {
        console.error(error);
    }
}
// Add Person
async function AddPerson(event) {

    event.preventDefault();
    const isValidData = ValidatePersonForm();

    if (!isValidData) {
        return;
    }

    const person = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value
    };

    try {

        const response = await fetch('/Person/Post', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(person)
        });

        if (!response.ok) {
            throw new Error('Failed to add person.');
        }

        document.getElementById('resultMessage').textContent =
            'Person added successfully.';

        RefreshPersonForm();

        await LoadPersons();

    }
    catch (error) {

        console.error(error);

        document.getElementById('resultMessage').textContent =
            'Error adding person.';

    }
}
// Show Person Details
async function ShowPersonDetails(id) {

    try {

        const response = await fetch(`/Person/Get?id=${id}`);

        if (!response.ok) {
            throw new Error('Failed to load person details.');
        }

        const person = await response.json();

        document.getElementById('detailsId').textContent = person.id;
        document.getElementById('detailsFirstName').textContent = person.firstName;
        document.getElementById('detailsLastName').textContent = person.lastName;

        const modal = new bootstrap.Modal(
            document.getElementById('detailsModal')
        );

        modal.show();

    }
    catch (error) {

        console.error(error);

    }
}
document.addEventListener('DOMContentLoaded', () => {

    LoadPersons();

    document.getElementById('personForm')
        .addEventListener('submit', AddPerson);

});
// Validate Person Form
function ValidatePersonForm() {

    let isValidData = true;

    const firstName = document.getElementById('firstName');
    const lastName = document.getElementById('lastName');

    const firstNameValidationMessage =
        document.getElementById('firstNameValidationMessage');

    const lastNameValidationMessage =
        document.getElementById('lastNameValidationMessage');


    if (firstName.value === '') {

        firstNameValidationMessage.innerText = 'First name is required';

        firstName.classList.add('is-invalid');

        isValidData = false;

    }
    else {

        firstNameValidationMessage.innerText = '';

        firstName.classList.remove('is-invalid');

        firstName.classList.add('is-valid');

    }


    if (lastName.value === '') {

        lastNameValidationMessage.innerText = 'Last name is required';

        lastName.classList.add('is-invalid');

        isValidData = false;

    }
    else {

        lastNameValidationMessage.innerText = '';

        lastName.classList.remove('is-invalid');

        lastName.classList.add('is-valid');

    }

    return isValidData;
}
// Refresh Person Form
function RefreshPersonForm() {

    const firstName = document.getElementById('firstName');
    const lastName = document.getElementById('lastName');

    firstName.value = '';
    lastName.value = '';

    firstName.classList.remove('is-invalid', 'is-valid');
    lastName.classList.remove('is-invalid', 'is-valid');

    document.getElementById('firstNameValidationMessage').innerText = '';
    document.getElementById('lastNameValidationMessage').innerText = '';

}
document.getElementById('btnRefresh')
    .addEventListener('click', () => {

        RefreshPersonForm();

        document.getElementById('resultMessage').textContent = '';

        LoadPersons();
    });
