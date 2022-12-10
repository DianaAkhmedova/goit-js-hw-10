import debounce from 'lodash.debounce';
import { Notify } from 'notiflix';
import API from './js/fetch-api';
import './css/styles.css';

const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', debounce(hundleInput, DEBOUNCE_DELAY));

function renderCountryList(countries) {
  const markup = countries
    .map(
      ({ flags, name }) => `<li>
      <img src="${flags.svg}" alt="item.name.official" width="60" height="40">  
<p>${name.official}</p>
</li>`
    )
    .join('');

  clearMarkup();
  refs.countryList.insertAdjacentHTML('beforeend', markup);
}

function renderCountryInfo(country) {
  const markup = country
    .map(
      ({
        flags,
        name,
        capital,
        population,
        languages,
      }) => `<div class="country-name">
    <img src="${flags.svg}" alt="item.name.official" width="60" height="40">
    <h2>${name.official}</h2>
    </div>
    <p><span class="description">Capital:</span>${capital}</p>
    <p><span class="description">Population:</span>${population}</p>
    <p><span class="description">Languages:</span>${Object.values(
      languages
    ).join(', ')}</p>`
    )
    .join('');

  clearMarkup();
  refs.countryInfo.innerHTML = markup;
}

function onFetchError() {
  clearMarkup();
  Notify.failure('Oops, there is no country with that name');
}

function hundleInput(e) {
  const name = e.target.value;

  if (name.trim() === '') {
    clearMarkup();
    return;
  }

  API.fetchCountries(name)
    .then(data => {
      if (data.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (data.length >= 2 && data.length <= 10) {
        renderCountryList(data);
      } else if (data.length === 1) {
        renderCountryInfo(data);
      }
    })
    .catch(onFetchError);
}

function clearMarkup() {
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
}
