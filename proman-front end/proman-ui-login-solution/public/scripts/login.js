async function login(email, password) {
    const param = window.btoa(`${email.value}:${password.value}`);
    try {
        const rawResponse = await fetch('http://localhost:8080/api/v1/auth/login', {
            method: 'POST',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json;charset=UTF-8",
                authorization: `Basic ${param}`
            }
        });

        const result = await rawResponse.json();
        if(rawResponse.ok) {
            window.sessionStorage.setItem('user-details', JSON.stringify(result));
            window.sessionStorage.setItem('access-token', rawResponse.headers.get('access-token'));
            window.location.href = './boards.html';
        } else {
            const error = new Error();
            error.message = result.message || 'Something went wrong.';
        }
    } catch(e) {
        alert(`Error: ${e.message}`);
    }
}