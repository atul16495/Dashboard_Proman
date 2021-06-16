async function signUpSubmit(firstName, lastName, email, password, mobile) {
    const params = {
        email_address: email.value,
        first_name: firstName.value,
        last_name: lastName.value,
        mobile_number: mobile.value,
        password: password.value
    }

    try {
        const rawResponse = await fetch('http://localhost:8080/api/v1/signup', {
            body: JSON.stringify(params),
            method: 'POST',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json;charset=UTF-8"
            }
        });

        const result = await rawResponse.json();

        if(rawResponse.ok) {
            window.location.href = './login.html';
        } else {
            const error = new Error();
            error.message = result.message || 'Something went wrong.';
            throw error;
        }
    } catch(e) {
        alert(`Error: ${e.message}`);
    }
}