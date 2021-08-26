const cards = document.getElementById("cards");
const searchSpan = document.getElementById("search-span");
const selectEpisode = document.getElementById("select-list2");
const selectShow = document.getElementById("select-list1");
const searchBar = document.getElementById("searchBar");

const gotoBtn = document.getElementById("go-to");

let episodeArr = [];
let showsArr = [];

searchBar.addEventListener("keyup", e => {
    const searchStr = e.target.value.toLowerCase();

    let filteredEpisode = episodeArr.filter((episode) => {

        return (episode.summary.toLowerCase().includes(searchStr) || episode.name.toLowerCase().includes(searchStr));
    });


    displayEpisode(filteredEpisode);
})

gotoBtn.addEventListener("click", () => {

    if (gotoBtn.innerText === "Go to Episode List")
        loadEpisode();
    else
        loadShows();
})


selectEpisode.addEventListener("change", e => {
    let season, number;
    const selectedEpisode = episodeArr.filter(episode => {
        if (episode.season < 10)
            season = `0${ episode.season}`;
        else
            season = number.season;
        if (episode.number < 10)
            number = `0${ episode.number}`;
        else
            number = episode.number;
        const episodeStr = `S${season}E${number}-${episode.name}`;

        if (episodeStr === e.target.value)
            return episode;
    })


    displayEpisode(selectedEpisode)
})

selectShow.addEventListener("change", e => {

    const selectedShow = showsArr.filter(episode => {

        const episodeStr = `${episode.name}`;
        if (episodeStr === e.target.value)
            return episode;
    })



    displayShows(selectedShow)

})


const loadEpisode = async() => {
    try {
        const res = await fetch('https://api.tvmaze.com/shows/1/episodes');
        episodeArr = await res.json();
        displayEpisode(episodeArr);
        loadOptions(episodeArr)
    } catch (err) {
        console.error(err);
    }
};
const loadShows = async() => {
    try {
        const res = await fetch('https://api.tvmaze.com/shows');
        showsArr = await res.json();
        displayShows(showsArr);
        loadOptions(showsArr)

    } catch (err) {
        console.error(err);
    }
};

const displayShows = (episodes) => {
    gotoBtn.innerHTML = "Go to Episode List"

    const htmlString = episodes
        .map(episode => {
            return `
<div class="card-show">
   <h2 class="card-show-title">${episode.name}</h2>
<div class="card-container">
 <img src=${episode.image.medium}>  
 <div>
 ${episode.summary}
 </div>
 <div class="rating">
<h5>Rated: ${episode.rating.average}</h5>
<h5 >Genres: ${episode.genres}</h5>
<h5 >Status: ${episode.status}</h5>
</div>
</div>
</div>
`
        }).join('');

    selectEpisode.style.display = "none"
    cards.innerHTML = htmlString;
    searchSpan.innerHTML = `Displaying ${episodes.length}/${showsArr.length}`
}

const displayEpisode = (episodes) => {
    let season, number;
    selectEpisode.style.display = "block"
    gotoBtn.innerHTML = "Go to Show List"
    const htmlString = episodes
        .map(episode => {
            if (episode.season < 10)
                season = `0${ episode.season}`;
            else
                season = episode.season;
            if (episode.number < 10)
                number = `0${ episode.number}`;
            else
                number = episode.number;
            return `
<div class="card-episode">
    
    <img src=${episode.image.medium}>
    <h4 class="card-title">${
        episode.name}-S${season}E${number}</h4>
    <p>${episode.summary}</p>
</div>
`
        }).join('');
    searchSpan.innerHTML = `Displaying ${  episodes.length}/${episodeArr.length}`
    cards.innerHTML = htmlString;
}

function loadOptions(episodes) {
    let season, number;
    const select2String = episodes
        .map(episode => {
            if (episode.season < 10)
                season = `0${ episode.season}`;
            else
                season = episode.season;
            if (episode.number < 10)
                number = `0${ episode.number}`;
            else
                number = episode.number;
            return `
<option >
    S${season}E${number}-${episode.name}
</option>
`
        }).join('');
    const select1String = showsArr
        .map(episode => {
            return `
<option>
 ${episode.name}
</option>
`
        }).join('');
    selectEpisode.innerHTML = select2String
    selectShow.innerHTML = select1String
}


window.onload = loadShows();