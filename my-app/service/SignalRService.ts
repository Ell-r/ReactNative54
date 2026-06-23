import {HubConnectionBuilder, LogLevel} from "@microsoft/signalr";
import {BASE_URL_HUB} from "@/api";

export const createHubConnection = () => {
    return new HubConnectionBuilder()
        .withUrl(BASE_URL_HUB)
        .configureLogging(LogLevel.Information)
        .withAutomaticReconnect()
        .build();
};