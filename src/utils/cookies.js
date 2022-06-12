export const getCookieByName = (name) => {
    if (!name) return "";

    try {
    return document.cookie
    .split('; ')
    .find(row => row.startsWith(`${name}=`))
    .split('=')[1]
    } catch (err) {
        return "";
    }
};