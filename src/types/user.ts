export interface UserPayload {
	name: string;
	phone: string;
}

export interface UserInfo extends UserPayload {
	id: string;
}
