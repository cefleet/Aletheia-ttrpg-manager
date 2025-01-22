// script.js

// Toggle box states in play view
document.addEventListener("DOMContentLoaded", () => {
    const toggleBoxState = (box) => {
      if (box.classList.contains("available")) {
        box.classList.remove("available");
        box.classList.add("filled");
      } else if (box.classList.contains("filled")) {
        box.classList.remove("filled");
        box.classList.add("available");
      }
    };
  
    const toggleHPState = (box) => {
      if (box.classList.contains("hp-available")) {
        box.classList.remove("hp-available");
        box.classList.add("filled");
      } else if (box.classList.contains("filled")) {
        box.classList.remove("filled");
        box.classList.add("hp-available");
      }
    };
  
    const toggleRacialAbilityState = (box) => {
      if (box.classList.contains("racial-available")) {
        box.classList.remove("racial-available");
        box.classList.add("filled");
      } else if (box.classList.contains("filled")) {
        box.classList.remove("filled");
        box.classList.add("racial-available");
      }
    };
  
    // Apply toggle functionality to all boxes
    document.querySelectorAll(".boxes div").forEach((box) => {
      box.addEventListener("click", () => {
        const stat = box.closest(".boxes").dataset.stat;
        if (stat === "hp") toggleHPState(box);
        else if (stat === "racial-ability") toggleRacialAbilityState(box);
        else toggleBoxState(box);
      });
    });
  
    // Populate play view with values from the edit view
    const populatePlayView = () => {
      document.getElementById("name-display").textContent = document.getElementById("name").value;
      document.getElementById("race-display").textContent = document.getElementById("race").value;
      document.getElementById("level-display").textContent = document.getElementById("level").value;
      document.getElementById("gold-play").value = document.getElementById("gold").value;
  
      // Populate abilities and inventory
      document.getElementById("bonus-ability-1-display").textContent = document.getElementById("bonus-ability-1").value;
      document.getElementById("bonus-ability-2-display").textContent = document.getElementById("bonus-ability-2").value;
  
      document.getElementById("special-ability-1-display").textContent = document.getElementById("special-ability-1").value;
      document.getElementById("special-ability-2-display").textContent = document.getElementById("special-ability-2").value;
      document.getElementById("special-ability-3-display").textContent = document.getElementById("special-ability-3").value;
      document.getElementById("special-ability-4-display").textContent = document.getElementById("special-ability-4").value;
  
      document.getElementById("equipped-inventory-display").textContent = document.getElementById("equipped-inventory").value;
    };
  
    // Example button to save and populate (for demonstration)
    const saveButton = document.querySelector("#edit-form button[type='submit']");
    if (saveButton) {
      saveButton.addEventListener("click", (e) => {
        e.preventDefault(); // Prevent form submission
        populatePlayView();
        alert("Data saved. Switch to play view to see changes.");
      });
    }
  });
  