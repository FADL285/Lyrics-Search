const form = document.getElementById('form');
const search = document.getElementById('search');
const result = document.getElementById('result');
const more = document.getElementById('more');

const apiURL = 'https://api.lyrics.ovh';

// !Functions
// search songs function
async function searchSongs(term) {

  // fetch(`${apiURL}/suggest/${term}`)
  //   .then(response => response.json())
  //   .then(data => showData(data))

  const res = await fetch(`${apiURL}/suggest/${term}`);
  const data = await res.json();
  showData(data);
}

// Show data in DOM
function showData(data) {
  result.innerHTML = `
  <ul class="songs">
    ${data.data.map((song) => {
      return `
      <li>
        <span><strong>${song.artist.name}</strong> - ${song.title}</span>
        <button class="btn" data-artist="${song.artist.name}" data-songtitle="${song.title}">Get Lyrics</button>
      </li>
      `;
    }).join('')}
  </ul>
  `;

  if (data.prev || data.next) {
    more.innerHTML = `
    ${data.prev ? `<button class='btn' onclick="getMoreSongs('${data.prev}')">Prev</button>` : ''}
    ${data.next ? `<button class='btn' onclick="getMoreSongs('${data.next}')">Next</button>` : ''}
    `;
  } else {
    more.innerHTML = ''
  }
}

// Get prev and next songs
async function getMoreSongs(url) {
  console.log(url);
  const res = await fetch(`https://cors-anywhere.herokuapp.com/${url}`);
  const data = await res.json();

  showData(data);
}

// Get lyrics for song
async function getLyrics(artist, songTitle) {
  const res = await fetch(`${apiURL}/v1/${artist}/${songTitle}`);
  const data = await res.json();

  const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>');

  result.innerHTML = `<h2><strong>${artist}</strong> - ${songTitle}</h2>
  <p>${lyrics}</p>`;

  more.innerHTML = '';
}



// !Event Listeners
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const searchTerm = search.value.trim();

  if (searchTerm) {
    searchSongs(searchTerm);
  } else {
    alert('Please type a search term')
  }

  search.value = '';
})

// Get lyrics button click
result.addEventListener('click', e => {
  const clickedEl = e.target;

  if (clickedEl.tagName.toLowerCase() === 'button') {
    const artist = clickedEl.getAttribute('data-artist');
    const songTitle = clickedEl.getAttribute('data-songtitle');

    getLyrics(artist, songTitle);
  }
});