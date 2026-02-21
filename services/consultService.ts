import { api } from "./api";

export const consultService = {
    async acceptSession(sessionId: string) {
        const response = await api.post(`/consult/accept/${sessionId}`);
        return response.data;
    },

    async declineSession(sessionId: string) {
        const response = await api.post(`/consult/decline/${sessionId}`);
        return response.data;
    },

    async getSessionDetails(sessionId: string) {
        const response = await api.get(`/consult/${sessionId}`);
        return response.data;
    },

    async getLawyerConsultations() {
        const response = await api.get("/consult/lawyer/all");
        return response.data;
    },
};
