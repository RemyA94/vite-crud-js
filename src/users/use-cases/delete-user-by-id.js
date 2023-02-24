
/**
 * 
 * @param {Number|String} id 
 */
export const deleteUserById = async (id) => {
    const url = `${import.meta.env.VITE_BASE_URL}/users/${id}`;
    const res = await fetch(url, {
        method: 'DELETE',
    });
    const deleteUserResult = await res.json();
    console.log(deleteUserResult);
    return true;
}
