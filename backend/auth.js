async function authFetch(url, options = {}) {
    const token = localStorage.getItem("token");
    
    options.headers = {
        //SPREAD HEADER
        //WE USE A SPREAD HEADER SO WE HAVE MULTIPLE HEADERS
        //ONE FOR THE ORIGINAL JSON CONTENT-TYPE
        //AND ONE FOR AUTHENTICATION
        //TLDR: IT ADDS AUTH TO OUR FETCH REQUEST
        ...options.headers,
        "Authorization": `Bearer ${token}`
    }

    return fetch(url, options);
}