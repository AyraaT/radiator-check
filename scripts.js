(function () {
      const inputs = Array.from(document.querySelectorAll(".number-input"));
      const operationSelect = document.getElementById("operation");
      const resultEl = document.getElementById("result");
      const resultDetailEl = document.getElementById("result-detail");
      const resultCard = document.getElementById("result-card");
      const calcButton = document.getElementById("calculate");

      function getNumbers() {
        return inputs
          .map(input => parseFloat(input.value))
          .filter(value => !Number.isNaN(value));
      }

      function formatNumber(value) {
        if (!Number.isFinite(value)) return "—";
        if (Number.isInteger(value)) return value.toString();
        const fixed = value.toFixed(6);
        return fixed.replace(/\.?0+$/, "");
      }

      function calculate() {
        const numbers = getNumbers();
        const op = operationSelect.value;

        resultCard.classList.remove("error");

        if (!numbers.length) {
          resultEl.textContent = "—";
          resultDetailEl.textContent = "Please enter at least one number.";
          resultCard.classList.add("error");
          return;
        }

        let result;
        switch (op) {
          case "sum":
            result = numbers.reduce((a, b) => a + b, 0);
            resultDetailEl.textContent = `Sum of ${numbers.length} value${numbers.length > 1 ? "s" : ""}`;
            break;
          case "average":
            result = numbers.reduce((a, b) => a + b, 0) / numbers.length;
            resultDetailEl.textContent = `Average of ${numbers.length} value${numbers.length > 1 ? "s" : ""}`;
            break;
          case "product":
            result = numbers.reduce((a, b) => a * b, 1);
            resultDetailEl.textContent = `Product of ${numbers.length} value${numbers.length > 1 ? "s" : ""}`;
            break;
          case "min":
            result = Math.min(...numbers);
            resultDetailEl.textContent = `Minimum of ${numbers.length} value${numbers.length > 1 ? "s" : ""}`;
            break;
          case "max":
            result = Math.max(...numbers);
            resultDetailEl.textContent = `Maximum of ${numbers.length} value${numbers.length > 1 ? "s" : ""}`;
            break;
          default:
            result = NaN;
        }

        resultEl.textContent = formatNumber(result);
      }

      // Calculate on button click
      calcButton.addEventListener("click", calculate);

      // Auto-update on input & operation change
      inputs.forEach(input => {
        input.addEventListener("input", calculate);
      });
      operationSelect.addEventListener("change", calculate);

      // Initial state
      calculate();
    })();
