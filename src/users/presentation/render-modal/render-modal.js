import modalHtml from './render-modal.html?raw';
import { getUserById } from '../../use-cases/get-user-by-id';
import { User } from '../../models/user';
import './render-modal.css'

let modal, form;
let loadeUser = {};

/**
 * 
 * @param {String|Number} id 
 */
export const showModal = async (id) => {
    modal?.classList.remove('hide-modal');
    loadeUser = {};

    if (!id) return;

    const user = await getUserById(id);
    setFormValue(user);
}

export const hideModal = () => {
    modal?.classList.add('hide-modal');
    form?.reset(); // For reset form-modal inputs when we click out or click save button.
}


/**
 * 
 * @param {User} user 
 */
const setFormValue = (user) => {
    form.querySelector('[name="firstName"]').value = user.firstName;
    form.querySelector('[name="lastName"]').value = user.lastName;
    form.querySelector('[name="balance"]').value = user.balance;
    form.querySelector('[name="isActive"]').checked = user.isActive;
    loadeUser = user;
}


/**
 * 
 * @param {HTMLDivElement} element 
 * @param {(userLIke) => Promise<void>} callback
 */
export const renderModal = (element, callback) => {
    if (modal) return;

    modal = document.createElement('div');
    modal.innerHTML = modalHtml;
    modal.className = 'modal-container hide-modal';
    form = modal.querySelector('form');

    modal.addEventListener('click', (event) => {
        if (event.target.className === 'modal-container') {
            hideModal();
        };
    });

    form.addEventListener('submit', async (event) => {

        event.preventDefault(); // This is for not refresh when in the form (modal) we click on sabe button. 
        const formData = new FormData(form);// We catch the key-value data from form-modal when click save button. 
        
        if(!formData.get('isActive'))
            formData.append('isActive', 'off');
        
        const userLike = { ...loadeUser };

        for (const [key, value] of formData) {
            //? Here I convert the string value of balance to number value; balance is a number variable not a string.
            if (key === 'balance') {
                userLike[key] = +value;
                continue;
            }

            //? Here I convert the string value of isActive to booleam value; isActive is a bool variable not a string;
            if (key === 'isActive') {
                userLike[key] = (value === 'on' ) ? true : false;
                continue;
            }

            userLike[key] = value;
        }

        await callback(userLike);
        hideModal();

    });

    element.append(modal);
}