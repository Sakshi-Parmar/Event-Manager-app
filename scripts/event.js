document.addEventListener("DOMContentLoaded", async () => {
    const categoryFilter = document.getElementById("categoryFilter");
    const priceSort = document.getElementById("priceSort");
    const eventCards = document.getElementById("eventCards");

    // Fetch and display events
    async function fetchAndDisplayEvents() {
        try {
            const response = await fetch("http://localhost:3000/events");
            const events = await response.json();

            eventCards.innerHTML = ""; // Clear existing event cards

            // Filter events based on category selection
            const selectedCategory = categoryFilter.value;
            const filteredEvents = selectedCategory !== "All"
                ? events.filter(event => event.category === selectedCategory)
                : events;

            // Sort events based on price selection
            const sortDirection = priceSort.value === "Ascending" ? 1 : -1;
            const sortedEvents = filteredEvents.slice().sort((a, b) => {
                return sortDirection * (a.price - b.price);
            });

            // Create event cards
            sortedEvents.forEach(event => {
                const card = createEventCard(event);
                eventCards.appendChild(card);
            });
        } catch (error) {
            console.error("Error:", error);
        }
    }

    // Create an event card
    function createEventCard(event) {
        const card = document.createElement("div");
        card.classList.add("event-card");
        card.innerHTML = `
        <img src="${event.poster}" alt="${event.name}" class="event-image">
            <h2>${event.name}</h2>
            <p class="category">${event.category}</p>
            <p>Date: ${event.date}</p>
            <p>Location: ${event.location}</p>
            <p class="price">Price: $${event.price}</p>
        `;
        return card;
    }

    // Add event listeners for filters and sorting
    categoryFilter.addEventListener("change", fetchAndDisplayEvents);
    priceSort.addEventListener("change", fetchAndDisplayEvents);

    // Initial fetch and display
    fetchAndDisplayEvents();
});
