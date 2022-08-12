# URL Shortener Microservice

## API

* /api/shorturl
	* POST {url: URL}
	* **returns** {original\_url: URL, short\_url : NUMBER }

* /api/shorturl/:number
	* GET :number = short url number
	* **returns** {original\_url: URL, short\_url : NUMBER }
