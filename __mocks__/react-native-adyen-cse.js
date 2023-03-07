
const adyen = {
	encrypt : (card, publicKey) => {
		return { ...card, publicKey};
	}
};
export const {
    encrypt,
} = adyen;