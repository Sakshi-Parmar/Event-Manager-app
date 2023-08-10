document.addEventListener("DOMContentLoaded", async () => {

    const eventForm = document.getElementById("eventForm");
    const eventTableBody = document.getElementById("eventTableBody");
    const editModal = document.getElementById("editModal");
    const editEventNameInput = document.getElementById("editEventName");
    const saveEditButton = document.getElementById("saveEditButton");
    const cancelEditButton = document.getElementById("cancelEditButton");

    let currentEditingEvent = null;

    async function fetchAndDisplayEvents() {
        try {
            const response = await fetch("http://localhost:3000/events");
            const events = await response.json();

            eventTableBody.innerHTML = "";

            events.forEach(event => {
                const row = createEventTableRow(event);
                eventTableBody.appendChild(row);
            });
        } catch (error) {
            console.error("Error:", error);
        }
    }

    // Create a table row for an event
    function createEventTableRow(event) {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${event.name}</td>
            <td>${event.date}</td>
            <td>${event.location}</td>
            <td>${event.category}</td>
            <td>${event.price}</td>
            <td><button class="edit-btn" data-id="${event.id}">Edit</button></td>
            <td><button class="delete-btn" data-id="${event.id}">Delete</button></td>
        `;

        // Edit Button
        const editButton = row.querySelector(".edit-btn");
        editButton.addEventListener("click", () => {
            openEditModal(event);
        });

        // Delete Button
        const deleteButton = row.querySelector(".delete-btn");
        deleteButton.addEventListener("click", async () => {
            try {
                const response = await fetch(`http://localhost:3000/events/${event.id}`, {
                    method: "DELETE"
                });

                if (response.ok) {
                    fetchAndDisplayEvents();
                } else {
                    console.error("Failed to delete event");
                }
            } catch (error) {
                console.error("Error:", error);
            }
        });

        return row;
    }

    function openEditModal(event) {
        currentEditingEvent = event;

        editEventNameInput.value = event.name;

        editModal.style.display = "block";
    }

    saveEditButton.addEventListener("click", async () => {
        if (currentEditingEvent) {
            const editedName = editEventNameInput.value;

            try {
                const response = await fetch(`http://localhost:3000/events/${currentEditingEvent.id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        poster: currentEditingEvent.poster,
                        name: editedName,
                        description: currentEditingEvent.description,
                        date: currentEditingEvent.date,
                        location: currentEditingEvent.location,
                        category: currentEditingEvent.category,
                        price: currentEditingEvent.price
                    })
                });

                if (response.ok) {
                    closeModal();
                    fetchAndDisplayEvents();
                } else {
                    console.error("Failed to update event");
                }
            } catch (error) {
                console.error("Error:", error);
            }
        }
    });

    cancelEditButton.addEventListener("click", () => {
        closeModal();
    });

    function closeModal() {
        currentEditingEvent = null;
        editModal.style.display = "none";
    }

    eventForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const poster = document.getElementById("poster").value;
        const eventName = document.getElementById("eventName").value;
        const description = document.getElementById("description").value;
        const date = document.getElementById("date").value;
        const location = document.getElementById("location").value;
        const category = document.getElementById("category").value;
        const price = document.getElementById("price").value;

        try {
            const response = await fetch("http://localhost:3000/events", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    poster,
                    name: eventName,
                    description,
                    date,
                    location,
                    category,
                    price: parseInt(price)
                })
            });

            if (response.ok) {
                fetchAndDisplayEvents();
            } else {
                console.error("Failed to create event");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    });

    fetchAndDisplayEvents();
});
