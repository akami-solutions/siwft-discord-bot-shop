const createPayment = async (senderIwan, receiverIwan, amount, description = null, key, username) => {
    const apiUri = `https://api.siwft.org/v0/transaction/${senderIwan}/${receiverIwan}`;
    const body = {
        "amount": amount,
        "description": description
    }
    const headers = {
        "Content-Type": "application/json",
        "Authorization": key,
        "X-Auth-Username": username
    }
    // Send the request and check if the responsed JSON includes success: true
    // If it does, return true, otherwise return false
    const response = await fetch(apiUri, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body)
    });
    const responseJson = await response.json();
    console.log(responseJson);
    return {success: responseJson.success, id: responseJson["message"]["id"]};
}



module.exports = {
    createPayment
}