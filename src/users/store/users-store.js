import { User } from "../models/user";
import { loadUsersByPage } from "../use-cases/load-users-by-page";

const state = {
    currentPage: 0,
    users: [],
}

const loadNextPage = async () => {
    const users = await loadUsersByPage(state.currentPage + 1);
    if (users.length === 0) return;

    state.currentPage += 1;
    state.users = users;
}

const loadPreviusPage = async () => {
    if (state.currentPage === 1) return;
    const users = await loadUsersByPage(state.currentPage - 1);
    state.currentPage -= 1;
    state.users = users;
}

/**
 * 
 * @param {User} updateUser 
 */
const onUserChange = async (updateUser) => {
    state.users = state.users.map(user => {
        let wasFound = false;
        if (user.id === updateUser.id) {
            wasFound = true;
            return updateUser;
        }
        return user;
    });

    if (state.users.length < 10 && !wasFound) {
        state.user.push(updateUser);
    }
}

const reloadPage = async () => {
    const users = await loadUsersByPage(state.currentPage);
    if (users.length === 0){
        await loadPreviusPage();
        return;
    };
    
    state.users = users;
}


export default {
    loadNextPage,
    loadPreviusPage,
    onUserChange,
    reloadPage,

    /**
     * 
     * @returns {User[]}
     */
    getUsers: () => [...state.users], //Spread operator is necesary here 'cause this is a object -> [], object in js pass by reference 

    /**
     * 
     * @returns {Number}
     */
    getCurrentPage: () => state.currentPage, //Spread operator is not necesary 'cause this is a primitive value -> 0
}