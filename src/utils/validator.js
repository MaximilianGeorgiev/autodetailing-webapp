export const validateEmail = (email) => {
    if (!email || email === "") return false;
    if (!email.includes("@")) return false;
    if (email.split(".").length - 1 < 2) return false; // does not contain at least two dots

    //foo@gmail.com
    const name = email.split("@")[0];
    const domainPart = email.split("@")[1]; // gmail.com
    const domainHost = domainPart.split(".")[0] // gmail
    const domainEnd = domainPart.split(".")[1]; // com

    if (name.length < 2) return false;
    if (!domainPart.includes(".")) return false;
    if (domainHost.length < 2) return false;
    if (domain.length < 2) return false;

    return true;
};