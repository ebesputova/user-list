let userList = [
  { id: '1', name: 'Елена Иванова', phone: '+38(063)457-88-99' },
  { id: '2', name: 'Ольга Сидорова', phone: '+38(063)457-89-00' },
  { id: '3', name: 'Олег Кузнецов', phone: '+38(067)431-89-05' },
  { id: '4', name: 'Сергей Жуков', phone: '+38(099)431-89-05' },
  { id: '5', name: 'Иван Шевченко', phone: '+38(099)341-79-06' },
];

function addPhoneMask(element) {
  addPhoneMask.phoneMask.mask(element);
}
addPhoneMask.phoneMask = new Inputmask({ mask: '+38(999) 999-99-99' });

const userListElem = document.querySelector('.usersList');
const newUserForm = document.querySelector('.newUser__form');
addPhoneMask(newUserForm.elements.phone);
newUserForm.addEventListener('submit', handleNewUserSubmit);

let userItemElements = userList.map(createUserItemElem);
userListElem.append(...userItemElements);
document.body.append(userListElem);

function handleNewUserSubmit(e) {
  e.preventDefault();
  let name = e.target.name.value.trim();
  let phone = e.target.phone.value;
  let id = uuidv4();
  if (!name || !phone) {
    return;
  }
  freezeInteraction();
  /* Требуется запрос на сервер - добавление нового пользователя 
    fetch('someserver/add', {
        method: 'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ id, name, phone })
    }).then(
          response => {
            if(!response.ok) throw new Error('Возникла ошибка');
            return response.json();
          }
    ).then(data=>addNewUserItem(data)).catch((error)=>alert(error.message))
 */
  setTimeout(() => addNewUserItem({ id, name, phone }), 2000);
}

function createUserItemElem({ id, name, phone }) {
  let userItemElem = document.createElement('li');
  userItemElem.className = 'userList__item';
  userItemElem.dataset.id = id;
  userItemElem.innerHTML = `<div class="user__name">${name}</div><div class="user__phone">${phone}</div>
                            <button class="btn btn--edit actionBtn" data-action="edit">Редактировать</button>
                            <button class="btn btn--delete actionBtn" data-action="delete">Удалить</button>`;

  userItemElem.addEventListener('click', handleUserBtnsClick);
  return userItemElem;
}

function handleUserBtnsClick({ target, currentTarget: userItem }) {
  if (target === userItem) return;
  let action = target.dataset.action;
  let userId = userItem.dataset.id;
  console.log(userId);
  switch (action) {
    case 'edit':
      userItem.innerHTML = '';
      let user = userList.find(({ id }) => id === userId);
      let editForm = createUserEditForm(user);
      userItem.append(editForm);
      userItem.removeEventListener('click', handleUserBtnsClick);
      break;
    case 'delete':
      /* Требуется запрос на сервер - удаление пользователя
            fetch('someserver/edit/{userId}', {method: 'DELETE')}).then(
                response => {
                    if(!response.ok) throw new Error('Возникла ошибка');
                    return response.json();
                }).then(
                user => {
                    userItem.remove();
                    userItem.removeEventListener('click', handleDeleteBtnsClick);
                }
            ).catch((error)=>alert(error.message))
        */
      userItem.remove();
      userItem.removeEventListener('click', handleUserBtnsClick);
      break;
  }
}

function createUserEditForm({ id, name, phone }) {
  let userForm = document.createElement('form');
  userForm.className = 'user__form';
  userForm.innerHTML = `<input type="hidden" name="id" class="user__input" value="${id}">
                        <input type="text" name="name" class="user__input" value="${name}">
                        <input type="text" name="phone" class="user__input" value="${phone}">
                        <button class="btn btn--submit" type="submit">Сохранить</button>
                        <button class="btn btn--refresh" type="button" data-action="clear">Очистить</button>`;
  addPhoneMask(userForm.phone);
  userForm.addEventListener('submit', handleEditFormSubmit);
  userForm.addEventListener('click', handleEditFormReset);
  return userForm;
}

function handleEditFormSubmit(e) {
  e.preventDefault();
  let { target: form } = e;
  let userId = form.id.value;
  let updateUserData = {
    id: userId,
    name: form.name.value,
    phone: form.phone.value,
  };
  /* Требуется запрос на сервер - обновление данных о пользователе 
    fetch('someserver/edit/{id}', {
        method: 'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ id, name, phone })
    }).then(
          response => {
            if(!response.ok) throw new Error('Возникла ошибка');
            return response.json();
          }
    ).then(
          updateUserData => {
            let index = userList.findIndex(({ id }) => userId === id);
            userList[index] = updateUserData;
            let updateUser = createUserItemElem(updateUserData);
            form.replaceWith(updateUser);
            form.removeEventListener('submit', handleEditFormSubmit);
            form.removeEventListener('click', handleEditFormReset);
          }
    ).catch((error)=>alert(error.message))
 */
  let index = userList.findIndex(({ id }) => userId === id);
  userList[index] = updateUserData;
  let updateUser = createUserItemElem(updateUserData);
  form.replaceWith(updateUser);
  form.removeEventListener('submit', handleEditFormSubmit);
  form.removeEventListener('click', handleEditFormReset);
}

let handleEditFormReset = ({ target, currentTarget: form }) => {
  if (target.dataset.action === 'clear') {
    clearForm(form);
  }
};

function clearForm(form) {
  let fields = form.querySelectorAll('input');
  for (let field of fields) {
    switch (field.type) {
      case 'text':
        field.value = '';
        break;
      case 'radio':
      case 'checkbox':
        fields.checked = false;
    }
  }
}

function freezeInteraction() {
  disableForm();
  disableEditButtons();
}

function unfreezeInteraction() {
  enableForm();
  enableEditButtons();
}

function disableForm() {
  newUserForm[0].disabled = true;
}

function enableForm() {
  newUserForm[0].disabled = false;
}

function disableEditButtons() {
  let buttons = document.querySelectorAll('.actionBtn');
  for (let item of buttons) {
    item.disabled = true;
  }
}

function enableEditButtons() {
  let buttons = document.querySelectorAll('.actionBtn');
  for (let item of buttons) {
    item.disabled = false;
  }
}

function addNewUserItem(newUser) {
  unfreezeInteraction();
  clearForm(newUserForm);
  userList = [newUser, ...userList];
  let newUserElem = createUserItemElem(newUser);
  updateUserList(newUserElem);
}

function updateUserList(newUserItem) {
  userListElem.prepend(newUserItem);
}
