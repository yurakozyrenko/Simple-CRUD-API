export const setData = (key: string, value: unknown) => {
    process.send && process.send(JSON.stringify({ action: 'set', key, value }));
};
