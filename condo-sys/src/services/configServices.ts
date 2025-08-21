import api from "./api";

export const updateConfigService = async (data: any) => {
	const res= await api.patch('/settings/config/1/', data)
	return res;
};
