var imagePoster = 'http://image.tmdb.org/t/p/w300';
var movieLink = 'https://www.themoviedb.org/movie/';
var api_key = '7720abdd4480de10abbc545ec1677719';
var ajax_url = 'https://api.themoviedb.org/3/search/movie';
var ajax_movie_data_url = 'https://api.themoviedb.org/3/movie';
var container = document.getElementById('container-res');
var divRes;
var input = document.getElementById("search");
var button = document.getElementById("searchBtn");
var h5 = document.getElementById("ne-postoji");

//addEventListener za button i za input(keypress) pozivanje funckije CALL
document.getElementById("search").addEventListener("keypress", call);

document.getElementById("searchBtn").addEventListener("click", call);

//funckija za slanje XMLHttpRequest-a u okviru koje se poziva funkcija showMovie
function call(e) {
    if (e.key === "Enter" || e.type === "click") {
        var xhr = new XMLHttpRequest();
        xhr.addEventListener("load", showMovie);
        xhr.open("GET", ajax_url + "?api_key=" + api_key + "&query=" + document.getElementById("search").value);
        xhr.send();
    }
}

//funckija showMovie
function showMovie() {
    container.innerHTML = "";
    h5.textContent = "";

    if (document.getElementById("divRes" !== null)) {
        resetHtml();
    }

    var obj = JSON.parse(this.responseText);
    console.log(obj);
    
    divRes = document.createElement("div");
    divRes.setAttribute('id', 'divRes');
    divRes.setAttribute('class', 'result row');
    container.appendChild(divRes);
    
    if (obj.total_results > 0) {
        for (i = 0; i < obj.results.length; i++) {
            var divImg = document.createElement("div");
            divImg.setAttribute("class", "card col-md-4 col-sm-6 col-xl-2 col-lg-3 col-12");
            var movieDate = new Date(obj.results[i].release_date);
            var releaseYear = movieDate.getFullYear();

            //nacin broj 1 za godinu filma
            //var releaseYearString = releaseYear ? " (" + releaseYear + ")" : "";

            //nacin broj 2 za godinu filma 
            var releaseYearString;
            if (releaseYear) {
                releaseYearString = " (" + releaseYear + ")";
            } else {
                releaseYearString = "";
            }
            //kad ima poster_path
            if (obj.results[i].poster_path) {
                var oneImg =
                    '<div onclick="showMovieData(' + obj.results[i].id + ')" class="movieCard" data-toggle="modal" data-target="#movieModal"><img class="card-img-top" src="' + imagePoster + obj.results[i].poster_path + '" alt="Card image" style="width:100%">' +
                    '<div class="card-body">' +
                    '<h4 class="card-title">' + obj.results[i].title + releaseYearString + ' <br><small>Ocena ' + obj.results[i].vote_average + '</small></h4>' +
                    '</div></div>';
            }
            //kad nema poster_path
            else {
                var oneImg =
                    '<div onclick="showMovieData(' + obj.results[i].id + ')" class="movieCard" data-toggle="modal" data-target="#movieModal"><img class="card-img-top" src="' + "noPosterImage.jpg" + '" alt="Card image" style="width:100%">' +
                    '<div class="card-body">' +
                    '<h4 class="card-title">' + obj.results[i].title + releaseYearString + ' <br><small>Ocena ' + obj.results[i].vote_average + '</small></h4>' +
                    '</div></div>';
            }

            divImg.innerHTML = oneImg;
            divRes.appendChild(divImg);

        }
    }
    else {
        //kada ne postoji trazeni film ili je pogresno ukucano 
        noResults();
    }
}

//funkcija za otvaranje modala koji je gore pozvan preko klika na sliku
function showMovieData(id) {

    $.get(ajax_movie_data_url + "/" + id + "?api_key=" + api_key, function (obj) {

        //nacin broj 1 za backdrop_path
        //var pictureHolder = obj.backdrop_path ? imagePoster + obj.backdrop_path : "placeholder.png";

        //nacin broj 2 za backdrop_path
        var pictureHolder;
        if (obj.backdrop_path) {
            pictureHolder = imagePoster + obj.backdrop_path;
        }
        else {
            pictureHolder = "placeholder.png";
        }

        $("#modalHeader").text(obj.original_title);
        $("#modalBody").html('<img class="card-img-top" src="' + pictureHolder
            + '" alt="Card image" style="width:100%"><p>' + obj.overview + '</p><p style="text-align: right;"><a href="' + movieLink + obj.id + '" target="_blank">Opširnije...</a></p>');
    });
}


function emptyModal() {
    $("#modalHeader").text("");
    $("#modalBody").text("");
}

function noResults() {
    console.log(h5);
    h5.style.visibility = "visible";
    h5.innerHTML = "Željeni film nije pronađen, pokušajte ponovo.";
}

function resetHtml() {
    divRes.parentNode.removeChild(divRes);
    h5.style.visibility = "hidden";
    h5.textContent = "";
}


