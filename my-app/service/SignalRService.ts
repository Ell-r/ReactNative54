import {HubConnectionBuilder, LogLevel} from "@microsoft/signalr";
import {HUB_URL} from "@/api";

export const createHubConnection = () => {
    return new HubConnectionBuilder()
        .withUrl(HUB_URL)
        .configureLogging(LogLevel.Information)
        .withAutomaticReconnect()
        .build();
};