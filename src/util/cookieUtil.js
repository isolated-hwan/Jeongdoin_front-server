import { useCookies } from 'vue3-cookies';

const { cookies } = useCookies();

export const setCookie = (name, value, days) => {
    const expires = new Date();
    expires.setUTCDate(expires.getUTCDate() + days); // 쿠키 보관기한

    return cookies.set(name, value, { path: '/', expires: expires });
};

export const getCookie = (name) => {
    try {
        const value = cookies.get(name);
        return value;
    } catch (e) {
        console.log(e);
    }
    return;
};

export const removeCookie = (name, path = '/') => {
    cookies.remove(name, { path });
};
