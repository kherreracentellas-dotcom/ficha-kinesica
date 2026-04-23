/**
 * auth.js
 * Manages local session and authentication simulation.
 */

export const AuthModule = {
    getUser() {
        return localStorage.getItem('kine_current_user') || null;
    },

    login(username, password) {
        if (username && password.length >= 4) {
            localStorage.setItem('kine_current_user', username);
            return { success: true, user: username };
        }
        return { success: false, message: 'Ingresa un usuario y clave (min 4 carac.)' };
    },

    logout() {
        localStorage.removeItem('kine_current_user');
        window.location.reload();
    }
};
