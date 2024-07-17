let myHeaders = new Headers();
myHeaders.append("apikey", "fca_live_MUUpsdmDpf0bA2n7OioMn6oRqOJttz3gvfKQGeWK");

let requestOptions = {
  method: 'GET',
  redirect: 'follow',
  headers: myHeaders
};

// getting currencies base on the value selected in the boxes
const baseCurrs = document.getElementById('base-currency')
const targCurrs = document.getElementById('target-currency')

// getting the amount from the amount selector on the page and using the converted amount box to place the value in html page
const amountInput = document.getElementById('amount');
const convertedAmount = document.getElementById('converted-amount');

//getting the historical rate using the button and placing it in the correct container rabfter the function is run
const historyRate = document.getElementById('historical-rates')
const histData = document.getElementById('historical-rates-container')

const favBtn = document.getElementById('save-favorite')
const favPairs = document.getElementById('favorite-currency-pairs')

//populating the Choose a currency element
const popCurrs = () => {
    fetch("https://api.freecurrencyapi.com/v1/latest?", requestOptions)
    .then(response => response.json())
    .then(result => {
        let res = Object.keys(result.data);
        res.forEach((el) => {
            baseCurrs.innerHTML += `<option value=${el}>${el}</option>`;
            targCurrs.innerHTML += `<option value=${el}>${el}</option>`;
        });
    })
    .catch(error => console.log('error', error));
}

// converting the amounts using the amount/2 currency fields 
const currConvr = () => {
    let amount = amountInput.value;
    if (targCurrs.value === 'Choose a Currency') {
        return;
    }
    fetch(`https://api.freecurrencyapi.com/v1/latest?base_currency=${baseCurrs.value}&currencies=${targCurrs.value}`, requestOptions)
        .then(response => response.json())
        .then(result => {
            const rate = result.data[targCurrs.value];
            const convertedAmnt = amount * rate;
            convertedAmount.textContent = convertedAmnt.toFixed(2);
        })
        .catch(error => console.log('error', error));
};

// retrieving the historical rate base on a single date and returning the value to the user
const histRates = () => {
    let date = '2021-12-31';
    if (targCurrs.value === 'Choose a Currency') {
        return;
    }
    fetch(`https://api.freecurrencyapi.com/v1/historical?date=${date}&base_currency=${baseCurrs.value}&currencies=${targCurrs.value}`, requestOptions)
        .then(response => response.json())
        .then(result => {
            const rates = result.data[date];
            if (rates) {
                const rate = rates[targCurrs.value]
                histData.innerHTML = `On ${date}, 1 ${baseCurrs.value} was equal to ${rate.toFixed(2)} ${targCurrs.value}`;
            } else {
                histData.innerHTML = `No such historical rate exists for this date`
            }
        })
        
        .catch(error => console.log('error', error));
}

favBtn.addEventListener("click", () => {
    const baseCurr = baseCurrs.value;
    const targCurr = targCurrs.value;
    if (baseCurr === 'Choose a Currency' || targCurr === 'Choose a Currency'){
        return;
    } else {
        
        fetch('http://localhost:3000/favs',{
            method:'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({baseCurr,targCurr})
        })
        favPairs.innerHTML += `<button class="favHistBtn">${baseCurr} > ${targCurr} </button>`
    }
})

const getFavs = () => {
    fetch('http://localhost:3000/favs')
    .then(response => response.json())
    .then(result => {
        const favs = result;
        favPairs.innerHTML = ''; 

        favs.forEach(objects => {
            let base = objects['baseCurr'];
            let targ = objects['targCurr'];

            const favButton = document.createElement("button");
            favButton.className = "favHistBtn";
            favButton.textContent = `${base} > ${targ}`;
            favButton.onclick = () => {
                baseCurrs.value = base;
                targCurrs.value = targ
                fetch(`https://api.freecurrencyapi.com/v1/latest?base_currency=${base}&currencies=${targ}`, requestOptions)
                    .then(response => response.json())
                    .then(result => {
                        const rate = result.data[targ];
                        const amount = document.getElementById('amount').value;
                        const convertedAmnt = amount * rate;
                        convertedAmount.textContent = convertedAmnt.toFixed(2);
                    })
                    .catch(error => console.log('Error fetching exchange rate:', error));
            };

            favPairs.appendChild(favButton);
        });
    })
    .catch(error => console.error('Error fetching favorite pairs:', error));
};


                // console.log(favs)

// Using event listeners to call the functions and on click or once the page is loaded
document.addEventListener('DOMContentLoaded',popCurrs(),getFavs())

historyRate.addEventListener('click', histRates)
amountInput.addEventListener('input', currConvr);
baseCurrs.addEventListener('change', currConvr);
targCurrs.addEventListener('change', currConvr);


document.getElementById('historical-rates').addEventListener('click', histRates);
