// Actions
const OPEN = 'voud/menu/OPEN';
const CLOSE = 'voud/menu/CLOSE';

// Reducer
const initialState = { isOpen: false };

function reducer(state = initialState, action) {
    switch (action.type) {
        case OPEN:
            return { isOpen: true };
        case CLOSE:
            return { isOpen: false };
        default:
            return state;
    }
}

export default reducer;

// Actions creators
export function openMenu() {
    return { type: OPEN }
}

export function closeMenu() {
    return { type: CLOSE }
}
