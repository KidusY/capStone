'use strict'

const api = '2ce4ead64f6aba19ba40cdbd3a3963c6';
const urlSearch = 'https://developers.zomato.com/api/v2.1/search';
const urlSearchId = 'https://developers.zomato.com/api/v2.1/restaurant';
const urlSearchLocation = 'https://developers.zomato.com/api/v2.1/locations';
const urlDiscover = 'https://developers.zomato.com/api/v2.1/collections';
const option = {
	headers: new Headers({
		'user-key': api
	})
};
//render results for search restaurant by name
const renderHtml = (restaurants) => {
	console.log(restaurants);

	for (const restaurant of restaurants) {
		$('.results').append(`
		
			<div class = resultsBox>
				<img src="${restaurant.restaurant.featured_image}" alt="" width=30%>				
				<div class="description">
					<h1>${restaurant.restaurant.name}</h1>
					<address>			
					<a href="https://maps.google.com/?q=${restaurant.restaurant.location.address}">
					<h5>${restaurant.restaurant.location.address}</h5>
					<h6>${restaurant.restaurant.location.locality}</h6>
					</a>
					</address>	
				</div>
				<p> ${restaurant.restaurant.timings}</p>
			</div>

		
		
		
		
		
		
		
		`);
	}
};
const renderHtmlDiscover = (restaurants) => {
	$('.results').empty();
	renderHtml(restaurants);
};
//search for restaurants by name
const getDataByName = (restaurantSearch, cityName) => { console.log(restaurantSearch, cityName);
	getLocation(cityName).then(cityData => {
		const params = {};
		let newUrl;
		params.q = restaurantSearch;
		params.entity_type = "city"
		params.entity_id = cityData.location_suggestions[0].city_id;
		const searchParams = $.param(params);
		newUrl = `${urlSearch}?${searchParams}`;
		fetch(newUrl, option).then((res) => res.json()).then((resjson) => renderHtml(resjson.restaurants));
	})
};



//get location by name and passes the city Id to discover
const getLocation = (citySearch) => {
	const params = {};
	let newUrl;
	params.query = citySearch;
	const searchParams = $.param(params);
	newUrl = `${urlSearchLocation}?${searchParams}`;
	return fetch(newUrl, option)
		.then((res) => res.json())
	//passes city id to discover
	// .then((resjson) => discover(resjson.location_suggestions[0].city_id));
};

//get info by restaurant id
const getDataById = (id) => {
	const params = {};
	let newUrl;
	params.res_id = id;
	const searchParams = $.param(params);
	newUrl = `${urlSearchId}?${searchParams}`;
	fetch(newUrl, option).then((res) => res.json()).then((resjson) => resjson);
};

//get different restaurants by city Id
const discover = (cityName) => {
	getLocation(cityName).then(cityData => {
		console.log(cityData);
		const params = {};
		let newUrl;
		params.city_id = cityData.location_suggestions[0].city_id
		params.entity_type = cityData.location_suggestions[0].entity_type
		const searchParams = $.param(params);
		newUrl = `${urlDiscover}?${searchParams}`;
		//collections obj
		fetch(newUrl, option).then((res) => res.json()).then((resjson) => render(resjson.collections));
	})
};

const render = (collections) => {
	$(".collections").show()
	for (const collection of collections) {
		console.log(collection)
		$(".collections").append(`<div data-target=${collection.collection.collection_id}>
		<h2>${collection.collection.title}</h2>
		<p>${collection.collection.description}</p>
		<img src="${collection.collection.image_url}">
		<p>${collection.collection.url}</p>
		</div>`)
	}
}

const collections = (collections) => {
	const params = {};
	let newUrl;
	const searchParams = $.param(params);
	newUrl = `${urlSearch}?${searchParams}`;
	fetch(newUrl, option).then((res) => res.json()).then((resjson) => (resjson.collections));
};



//events
const events = () => {
	$('.widget1').click(function (e) {
		e.preventDefault();
		$('main section').hide();
		$('.searchRestaurant').show();
	});
	$('.widget2').click(function (e) {
		e.preventDefault();
		$('main section').hide();
		$('.search').show();
	});
	$('.collections').on("click", "div", function (e) {
		e.preventDefault(); collections($(this)[0].dataset.target)

	})
	//returns to landing page on h1 click
	$('.searchRestaurant', 'search').on("click", "h1", function (e) {
		e.preventDefault();
		$('.landingPage').show();
	})
};

function main() {
	events();
	//gets info for search restaurant by name
	$('.searchRestaurantForm').on('submit', (e) => {
		e.preventDefault();
		const restaurantSearch = $('#restaurantSearch').val().trim();
		const citySearch = $('#citySearchRestaurant').val().trim();
		getDataByName(restaurantSearch, citySearch);
		$('.results').show();
	});

	//discover restaurants
	$('.discoverForm').on('submit', (e) => {
		e.preventDefault();
		const citySearch = $('#citySearch').val().trim();
		discover(citySearch);
	});

	//after selecting a restaurant, search info by Id
}

$(main);
