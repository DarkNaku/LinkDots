export class Logger {
    static info(data) {
        console.log(JSON.stringify({
            level: 'info',
            timestamp: new Date().toISOString(),
            ...data
        }));
    }

    static error(data) {
        console.error(JSON.stringify({
            level: 'error',
            timestamp: new Date().toISOString(),
            ...data
        }));
    }

    static gameEvent(event, details = {}) {
        this.info({
            type: 'game_event',
            event: event,
            ...details
        });
    }
}
