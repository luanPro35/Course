//lưu accessToken và refreshToken vào localStorage
export const setTokens = (accessToken: string, refreshToken: string) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
};
// get accessToken từ localStorage
export const getAccessToken = () =>{
    return localStorage.getItem('accessToken');
}
//get refreshToken từ localStorage
export const getRefreshToken = () => {
    return localStorage.getItem('refreshToken');
}
// remove all token khỏi localStorage khi logout
export const removeTokens = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
}

// get both tokens from localStorage
export const getTokens = () => {
    return { accessToken: getAccessToken(), refreshToken: getRefreshToken() };
};
