document.addEventListener("DOMContentLoaded", () => {
  const activitiesList = document.getElementById("all-activities-list");

  async function fetchActivities() {
    try {
      const response = await fetch("/activities");
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const activities = await response.json();
      activitiesList.innerHTML = "";

      Object.entries(activities).forEach(([name, details]) => {
        const activityCard = document.createElement("article");
        activityCard.className = "activity-card";

        const heading = document.createElement("h4");
        heading.textContent = name;
        activityCard.appendChild(heading);

        const description = document.createElement("p");
        description.textContent = details.description;
        activityCard.appendChild(description);

        [
          ["Schedule", details.schedule],
          ["Maximum participants", details.max_participants],
          ["Current participants", details.participants.length],
        ].forEach(([label, value]) => {
          const detail = document.createElement("p");
          const labelElement = document.createElement("strong");
          labelElement.textContent = `${label}: `;
          detail.append(labelElement, document.createTextNode(value));
          activityCard.appendChild(detail);
        });

        const participantsHeading = document.createElement("p");
        participantsHeading.innerHTML = "<strong>Students signed up:</strong>";
        activityCard.appendChild(participantsHeading);

        if (details.participants.length) {
          const participantList = document.createElement("ul");
          details.participants.forEach((participant) => {
            const participantItem = document.createElement("li");
            participantItem.textContent = participant;
            participantList.appendChild(participantItem);
          });
          activityCard.appendChild(participantList);
        } else {
          const emptyMessage = document.createElement("p");
          emptyMessage.textContent = "No students signed up yet.";
          activityCard.appendChild(emptyMessage);
        }

        activitiesList.appendChild(activityCard);
      });
    } catch (error) {
      activitiesList.innerHTML =
        '<p class="empty-state">Failed to load activities. Please try again later.</p>';
      console.error("Error fetching activities:", error);
    }
  }

  fetchActivities();
});
