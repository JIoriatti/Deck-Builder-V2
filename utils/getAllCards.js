const getAllCards = (url, nextPageUrl, prevResponse = []) => {
    return fetch(url)
        .then(response =>response.json())
        .then(newResponse => {
            const response = [...prevResponse, ...newResponse.data];

            if (newResponse.next_page) {
                nextPageUrl = newResponse.next_page
                return getAllCards(url, nextPageUrl, response);
            }
            console.log(response);
            return response;
        }).catch(err => console.log(err));
}


export default getAllCards;