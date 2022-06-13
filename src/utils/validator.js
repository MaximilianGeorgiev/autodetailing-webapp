export const validateEmail = (email) => {
    if (!email || email === "") return false;
    if (!email.includes("@")) return false;
    if (email.split(".").length < 2) return false; // does not contain at least two dots

    // foo@gmail.com
    const domainPart = email.split("@")[1]; // gmail.com
    const endPart = domainPart.split(".");

    if (endPart.length < 2) return false; // dots should be after @
    if (endPart[0] === "" || endPart[1] === "") return false; // scenario: @abv. 

    const domainName = email.split(".")[0]; // gmail
    const endName = email.split(".")[1];

    return true;
};

export const validateUsername = (username) => {
    if (!username || username === "") return false;
    if (username.length < 5 || username.length > 20) return false;

    return true;
};

export const validatePassword = (password) => {
    if (!password || password === "") return false;
    if (password.length < 8 || password.length > 20) return false;

    if (/^\d+$/.test(password)) return false; // digit only password
    if (/^[a-z]+$/.test(password)) return false; // lower case text only
    if (/^[A-Z]+$/.test(password)) return false; // upper case text only

    // valid: mix of upper and lower cases and chars, with length not less than 8 and not greater than 20
    return true;
};

export const validatePhone = (phone) => {
    if (!phone || phone === "") return false;

    if ((!phone.startsWith("+359")) && (!phone.startsWith("0"))) return false;
    if (phone.length !== 13 && phone.length !== 10) return false;
    if (/^\+?\d+$/.test(phone)) return true; // may start with +; not numbers only

    return true;
};

export const validatePrice = (price) => {
    if (!price || price <= 0) return false;
    if (/[a-z]/.test(price)) return false;
    if (/[A-Z]/.test(price)) return false;

    return true;
};

export const validateDates = (dateOne, dateTwo) => {
    if (dateOne === null) return false;
    if (dateTwo === null) return false;

    const castDateOne = new Date(dateOne);
    const castDateTwo = new Date(dateTwo);

    if (castDateOne.getYear() > 2300 || castDateTwo.getYear() > 2300) return false;
    if (castDateOne.getMonth() > 12 || castDateTwo.getMonth() > 12) return false;
    if (castDateOne.getDay() > 31 || castDateTwo.getMonth() > 31) return false;

    if (castDateOne >= castDateTwo) return false;

    return true;
};