function Boards () {
    this.boards = [];
    this.form = document.getElementById('form');
}

Boards.prototype.bindEvents = function() {
    this.form.addEventListener('submit', (e) => {
        e.preventDefault();
        const value = document.getElementsByClassName('add-item-input')[0].value;
        this.addBoard(value);
    });
}

Boards.prototype.addBoard = async function(value) {
    const userDetails = JSON.parse(window.sessionStorage.getItem('user-details'));
    const accessToken = window.sessionStorage.getItem('access-token');
    const params = {
        "description": "",
        "name": value,
        "owner_id": userDetails.id
    };

    if(userDetails.role.id === 105) {
        alert('Only admins can create the boards!');
        return;
    }

    try {
        const rawResponse = await fetch('http://localhost:8080/api/v1/boards',{
            method: 'POST',
            body: JSON.stringify(params),
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json;charset=UTF-8",
                authorization: `Bearer ${accessToken}`
            }
        });
	const result = await rawResponse.json();
	if(rawResponse.ok){
		this.getBoards();
	} else {
		const error = new Error();
		error.message = result.message || 'Something went wrong.';
	}
    } catch (e) {
        alert(`Error: ${e.message}`);
    }
}

Boards.prototype.getBoards = function() {

}

Boards.prototype.render = function() {

}

const instance = new Boards();
instance.render();
instance.bindEvents();