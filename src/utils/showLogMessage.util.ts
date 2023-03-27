export function showLogMessage(showLogs: boolean, logMessage_: string, logType?: string) {
    if (showLogs === true) {
        if (logType === "ERROR") console.error(logMessage_)
        if (logType === "WARN") console.warn(logMessage_)
        else console.log(logMessage_)
    }
}