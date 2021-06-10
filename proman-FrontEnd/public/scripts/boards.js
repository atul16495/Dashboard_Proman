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

    this.listing[0].addEventListener('click', (event) => {
        if(event.target.classList.contains('edit-button')) {
            if(event.target.closest('.board-li').querySelector('.editMode').classList.contains('hide')) {
                event.target.closest('.board-li').querySelector('.editMode').classList.remove('hide');
                event.target.closest('.board-li').querySelector('label').classList.add('hide');
            } else {
                event.target.closest('.board-li').querySelector('.editMode').classList.add('hide');
                event.target.closest('.board-li').querySelector('label').classList.remove('hide');
            }
        }

        if(event.target.classList.contains('delete-button')) {
            const id = event.target.closest('.board-li').dataset.id;
            this.deleteBoard(id);
        }

    });

    this.listing[0].addEventListener('change', (event) => {
        if(event.target.classList.contains('editMode')) {
            const value = event.target.value;
            const id = event.target.closest('.board-li').dataset.id;
            this.updateBoards(id, value);
        }
    })
}

Boards.prototype.deleteBoard = async function(id) {
    const userDetails = JSON.parse(window.sessionStorage.getItem('user-details'));
    const accessToken = window.sessionStorage.getItem('access-token');

    if(userDetails.role.id === 105) {
        alert('Only admins can delete the boards!');
        return;
    }

    try {
        const rawResponse = await fetch(`http://localhost:8080/api/v1/boards/${id}`, {
            method: 'DELETE',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json;charset=UTF-8",
                authorization: `Bearer ${accessToken}`
            }
        });

        if(rawResponse.ok) {
           this.getBoards();
        } else {
            const error = new Error();
            error.message = 'Something went wrong.';
            throw error;
        }
    } catch (e) {
        alert(`Error: ${e.message}`);
    }
}

Boards.prototype.updateBoards = async function(id, value) {
    const userDetails = JSON.parse(window.sessionStorage.getItem('user-details'));
    const accessToken = window.sessionStorage.getItem('access-token');
    const params = {
        "description": "",
        "name": value,
        "owner_id": userDetails.id
    };

    if(userDetails.role.id === 105) {
        alert('Only admins can edit the boards!');
        return;
    }

    try {
        const rawResponse = await fetch(`http://localhost:8080/api/v1/boards/${id}`, {
            method: 'PUT',
            body: JSON.stringify(params),
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json;charset=UTF-8",
                authorization: `Bearer ${accessToken}`
            }
        });

        if(rawResponse.ok) {
           this.getBoards();
        } else {
            const error = new Error();
            error.message = 'Something went wrong.';
            throw error;
        }
    } catch (e) {
        alert(`Error: ${e.message}`);
    }
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
		this.boards = result.boards.filter(({status}) => {
            	return status !== 'DELETED';
        });
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