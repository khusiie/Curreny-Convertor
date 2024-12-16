const apiKey = "6ad7814f132e23a31b06db4b";
const BASE_URL = "https://v6.exchangerate-api.com/v6/6ad7814f132e23a31b06db4b/latest/USD";

const dropdowns = document.querySelectorAll(".dropdown select"); // Selecting dropdowns
const btn = document.querySelector("form button");
const fromCurr = document.querySelector("#from-select"); // Updated to use id
const toCurr = document.querySelector("#to-select"); // Updated to use id
const msg = document.querySelector(".msg");
const exchange  = document.querySelector("i");




window.addEventListener("load", ()=>{
   updateExchangeRate();

})

// Populating dropdowns
for (let select of dropdowns) {
  for (let currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;
    if (select.name === "from" && currCode === "USD") {
      newOption.selected = "selected";
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = "selected";
    }
    select.append(newOption);
  }

  // Event listener for updating flags
  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

// Function to update flags based on the selected currency
const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  if (img) { // Ensures image exists before updating src
    img.src = newSrc;
  }
};

// Button click handler for getting the exchange rate
btn.addEventListener("click",(evt) => {
  evt.preventDefault();
 updateExchangeRate();
});

const updateExchangeRate = async () => {
  let amount = document.querySelector(".amount input");
  let amtVal = parseFloat(amount.value);
  if (isNaN(amtVal) || amtVal < 1) {
    amtVal = 1;
    amount.value = "1";
  }

  // Construct the correct API URL
  const URL = `${BASE_URL}`;

  try {
    let response = await fetch(URL);
    if (!response.ok) {
      throw new Error("Failed to fetch exchange rates");
    }

    let data = await response.json();

    // Accessing the conversion rate for the selected target currency
    let rate = data.conversion_rates[toCurr.value.toUpperCase()];

    // Calculating the final converted amount
    let finalamount = amtVal * rate;

    // Displaying the result in the message
    msg.innerText = `${amtVal} ${fromCurr.value} = ${finalamount.toFixed(2)} ${toCurr.value}`;
    console.log(data);
  } catch (error) {
    console.error("Error fetching exchange rates:", error);
    msg.innerText = "Failed to fetch exchange rate. Please try again.";
  }
};
let temp;
exchange.addEventListener("click", () => {
  // Swap the selected currency values
  temp = toCurr.value;
  toCurr.value = fromCurr.value;
  fromCurr.value = temp;

  // Update flags for both dropdowns
  updateFlag(fromCurr);
  updateFlag(toCurr);
  updateExchangeRate();;
});

