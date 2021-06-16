function Boards () {
    this.boards = [];
    this.form = document.getElementById('form');
    this.listing = document.getElementsByClassName('board-ul');
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

Boards.prototype.getBoards = async function() {
    const userDetails = JSON.parse(window.sessionStorage.getItem('user-details'));
    const accessToken = window.sessionStorage.getItem('access-token');

    try {
        const rawResponse = await fetch('http://localhost:8080/api/v1/boards',{
            method: 'GET',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json;charset=UTF-8",
                authorization: `Bearer ${accessToken}`
            }
        });
	const result = await rawResponse.json();
	if(rawResponse.ok){
		this.boards = result.boards;
		this.renderListing();
	} else {
		const error = new Error();
		error.message = result.message || 'Something went wrong.';
	}
    } catch (e) {
        alert(`Error: ${e.message}`);
    }
}

Boards.prototype.renderListing = function () {
    this.listing[0].innerHTML = "";
    if (this.boards.length === 0) {
      const template = `
                <h1 class="no-data">
                    No board items found.
                </h1>`;
      const element = document.createElement("div");
      element.innerHTML = template;
      this.listing[0].innerHTML = template;
      return;
    }
  
    this.boards.forEach((boardItem) => {
      const { checked, name, id, status } = boardItem;
  
      const template = `
            <li class="board-li" data-id=${id}>
              <div class="item-title">
                  <label>${name}</label> </input>
                  <input class="text-input editMode hide" type="text" value="${name}" />
              </div>
              <div class="item-actions">
                  <div class="edit-button">
                      Edit
                  </div>
                  <div class="delete-button">
                      Delete
                  </div>
              </div>
          </li>`;
      const element = document.createElement("div");
      element.innerHTML = template;
      this.listing[0].appendChild(element);
    });
};

Boards.prototype.render = function() {
    this.getBoards();
}

const instance = new Boards();
instance.render();
instance.bindEvents();