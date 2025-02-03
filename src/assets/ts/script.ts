type country = {
    flags: {
        png: string,
        svg: string,
        alt: string
    }
    name: {
        common: string,
        official: string
    }
    population: number
}

let allCountries : country[] = [];

async function loadData() {
    try{
        const countriesResponse = await fetch("https://restcountries.com/v3.1/all?fields=name,flags,population");
        const countriesData = await countriesResponse.json();

        allCountries = sortAlphabetically(countriesData);
        renderFlags(allCountries)
    }
    catch(error) {
        console.log("An error has occurred: " + error)

        const errorMessageElem = document.querySelector<HTMLParagraphElement>("#errorMessage")
        if(errorMessageElem) {
            errorMessageElem.style.display = "block";
            errorMessageElem.textContent = `An error has occurred: ${error}`
        }
    } 
}
loadData()


// ================ render all countries ================

function renderFlags(data : country[]) {
    const flagSpace = document.querySelector("#flagSpace");

    if(flagSpace) {
        flagSpace.innerHTML = "";

        data.forEach((elem) => {
            const newFlagWrapper = document.createElement("div")
            flagSpace.appendChild(newFlagWrapper);
    
            const newFlag = document.createElement("img")
            newFlag.setAttribute("src", elem.flags.svg)
            newFlagWrapper.appendChild(newFlag)

            const newCountryName = document.createElement("p")
            newCountryName.innerHTML = `<b>${elem.name.common}</b> <br> 
            (${elem.name.official}) <br><br>
            Population: ${elem.population.toLocaleString()}`
            newFlagWrapper.appendChild(newCountryName)
        })

        if(flagSpace.innerHTML === "") {
            flagSpace.innerHTML = `<p>No matches found :(</p>`
        }
    }
}

// ================ filter on input, render new ================

function filterFlags(data : country[], searchString : string) {
    return data.filter((elem) => {
        return elem.name.common.toLowerCase().includes(searchString.toLowerCase()) || elem.name.official.toLowerCase().includes(searchString.toLowerCase())
    })
}

const search = document.querySelector<HTMLInputElement>("#search")
if(search) {
    search.addEventListener("input", () => {
        const searchInput = search.value;

        const filteredCountries = filterFlags(allCountries, searchInput)
        renderFlags(filteredCountries)
    })
}

// ================ sort by population when clicked ================

let sortOrderPop : "asc" | "desc" = "desc";

function sortByPopulation(data : country[]) {
    if(sortOrderPop === "asc") {
        return data.sort((a,b) => a.population - b.population)
    } else {
        return data.sort((a,b) => b.population - a.population)
    }
}

const sortByPopBtn = document.querySelector("#sortByPopBtn");
if(sortByPopBtn) {
    sortByPopBtn.addEventListener("click", () => {
        sortOrderPop = sortOrderPop === "asc" ? "desc" : "asc"

        const sortedByPop = sortByPopulation(allCountries)
        renderFlags(sortedByPop)

        sortByPopBtn.textContent = sortOrderPop === "desc" ? "Sort by population ↑" : "Sort by population ↓"
    })
}

// ================ sort alphabetically ================

let sortOrderAlpha : "asc" | "desc" = "asc";

function sortAlphabetically(data : country[]) {
    if(sortOrderAlpha === "asc") {
        return data.sort((a,b) => a.name.common.localeCompare(b.name.common))
    } else {
        return data.sort((a,b) => b.name.common.localeCompare(a.name.common))
    }
}

const sortByAlphaBtn = document.querySelector("#sortByAlphaBtn");
if(sortByAlphaBtn) {
    sortByAlphaBtn.addEventListener("click", () => {
        sortOrderAlpha = sortOrderAlpha === "desc" ? "asc" : "desc"

        const sortedByAlpha = sortAlphabetically(allCountries)
        renderFlags(sortedByAlpha)

        sortByAlphaBtn.textContent = sortOrderAlpha === "desc" ? "Sort alphabetically ↑" : "Sort alphabetically ↓"
    })
}